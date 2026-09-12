import { getDictionary, type Locale } from "@/lib/i18n";
import type { NutrientValues } from "@/types";

interface NutritionSummaryBarProps {
  locale: Locale;
  dateLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onToggleCalendar: () => void;
  showCalendar: boolean;
  totals: NutrientValues;
  targets: NutrientValues;
}

const MACRO_BAR_CLASS: Record<"carbs" | "protein" | "fat", string> = {
  carbs: "bg-amber-500",
  protein: "bg-rose-500",
  fat: "bg-sky-500",
};

export default function NutritionSummaryBar({
  locale,
  dateLabel,
  onPrev,
  onNext,
  onToggleCalendar,
  showCalendar,
  totals,
  targets,
}: NutritionSummaryBarProps) {
  const t = getDictionary(locale);
  const caloriePercent = targets.calories > 0 ? Math.round((totals.calories / targets.calories) * 100) : 0;

  return (
    <div className="sticky top-0 z-10 flex flex-col gap-2 border-b border-zinc-200 bg-zinc-50/95 px-4 py-2.5 backdrop-blur dark:border-zinc-800 dark:bg-black/95">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="px-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          aria-label={t.nutrition.dateYesterday}
        >
          ◀
        </button>
        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{dateLabel}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onNext}
            className="px-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            aria-label={t.nutrition.dateTomorrow}
          >
            ▶
          </button>
          <button
            type="button"
            onClick={onToggleCalendar}
            aria-label={showCalendar ? t.nutrition.calendarClose : t.nutrition.calendarToggle}
            className="px-1 text-base"
          >
            📅
          </button>
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold text-emerald-700 dark:text-accent-400">
          🔥 {t.nutrition.caloriesLabel}
        </span>
        <span className="text-sm font-bold text-emerald-800 dark:text-accent-300">
          {Math.round(totals.calories).toLocaleString(locale)} / {Math.round(targets.calories).toLocaleString(locale)}{" "}
          {t.nutrition.unitKcal} ({caloriePercent}%)
        </span>
      </div>

      <div className="flex gap-3">
        {(["carbs", "protein", "fat"] as const).map((key) => {
          const percent = targets[key] > 0 ? Math.min(100, Math.round((totals[key] / targets[key]) * 100)) : 0;
          return (
            <div key={key} className="flex flex-1 flex-col gap-0.5">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                {t.nutrition.nutrientLabels[key]}
              </span>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className={`h-full rounded-full ${MACRO_BAR_CLASS[key]}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
