import Badge from "./Badge";

type StatusType = "active" | "inactive" | "draft" | "approved" | "rejected" | "pending" | "expired";

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { color: "success" | "error" | "warning" | "info" | "primary" | "light" | "dark"; label: string }> = {
  active: { color: "success", label: "Aktif" },
  inactive: { color: "error", label: "Tidak Aktif" },
  draft: { color: "light", label: "Draft" },
  approved: { color: "success", label: "Disetujui" },
  rejected: { color: "error", label: "Ditolak" },
  pending: { color: "warning", label: "Menunggu" },
  expired: { color: "dark", label: "Kadaluarsa" },
};

/**
 * Reusable status badge with predefined color mappings.
 * Provides consistent status display across all pages.
 */
export default function StatusBadge({ status, label, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] || { color: "light" as const, label: status };
  const displayLabel = label || config.label;

  return (
    <Badge variant="light" color={config.color} size={size}>
      {displayLabel}
    </Badge>
  );
}
