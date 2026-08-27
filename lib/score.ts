import type { IngredientTag, LongevityScoreBreakdown } from "@/types/score";

export const WEIGHTS = {
  plantRatio: 30,
  processedFood: 25,
  fatQuality: 15,
  sodium: 15,
  addedSugar: 15,
} as const;

const PLANT_GROUP_TAGS = new Set<IngredientTag>([
  "whole-grain",
  "refined-grain",
  "vegetable",
  "leafy-green",
  "fruit",
  "legume",
  "nuts-seeds",
]);
const ANIMAL_GROUP_TAGS = new Set<IngredientTag>([
  "fish",
  "poultry",
  "red-meat",
  "processed-meat",
  "dairy",
  "egg",
]);

const HEALTHY_FAT_TAGS = new Set<IngredientTag>(["healthy-fat"]);
const UNHEALTHY_FAT_TAGS = new Set<IngredientTag>(["saturated-fat"]);

// Points subtracted from the processed-food axis, per occurrence.
const PROCESSED_PENALTY: Partial<Record<IngredientTag, number>> = {
  "ultra-processed": 12,
  fried: 8,
  "processed-meat": 8,
  "sugary-drink": 8,
  "refined-grain": 4,
  "pickled-salted": 3,
};

// Points subtracted from the sodium axis, per occurrence.
const SODIUM_PENALTY: Partial<Record<IngredientTag, number>> = {
  "high-sodium": 10,
  "pickled-salted": 10,
};

// Points subtracted from the added-sugar axis, per occurrence.
const ADDED_SUGAR_PENALTY: Partial<Record<IngredientTag, number>> = {
  "added-sugar": 6,
  "sugary-drink": 15,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// (positive tag count) / (positive + negative tag count) * max.
// Neutral (half credit) when neither side of the axis is tagged at all.
function ratioScore(
  tags: IngredientTag[],
  positiveTags: Set<IngredientTag>,
  negativeTags: Set<IngredientTag>,
  max: number,
): number {
  const positive = tags.filter((tag) => positiveTags.has(tag)).length;
  const negative = tags.filter((tag) => negativeTags.has(tag)).length;
  const total = positive + negative;
  if (total === 0) return max / 2;
  return (positive / total) * max;
}

// Starts at max and subtracts each tagged occurrence's penalty, floored at 0.
function penaltyScore(
  tags: IngredientTag[],
  penalties: Partial<Record<IngredientTag, number>>,
  max: number,
): number {
  const deducted = tags.reduce((sum, tag) => sum + (penalties[tag] ?? 0), 0);
  return clamp(max - deducted, 0, max);
}

export function calculateLongevityScore(
  ingredientTags: IngredientTag[],
): LongevityScoreBreakdown {
  const plantRatioScore = ratioScore(
    ingredientTags,
    PLANT_GROUP_TAGS,
    ANIMAL_GROUP_TAGS,
    WEIGHTS.plantRatio,
  );

  const fatQualityScore = ratioScore(
    ingredientTags,
    HEALTHY_FAT_TAGS,
    UNHEALTHY_FAT_TAGS,
    WEIGHTS.fatQuality,
  );

  const processedFoodScore = penaltyScore(
    ingredientTags,
    PROCESSED_PENALTY,
    WEIGHTS.processedFood,
  );

  const sodiumScore = penaltyScore(ingredientTags, SODIUM_PENALTY, WEIGHTS.sodium);

  const addedSugarScore = penaltyScore(
    ingredientTags,
    ADDED_SUGAR_PENALTY,
    WEIGHTS.addedSugar,
  );

  const total =
    plantRatioScore + processedFoodScore + fatQualityScore + sodiumScore + addedSugarScore;

  return {
    plantRatioScore: Math.round(plantRatioScore),
    processedFoodScore: Math.round(processedFoodScore),
    fatQualityScore: Math.round(fatQualityScore),
    sodiumScore: Math.round(sodiumScore),
    addedSugarScore: Math.round(addedSugarScore),
    total: Math.round(total),
  };
}
