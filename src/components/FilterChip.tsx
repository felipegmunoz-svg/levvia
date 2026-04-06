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
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out min-h-[44px] cursor-pointer active:scale-[0.97] ${
        active
          ? "bg-levvia-primary/15 text-levvia-primary border border-levvia-primary/25 shadow-sm"
          : "bg-white/[0.08] text-levvia-muted border border-white/[0.12] hover:bg-white/[0.12]"
      }`}
    >
      {icon && <span className="text-base">{icon}</span>}
      {label}
    </button>
  );
}
