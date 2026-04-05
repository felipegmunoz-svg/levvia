import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ placeholder = "Buscar...", value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-levvia-muted" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 pl-12 pr-10 rounded-xl bg-white border border-levvia-border text-levvia-fg placeholder:text-levvia-muted focus:outline-none focus:ring-2 focus:ring-levvia-primary/30 focus:border-levvia-primary/30 transition-all font-body text-sm"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-levvia-muted/20 hover:bg-levvia-muted/30 transition-colors"
        >
          <X className="w-4 h-4 text-levvia-muted" />
        </button>
      )}
    </div>
  );
}
