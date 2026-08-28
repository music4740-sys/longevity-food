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

// recipes.json is loaded via `as Recipe[]` (not `satisfies`), so unlike plans.json and
// substitutes.json it gets no compile-time check that every LocalizedText node carries all
// 6 locale keys. This recursive walk is the runtime safety net for all three datasets.
const REQUIRED_LOCALES = ["ko", "en", "ja", "zh", "es", "fr"];

function isLocalizedText(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    typeof (value as Record<string, unknown>).ko === "string"
  );
}

function checkLocalizedTextCompleteness(value: unknown, path: string): void {
  if (Array.isArray(value)) {
    value.forEach((item, i) => checkLocalizedTextCompleteness(item, `${path}[${i}]`));
    return;
  }
  if (typeof value !== "object" || value === null) {
    return;
  }
  if (isLocalizedText(value)) {
    for (const locale of REQUIRED_LOCALES) {
      if (typeof value[locale] !== "string") {
        fail(`${path} is missing locale "${locale}"`);
      }
    }
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    checkLocalizedTextCompleteness(child, `${path}.${key}`);
  }
}

checkLocalizedTextCompleteness(plans, "plans");
checkLocalizedTextCompleteness(recipes, "recipes");
checkLocalizedTextCompleteness(substitutes, "substitutes");

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
