import { foods } from "@/lib/data";
import { COMMON_INGREDIENT_FAMILIES } from "@/lib/commonIngredients";
import { resolveStaples } from "@/lib/dailyStaples";
import { getLoadedIngredients } from "@/lib/ingredients";
import { DEFAULT_DAILY_TARGETS } from "@/lib/nutritionTargets";
import { UPPER_BOUND_NUTRIENTS } from "@/lib/nutritionTargets";
import type { ConcernTag } from "@/lib/onboardingProfile";
import type { Food, NutrientKey, NutrientStatus, NutritionLogEntry } from "@/types";

// Which nutrients each goal leans on. Wording shown to users stays "focus on /
// go easy on" — never a treatment claim (see CLAUDE.md rule 1).
interface CoachFocus {
  more: NutrientKey[];
  less: NutrientKey[];
}

export const COACH_FOCUS: Record<ConcernTag, CoachFocus> = {
  "blood-sugar": { more: ["fiber", "protein"], less: ["sugar", "carbs"] },
  "heart-health": { more: ["fiber"], less: ["saturatedFat", "sodium"] },
  "gut-health": { more: ["fiber"], less: ["sugar", "saturatedFat"] },
  "plant-based": { more: ["fiber", "iron", "calcium"], less: ["saturatedFat"] },
  balanced: { more: ["protein", "fiber", "calcium"], less: ["sodium", "sugar"] },
  cardiovascular: { more: ["fiber"], less: ["sodium", "saturatedFat"] },
  "brain-health": { more: ["protein", "iron"], less: ["sugar", "saturatedFat"] },
  "anti-inflammatory": { more: ["fiber"], less: ["sugar", "saturatedFat"] },
  "skin-hair": { more: ["protein", "iron"], less: ["sugar"] },
  "muscle-health": { more: ["protein", "calcium"], less: ["saturatedFat"] },
  "weight-management": { more: ["fiber", "protein"], less: ["fat", "sugar"] },
  "blue-zone": { more: ["fiber", "iron"], less: ["sodium", "sugar"] },
};

export interface CoachMore {
  nutrient: NutrientKey;
  percent: number;
  picks: Food[];
}

export interface CoachLess {
  nutrient: NutrientKey;
  percent: number;
  /** The logged food contributing the most of this nutrient today. */
  culprit?: Food;
  /** A similar food that is lower in this nutrient — "swap it for this". */
  swap?: Food;
}

export interface Coaching {
  more: CoachMore[];
  less: CoachLess[];
  /** The goal's go-easy-on nutrients, shown as general guidance before anything is logged. */
  focusLess: NutrientKey[];
  /** Entries exist and nothing needs attention. */
  balanced: boolean;
}

const LESS_WARN_PERCENT = 80;
const MAX_PICKS = 3;

// Light, everyday foods only — a "more fiber" pick that is 900 mg of sodium
// would undercut the other half of the advice.
function isGentlePick(food: Food): boolean {
  const n = food.nutrients;
  return n.calories <= 450 && n.sodium <= 700 && n.sugar <= 15 && n.saturatedFat <= 8;
}

// A pick has to matter: one serving should cover a real slice of the daily target.
const MIN_TARGET_SHARE = 0.1;
// Raw-ingredient variants that read oddly as a suggestion (offal, preserved, dried powders…).
const PLAIN_PREPARATION = /(생것|삶은것|데친것|찐것|구운것)\)?$/;
const NOISY_VARIANT = /수입|튀긴|조린|줄기|껍질|씨|잎|전체|적색육|혈합육/;
const ODD_INGREDIENT = /부산물|내장|젓|말린것|건조|가루|분말|통조림|훈제|절인것|육수/;

function isSuggestable(food: Food): boolean {
  if (food.category === "ingredient") {
    if (!COMMON_INGREDIENT_FAMILIES.has(food.family ?? "") || ODD_INGREDIENT.test(food.name)) return false;
    // Plain preparations only — not "수입", regional cuts or processed variants.
    if (!PLAIN_PREPARATION.test(food.name) || NOISY_VARIANT.test(food.name)) return false;
  }
  return isGentlePick(food);
}

// Nutrients that define what a food "is" nutritionally; the nutrient being cut is
// left out so the swap can differ there while staying alike everywhere else.
const PROFILE_KEYS: NutrientKey[] = ["calories", "carbs", "protein", "fat", "fiber", "calcium", "iron"];
const SWAP_MIN_REDUCTION = 0.3;

