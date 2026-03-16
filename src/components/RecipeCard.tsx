import { Clock, ChevronRight, UtensilsCrossed } from "lucide-react";
import type { Recipe } from "@/data/recipes";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  const imageUrl = (recipe as any).image_url;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 w-full p-5 glass-card hover:bg-white/[0.09] transition-all duration-200 text-left group"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-accent/20 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
        ) : (
          <UtensilsCrossed size={22} strokeWidth={1.5} className="text-accent" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-foreground truncate">{recipe.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{recipe.description}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} strokeWidth={1.5} />
            {recipe.time}
          </span>
          {recipe.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-white/[0.08] text-muted-foreground font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <ChevronRight size={18} strokeWidth={1.5} className="text-muted-foreground/50 group-hover:text-secondary transition-colors" />
    </button>
  );
};

export default RecipeCard;
