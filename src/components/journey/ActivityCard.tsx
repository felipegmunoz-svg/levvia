import { Check } from "lucide-react";

interface ActivityCardProps {
  icon: string;
  title: string;
  description: string;
  duration?: string;
  completed?: boolean;
  onToggle?: () => void;
}

const ActivityCard = ({
  icon,
  title,
  description,
  duration,
  completed = false,
  onToggle,
}: ActivityCardProps) => {
  return (
    <button
      onClick={onToggle}
      className={`levvia-card flex items-center gap-3 p-4 w-full text-left transition-all duration-200 ease-out cursor-pointer ${
        completed ? "border-levvia-success/20" : ""
      }`}
    >
      {onToggle && (
        <div
          className={`w-[22px] h-[22px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
            completed ? "border-levvia-success" : "border-white/[0.12]"
          }`}
        >
          {completed && (
            <Check size={13} strokeWidth={2.5} className="text-levvia-success" />
          )}
        </div>
      )}

      <span className="text-xl shrink-0">{icon}</span>

      <div className="flex-1 min-w-0">
        <p
          className={`text-[13px] font-medium font-body ${
            completed ? "line-through text-levvia-muted" : "text-levvia-fg"
          }`}
        >
          {title}
        </p>
        <p className="text-[11px] text-levvia-muted font-body truncate">
          {description}
        </p>
      </div>

      {duration && (
        <span className="text-[10px] text-levvia-muted font-body shrink-0">
          {duration}
        </span>
      )}
    </button>
  );
};

export default ActivityCard;
