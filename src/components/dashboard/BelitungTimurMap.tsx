import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { kecamatanData } from "./dashboardMockData";

interface BelitungTimurMapProps {
  selectedKecamatan: string | null;
  onSelectKecamatan: (nama: string | null) => void;
}

// Warna marker berdasarkan jumlah konflik
function getMarkerColor(totalKonflik: number): string {
  if (totalKonflik >= 7) return "#ef4444";
  if (totalKonflik >= 5) return "#f97316";
  if (totalKonflik >= 3) return "#eab308";
  return "#22c55e";
}

function getMarkerRadius(totalKonflik: number): number {
  if (totalKonflik >= 7) return 18;
  if (totalKonflik >= 5) return 15;
  if (totalKonflik >= 3) return 12;
  return 9;
}

// More realistic polygon boundaries for Belitung Timur kecamatan
const kecamatanBoundaries: Record<string, L.LatLngExpression[]> = {
  Manggar: [
    [-2.84, 108.22], [-2.83, 108.26], [-2.84, 108.30], [-2.86, 108.33],
    [-2.89, 108.34], [-2.92, 108.33], [-2.94, 108.30], [-2.93, 108.26],
    [-2.91, 108.23], [-2.88, 108.21], [-2.86, 108.21],
  ],
  Gantung: [
    [-2.88, 108.02], [-2.87, 108.06], [-2.88, 108.10], [-2.90, 108.13],
    [-2.93, 108.14], [-2.96, 108.13], [-2.98, 108.10], [-2.99, 108.06],
    [-2.97, 108.03], [-2.95, 108.01], [-2.92, 108.00], [-2.90, 108.01],
  ],
  Dendang: [
    [-2.73, 108.09], [-2.72, 108.12], [-2.73, 108.16], [-2.75, 108.19],
    [-2.78, 108.20], [-2.81, 108.19], [-2.83, 108.16], [-2.83, 108.12],
    [-2.81, 108.09], [-2.78, 108.08], [-2.75, 108.08],
  ],
  "Kelapa Kampit": [
    [-2.77, 107.89], [-2.76, 107.93], [-2.77, 107.97], [-2.79, 108.00],
    [-2.82, 108.01], [-2.85, 108.00], [-2.87, 107.97], [-2.87, 107.93],
    [-2.85, 107.90], [-2.82, 107.88], [-2.79, 107.88],
  ],
  Damar: [
    [-2.99, 108.04], [-2.98, 108.08], [-2.99, 108.12], [-3.01, 108.15],
    [-3.04, 108.16], [-3.07, 108.15], [-3.09, 108.12], [-3.10, 108.08],
    [-3.08, 108.05], [-3.05, 108.03], [-3.02, 108.03],
  ],
  "Simpang Renggiang": [
    [-2.87, 107.93], [-2.86, 107.96], [-2.87, 108.00], [-2.89, 108.03],
    [-2.92, 108.04], [-2.95, 108.03], [-2.97, 108.00], [-2.97, 107.96],
    [-2.95, 107.93], [-2.92, 107.92], [-2.89, 107.92],
  ],
  "Simpang Pesak": [
    [-3.04, 107.82], [-3.03, 107.86], [-3.04, 107.90], [-3.06, 107.93],
    [-3.09, 107.94], [-3.12, 107.93], [-3.14, 107.90], [-3.14, 107.86],
    [-3.12, 107.83], [-3.09, 107.81], [-3.06, 107.81],
  ],
};

/**
 * Generate realistic heatmap data points spread across the region.
 * Each kecamatan generates multiple points around its center with varying intensity.
 * This creates a smooth, realistic gradient heatmap similar to conflict potential maps.
 */
