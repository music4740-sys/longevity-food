"use client";

import { useEffect, useMemo, useState } from "react";
import FoodPickerModal from "@/components/FoodPickerModal";
import MealNutrientHighlight from "@/components/MealNutrientHighlight";
import NutritionCalendar from "@/components/NutritionCalendar";
import NutritionSummaryBar from "@/components/NutritionSummaryBar";
import NutritionSummaryCard from "@/components/NutritionSummaryCard";
import { calculateTdee } from "@/lib/bmi";
import { getDictionary, type Locale } from "@/lib/i18n";
import { computeDailyTotals, computeMealTotals, getMealTargets, getNutrientStatuses } from "@/lib/nutrition";
import { addEntry, formatDateKey, loadLog, removeEntry } from "@/lib/nutritionLog";
import { DEFAULT_DAILY_TARGETS } from "@/lib/nutritionTargets";
import { findFoodById } from "@/lib/nutritionFoods";
import { pushRecent } from "@/lib/nutritionRecents";
import { getProfile } from "@/lib/onboardingProfile";
import { MEAL_TYPES } from "@/types";
import type { MealType, NutritionLogEntry } from "@/types";

interface NutritionViewProps {
  locale: Locale;
}

export default function NutritionView({ locale }: NutritionViewProps) {
  const t = getDictionary(locale);
  const [date, setDate] = useState(() => new Date());
  const [entries, setEntries] = useState<NutritionLogEntry[]>([]);
  const [addingMeal, setAddingMeal] = useState<MealType | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calorieTarget, setCalorieTarget] = useState(DEFAULT_DAILY_TARGETS.calories);

  const dateKey = formatDateKey(date);

  useEffect(() => {
    setEntries(loadLog(dateKey));
  }, [dateKey]);

  useEffect(() => {
    const { age, gender, heightCm, weightKg, activityLevel } = getProfile();
    if (age && gender && gender !== "unspecified" && heightCm && weightKg && activityLevel) {
      setCalorieTarget(calculateTdee({ age, gender, heightCm, weightKg, activityLevel }));
    }
  }, []);

  const dailyTargets = useMemo(
    () => ({ ...DEFAULT_DAILY_TARGETS, calories: calorieTarget }),
    [calorieTarget],
  );
  const dailyTotals = useMemo(() => computeDailyTotals(entries, findFoodById), [entries]);
  const dailyStatuses = useMemo(
    () => getNutrientStatuses(dailyTotals, dailyTargets),
    [dailyTotals, dailyTargets],
  );

  function shiftDate(deltaDays: number) {
    setDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + deltaDays);
      return next;
    });
  }

  function handleAdd(mealType: MealType, foodId: string, servings: number) {
    setEntries(addEntry(dateKey, foodId, mealType, servings));
    pushRecent(foodId);
  }

  function handleRemove(foodId: string, mealType: MealType) {
    setEntries(removeEntry(dateKey, foodId, mealType));
  }

  const isToday = dateKey === formatDateKey(new Date());
  const dateLabel = isToday
    ? t.nutrition.dateToday
    : date.toLocaleDateString(locale, { month: "short", day: "numeric", weekday: "short" });

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <h1 className="px-4 pt-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {t.nutrition.pageTitle}
        </h1>
        <NutritionSummaryBar
          locale={locale}
          dateLabel={dateLabel}
          onPrev={() => shiftDate(-1)}
          onNext={() => shiftDate(1)}
          onToggleCalendar={() => setShowCalendar((s) => !s)}
          showCalendar={showCalendar}
          totals={dailyTotals}
          targets={dailyTargets}
        />

        <div className="flex flex-col gap-4 px-4 py-4">
          {showCalendar && (
            <NutritionCalendar
              locale={locale}
              selectedDate={date}
              onSelect={(next) => {
                setDate(next);
                setShowCalendar(false);
              }}
            />
          )}

          {MEAL_TYPES.map((mealType) => {
            const mealEntries = entries.filter((entry) => entry.mealType === mealType);
            const mealTotals = computeMealTotals(entries, mealType, findFoodById);
            const mealTargets = getMealTargets(dailyTargets, mealType);
            const mealStatuses = getNutrientStatuses(mealTotals, mealTargets);

            if (mealEntries.length === 0) {
              return (
                <section
                  key={mealType}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                    {t.nutrition.mealLabels[mealType]}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setAddingMeal(mealType)}
                    className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    + {t.nutrition.addFoodButton}
                  </button>
                </section>
              );
            }

            return (
              <section
                key={mealType}
                className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between">
                  <h2 className="flex items-baseline gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    {t.nutrition.mealLabels[mealType]}
                    <span className="text-xs font-normal text-zinc-400">
                      {Math.round(mealTotals.calories)} {t.nutrition.unitKcal}
                    </span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => setAddingMeal(mealType)}
                    className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    + {t.nutrition.addFoodButton}
                  </button>
                </div>

                <ul className="flex flex-col gap-1.5">
                  {mealEntries.map((entry) => {
                    const food = findFoodById(entry.foodId);
                    if (!food) return null;
                    return (
                      <li
                        key={`${entry.mealType}:${entry.foodId}`}
                        className="flex items-center justify-between gap-2 rounded-xl bg-zinc-50 px-3 py-2 dark:bg-zinc-950"
                      >
                        <span className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                          <span className="text-lg">{food.emoji}</span>
                          {food.name}
                          <span className="text-xs text-zinc-400">× {entry.servings}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-400">
                            {Math.round(food.nutrients.calories * entry.servings)} {t.nutrition.unitKcal}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemove(entry.foodId, entry.mealType)}
                            aria-label={t.nutrition.removeItem}
                            className="text-zinc-400 hover:text-red-600 dark:text-zinc-600 dark:hover:text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <MealNutrientHighlight statuses={mealStatuses} locale={locale} />
              </section>
            );
          })}

          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {t.nutrition.detailReportTitle}
          </h2>
          <NutritionSummaryCard
            totals={dailyTotals}
            calorieTarget={calorieTarget}
            statuses={dailyStatuses}
            locale={locale}
          />
        </div>
      </main>
      <footer className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="mx-auto max-w-md text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {t.common.disclaimer}
        </p>
      </footer>

      {addingMeal && (
        <FoodPickerModal
          locale={locale}
          onClose={() => setAddingMeal(null)}
          onAdd={(foodId, servings) => handleAdd(addingMeal, foodId, servings)}
        />
      )}
    </div>
  );
}
