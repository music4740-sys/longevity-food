import { WEIGHTS } from "@/lib/score";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { LongevityScoreBreakdown } from "@/types";

interface ScoreBreakdownProps {
  score: LongevityScoreBreakdown;
  locale: Locale;
}

export default function ScoreBreakdown({ score, locale }: ScoreBreakdownProps) {
  const t = getDictionary(locale);

  const axes = [
    { label: t.recipe.axisLabels.plantRatio, value: score.plantRatioScore, max: WEIGHTS.plantRatio },
    { label: t.recipe.axisLabels.processedFood, value: score.processedFoodScore, max: WEIGHTS.processedFood },
    { label: t.recipe.axisLabels.fatQuality, value: score.fatQualityScore, max: WEIGHTS.fatQuality },
    { label: t.recipe.axisLabels.sodium, value: score.sodiumScore, max: WEIGHTS.sodium },
    { label: t.recipe.axisLabels.addedSugar, value: score.addedSugarScore, max: WEIGHTS.addedSugar },
  ];

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          {t.recipe.scoreBreakdownTitle}
        </h2>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          {t.plan.longevityScoreLabel} {score.total}
          {t.plan.scoreUnit}
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {axes.map((axis) => (
          <li key={axis.label} className="flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-300">{axis.label}</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              {axis.value}/{axis.max}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
