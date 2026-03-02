import { ArrowLeft, Clock, Users, UtensilsCrossed, ChefHat } from "lucide-react";
import type { Recipe } from "@/data/recipes";

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onMarkDone?: () => void;
}

const RecipeDetail = ({ recipe, onBack, onMarkDone }: RecipeDetailProps) => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-accent/20 px-6 pt-10 pb-8 rounded-b-3xl">
        <button
          onClick={onBack}
          className="text-foreground/60 hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent/30 flex items-center justify-center">
            <UtensilsCrossed size={20} className="text-accent-foreground" />
          </div>
          <span className="text-xs font-bold text-muted-foreground bg-card px-3 py-1 rounded-full">
            {recipe.category}
          </span>
        </div>
        <h1 className="text-xl font-extrabold text-foreground">{recipe.title}</h1>
        <div className="flex items-center gap-4 mt-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
            <Clock size={14} /> {recipe.time}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
            <Users size={14} /> {recipe.servings}
          </span>
        </div>
      </div>

      <main className="px-6 py-6 space-y-6">
        <section>
          <h2 className="text-base font-bold text-foreground mb-2">Por que Resfria</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {(recipe as any).por_que_resfria || recipe.description}
          </p>
        </section>

        {(recipe as any).dica && (
          <section className="bg-primary-light rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-primary text-sm">💡</span>
              <h2 className="text-sm font-bold text-foreground">Dica</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{(recipe as any).dica}</p>
          </section>
        )}

        <section>
          <h2 className="text-base font-bold text-foreground mb-3">Ingredientes</h2>
          <div className="space-y-2">
            {recipe.ingredients.map((ingredient, i) => (
              <div key={i} className="flex items-center gap-3 bg-card p-3 rounded-xl shadow-card">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm text-foreground">{ingredient}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <ChefHat size={18} className="text-primary" />
            Modo de Fazer
          </h2>
          <div className="space-y-3">
            {recipe.instructions.map((instruction, i) => (
              <div key={i} className="flex items-start gap-3 bg-card p-3 rounded-xl shadow-card">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-foreground">{i + 1}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed pt-0.5">{instruction}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground font-bold"
            >
              {tag}
            </span>
          ))}
        </section>
      </main>

      {onMarkDone && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t border-border">
          <button
            onClick={onMarkDone}
            className="w-full py-3.5 rounded-xl gradient-primary text-primary-foreground font-bold text-sm"
          >
            ✅ Marcar como Feito
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
