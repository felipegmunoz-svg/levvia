interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: string;
}

export function FilterChip({ label, active, onClick, icon }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
        active
          ? "bg-levvia-primary text-white shadow-sm"
          : "bg-white text-levvia-fg border border-levvia-border hover:bg-levvia-primary/5"
      }`}
    >
      {icon && <span className="text-base">{icon}</span>}
      {label}
    </button>
  );
}
