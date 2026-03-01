import { Clock, ChevronRight, UtensilsCrossed } from "lucide-react";
import type { Recipe } from "@/data/recipes";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 w-full p-4 bg-card rounded-2xl shadow-card hover:shadow-soft transition-all duration-200 text-left group"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
        <UtensilsCrossed size={22} className="text-accent-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-foreground truncate">{recipe.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{recipe.description}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} />
            {recipe.time}
          </span>
          {recipe.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <ChevronRight size={18} className="text-muted-foreground/50 group-hover:text-primary transition-colors" />
    </button>
  );
};

export default RecipeCard;
