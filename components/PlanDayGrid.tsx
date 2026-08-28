"use client";

import { Fragment, useEffect, useState } from "react";
import MealCell from "@/components/MealCell";
import { getSelectedRegion, type CuisineRegion } from "@/lib/cuisineRegion";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { DayMeal, Plan } from "@/types";

interface PlanDayGridProps {
  plan: Plan;
  locale: Locale;
}

function resolveRecipeId(
  day: DayMeal,
  meal: "breakfast" | "lunch" | "dinner",
  region: CuisineRegion | null,
): string {
  if (!region) return day[meal];
  const byRegion = day[`${meal}ByRegion`];
  return byRegion?.[region] ?? day[meal];
}

export default function PlanDayGrid({ plan, locale }: PlanDayGridProps) {
  const t = getDictionary(locale);
  const dayLabel = (day: number) => t.plan.dayLabelFormat.replace("{n}", String(day));
  const [region, setRegion] = useState<CuisineRegion | null>(null);

  useEffect(() => {
    setRegion(getSelectedRegion());
    const onStorage = () => setRegion(getSelectedRegion());
    window.addEventListener("storage", onStorage);
    window.addEventListener("cuisine-region-change", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cuisine-region-change", onStorage);
    };
  }, []);

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
              <MealCell recipeId={resolveRecipeId(day, "breakfast", region)} mealLabel={t.plan.mealLabels.breakfast} locale={locale} />
              <MealCell recipeId={resolveRecipeId(day, "lunch", region)} mealLabel={t.plan.mealLabels.lunch} locale={locale} />
              <MealCell recipeId={resolveRecipeId(day, "dinner", region)} mealLabel={t.plan.mealLabels.dinner} locale={locale} />
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
            <MealCell recipeId={resolveRecipeId(day, "breakfast", region)} mealLabel={t.plan.mealLabels.breakfast} locale={locale} />
            <MealCell recipeId={resolveRecipeId(day, "lunch", region)} mealLabel={t.plan.mealLabels.lunch} locale={locale} />
            <MealCell recipeId={resolveRecipeId(day, "dinner", region)} mealLabel={t.plan.mealLabels.dinner} locale={locale} />
          </Fragment>
        ))}
      </div>
    </>
  );
}
