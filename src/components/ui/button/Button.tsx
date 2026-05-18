import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "outline";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) => {
  const sizeClasses = {
    sm: "px-4 py-2.5 text-sm",
    md: "px-5 py-3 text-sm",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/20 hover:from-brand-600 hover:to-brand-700 hover:shadow-lg hover:shadow-brand-500/30 active:from-brand-700 active:to-brand-800 disabled:from-brand-300 disabled:to-brand-400 disabled:shadow-none dark:shadow-brand-500/10",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-200 shadow-sm hover:bg-gray-50 hover:ring-gray-300 active:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-750 dark:hover:ring-gray-600 dark:active:bg-gray-700",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
