import { ReactNode } from "react";

type ActionVariant = "primary" | "danger" | "warning" | "info";

interface ActionButtonProps {
  onClick: () => void;
  icon: ReactNode;
  title: string;
  variant?: ActionVariant;
}

const variantClasses: Record<ActionVariant, string> = {
  primary: "text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20",
  danger: "text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20",
  warning: "text-warning-500 hover:bg-warning-50 dark:hover:bg-warning-900/20",
  info: "text-blue-light-500 hover:bg-blue-light-50 dark:hover:bg-blue-light-900/20",
};

/**
 * Reusable action button for table rows.
 * Consistent icon button styling with color variants.
 */
export default function ActionButton({
  onClick,
  icon,
  title,
  variant = "primary",
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded-md transition-colors ${variantClasses[variant]}`}
      title={title}
    >
      {icon}
    </button>
  );
}
