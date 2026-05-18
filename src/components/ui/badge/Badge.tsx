type BadgeVariant = "light" | "solid";
type BadgeSize = "sm" | "md";
type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
}) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-lg font-medium";

  const sizeStyles = {
    sm: "text-theme-xs",
    md: "text-sm",
  };

  const variants = {
    light: {
      primary:
        "bg-brand-50 text-brand-600 ring-1 ring-brand-200/50 dark:bg-brand-500/15 dark:text-brand-400 dark:ring-brand-500/20",
      success:
        "bg-success-50 text-success-700 ring-1 ring-success-200/50 dark:bg-success-500/15 dark:text-success-400 dark:ring-success-500/20",
      error:
        "bg-error-50 text-error-700 ring-1 ring-error-200/50 dark:bg-error-500/15 dark:text-error-400 dark:ring-error-500/20",
      warning:
        "bg-warning-50 text-warning-700 ring-1 ring-warning-200/50 dark:bg-warning-500/15 dark:text-orange-400 dark:ring-warning-500/20",
      info: "bg-blue-light-50 text-blue-light-600 ring-1 ring-blue-light-200/50 dark:bg-blue-light-500/15 dark:text-blue-light-400 dark:ring-blue-light-500/20",
      light: "bg-gray-100 text-gray-700 ring-1 ring-gray-200/50 dark:bg-white/5 dark:text-white/80 dark:ring-white/10",
      dark: "bg-gray-500 text-white dark:bg-white/5 dark:text-white",
    },
    solid: {
      primary: "bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-sm shadow-brand-500/20",
      success: "bg-gradient-to-b from-success-500 to-success-600 text-white shadow-sm shadow-success-500/20",
      error: "bg-gradient-to-b from-error-500 to-error-600 text-white shadow-sm shadow-error-500/20",
      warning: "bg-gradient-to-b from-warning-500 to-warning-600 text-white shadow-sm shadow-warning-500/20",
      info: "bg-gradient-to-b from-blue-light-500 to-blue-light-600 text-white shadow-sm shadow-blue-light-500/20",
      light: "bg-gray-400 dark:bg-white/5 text-white dark:text-white/80",
      dark: "bg-gray-700 text-white dark:text-white",
    },
  };

  const sizeClass = sizeStyles[size];
  const colorStyles = variants[variant][color];

  return (
    <span className={`${baseStyles} ${sizeClass} ${colorStyles}`}>
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </span>
  );
};

export default Badge;
