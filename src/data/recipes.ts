export interface Recipe {
  id: number;
  title: string;
  tipo_refeicao: string[];
  tags: string[];
  ingredients: string[];
  instructions: string[];
  por_que_resfria: string;
  dica: string;
  category: string;
  time: string;
  servings: string;
  description: string;
  icon: string;
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
