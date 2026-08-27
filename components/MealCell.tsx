import Link from "next/link";
import { getRecipeById, getRecipeLongevityScore } from "@/lib/data";
import { getDictionary, localizedText, type Locale } from "@/lib/i18n";

interface MealCellProps {
  recipeId: string;
  mealLabel: string;
  locale: Locale;
}

export default function MealCell({ recipeId, mealLabel, locale }: MealCellProps) {
  const recipe = getRecipeById(recipeId);
  if (!recipe) return null;

  const t = getDictionary(locale);
  const score = getRecipeLongevityScore(recipe).total;

  return (
    <Link
      href={`/${locale}/recipes/${recipe.slug}`}
      className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-3 text-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30"
    >
      <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">{mealLabel}</span>
      <span className="font-medium text-zinc-900 dark:text-zinc-50">
        {localizedText(recipe.title, locale)}
      </span>
      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
        {t.plan.longevityScoreLabel} {score}
        {t.plan.scoreUnit}
      </span>
    </Link>
  );
}
