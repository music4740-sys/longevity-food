"use client";

import { useEffect, useMemo, useState } from "react";
import FoodPickerModal from "@/components/FoodPickerModal";
import HealthChecklist from "@/components/HealthChecklist";
import DailyStaplesStrip from "@/components/DailyStaplesStrip";
import NutritionGlance from "@/components/NutritionGlance";
import PlanCoachCard from "@/components/PlanCoachCard";
import NutritionCalendar from "@/components/NutritionCalendar";
import NutritionSummaryBar from "@/components/NutritionSummaryBar";
import NutritionSummaryCard from "@/components/NutritionSummaryCard";
import { calculateTdee } from "@/lib/bmi";
import { getDictionary, type Locale } from "@/lib/i18n";
import { computeDailyTotals, getNutrientStatuses } from "@/lib/nutrition";
import { addEntry, formatDateKey, getLogStreak, loadLog, moveEntry, removeEntry } from "@/lib/nutritionLog";
import { DEFAULT_DAILY_TARGETS } from "@/lib/nutritionTargets";
import { findFoodById } from "@/lib/nutritionFoods";
import { getStapleByFoodId, type StapleGroup } from "@/lib/dailyStaples";
import { loadIngredients } from "@/lib/ingredients";
import { pushRecent } from "@/lib/nutritionRecents";
import { CONCERN_TAGS, getProfile, type ConcernTag } from "@/lib/onboardingProfile";
import { plans } from "@/lib/data";
import { buildCoaching } from "@/lib/planCoaching";
import { MEAL_TYPES } from "@/types";
import type { MealType, NutritionLogEntry } from "@/types";

interface NutritionViewProps {
  locale: Locale;
}

