"use client";

import { useMemo, useState } from "react";
import { foods } from "@/lib/data";
import { getDictionary, type Locale } from "@/lib/i18n";
import { NUTRIENT_KEYS } from "@/types";
import type { Food } from "@/types";

interface FoodPickerModalProps {
  locale: Locale;
  onClose: () => void;
  onAdd: (foodId: string, servings: number) => void;
}

function matchesQuery(food: Food, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (food.name.toLowerCase().includes(q)) return true;
  if (food.aliases?.some((alias) => alias.toLowerCase().includes(q))) return true;
  return false;
}

export default function FoodPickerModal({ locale, onClose, onAdd }: FoodPickerModalProps) {
  const t = getDictionary(locale);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Food | null>(null);
  const [servings, setServings] = useState(1);

  const grouped = useMemo(() => {
    const filtered = foods.filter((food) => matchesQuery(food, query));
    const map = new Map<string, Food[]>();
    for (const food of filtered) {
      const list = map.get(food.category) ?? [];
      list.push(food);
      map.set(food.category, list);
    }
    return map;
  }, [query]);

  const totalResults = [...grouped.values()].reduce((sum, list) => sum + list.length, 0);

  function handlePick(food: Food) {
    setSelected(food);
    setServings(1);
  }

  function handleConfirm() {
    if (!selected) return;
    onAdd(selected.id, servings);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-t-2xl bg-white dark:bg-zinc-950 sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
            {selected ? selected.name : t.nutrition.addFoodButton}
          </h2>
          <button
            type="button"
            onClick={selected ? () => setSelected(null) : onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            aria-label={t.common.cartRemoveItem}
          >
            ✕
          </button>
        </div>

        {!selected ? (
          <>
            <div className="px-4 pt-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.nutrition.searchPlaceholder}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {totalResults === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-400">{t.nutrition.searchEmpty}</p>
              ) : (
                [...grouped.entries()].map(([category, items]) => (
                  <div key={category} className="mb-4">
                    <h3 className="mb-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {t.nutrition.categoryLabels[category as keyof typeof t.nutrition.categoryLabels]}
                    </h3>
                    <ul className="flex flex-col gap-1">
                      {items.map((food) => (
                        <li key={food.id}>
                          <button
                            type="button"
                            onClick={() => handlePick(food)}
                            className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                          >
                            <span className="text-lg">{food.emoji}</span>
                            <span className="flex-1">{food.name}</span>
                            <span className="text-xs text-zinc-400">
                              {food.nutrients.calories} {t.nutrition.unitKcal} / {food.servingLabel}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-5xl">{selected.emoji}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {t.nutrition.servingStepperTitle}: {selected.servingLabel}
              </span>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setServings((s) => Math.max(0.5, s - 0.5))}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-lg font-bold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                aria-label="decrease"
              >
                ◀
              </button>
              <span className="w-16 text-center text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {servings}
              </span>
              <button
                type="button"
                onClick={() => setServings((s) => s + 0.5)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-lg font-bold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                aria-label="increase"
              >
                ▶
              </button>
            </div>

            <div className="flex flex-col gap-1 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  {t.nutrition.caloriesLabel}
                </span>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  {Math.round(selected.nutrients.calories * servings)} {t.nutrition.unitKcal}
                </span>
              </div>
              {NUTRIENT_KEYS.filter((key) => key !== "calories").map((key) => (
                <div key={key} className="flex items-baseline justify-between text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {t.nutrition.nutrientLabels[key]}
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {Math.round(selected.nutrients[key] * servings * 10) / 10}{" "}
                    {key === "sodium" || key === "calcium" || key === "iron"
                      ? t.nutrition.unitMg
                      : t.nutrition.unitGram}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              {t.nutrition.addToLogButton}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
