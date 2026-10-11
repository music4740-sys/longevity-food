import MealNutrientHighlight from "@/components/MealNutrientHighlight";
import { getDictionary, type Locale } from "@/lib/i18n";
import { UPPER_BOUND_NUTRIENTS } from "@/lib/nutritionTargets";
import type { NutrientStatus } from "@/types";

interface NutritionGlanceProps {
  statuses: NutrientStatus[];
  hasEntries: boolean;
  locale: Locale;
}

// One-glance verdict for the day: which nutrients are covered, short, or over.
// Calories live in the sticky summary bar, so they're skipped here.
export default function NutritionGlance({ statuses, hasEntries, locale }: NutritionGlanceProps) {
  const t = getDictionary(locale);
  const labels = t.nutrition.nutrientLabels;

  const rows = statuses.filter((s) => s.nutrient !== "calories");
  const covered = rows.filter((s) => s.level === "ok" && !UPPER_BOUND_NUTRIENTS.has(s.nutrient));
  const low = rows.filter((s) => s.level === "low");
  const high = rows.filter((s) => s.level === "high");

  const groups = [
    { key: "ok", title: t.nutrition.glanceOk, items: covered, chip: "bg-emerald-100 text-emerald-800 dark:bg-accent-900 dark:text-accent-300" },
    { key: "low", title: t.nutrition.glanceLow, items: low, chip: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400" },
    { key: "high", title: t.nutrition.glanceHigh, items: high, chip: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" },
  ];

  return (
    <section className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{t.nutrition.glanceTitle}</h2>
      {!hasEntries ? (
        <p className="text-xs text-zinc-400">{t.nutrition.glanceEmpty}</p>
      ) : (
        <>
          {groups
            .filter((g) => g.items.length > 0)
            .map((g) => (
              <div key={g.key} className="flex items-start gap-2">
                <span className="w-9 shrink-0 pt-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  {g.title}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((s) => (
                    <span key={s.nutrient} className={`rounded-full px-2.5 py-1 text-xs font-bold ${g.chip}`}>
                      {labels[s.nutrient]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          <MealNutrientHighlight statuses={statuses} locale={locale} />
        </>
      )}
    </section>
  );
}