export default function NutritionView({ locale }: NutritionViewProps) {
  const t = getDictionary(locale);
  const [date, setDate] = useState(() => new Date());
  const [entries, setEntries] = useState<NutritionLogEntry[]>([]);
  const [adding, setAdding] = useState(false);
  const [pickerGroup, setPickerGroup] = useState<StapleGroup | undefined>(undefined);
  const [streak, setStreak] = useState(0);
  const [ingredientsReady, setIngredientsReady] = useState(false);
  const [concern, setConcern] = useState<ConcernTag>("balanced");
  const [showCalendar, setShowCalendar] = useState(false);
  const [calorieTarget, setCalorieTarget] = useState(DEFAULT_DAILY_TARGETS.calories);

  const dateKey = formatDateKey(date);

  useEffect(() => {
    setEntries(loadLog(dateKey));
    setStreak(getLogStreak());
  }, [dateKey]);

  useEffect(() => {
    void loadIngredients().then(() => setIngredientsReady(true));
  }, []);

  useEffect(() => {
    const { age, gender, heightCm, weightKg, activityLevel, concernTag, selectedPlanId } = getProfile();
    const fromPlan = plans
      .find((plan) => plan.id === selectedPlanId)
      ?.tags.find((tag): tag is ConcernTag => (CONCERN_TAGS as readonly string[]).includes(tag));
    const resolved = (CONCERN_TAGS as readonly string[]).includes(concernTag ?? "")
      ? (concernTag as ConcernTag)
      : fromPlan;
    if (resolved) setConcern(resolved);
    if (age && gender && gender !== "unspecified" && heightCm && weightKg && activityLevel) {
      setCalorieTarget(calculateTdee({ age, gender, heightCm, weightKg, activityLevel }));
    }
  }, []);

  const dailyTargets = useMemo(
    () => ({ ...DEFAULT_DAILY_TARGETS, calories: calorieTarget }),
    [calorieTarget],
  );
  const dailyTotals = useMemo(
    () => computeDailyTotals(entries, findFoodById),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run once ingredient data arrives
    [entries, ingredientsReady],
  );
  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => MEAL_TYPES.indexOf(a.mealType) - MEAL_TYPES.indexOf(b.mealType)),
    [entries],
  );
  const dailyStatuses = useMemo(
    () => getNutrientStatuses(dailyTotals, dailyTargets),
    [dailyTotals, dailyTargets],
  );

  const coveredGroups = useMemo(() => {
    const groups = new Set<StapleGroup>();
    for (const entry of entries) {
      const staple = getStapleByFoodId(entry.foodId);
      if (staple) groups.add(staple.group);
    }
    return groups;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- staples resolve once ingredient data is loaded
  }, [entries, ingredientsReady]);
  const loggedFoodIds = useMemo(() => new Set(entries.map((entry) => entry.foodId)), [entries]);

  const coaching = useMemo(
    () => buildCoaching(concern, dailyStatuses, entries, findFoodById),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- picks use ingredient data once loaded
    [concern, dailyStatuses, entries, ingredientsReady],
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
    setStreak(getLogStreak());
    pushRecent(foodId);
  }

  function handleCycleMeal(foodId: string, mealType: MealType) {
    const next = MEAL_TYPES[(MEAL_TYPES.indexOf(mealType) + 1) % MEAL_TYPES.length];
    setEntries(moveEntry(dateKey, foodId, mealType, next));
  }

  function handleRemove(foodId: string, mealType: MealType) {
    setEntries(removeEntry(dateKey, foodId, mealType));
    setStreak(getLogStreak());
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

          <PlanCoachCard concern={concern} coaching={coaching} streak={streak} locale={locale} />

          <DailyStaplesStrip
            covered={coveredGroups}
            locale={locale}
            onPick={(group) => {
              setPickerGroup(group);
              setAdding(true);
            }}
          />

          <button
            type="button"
            onClick={() => {
              setPickerGroup(undefined);
              setAdding(true);
            }}
            className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            + {t.nutrition.addFoodButton}
          </button>

          <section className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{t.nutrition.loggedFoodsTitle}</h2>
            {sortedEntries.length === 0 ? (
              <p className="text-xs text-zinc-400">{t.nutrition.emptyLogText}</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {sortedEntries.map((entry) => {
                  const food = findFoodById(entry.foodId);
                  if (!food) return null;
                  return (
                    <li
                      key={`${entry.mealType}:${entry.foodId}`}
                      className="flex items-center justify-between gap-2 rounded-xl bg-zinc-50 px-3 py-2 dark:bg-zinc-950"
                    >
                      <span className="flex min-w-0 items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                        <span className="text-lg">{food.emoji}</span>
                        <span className="truncate">{food.name}</span>
                        <span className="text-xs text-zinc-400">× {entry.servings}</span>
                        <button
                          type="button"
                          onClick={() => handleCycleMeal(entry.foodId, entry.mealType)}
                          className="shrink-0 rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 hover:bg-emerald-100 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          {t.nutrition.mealLabels[entry.mealType]} ↻
                        </button>
                      </span>
                      <div className="flex shrink-0 items-center gap-2">
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
            )}
          </section>

          <NutritionGlance statuses={dailyStatuses} hasEntries={entries.length > 0} locale={locale} />

          <HealthChecklist dateKey={dateKey} locale={locale} />

          <details className="group">
            <summary className="cursor-pointer text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              {t.nutrition.detailReportTitle}
            </summary>
            <div className="pt-2">
              <NutritionSummaryCard
                totals={dailyTotals}
                calorieTarget={calorieTarget}
                statuses={dailyStatuses}
                locale={locale}
              />
            </div>
          </details>
        </div>
      </main>
      <footer className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="mx-auto max-w-md text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {t.common.disclaimer}
        </p>
      </footer>

      {adding && (
        <FoodPickerModal
          locale={locale}
          onClose={() => setAdding(false)}
          initialStapleGroup={pickerGroup}
          loggedFoodIds={loggedFoodIds}
          totals={dailyTotals}
          targets={dailyTargets}
          onAdd={(foodId, servings, mealType) => handleAdd(mealType, foodId, servings)}
        />
      )}
    </div>
  );
}
