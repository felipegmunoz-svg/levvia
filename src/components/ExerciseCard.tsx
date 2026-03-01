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
      className="flex items-center gap-4 w-full p-4 bg-card rounded-2xl shadow-card hover:shadow-soft transition-all duration-200 text-left group"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
        <Dumbbell size={22} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-foreground truncate">{exercise.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{exercise.category}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} />
            {exercise.duration}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
            {exercise.level}
          </span>
        </div>
      </div>
      <ChevronRight size={18} className="text-muted-foreground/50 group-hover:text-primary transition-colors" />
    </button>
  );
};

export default ExerciseCard;
