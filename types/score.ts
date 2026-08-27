// Single source of truth for valid tags — also used at runtime to validate
// /data/recipes.json, since JSON-imported string arrays don't get narrowed to
// a literal union by TypeScript (they type-check as plain `string[]`).
export const INGREDIENT_TAGS = [
  // plant food groups — count positively toward the plant-ratio axis
  "whole-grain",
  "refined-grain",
  "vegetable",
  "leafy-green",
  "fruit",
  "legume",
  "nuts-seeds",
  // animal food groups — count as the non-plant side of the plant-ratio axis
  "fish",
  "poultry",
  "red-meat",
  "processed-meat",
  "dairy",
  "egg",
  // fat quality
  "healthy-fat",
  "saturated-fat",
  // processing / preparation red flags
  "ultra-processed",
  "fried",
  "sugary-drink",
  // sodium red flags
  "high-sodium",
  "pickled-salted",
  // added sugar red flag
  "added-sugar",
] as const;

export type IngredientTag = (typeof INGREDIENT_TAGS)[number];

export const TAG_SET: ReadonlySet<string> = new Set(INGREDIENT_TAGS);

export interface LongevityScoreBreakdown {
  plantRatioScore: number;
  processedFoodScore: number;
  fatQualityScore: number;
  sodiumScore: number;
  addedSugarScore: number;
  total: number;
}
