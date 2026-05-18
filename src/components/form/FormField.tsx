import { ReactNode } from "react";
import Label from "./Label";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable form field wrapper: Label + children (input) + error message.
 * Eliminates repetitive Label + error pattern across all form pages.
 */
export default function FormField({
  label,
  htmlFor,
  required = false,
  error,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label htmlFor={htmlFor}>
        {label} {required && <span className="text-error-500">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-error-500">{error}</p>}
    </div>
  );
}
