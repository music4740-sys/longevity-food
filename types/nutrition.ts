export const FOOD_CATEGORIES = [
  "rice",
  "soup_stew",
  "banchan",
  "kimchi",
  "noodle",
  "meat",
  "chicken",
  "seafood",
  "egg_tofu",
  "fried_pancake",
  "bunsik",
  "porridge",
  "jjim_jorim",
  "bakery",
  "fruit",
  "dairy",
  "nuts_seeds",
  "beverage",
  "dessert_cafe",
  "salad_diet",
  "dosirak",
  "snack",
  "yasik",
  "tea_health",
  "jeotgal",
] as const;

export type FoodCategory = (typeof FOOD_CATEGORIES)[number];

export const FOOD_CATEGORY_SET: ReadonlySet<string> = new Set(FOOD_CATEGORIES);

export const NUTRIENT_KEYS = [
  "calories",
  "carbs",
  "sugar",
  "protein",
  "fat",
  "saturatedFat",
  "fiber",
  "sodium",
  "calcium",
  "iron",
] as const;

export type NutrientKey = (typeof NUTRIENT_KEYS)[number];

export type NutrientValues = Record<NutrientKey, number>;

// Korean text only — this feature is ko-locale-only, not LocalizedText.
export interface Food {
  id: string;
  category: FoodCategory;
  name: string;
  /** Search synonyms, e.g. "참치김밥" also matches when searching "김밥". */
  aliases?: string[];
  emoji: string;
  servingLabel: string;
  servingGrams: number;
  nutrients: NutrientValues;
}

export interface NutritionLogEntry {
  foodId: string;
  /** In 0.5 increments, minimum 0.5. */
  servings: number;
}

export type NutrientStatusLevel = "low" | "ok" | "high";

export interface NutrientStatus {
  nutrient: NutrientKey;
  amount: number;
  target: number;
  percent: number;
  level: NutrientStatusLevel;
}