function generateHeatmapPoints(): [number, number, number][] {
  const points: [number, number, number][] = [];

  // Main conflict hotspots based on kecamatan data
  kecamatanData.forEach((kec) => {
    const intensity = kec.totalKonflik / 8; // Normalize to 0-1
    const numPoints = Math.max(8, kec.totalKonflik * 4); // More points for higher conflict areas

    for (let i = 0; i < numPoints; i++) {
      // Spread points around the center with gaussian-like distribution
      const angle = (Math.PI * 2 * i) / numPoints + (Math.random() * 0.5);
      const distance = Math.random() * 0.04 + 0.005; // Spread radius
      const lat = kec.latitude + Math.cos(angle) * distance;
      const lng = kec.longitude + Math.sin(angle) * distance;
      const pointIntensity = intensity * (0.5 + Math.random() * 0.5);
      points.push([lat, lng, pointIntensity]);
    }

    // Add concentrated center points for high-risk areas
    if (kec.risikoTinggi > 0) {
      for (let i = 0; i < kec.risikoTinggi * 5; i++) {
        const lat = kec.latitude + (Math.random() - 0.5) * 0.02;
        const lng = kec.longitude + (Math.random() - 0.5) * 0.02;
        points.push([lat, lng, 0.9 + Math.random() * 0.1]);
      }
    }
  });

  // Add additional scattered points for realism (lower intensity background)
  const additionalHotspots = [
    { lat: -2.85, lng: 108.25, intensity: 0.6, spread: 0.03 }, // Near Manggar coast
    { lat: -2.95, lng: 108.05, intensity: 0.4, spread: 0.025 }, // Gantung area
    { lat: -2.82, lng: 107.95, intensity: 0.7, spread: 0.03 }, // Kelapa Kampit mining area
    { lat: -3.08, lng: 107.88, intensity: 0.5, spread: 0.025 }, // Simpang Pesak coast
    { lat: -2.90, lng: 108.27, intensity: 0.5, spread: 0.02 }, // Manggar south
    { lat: -2.93, lng: 107.97, intensity: 0.35, spread: 0.02 }, // Simpang Renggiang
    { lat: -2.78, lng: 108.15, intensity: 0.25, spread: 0.02 }, // Dendang
    { lat: -3.05, lng: 108.10, intensity: 0.2, spread: 0.02 }, // Damar
  ];

  additionalHotspots.forEach((spot) => {
    const count = Math.floor(spot.intensity * 15);
    for (let i = 0; i < count; i++) {
      const lat = spot.lat + (Math.random() - 0.5) * spot.spread * 2;
      const lng = spot.lng + (Math.random() - 0.5) * spot.spread * 2;
      points.push([lat, lng, spot.intensity * (0.4 + Math.random() * 0.6)]);
    }
  });

  return points;
}

