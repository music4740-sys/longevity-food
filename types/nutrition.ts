export const FOOD_CATEGORIES = [
  "rice",
  "guk",
  "tang",
  "jjigae",
  "jeongol",
  "banchan",
  "kimchi",
  "jangajji",
  "hoe",
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
  "tteok_hangwa",
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

// Top-level grouping shown in the food-picker accordion — each FoodCategory
// ("중분류") belongs to exactly one of these ("대분류").
export const FOOD_GROUPS = [
  "staple",
  "broth",
  "main_dish",
  "vegetable",
  "preserved",
  "dessert_drink",
  "snack_fruit",
  "special_meal",
] as const;

export type FoodGroup = (typeof FOOD_GROUPS)[number];

export const GROUP_OF_CATEGORY: Record<FoodCategory, FoodGroup> = {
  rice: "staple",
  porridge: "staple",
  noodle: "staple",
  guk: "broth",
  tang: "broth",
  jjigae: "broth",
  jeongol: "broth",
  meat: "main_dish",
  chicken: "main_dish",
  seafood: "main_dish",
  egg_tofu: "main_dish",
  fried_pancake: "main_dish",
  jjim_jorim: "main_dish",
  banchan: "vegetable",
  hoe: "vegetable",
  kimchi: "preserved",
  jangajji: "preserved",
  jeotgal: "preserved",
  bakery: "dessert_drink",
  tteok_hangwa: "dessert_drink",
  dessert_cafe: "dessert_drink",
  beverage: "dessert_drink",
  tea_health: "dessert_drink",
  fruit: "snack_fruit",
  nuts_seeds: "snack_fruit",
  dairy: "snack_fruit",
  snack: "snack_fruit",
  bunsik: "special_meal",
  dosirak: "special_meal",
  yasik: "special_meal",
  salad_diet: "special_meal",
};

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

export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;

export type MealType = (typeof MEAL_TYPES)[number];

export interface NutritionLogEntry {
  foodId: string;
  mealType: MealType;
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
