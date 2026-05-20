

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[] | string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Reusable select field with consistent styling.
 * Accepts options as string[] or {value, label}[] for flexibility.
 */
export default function SelectField({
  id,
  value,
  onChange,
  options,
  placeholder = "-- Pilih --",
  disabled = false,
  className = "",
}: SelectFieldProps) {
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      <option value="">{placeholder}</option>
      {normalizedOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
