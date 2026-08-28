import plansJson from "@/data/plans.json";
import recipesJson from "@/data/recipes.json";
import substitutesJson from "@/data/substitutes.json";
import { calculateLongevityScore } from "@/lib/score";
import { TAG_SET } from "@/types";
import type { CuisineRegion, DayMeal, LongevityScoreBreakdown, Plan, Recipe, SubstituteGroup } from "@/types";

// TypeScript widens JSON string arrays to `string[]`, so a literal-union field
// like Ingredient.tags can't be checked at compile time (`satisfies` would
// reject every value, valid or not). This is the real typo check instead.
function assertValidRecipes(data: Recipe[]): Recipe[] {
  for (const recipe of data) {
    for (const ingredient of recipe.ingredients) {
      for (const tag of ingredient.tags) {
        if (!TAG_SET.has(tag)) {
          throw new Error(
            `Recipe "${recipe.id}" ingredient "${ingredient.name.en}" has unknown tag "${tag}"`,
          );
        }
      }
    }
  }
  return data;
}

export const plans: Plan[] = plansJson satisfies Plan[];
export const recipes: Recipe[] = assertValidRecipes(recipesJson as Recipe[]);
export const substitutes: SubstituteGroup[] = substitutesJson satisfies SubstituteGroup[];

export function getPlanBySlug(slug: string): Plan | undefined {
  return plans.find((plan) => plan.slug === slug);
}

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find((recipe) => recipe.id === id);
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((recipe) => recipe.slug === slug);
}

export function getSubstituteGroupById(id: string): SubstituteGroup | undefined {
  return substitutes.find((group) => group.id === id);
}

export function getRecipeLongevityScore(recipe: Recipe): LongevityScoreBreakdown {
  const ingredientTags = recipe.ingredients.flatMap((ingredient) => ingredient.tags);
  return calculateLongevityScore(ingredientTags);
}

function resolveMealRecipeId(
  day: DayMeal,
  meal: "breakfast" | "lunch" | "dinner",
  region?: CuisineRegion | null,
): string {
  if (!region) return day[meal];
  const byRegion = day[`${meal}ByRegion`];
  return byRegion?.[region] ?? day[meal];
}

/** Average longevity score across every meal slot in the plan's 7-day grid (duplicates included). */
export function getPlanAverageLongevityScore(plan: Plan, region?: CuisineRegion | null): number {
  const mealRecipeIds = plan.days.flatMap((day) => [
    resolveMealRecipeId(day, "breakfast", region),
    resolveMealRecipeId(day, "lunch", region),
    resolveMealRecipeId(day, "dinner", region),
  ]);
  const totals = mealRecipeIds.map((recipeId) => {
    const recipe = getRecipeById(recipeId);
    if (!recipe) {
      throw new Error(`Plan "${plan.id}" references unknown recipe "${recipeId}"`);
    }
    return getRecipeLongevityScore(recipe).total;
  });
  return Math.round(totals.reduce((sum, score) => sum + score, 0) / totals.length);
}
