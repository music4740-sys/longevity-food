import { getDictionary, type Locale } from "@/lib/i18n";
import { UPPER_BOUND_NUTRIENTS } from "@/lib/nutritionTargets";
import type { NutrientStatus, NutrientValues } from "@/types";

interface NutritionSummaryCardProps {
  totals: NutrientValues;
  calorieTarget: number;
  statuses: NutrientStatus[];
  locale: Locale;
  /** Compact mode drops the per-nutrient percent breakdown and reference note — used in per-meal sections. */
  compact?: boolean;
  title?: string;
}

const STATUS_BADGE_CLASS: Record<NutrientStatus["level"], string> = {
  low: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400",
  ok: "bg-emerald-100 text-emerald-800 dark:bg-accent-900 dark:text-accent-300",
  high: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export default function NutritionSummaryCard({
  totals,
  calorieTarget,
  statuses,
  locale,
  compact = false,
  title,
}: NutritionSummaryCardProps) {
  const t = getDictionary(locale);
  const deficient = statuses.filter((s) => s.level === "low");
  const caloriePercent = calorieTarget > 0 ? Math.round((totals.calories / calorieTarget) * 100) : 0;

  return (
    <div
      className={
        compact
          ? "flex flex-col gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 dark:border-accent-900/60 dark:bg-accent-950/20"
          : "flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4 dark:border-accent-900 dark:from-accent-950/40 dark:to-zinc-950"
      }
    >
      <span className="text-xs font-semibold text-emerald-700 dark:text-accent-400">
        {title ?? t.nutrition.summaryTitle}
      </span>

      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-emerald-900 dark:text-accent-200">
          🔥 {t.nutrition.caloriesLabel}
        </span>
        <span className="text-sm font-bold text-emerald-800 dark:text-accent-300">
          {Math.round(totals.calories).toLocaleString(locale)} / {Math.round(calorieTarget).toLocaleString(locale)}{" "}
          {t.nutrition.unitKcal} ({caloriePercent}%)
        </span>
      </div>

      {!compact && (
        <div className="flex flex-col gap-1.5">
          {statuses
            .filter((s) => s.nutrient !== "calories")
            .map((status) => (
              <div key={status.nutrient} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-emerald-900/80 dark:text-accent-200/80">
                  {t.nutrition.nutrientLabels[status.nutrient]}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700/70 dark:text-accent-400/70">{status.percent}%</span>
                  <span className={`rounded-full px-2 py-0.5 font-bold ${STATUS_BADGE_CLASS[status.level]}`}>
                    {status.level === "low"
                      ? t.nutrition.statusLow
                      : status.level === "high"
                        ? t.nutrition.statusHigh
                        : UPPER_BOUND_NUTRIENTS.has(status.nutrient)
                          ? t.nutrition.statusModerate
                          : t.nutrition.statusOk}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

      <div className={compact ? "flex flex-col gap-1" : "flex flex-col gap-1 border-t border-emerald-200 pt-2 dark:border-accent-900"}>
        <span className="text-xs font-semibold text-emerald-700 dark:text-accent-400">
          {t.nutrition.deficientSectionTitle}
        </span>
        {deficient.length === 0 ? (
          <span className="text-xs text-emerald-700/70 dark:text-accent-400/70">
            {t.nutrition.noDeficiencyText}
          </span>
        ) : (
          <>
            <div className="flex flex-wrap gap-1.5">
              {deficient.map((status) => (
                <span
                  key={status.nutrient}
                  className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-400"
                >
                  {t.nutrition.nutrientLabels[status.nutrient]}
                </span>
              ))}
            </div>
            <ul className="flex flex-col gap-0.5">
              {deficient
                .filter((status) => status.nutrient in t.nutrition.nutrientRecommendations)
                .map((status) => (
                  <li key={status.nutrient} className="text-xs text-emerald-800/90 dark:text-accent-300/90">
                    · {t.nutrition.nutrientRecommendations[status.nutrient as keyof typeof t.nutrition.nutrientRecommendations]}
                  </li>
                ))}
            </ul>
          </>
        )}
      </div>

      {!compact && (
        <p className="text-xs text-emerald-700/80 dark:text-accent-400/80">{t.nutrition.referenceNote}</p>
      )}
    </div>
  );
}
