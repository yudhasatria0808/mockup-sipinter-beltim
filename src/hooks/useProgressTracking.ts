import { useState, useEffect, useCallback, useRef } from 'react';

interface ProgressData {
  job_id: string;
  progress: number;
  message: string;
  status: 'processing' | 'completed' | 'failed' | 'unknown';
  timestamp: string;
}

interface UseProgressTrackingOptions {
  onComplete?: (data: ProgressData) => void;
  onError?: (error: Error) => void;
  autoConnect?: boolean;
}

interface UseProgressTrackingReturn {
  progress: number;
  message: string;
  status: 'processing' | 'completed' | 'failed' | 'unknown' | 'idle';
  estimatedTimeRemaining: number | null;
  connect: (jobId: string) => void;
  disconnect: () => void;
  isConnected: boolean;
}

/**
 * Custom hook for tracking progress of long-running seismic operations via SSE.
 * 
 * @param options Configuration options
 * @returns Progress tracking state and control functions
 * 
 * @example
 * ```tsx
 * const { progress, message, status, connect, disconnect } = useProgressTracking({
 *   onComplete: (data) => console.log('Job completed:', data),
 *   onError: (error) => console.error('Progress tracking error:', error)
 * });
 * 
 * // Start tracking when job is initiated
 * const response = await seismicApiService.applyBandpassFilter(...);
 * if (response.job_id) {
 *   connect(response.job_id);
 * }
 * ```
 */
export const useProgressTracking = (
  options: UseProgressTrackingOptions = {}
): UseProgressTrackingReturn => {
  const { onComplete, onError } = options; // Remove unused autoConnect

  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<'processing' | 'completed' | 'failed' | 'unknown' | 'idle'>('idle');
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const eventSourceRef = useRef<EventSource | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastProgressRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number | null>(null);

  /**
   * Calculate estimated time remaining based on progress rate
   */
  const calculateEstimatedTime = useCallback((currentProgress: number): number | null => {
    if (!startTimeRef.current || currentProgress <= 0 || currentProgress >= 100) {
      return null;
    }

    const now = Date.now();
    const elapsedSeconds = (now - startTimeRef.current) / 1000;
    const progressRate = currentProgress / elapsedSeconds; // percent per second

    if (progressRate <= 0) {
      return null;
    }

    const remainingProgress = 100 - currentProgress;
    const estimatedSeconds = remainingProgress / progressRate;

    return estimatedSeconds;
  }, []);

  /**
   * Connect to SSE stream for a specific job
   */
  const connect = useCallback((jobId: string) => {
    // Disconnect existing connection if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Reset state
    setProgress(0);
    setMessage('Connecting to progress stream...');
    setStatus('processing');
    setEstimatedTimeRemaining(null);
    startTimeRef.current = Date.now();
    lastProgressRef.current = 0;
    lastUpdateTimeRef.current = Date.now();

    try {
      // Construct SSE URL
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // Note: In production, this should go through API middleware, not directly to engine
      // For now, assuming middleware proxies SSE requests to engine
      const sseUrl = `${apiUrl}/api/seismic/progress/stream/${jobId}`;

      const eventSource = new EventSource(sseUrl);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log(`SSE connection opened for job: ${jobId}`);
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data: ProgressData = JSON.parse(event.data);
          
          setProgress(data.progress);
          setMessage(data.message);
          setStatus(data.status);

          // Calculate estimated time remaining
          const estimated = calculateEstimatedTime(data.progress);
          setEstimatedTimeRemaining(estimated);

          lastProgressRef.current = data.progress;
          lastUpdateTimeRef.current = Date.now();

          // Handle completion
          if (data.status === 'completed') {
            console.log(`Job completed: ${jobId}`);
            setIsConnected(false);
            eventSource.close();
            if (onComplete) {
              onComplete(data);
            }
          }

          // Handle failure
          if (data.status === 'failed') {
            console.error(`Job failed: ${jobId}`, data.message);
            setIsConnected(false);
            eventSource.close();
            if (onError) {
              onError(new Error(data.message));
            }
          }
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error(`SSE connection error for job: ${jobId}`, error);
        setIsConnected(false);
        setStatus('failed');
        setMessage('Connection to progress stream lost');
        eventSource.close();
        
        if (onError) {
          onError(new Error('SSE connection error'));
        }
      };
    } catch (error) {
      console.error('Error establishing SSE connection:', error);
      setStatus('failed');
      setMessage('Failed to connect to progress stream');
      
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [calculateEstimatedTime, onComplete, onError]);

  /**
   * Disconnect from SSE stream
   */
  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      console.log('Disconnecting from SSE stream');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
      setStatus('idle');
    }
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return {
    progress,
    message,
    status,
    estimatedTimeRemaining,
    connect,
    disconnect,
    isConnected,
  };
};
