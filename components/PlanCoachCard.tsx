import { getStapleByFoodId } from "@/lib/dailyStaples";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { Coaching } from "@/lib/planCoaching";
import type { ConcernTag } from "@/lib/onboardingProfile";

interface PlanCoachCardProps {
  concern: ConcernTag;
  coaching: Coaching;
  streak: number;
  locale: Locale;
}

// The tab's hero: two columns, "eat this" vs "go easy on this", for the user's
// chosen goal. Kept above the food log so it's the first thing seen each visit.
export default function PlanCoachCard({ concern, coaching, streak, locale }: PlanCoachCardProps) {
  const t = getDictionary(locale);
  const labels = t.nutrition.nutrientLabels;
  const title = t.nutrition.coachTitle.replace("{concern}", t.onboarding.concernTags[concern]);

  // Flatten to a short, scannable food list (dedupe across nutrients).
  const pickFoods = [...new Map(coaching.more.flatMap((m) => m.picks).map((f) => [f.id, f])).values()].slice(0, 4);

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-3 dark:border-accent-900 dark:from-accent-950/40 dark:to-zinc-950">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-emerald-800 dark:text-accent-300">🎯 {title}</h2>
        {streak > 0 && (
          <span className="shrink-0 rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
            🔥 {t.nutrition.streakDays.replace("{n}", String(streak))}
          </span>
        )}
      </div>

      {coaching.balanced ? (
        <p className="text-sm font-semibold text-emerald-700 dark:text-accent-400">{t.nutrition.coachBalanced}</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1.5 rounded-xl bg-emerald-100/70 p-2.5 dark:bg-accent-900/40">
            <span className="text-xs font-bold text-emerald-800 dark:text-accent-300">🟢 {t.nutrition.coachMore}</span>
            {coaching.more.length > 0 && (
              <span className="text-[11px] text-emerald-900/70 dark:text-accent-200/70">
                {coaching.more.map((m) => `${labels[m.nutrient]} ${m.percent}%`).join(" · ")}
              </span>
            )}
            <ul className="flex flex-col gap-1">
              {pickFoods.map((food) => (
                <li key={food.id} className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {getStapleByFoodId(food.id)?.emoji ?? food.emoji} {getStapleByFoodId(food.id)?.label ?? food.family ?? food.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-1.5 rounded-xl bg-red-100/70 p-2.5 dark:bg-red-950/40">
            <span className="text-xs font-bold text-red-800 dark:text-red-300">🔴 {t.nutrition.coachLess}</span>
            {coaching.less.length > 0 ? (
              <ul className="flex flex-col gap-1.5">
                {coaching.less.map((item) => (
                  <li key={item.nutrient} className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                    {item.culprit ? `${item.culprit.emoji} ${item.culprit.name}` : labels[item.nutrient]}
                    <span className="block text-[11px] font-normal text-red-800/80 dark:text-red-300/80">
                      {labels[item.nutrient]} {item.percent}%
                    </span>
                    {item.swap && (
                      <span className="block text-[11px] font-semibold text-emerald-700 dark:text-accent-400">
                        ↪ {t.nutrition.coachSwap.replace("{food}", `${item.swap.emoji} ${item.swap.family ?? item.swap.name}`)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-xs text-red-900/80 dark:text-red-200/80">
                {t.nutrition.coachLessGeneral.replace(
                  "{nutrients}",
                  coaching.focusLess.map((n) => labels[n]).join("·"),
                )}
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
