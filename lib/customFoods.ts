import type { Food, NutrientValues } from "@/types";

const CUSTOM_FOODS_KEY = "longevity-food-nutrition-custom-foods";

export interface CustomFoodInput {
  name: string;
  servingLabel: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

function loadAll(): Food[] {
  try {
    const raw = localStorage.getItem(CUSTOM_FOODS_KEY);
    return raw ? (JSON.parse(raw) as Food[]) : [];
  } catch {
    return [];
  }
}

function saveAll(foods: Food[]): void {
  try {
    localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(foods));
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — fail silently.
  }
}

export function getCustomFoods(): Food[] {
  return loadAll();
}

export function addCustomFood(input: CustomFoodInput): Food {
  const nutrients: NutrientValues = {
    calories: input.calories,
    carbs: input.carbs,
    sugar: 0,
    protein: input.protein,
    fat: input.fat,
    saturatedFat: 0,
    fiber: 0,
    sodium: 0,
    calcium: 0,
    iron: 0,
  };
  const food: Food = {
    id: `custom-${crypto.randomUUID()}`,
    category: "salad_diet",
    name: input.name,
    emoji: "🍽️",
    servingLabel: input.servingLabel || "1인분",
    servingGrams: 0,
    nutrients,
  };
  const next = [...loadAll(), food];
  saveAll(next);
  return food;
}

export function removeCustomFood(id: string): Food[] {
  const next = loadAll().filter((food) => food.id !== id);
  saveAll(next);
  return next;
}
