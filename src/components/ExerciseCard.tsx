import { Clock, Dumbbell, ChevronRight } from "lucide-react";
import type { Exercise } from "@/data/exercises";

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
}

const ExerciseCard = ({ exercise, onClick }: ExerciseCardProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 w-full p-5 glass-card hover:bg-white/[0.09] transition-all duration-200 text-left group"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
        <Dumbbell size={22} strokeWidth={1.5} className="text-secondary" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-foreground truncate">{exercise.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{exercise.category}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} strokeWidth={1.5} />
            {exercise.duration}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.08] text-muted-foreground font-medium">
            {exercise.level}
          </span>
        </div>
      </div>
      <ChevronRight size={18} strokeWidth={1.5} className="text-muted-foreground/50 group-hover:text-secondary transition-colors" />
    </button>
  );
};

export default ExerciseCard;
