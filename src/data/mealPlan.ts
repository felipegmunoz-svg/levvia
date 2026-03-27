import { recipes } from "./recipes";
import type { Recipe } from "./recipes";

export type MealSlot = "Café da Manhã" | "Lanche da Manhã" | "Almoço" | "Lanche da Tarde" | "Jantar";

export const mealSlots: MealSlot[] = [
  "Café da Manhã",
  "Lanche da Manhã",
  "Almoço",
  "Lanche da Tarde",
  "Jantar",
];

export interface DailyMealPlan {
  day: number;
  meals: Record<MealSlot, Recipe | null>;
}

function getRestrictions(): string[] {
  const saved = localStorage.getItem("levvia_onboarding");
  if (!saved) return [];
  const data = JSON.parse(saved);
  return (data[13] as string[]) || [];
}

function filterByRestrictions(allRecipes: Recipe[], restrictions: string[]): Recipe[] {
  let filtered = [...allRecipes];

  if (restrictions.includes("Vegano")) {
    filtered = filtered.filter((r) => {
      const dp = ((r as any).diet_profile || []).map((d: string) => d.toLowerCase());
      return dp.includes("vegana") || dp.includes("vegano");
    });
  } else if (restrictions.includes("Vegetariano")) {
    filtered = filtered.filter((r) => {
      const dp = ((r as any).diet_profile || []).map((d: string) => d.toLowerCase());
      return dp.includes("vegetariana") || dp.includes("vegetariano") || dp.includes("vegana") || dp.includes("vegano");
    });
  }
  if (restrictions.includes("Sem Glúten")) {
    filtered = filtered.filter((r) => {
      const af = ((r as any).allergen_free || []).map((a: string) => a.toLowerCase());
      return af.includes("sem glúten") || af.includes("gluten-free") || af.includes("livre de glúten") || (r.tags || []).some(t => t.toLowerCase().includes("glúten"));
    });
  }
  if (restrictions.includes("Sem Lactose")) {
    filtered = filtered.filter((r) => {
      const af = ((r as any).allergen_free || []).map((a: string) => a.toLowerCase());
      return af.includes("sem lactose") || af.includes("lactose-free") || af.includes("livre de lactose") || (r.tags || []).some(t => t.toLowerCase().includes("lactose"));
    });
  }
  if (restrictions.includes("Alergia a Frutos do Mar")) {
    filtered = filtered.filter((r) => !r.ingredients.some((i) => /salmão|peixe|tilápia|atum|sardinha|camarão|frutos do mar/i.test(i)));
  }
  if (restrictions.includes("Alergia a Amendoim")) {
    filtered = filtered.filter((r) => !r.ingredients.some((i) => /amendoim/i.test(i)));
  }
  if (restrictions.includes("Alergia a Oleaginosas")) {
    filtered = filtered.filter((r) => !r.ingredients.some((i) => /nozes|castanha|amêndoa|amendoa|pistache|avelã/i.test(i)));
  }

  return filtered;
}

function getRecipesForSlot(filtered: Recipe[], slot: MealSlot): Recipe[] {
  const slotMapping: Record<MealSlot, string[]> = {
    "Café da Manhã": ["Café da Manhã"],
    "Lanche da Manhã": ["Lanche da Manhã", "Lanche"],
    "Almoço": ["Almoço"],
    "Lanche da Tarde": ["Lanche da Tarde", "Lanche"],
    "Jantar": ["Jantar"],
  };

  const types = slotMapping[slot];
  return filtered.filter((r) => r.tipo_refeicao.some((t) => types.some((st) => t === st)));
}

export function generateMealPlan(): DailyMealPlan[] {
  const cached = localStorage.getItem("levvia_meal_plan");
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch { /* regenerate */ }
  }

  const restrictions = getRestrictions();
  const filtered = filterByRestrictions(recipes, restrictions);

  const plan: DailyMealPlan[] = [];
  const usedPerSlot: Record<MealSlot, number> = {
    "Café da Manhã": 0,
    "Lanche da Manhã": 0,
    "Almoço": 0,
    "Lanche da Tarde": 0,
    "Jantar": 0,
  };

  for (let day = 1; day <= 14; day++) {
    const meals: Record<MealSlot, Recipe | null> = {
      "Café da Manhã": null,
      "Lanche da Manhã": null,
      "Almoço": null,
      "Lanche da Tarde": null,
      "Jantar": null,
    };

    for (const slot of mealSlots) {
      const available = getRecipesForSlot(filtered, slot);
      if (available.length > 0) {
        const index = usedPerSlot[slot] % available.length;
        meals[slot] = available[index];
        usedPerSlot[slot]++;
      }
    }

    plan.push({ day, meals });
  }

  localStorage.setItem("levvia_meal_plan", JSON.stringify(plan));
  return plan;
}

export function getMealPlanForDay(day: number): Record<MealSlot, Recipe | null> {
  const plan = generateMealPlan();
  const dayPlan = plan.find((p) => p.day === day);
  return dayPlan?.meals || {
    "Café da Manhã": null,
    "Lanche da Manhã": null,
    "Almoço": null,
    "Lanche da Tarde": null,
    "Jantar": null,
  };
}

export function regenerateMealPlan(): DailyMealPlan[] {
  localStorage.removeItem("levvia_meal_plan");
  return generateMealPlan();
}
