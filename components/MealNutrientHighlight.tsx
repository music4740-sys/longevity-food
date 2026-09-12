import { getDictionary, type Locale } from "@/lib/i18n";
import type { NutrientStatus } from "@/types";

interface MealNutrientHighlightProps {
  statuses: NutrientStatus[];
  locale: Locale;
}

// Compact one-liner for a meal section — the full breakdown lives in the daily
// summary card. Only surfaces the worst 1-2 low nutrients so 4 meal sections
// don't each repeat a full badge grid + every matching recommendation.
export default function MealNutrientHighlight({ statuses, locale }: MealNutrientHighlightProps) {
  const t = getDictionary(locale);
  const recommendations = t.nutrition.nutrientRecommendations;

  const worst = statuses
    .filter((s) => s.level === "low" && s.nutrient in recommendations)
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 2);

  if (worst.length === 0) return null;

  const names = worst.map((s) => t.nutrition.nutrientLabels[s.nutrient]).join("·");
  const recommendation = recommendations[worst[0].nutrient as keyof typeof recommendations];

  return (
    <p className="text-xs text-amber-800 dark:text-amber-400">
      💡 {names} {t.nutrition.statusLow} — {recommendation}
    </p>
  );
}
