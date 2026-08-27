import { Fragment } from "react";
import MealCell from "@/components/MealCell";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { Plan } from "@/types";

interface PlanDayGridProps {
  plan: Plan;
  locale: Locale;
}

export default function PlanDayGrid({ plan, locale }: PlanDayGridProps) {
  const t = getDictionary(locale);
  const dayLabel = (day: number) => t.plan.dayLabelFormat.replace("{n}", String(day));

  return (
    <>
      {/* Mobile: one card per day, meals stacked vertically */}
      <div className="flex flex-col gap-4 md:hidden">
        {plan.days.map((day) => (
          <section
            key={day.day}
            className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              {dayLabel(day.day)}
            </h2>
            <div className="flex flex-col gap-2">
              <MealCell recipeId={day.breakfast} mealLabel={t.plan.mealLabels.breakfast} locale={locale} />
              <MealCell recipeId={day.lunch} mealLabel={t.plan.mealLabels.lunch} locale={locale} />
              <MealCell recipeId={day.dinner} mealLabel={t.plan.mealLabels.dinner} locale={locale} />
            </div>
          </section>
        ))}
      </div>

      {/* Desktop: 7-day x 3-meal grid */}
      <div className="hidden md:grid md:grid-cols-[auto_repeat(3,1fr)] md:gap-3">
        <div />
        <div className="px-1 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          {t.plan.mealLabels.breakfast}
        </div>
        <div className="px-1 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          {t.plan.mealLabels.lunch}
        </div>
        <div className="px-1 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          {t.plan.mealLabels.dinner}
        </div>
        {plan.days.map((day) => (
          <Fragment key={day.day}>
            <div className="flex items-center px-1 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              {dayLabel(day.day)}
            </div>
            <MealCell recipeId={day.breakfast} mealLabel={t.plan.mealLabels.breakfast} locale={locale} />
            <MealCell recipeId={day.lunch} mealLabel={t.plan.mealLabels.lunch} locale={locale} />
            <MealCell recipeId={day.dinner} mealLabel={t.plan.mealLabels.dinner} locale={locale} />
          </Fragment>
        ))}
      </div>
    </>
  );
}
