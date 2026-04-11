export interface Recipe {
  id: string | number;
  type?: string;
  title: string;
  tipo_refeicao: string[];
  description: string;
  ingredients: string[];
  instructions: string[];
  dica: string | null;
  servings: string | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  difficulty: string | null;
  tags: string[];
  diet_profile: string[];
  allergen_free: string[];
  main_ingredients: string[];
  health_goals: string[];
  pantry_complexity: string | null;
  levvia_voice_applied: boolean;
  editorial_review_needed: boolean;
  category?: string;
  time?: string;
  icon?: string;
  image_url?: string;
  por_que_resfria?: string;
}

export const recipeCategories = [
  "Café da Manhã",
  "Lanche",
  "Almoço",
  "Jantar",
  "Bebidas",
];

// Import all recipe sections
import { breakfastRecipes } from "./recipes/breakfast";
import { lunchRecipes } from "./recipes/lunch";
import { dinnerRecipes } from "./recipes/dinner";
import { snackRecipes } from "./recipes/snacks";
import { drinkRecipes } from "./recipes/drinks";

export const recipes: Recipe[] = [
  ...breakfastRecipes,
  ...lunchRecipes,
  ...dinnerRecipes,
  ...snackRecipes,
  ...drinkRecipes,
];
