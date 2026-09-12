"use client";

import { useEffect, useMemo, useState } from "react";
import FoodPickerModal from "@/components/FoodPickerModal";
import NutritionSummaryCard from "@/components/NutritionSummaryCard";
import { calculateTdee } from "@/lib/bmi";
import { getFoodById } from "@/lib/data";
import { getDictionary, type Locale } from "@/lib/i18n";
import { computeDailyTotals, getNutrientStatuses } from "@/lib/nutrition";
import { addEntry, formatDateKey, loadLog, removeEntry } from "@/lib/nutritionLog";
import { DEFAULT_DAILY_TARGETS } from "@/lib/nutritionTargets";
import { getProfile } from "@/lib/onboardingProfile";
import type { NutritionLogEntry } from "@/types";

interface NutritionViewProps {
  locale: Locale;
}

export default function NutritionView({ locale }: NutritionViewProps) {
  const t = getDictionary(locale);
  const [date, setDate] = useState(() => new Date());
  const [entries, setEntries] = useState<NutritionLogEntry[]>([]);
  const [showPicker, setShowPicker] = useState(false);
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

  const totals = useMemo(() => computeDailyTotals(entries, getFoodById), [entries]);
  const targets = useMemo(
    () => ({ ...DEFAULT_DAILY_TARGETS, calories: calorieTarget }),
    [calorieTarget],
  );
  const statuses = useMemo(() => getNutrientStatuses(totals, targets), [totals, targets]);

  function shiftDate(deltaDays: number) {
    setDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + deltaDays);
      return next;
    });
  }

  function handleAdd(foodId: string, servings: number) {
    setEntries(addEntry(dateKey, foodId, servings));
  }

  function handleRemove(foodId: string) {
    setEntries(removeEntry(dateKey, foodId));
  }

  const isToday = dateKey === formatDateKey(new Date());
  const dateLabel = isToday
    ? t.nutrition.dateToday
    : date.toLocaleDateString(locale, { month: "short", day: "numeric", weekday: "short" });

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{t.nutrition.pageTitle}</h1>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => shiftDate(-1)}
            className="px-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            aria-label={t.nutrition.dateYesterday}
          >
            ◀
          </button>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{dateLabel}</span>
          <button
            type="button"
            onClick={() => shiftDate(1)}
            className="px-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            aria-label={t.nutrition.dateTomorrow}
          >
            ▶
          </button>
        </div>

        <NutritionSummaryCard
          totals={totals}
          calorieTarget={calorieTarget}
          statuses={statuses}
          locale={locale}
        />

        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          + {t.nutrition.addFoodButton}
        </button>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {t.nutrition.loggedFoodsTitle}
          </h2>
          {entries.length === 0 ? (
            <p className="text-sm text-zinc-400">{t.nutrition.emptyLogText}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {entries.map((entry) => {
                const food = getFoodById(entry.foodId);
                if (!food) return null;
                return (
                  <li
                    key={entry.foodId}
                    className="flex items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900"
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
                        onClick={() => handleRemove(entry.foodId)}
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
          )}
        </section>
      </main>
      <footer className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="mx-auto max-w-md text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {t.common.disclaimer}
        </p>
      </footer>

      {showPicker && (
        <FoodPickerModal locale={locale} onClose={() => setShowPicker(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}