export default function BelitungTimurMap({ selectedKecamatan, onSelectKecamatan }: BelitungTimurMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const polygonsRef = useRef<L.Polygon[]>([]);
  const heatLayerRef = useRef<L.HeatLayer | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);

  const invalidateMapSize = useCallback(() => {
    setTimeout(() => mapRef.current?.invalidateSize(), 100);
    setTimeout(() => mapRef.current?.invalidateSize(), 300);
    setTimeout(() => mapRef.current?.invalidateSize(), 600);
    setTimeout(() => mapRef.current?.invalidateSize(), 1000);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!wrapperRef.current) return;

    if (!isFullscreen) {
      // Enter fullscreen via API
      wrapperRef.current.requestFullscreen().catch(() => {
        // If API fails, do nothing — CSS fallback not needed
      });
    } else {
      // Exit fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  }, [isFullscreen]);

  // Listen for fullscreen change events from browser
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Handle Escape key (browser handles this for Fullscreen API, but just in case)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Re-invalidate map size when fullscreen state changes
  useEffect(() => {
    invalidateMapSize();
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen, invalidateMapSize]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [-2.93, 108.05],
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
    });

    // Use a cleaner tile layer for better heatmap visibility
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    // Draw kecamatan boundaries with subtle styling
    kecamatanData.forEach((kec) => {
      const bounds = kecamatanBoundaries[kec.nama];
      if (!bounds) return;

      const polygon = L.polygon(bounds, {
        color: "transparent",
        weight: 0,
        opacity: 0,
        fillColor: "transparent",
        fillOpacity: 0,
      }).addTo(map);

      polygon.on("click", () => {
        onSelectKecamatan(kec.nama);
      });

      polygon.bindTooltip(
        `<div style="font-weight:600;font-size:12px;">KEC. ${kec.nama.toUpperCase()}</div>`,
        {
          permanent: true,
          direction: "center",
          className: "kecamatan-label-tooltip",
        }
      );

      polygonsRef.current.push(polygon);
    });

    // Add heatmap layer
    const heatPoints = generateHeatmapPoints();
    const heat = L.heatLayer(heatPoints, {
      radius: 35,
      blur: 25,
      maxZoom: 14,
      max: 1.0,
      minOpacity: 0.3,
      gradient: {
        0.0: "#00ff00",
        0.2: "#adff2f",
        0.4: "#ffff00",
        0.6: "#ffa500",
        0.8: "#ff4500",
        1.0: "#ff0000",
      },
    }).addTo(map);
    heatLayerRef.current = heat;

    // Draw circle markers for each kecamatan
    kecamatanData.forEach((kec) => {
      const color = getMarkerColor(kec.totalKonflik);
      const radius = getMarkerRadius(kec.totalKonflik);

      const marker = L.circleMarker([kec.latitude, kec.longitude], {
        radius,
        fillColor: color,
        color: "#fff",
        weight: 2.5,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(map);

      marker.bindPopup(`
        <div style="min-width: 180px; font-family: system-ui, sans-serif;">
          <strong style="font-size: 14px; color: #1f2937;">${kec.nama}</strong>
          <hr style="margin: 8px 0; border-color: #e5e7eb;" />
          <div style="font-size: 12px; line-height: 1.8;">
            <div style="display:flex;justify-content:space-between;">
              <span>Total Konflik:</span>
              <strong>${kec.totalKonflik}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;color:#ef4444;">
              <span>Risiko Tinggi:</span>
              <strong>${kec.risikoTinggi}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;color:#f59e0b;">
              <span>Risiko Sedang:</span>
              <strong>${kec.risikoSedang}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;color:#22c55e;">
              <span>Risiko Rendah:</span>
              <strong>${kec.risikoRendah}</strong>
            </div>
          </div>
        </div>
      `);

      marker.on("click", () => {
        onSelectKecamatan(kec.nama);
      });

      markersRef.current.push(marker);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      heatLayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle heatmap visibility
  useEffect(() => {
    if (!mapRef.current || !heatLayerRef.current) return;
    if (showHeatmap) {
      if (!mapRef.current.hasLayer(heatLayerRef.current)) {
        heatLayerRef.current.addTo(mapRef.current);
      }
    } else {
      if (mapRef.current.hasLayer(heatLayerRef.current)) {
        mapRef.current.removeLayer(heatLayerRef.current);
      }
    }
  }, [showHeatmap]);

  // Toggle markers visibility
  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach((marker) => {
      if (showMarkers) {
        if (!mapRef.current!.hasLayer(marker)) marker.addTo(mapRef.current!);
      } else {
        if (mapRef.current!.hasLayer(marker)) mapRef.current!.removeLayer(marker);
      }
    });
  }, [showMarkers]);

  // Highlight selected kecamatan
  useEffect(() => {
    polygonsRef.current.forEach((polygon, idx) => {
      const kec = kecamatanData[idx];
      if (!kec) return;
      const isSelected = selectedKecamatan === kec.nama;
      polygon.setStyle({
        color: isSelected ? "#1d4ed8" : "transparent",
        weight: isSelected ? 3 : 0,
        opacity: isSelected ? 1 : 0,
        fillColor: isSelected ? "#3b82f6" : "transparent",
        fillOpacity: isSelected ? 0.15 : 0,
      });
    });
  }, [selectedKecamatan]);

  return (
    <div
      ref={wrapperRef}
      className="relative flex flex-col"
      style={isFullscreen ? { height: "100vh", width: "100vw", padding: "16px", background: "white" } : undefined}
    >
      {/* Controls bar */}
      <div className={`flex items-center justify-between mb-2 ${isFullscreen ? "px-2" : ""}`}>
        <div className="flex items-center gap-2">
          {/* Heatmap toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
              showHeatmap
                ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            }`}
            title="Toggle Heatmap"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
            Heatmap
          </button>
          {/* Markers toggle */}
          <button
            onClick={() => setShowMarkers(!showMarkers)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
              showMarkers
                ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            }`}
            title="Toggle Markers"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Marker
          </button>
        </div>
        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          title={isFullscreen ? "Keluar Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
          {isFullscreen ? "Tutup" : "Fullscreen"}
        </button>
      </div>

      {/* Map container */}
      <div
        ref={containerRef}
        className="w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
        style={{ height: isFullscreen ? "calc(100vh - 120px)" : "400px" }}
      />

      {/* Legend */}
      <div className={`mt-3 ${isFullscreen ? "px-2" : ""}`}>
        {/* Heatmap gradient legend */}
        {showHeatmap && (
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">TINGKAT POTENSI KONFLIK</span>
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] text-gray-500">LOW</span>
              <div className="h-3 w-32 rounded-sm" style={{
                background: "linear-gradient(to right, #00ff00, #adff2f, #ffff00, #ffa500, #ff4500, #ff0000)"
              }} />
              <span className="text-[10px] text-gray-500">HIGH</span>
            </div>
          </div>
        )}
        {/* Marker legend */}
        {showMarkers && (
          <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ef4444] shadow-sm" />
              <span>≥ 7 konflik</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#f97316] shadow-sm" />
              <span>5–6 konflik</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#eab308] shadow-sm" />
              <span>3–4 konflik</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#22c55e] shadow-sm" />
              <span>1–2 konflik</span>
            </div>
          </div>
        )}
      </div>

      {selectedKecamatan && (
        <button
          onClick={() => onSelectKecamatan(null)}
          className="mt-2 text-xs text-brand-500 hover:underline"
        >
          ✕ Hapus filter kecamatan
        </button>
      )}
    </div>
  );
}
