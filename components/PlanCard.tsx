import Link from "next/link";
import { getPlanAverageLongevityScore } from "@/lib/data";
import { getDictionary, localizedText, type Locale } from "@/lib/i18n";
import type { Plan } from "@/types";

interface PlanCardProps {
  plan: Plan;
  locale: Locale;
}

export default function PlanCard({ plan, locale }: PlanCardProps) {
  const t = getDictionary(locale);
  const averageScore = getPlanAverageLongevityScore(plan);

  return (
    <Link
      href={`/${locale}/plans/${plan.slug}`}
      className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
    >
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {localizedText(plan.title, locale)}
      </h2>
      <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
        {localizedText(plan.description, locale)}
      </p>
      <div className="flex flex-wrap gap-2 pt-1">
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {plan.durationDays}
          {t.plan.durationUnit}
        </span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          {t.plan.longevityScoreLabel} {averageScore}
          {t.plan.scoreUnit}
        </span>
      </div>
    </Link>
  );
}
