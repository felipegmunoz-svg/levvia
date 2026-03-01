import { Check } from "lucide-react";

interface ChecklistItemProps {
  id: string;
  label: string;
  checked: boolean;
  onToggle: (id: string) => void;
}

const ChecklistItemCard = ({ id, label, checked, onToggle }: ChecklistItemProps) => {
  return (
    <button
      onClick={() => onToggle(id)}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 text-left ${
        checked
          ? "bg-primary-light"
          : "bg-card hover:bg-secondary"
      }`}
    >
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          checked
            ? "bg-primary border-primary"
            : "border-muted-foreground/30"
        }`}
      >
        {checked && <Check size={14} className="text-primary-foreground" strokeWidth={3} />}
      </div>
      <span
        className={`text-sm font-medium transition-all duration-200 ${
          checked ? "line-through text-muted-foreground" : "text-foreground"
        }`}
      >
        {label}
      </span>
    </button>
  );
};

export default ChecklistItemCard;
