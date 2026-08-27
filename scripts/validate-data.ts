// Reaching this import without throwing already means every ingredient tag
// is valid — lib/data.ts asserts that at module load (see assertValidRecipes).
import { plans, recipes, substitutes, getRecipeById, getSubstituteGroupById } from "../lib/data";

let hasError = false;

function fail(message: string): void {
  console.error(`✗ ${message}`);
  hasError = true;
}

// A duplicate id/slug silently shadows the first match (getRecipeById etc.
// use .find()), so the later entry becomes unreachable dead data instead of
// a visible error — this catches that at validate time instead.
function checkUnique(kind: string, items: { id: string; slug?: string }[]): void {
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  for (const item of items) {
    if (seenIds.has(item.id)) {
      fail(`Duplicate ${kind} id "${item.id}"`);
    }
    seenIds.add(item.id);

    if (item.slug !== undefined) {
      if (seenSlugs.has(item.slug)) {
        fail(`Duplicate ${kind} slug "${item.slug}"`);
      }
      seenSlugs.add(item.slug);
    }
  }
}

checkUnique("recipe", recipes);
checkUnique("plan", plans);
checkUnique("substitute group", substitutes);

for (const recipe of recipes) {
  for (const ingredient of recipe.ingredients) {
    if (ingredient.substituteGroupId && !getSubstituteGroupById(ingredient.substituteGroupId)) {
      fail(
        `Recipe "${recipe.id}" ingredient "${ingredient.name.en}" references unknown substituteGroupId "${ingredient.substituteGroupId}"`,
      );
    }
  }
}

for (const plan of plans) {
  for (const day of plan.days) {
    for (const recipeId of [day.breakfast, day.lunch, day.dinner]) {
      if (!getRecipeById(recipeId)) {
        fail(`Plan "${plan.id}" day ${day.day} references unknown recipe "${recipeId}"`);
      }
    }
  }
}

if (hasError) {
  console.error("\nData validation failed.");
  process.exit(1);
}

console.log(`✓ Data validation passed (${plans.length} plans, ${recipes.length} recipes)`);
