"use client";

import { useState } from "react";
import { getStageGuideByRecipeId } from "@/lib/data";
import { getDictionary, localizedText, type Locale } from "@/lib/i18n";

interface RecipeStageTabsProps {
  recipeId: string;
  locale: Locale;
}

type Stage = 1 | 2 | 3;

export default function RecipeStageTabs({ recipeId, locale }: RecipeStageTabsProps) {
  const guide = getStageGuideByRecipeId(recipeId);
  const t = getDictionary(locale);
  const [stage, setStage] = useState<Stage>(1);

  if (!guide) {
    return null;
  }

  const stages: { value: Stage; label: string }[] = [
    { value: 1, label: t.recipe.stage1Label },
    { value: 2, label: t.recipe.stage2Label },
    { value: 3, label: t.recipe.stage3Label },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {stages.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setStage(value)}
            aria-pressed={stage === value}
            className={
              stage === value
                ? "shrink-0 whitespace-nowrap rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white"
                : "shrink-0 whitespace-nowrap rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-600 hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            }
          >
            {label}
          </button>
        ))}
      </div>

      {stage === 1 && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.recipe.stage1Note}</p>
      )}

      {stage === 2 && (
        <div className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {t.recipe.stage2DetailHeading}
          </span>
          <p className="text-sm text-zinc-800 dark:text-zinc-200">
            {localizedText(guide.stage2Detail, locale)}
          </p>
        </div>
      )}

      {stage === 3 && (
        <div className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {t.recipe.stage3DetailHeading}
          </span>
          <p className="text-sm text-zinc-800 dark:text-zinc-200">
            {localizedText(guide.stage3Detail, locale)}
          </p>
        </div>
      )}
    </div>
  );
}