function profileDistance(a: Food, b: Food, skip: NutrientKey): number {
  let sum = 0;
  for (const key of PROFILE_KEYS) {
    if (key === skip) continue;
    const diff = (a.nutrients[key] - b.nutrients[key]) / DEFAULT_DAILY_TARGETS[key];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

/** Nearest food by nutrient profile that has clearly less of `nutrient` (same kind of food). */
export function findSwap(food: Food, nutrient: NutrientKey, excludeIds: Set<string>): Food | undefined {
  const current = food.nutrients[nutrient];
  if (current <= 0) return undefined;
  const sameKind = (other: Food) =>
    food.category === "ingredient"
      ? other.category === "ingredient" && other.subgroup === food.subgroup
      : other.category === food.category;
  let best: Food | undefined;
  let bestDistance = Infinity;
  for (const other of [...foods, ...getLoadedIngredients()]) {
    if (other.id === food.id || excludeIds.has(other.id) || (food.family && other.family === food.family)) continue;
    if (!sameKind(other) || !isSuggestable(other)) continue;
    if (other.nutrients[nutrient] > current * (1 - SWAP_MIN_REDUCTION)) continue;
    const distance = profileDistance(food, other, nutrient);
    if (distance < bestDistance) {
      best = other;
      bestDistance = distance;
    }
  }
  return best;
}

// Suggestions come from the curated everyday list first; the wider (still
// filtered) pool only tops up if the staples can't cover the nutrient.
function pickFoods(nutrient: NutrientKey, excludeIds: Set<string>): Food[] {
  const fromStaples = pickFrom(
    resolveStaples().map((s) => s.food),
    nutrient,
    excludeIds,
    false,
  );
  if (fromStaples.length >= MAX_PICKS) return fromStaples;
  const have = new Set(fromStaples.map((f) => f.id));
  const topUp = pickFrom([...foods, ...getLoadedIngredients()], nutrient, new Set([...excludeIds, ...have]), true);
  return [...fromStaples, ...topUp].slice(0, MAX_PICKS);
}

function pickFrom(candidates: Food[], nutrient: NutrientKey, excludeIds: Set<string>, strict: boolean): Food[] {
  const target = DEFAULT_DAILY_TARGETS[nutrient];
  const score = (food: Food) => food.nutrients[nutrient] / Math.max(food.nutrients.calories, 50);
  const picks: Food[] = [];
  const seenFamilies = new Set<string>();
  const pool = candidates
    .filter(
      (food) =>
        !excludeIds.has(food.id) &&
        (!strict || isSuggestable(food)) &&
        food.nutrients[nutrient] / target >= MIN_TARGET_SHARE,
    )
    .sort((a, b) => score(b) - score(a));
  for (const food of pool) {
    // One suggestion per family so 3 picks aren't three kinds of the same fish.
    const family = food.family ?? food.id;
    if (seenFamilies.has(family)) continue;
    seenFamilies.add(family);
    picks.push(food);
    if (picks.length === MAX_PICKS) break;
  }
  return picks;
}

export function buildCoaching(
  concern: ConcernTag,
  statuses: NutrientStatus[],
  entries: NutritionLogEntry[],
  getFood: (id: string) => Food | undefined,
): Coaching {
  const focus = COACH_FOCUS[concern];
  const byNutrient = new Map(statuses.map((s) => [s.nutrient, s]));
  const hasEntries = entries.length > 0;
  const loggedIds = new Set(entries.map((entry) => entry.foodId));

  // Before anything is logged, show the goal's focus nutrients as a starting point.
  const more = focus.more
    .map((nutrient) => ({ nutrient, percent: byNutrient.get(nutrient)?.percent ?? 0 }))
    .filter(({ nutrient }) => !hasEntries || byNutrient.get(nutrient)?.level === "low")
    .map(({ nutrient, percent }) => ({ nutrient, percent, picks: pickFoods(nutrient, loggedIds) }));

  const less: CoachLess[] = hasEntries
    ? focus.less
        .map((nutrient) => ({ nutrient, percent: byNutrient.get(nutrient)?.percent ?? 0 }))
        .filter(({ nutrient, percent }) =>
          percent >= (UPPER_BOUND_NUTRIENTS.has(nutrient) || nutrient === "fat" ? LESS_WARN_PERCENT : 100),
        )
        .map(({ nutrient, percent }) => {
          let culprit: Food | undefined;
          let best = 0;
          for (const entry of entries) {
            const food = getFood(entry.foodId);
            const amount = food ? food.nutrients[nutrient] * entry.servings : 0;
            if (food && amount > best) {
              best = amount;
              culprit = food;
            }
          }
          return { nutrient, percent, culprit, swap: culprit ? findSwap(culprit, nutrient, loggedIds) : undefined };
        })
    : [];

  return { more, less, focusLess: focus.less, balanced: hasEntries && more.length === 0 && less.length === 0 };
}
