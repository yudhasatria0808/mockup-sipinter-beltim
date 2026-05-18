import { useCallback } from "react";

interface UseDeleteConfirmOptions {
  /** Message template — use {name} as placeholder for item name */
  message?: string;
  /** Callback after successful deletion */
  onSuccess?: () => void;
}

/**
 * Reusable hook for delete confirmation pattern.
 * Handles confirm dialog + deletion logic consistently.
 */
export function useDeleteConfirm<T>(
  setData: React.Dispatch<React.SetStateAction<T[]>>,
  getId: (item: T) => string,
  options: UseDeleteConfirmOptions = {}
) {
  const { message = 'Apakah Anda yakin ingin menghapus "{name}"?', onSuccess } = options;

  const handleDelete = useCallback(
    (item: T, name: string) => {
      const confirmMessage = message.replace("{name}", name);
      if (!confirm(confirmMessage)) return;
      setData((prev) => prev.filter((d) => getId(d) !== getId(item)));
      onSuccess?.();
    },
    [setData, getId, message, onSuccess]
  );

  return { handleDelete };
}
