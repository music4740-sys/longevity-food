import { getDictionary, type Locale } from "@/lib/i18n";
import { STAPLE_GROUPS, type StapleGroup } from "@/lib/dailyStaples";

interface DailyStaplesStripProps {
  covered: Set<StapleGroup>;
  onPick: (group: StapleGroup) => void;
  locale: Locale;
}

const GROUP_EMOJI: Record<StapleGroup, string> = {
  veg: "🥬",
  fruit: "🍎",
  protein: "🍳",
  carb: "🍚",
  fat: "🫒",
};

// Daily habit loop: five food groups to touch every day. Tapping an open one
// jumps straight to its everyday ingredients.
export default function DailyStaplesStrip({ covered, onPick, locale }: DailyStaplesStripProps) {
  const t = getDictionary(locale);
  const done = STAPLE_GROUPS.filter((g) => covered.has(g)).length;

  return (
    <section className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{t.nutrition.staplesStripTitle}</h2>
        <span className="text-xs font-bold text-emerald-700 dark:text-accent-400">{done}/{STAPLE_GROUPS.length}</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {STAPLE_GROUPS.map((group) => {
          const isDone = covered.has(group);
          return (
            <button
              key={group}
              type="button"
              onClick={() => onPick(group)}
              className={`flex flex-col items-center gap-0.5 rounded-xl border py-2 text-[11px] font-semibold ${
                isDone
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-accent-900 dark:bg-accent-950/30 dark:text-accent-300"
                  : "border-dashed border-zinc-300 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
              }`}
            >
              <span className="text-lg">{isDone ? "✅" : GROUP_EMOJI[group]}</span>
              {t.nutrition.stapleGroups[group]}
            </button>
          );
        })}
      </div>
      {done < STAPLE_GROUPS.length ? (
        <p className="text-xs text-zinc-400">{t.nutrition.staplesStripHint}</p>
      ) : (
        <p className="text-xs font-semibold text-emerald-700 dark:text-accent-400">{t.nutrition.staplesStripDone}</p>
      )}
    </section>
  );
}
