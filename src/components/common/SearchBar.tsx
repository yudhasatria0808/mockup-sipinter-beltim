import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { SearchIcon } from "../icons";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onReset?: () => void;
  resetLabel?: string;
}

/**
 * Reusable search bar with input + reset button.
 * Consistent layout across all list pages.
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = "Cari...",
  onReset,
  resetLabel = "Reset",
}: SearchBarProps) {
  const handleReset = () => {
    onChange("");
    onReset?.();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex-1 min-w-[180px] max-w-xs">
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={handleReset}
      >
        <SearchIcon /> {resetLabel}
      </Button>
    </div>
  );
}
