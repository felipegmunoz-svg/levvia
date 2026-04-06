import { Check, ExternalLink, Info } from "lucide-react";

interface ChecklistItemProps {
  id: string;
  label: string;
  checked: boolean;
  onToggle: (id: string) => void;
  hasAction?: boolean;
  actionType?: "modal" | "exercise" | "recipe" | "none";
}

const ChecklistItemCard = ({ id, label, checked, onToggle, hasAction, actionType }: ChecklistItemProps) => {
  return (
    <button
      onClick={() => onToggle(id)}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl border backdrop-blur-[10px] transition-all duration-200 ease-out text-left cursor-pointer ${
        checked
          ? "bg-white/[0.12] border-white/[0.15]"
          : "bg-white/[0.08] border-white/[0.12] hover:bg-white/[0.09]"
      }`}
    >
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          checked
            ? "bg-secondary border-secondary"
            : "border-muted-foreground/30"
        }`}
      >
        {checked && <Check size={14} className="text-foreground" strokeWidth={3} />}
      </div>
      <span
        className={`text-sm font-medium transition-all duration-200 flex-1 ${
          checked ? "line-through text-muted-foreground" : "text-foreground"
        }`}
      >
        {label}
      </span>
      {hasAction && !checked && (
        <span className="flex-shrink-0">
          {actionType === "modal" ? (
            <Info size={14} strokeWidth={1.5} className="text-muted-foreground/50" />
          ) : (
            <ExternalLink size={14} strokeWidth={1.5} className="text-muted-foreground/50" />
          )}
        </span>
      )}
    </button>
  );
};

export default ChecklistItemCard;
