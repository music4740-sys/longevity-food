import { MEAL_FRACTIONS, UPPER_BOUND_NUTRIENTS } from "@/lib/nutritionTargets";
import { NUTRIENT_KEYS } from "@/types";
import type { Food, MealType, NutrientStatus, NutrientValues, NutritionLogEntry } from "@/types";

function sumEntries(
  entries: NutritionLogEntry[],
  getFood: (id: string) => Food | undefined,
): NutrientValues {
  const totals: NutrientValues = {
    calories: 0,
    carbs: 0,
    sugar: 0,
    protein: 0,
    fat: 0,
    saturatedFat: 0,
    fiber: 0,
    sodium: 0,
    calcium: 0,
    iron: 0,
  };

  for (const entry of entries) {
    const food = getFood(entry.foodId);
    if (!food) continue;
    for (const key of NUTRIENT_KEYS) {
      totals[key] += food.nutrients[key] * entry.servings;
    }
  }

  return totals;
}

export function computeDailyTotals(
  entries: NutritionLogEntry[],
  getFood: (id: string) => Food | undefined,
): NutrientValues {
  return sumEntries(entries, getFood);
}

export function computeMealTotals(
  entries: NutritionLogEntry[],
  mealType: MealType,
  getFood: (id: string) => Food | undefined,
): NutrientValues {
  return sumEntries(
    entries.filter((entry) => entry.mealType === mealType),
    getFood,
  );
}

export function getMealTargets(dailyTargets: NutrientValues, mealType: MealType): NutrientValues {
  const fraction = MEAL_FRACTIONS[mealType];
  return NUTRIENT_KEYS.reduce((acc, key) => {
    acc[key] = dailyTargets[key] * fraction;
    return acc;
  }, {} as NutrientValues);
}

const LOW_THRESHOLD = 0.7; // 기준치의 70% 미만이면 "부족"
const HIGH_THRESHOLD = 1.0; // 상한 관리 영양소는 기준치를 넘으면 "초과"

export function getNutrientStatuses(
  totals: NutrientValues,
  targets: NutrientValues,
): NutrientStatus[] {
  return NUTRIENT_KEYS.map((nutrient) => {
    const amount = totals[nutrient];
    const target = targets[nutrient];
    const percent = target > 0 ? Math.round((amount / target) * 100) : 0;

    const isUpperBound = UPPER_BOUND_NUTRIENTS.has(nutrient);
    const level = isUpperBound
      ? percent > HIGH_THRESHOLD * 100
        ? "high"
        : "ok"
      : percent < LOW_THRESHOLD * 100
        ? "low"
        : "ok";

    return { nutrient, amount, target, percent, level };
  });
}
