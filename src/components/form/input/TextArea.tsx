import type { FC } from "react";

interface TextAreaProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

/**
 * Reusable textarea with consistent styling matching InputField.
 * Eliminates repeated inline textarea className strings across form pages.
 */
const TextArea: FC<TextAreaProps> = ({
  id,
  name,
  placeholder,
  value,
  onChange,
  rows = 4,
  disabled = false,
  error = false,
  className = "",
}) => {
  let baseClasses =
    "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none dark:bg-gray-900";

  if (disabled) {
    baseClasses +=
      " border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-40 dark:border-gray-700 dark:text-gray-400";
  } else if (error) {
    baseClasses +=
      " border-error-500 text-gray-700 dark:text-gray-300 focus:ring-error-500/20 dark:border-error-500";
  } else {
    baseClasses +=
      " border-gray-300 dark:border-gray-700 bg-white text-gray-700 dark:text-gray-300 focus:ring-brand-500 focus:border-brand-300 dark:focus:border-brand-800";
  }

  return (
    <textarea
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      disabled={disabled}
      className={`${baseClasses} ${className}`}
    />
  );
};

export default TextArea;
