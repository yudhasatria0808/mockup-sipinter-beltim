import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable form section card with title divider.
 * Used in complex multi-section forms (TKA, WNA, Kewaspadaan, etc.)
 */
export default function FormSection({ title, children, className = "" }: FormSectionProps) {
  return (
    <div className={`rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-4 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}
