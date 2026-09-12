"use client";

import { useEffect, useMemo, useState } from "react";
import { addCustomFood, getCustomFoods } from "@/lib/customFoods";
import { foods } from "@/lib/data";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getFavorites, toggleFavorite } from "@/lib/nutritionFavorites";
import { getRecents } from "@/lib/nutritionRecents";
import { FOOD_GROUPS, GROUP_OF_CATEGORY, NUTRIENT_KEYS } from "@/types";
import type { Food, FoodCategory, FoodGroup } from "@/types";

interface FoodPickerModalProps {
  locale: Locale;
  onClose: () => void;
  onAdd: (foodId: string, servings: number) => void;
}

type Tab = "recent" | "favorites" | "category" | "custom";

function matchesQuery(food: Food, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (food.name.toLowerCase().includes(q)) return true;
  if (food.aliases?.some((alias) => alias.toLowerCase().includes(q))) return true;
  return false;
}

// FoodCategory -> Food[], preserving first-seen order.
function groupByCategory(items: Food[]): Map<FoodCategory, Food[]> {
  const map = new Map<FoodCategory, Food[]>();
  for (const food of items) {
    const list = map.get(food.category) ?? [];
    list.push(food);
    map.set(food.category, list);
  }
  return map;
}

const EMPTY_CUSTOM_FORM = { name: "", servingLabel: "", calories: "", carbs: "", protein: "", fat: "" };

export default function FoodPickerModal({ locale, onClose, onAdd }: FoodPickerModalProps) {
  const t = getDictionary(locale);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Food | null>(null);
  const [servings, setServings] = useState(1);
  const [expandedGroups, setExpandedGroups] = useState<Set<FoodGroup>>(new Set());
  const [tab, setTab] = useState<Tab>("recent");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [customFoods, setCustomFoods] = useState<Food[]>([]);
  const [customForm, setCustomForm] = useState(EMPTY_CUSTOM_FORM);

  useEffect(() => {
    setFavorites(getFavorites());
    setRecentIds(getRecents());
    setCustomFoods(getCustomFoods());
  }, []);

  const allFoods = useMemo(() => [...foods, ...customFoods], [customFoods]);
  const foodById = useMemo(() => new Map(allFoods.map((food) => [food.id, food])), [allFoods]);

  const isSearching = query.trim().length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return new Map<FoodCategory, Food[]>();
    return groupByCategory(allFoods.filter((food) => matchesQuery(food, query)));
  }, [query, isSearching, allFoods]);
  const totalSearchResults = [...searchResults.values()].reduce((sum, list) => sum + list.length, 0);

  const byGroup = useMemo(() => {
    const map = new Map<FoodGroup, Map<FoodCategory, Food[]>>();
    for (const group of FOOD_GROUPS) {
      map.set(group, new Map());
    }
    for (const food of foods) {
      const group = GROUP_OF_CATEGORY[food.category];
      const categoryMap = map.get(group)!;
      const list = categoryMap.get(food.category) ?? [];
      list.push(food);
      categoryMap.set(food.category, list);
    }
    return map;
  }, []);

  const recentFoods = recentIds.map((id) => foodById.get(id)).filter((food): food is Food => Boolean(food));
  const favoriteFoods = allFoods.filter((food) => favorites.has(food.id));

  function toggleGroup(group: FoodGroup) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  }

  function handleToggleFavorite(e: React.MouseEvent, foodId: string) {
    e.stopPropagation();
    setFavorites(toggleFavorite(foodId));
  }

  function handlePick(food: Food) {
    setSelected(food);
    setServings(1);
  }

  function handleConfirm() {
    if (!selected) return;
    onAdd(selected.id, servings);
    onClose();
  }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    const calories = Number(customForm.calories) || 0;
    const carbs = Number(customForm.carbs) || 0;
    const protein = Number(customForm.protein) || 0;
    const fat = Number(customForm.fat) || 0;
    if (!customForm.name.trim() || calories <= 0) return;
    const food = addCustomFood({
      name: customForm.name.trim(),
      servingLabel: customForm.servingLabel.trim(),
      calories,
      carbs,
      protein,
      fat,
    });
    setCustomFoods((prev) => [...prev, food]);
    setCustomForm(EMPTY_CUSTOM_FORM);
    handlePick(food);
  }

  function renderFoodRow(food: Food) {
    const isFavorite = favorites.has(food.id);
    return (
      <li key={food.id} className="flex items-center gap-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900">
        <button
          type="button"
          onClick={(e) => handleToggleFavorite(e, food.id)}
          aria-label={isFavorite ? t.nutrition.favoriteRemove : t.nutrition.favoriteAdd}
          className={`shrink-0 px-1.5 ${isFavorite ? "text-amber-500" : "text-zinc-300 dark:text-zinc-700"}`}
        >
          ★
        </button>
        <button
          type="button"
          onClick={() => handlePick(food)}
          className="flex flex-1 items-center gap-2 py-2 pr-2 text-left text-sm text-zinc-800 dark:text-zinc-200"
        >
          <span className="text-lg">{food.emoji}</span>
          <span className="flex-1">{food.name}</span>
          <span className="text-xs text-zinc-400">
            {food.nutrients.calories} {t.nutrition.unitKcal} / {food.servingLabel}
          </span>
        </button>
      </li>
    );
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "recent", label: t.nutrition.tabRecent },
    { key: "favorites", label: t.nutrition.tabFavorites },
    { key: "category", label: t.nutrition.tabCategories },
    { key: "custom", label: t.nutrition.tabCustom },
  ];

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

            {!isSearching && (
              <div className="flex gap-1 overflow-x-auto px-4 pt-3">
                {TABS.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      tab === key
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {isSearching ? (
                totalSearchResults === 0 ? (
                  <p className="py-8 text-center text-sm text-zinc-400">{t.nutrition.searchEmpty}</p>
                ) : (
                  [...searchResults.entries()].map(([category, items]) => (
                    <div key={category} className="mb-4">
                      <h3 className="mb-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        {t.nutrition.categoryLabels[category]}
                      </h3>
                      <ul className="flex flex-col gap-1">{items.map(renderFoodRow)}</ul>
                    </div>
                  ))
                )
              ) : tab === "recent" ? (
                recentFoods.length === 0 ? (
                  <p className="py-8 text-center text-sm text-zinc-400">{t.nutrition.noRecentText}</p>
                ) : (
                  <ul className="flex flex-col gap-1">{recentFoods.map(renderFoodRow)}</ul>
                )
              ) : tab === "favorites" ? (
                favoriteFoods.length === 0 ? (
                  <p className="py-8 text-center text-sm text-zinc-400">{t.nutrition.noFavoritesText}</p>
                ) : (
                  <ul className="flex flex-col gap-1">{favoriteFoods.map(renderFoodRow)}</ul>
                )
              ) : tab === "custom" ? (
                <form onSubmit={handleCustomSubmit} className="flex flex-col gap-3">
                  <input
                    type="text"
                    required
                    value={customForm.name}
                    onChange={(e) => setCustomForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder={t.nutrition.customFoodNameLabel}
                    className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                  <input
                    type="text"
                    value={customForm.servingLabel}
                    onChange={(e) => setCustomForm((f) => ({ ...f, servingLabel: e.target.value }))}
                    placeholder={t.nutrition.customFoodServingLabel}
                    className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="0"
                      required
                      value={customForm.calories}
                      onChange={(e) => setCustomForm((f) => ({ ...f, calories: e.target.value }))}
                      placeholder={`${t.nutrition.caloriesLabel} (${t.nutrition.unitKcal})`}
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                    <input
                      type="number"
                      min="0"
                      value={customForm.carbs}
                      onChange={(e) => setCustomForm((f) => ({ ...f, carbs: e.target.value }))}
                      placeholder={`${t.nutrition.nutrientLabels.carbs} (${t.nutrition.unitGram})`}
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                    <input
                      type="number"
                      min="0"
                      value={customForm.protein}
                      onChange={(e) => setCustomForm((f) => ({ ...f, protein: e.target.value }))}
                      placeholder={`${t.nutrition.nutrientLabels.protein} (${t.nutrition.unitGram})`}
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                    <input
                      type="number"
                      min="0"
                      value={customForm.fat}
                      onChange={(e) => setCustomForm((f) => ({ ...f, fat: e.target.value }))}
                      placeholder={`${t.nutrition.nutrientLabels.fat} (${t.nutrition.unitGram})`}
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    {t.nutrition.customFoodSubmitButton}
                  </button>
                </form>
              ) : (
                FOOD_GROUPS.map((group) => {
                  const categories = byGroup.get(group)!;
                  const itemCount = [...categories.values()].reduce((sum, list) => sum + list.length, 0);
                  const isExpanded = expandedGroups.has(group);
                  return (
                    <div key={group} className="mb-2 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => toggleGroup(group)}
                        className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-900"
                      >
                        <span>{t.nutrition.groupLabels[group]}</span>
                        <span className="flex items-center gap-2 text-xs font-normal text-zinc-400">
                          {itemCount}
                          <span className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>▾</span>
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="border-t border-zinc-200 px-3 py-2 dark:border-zinc-800">
                          {[...categories.entries()].map(([category, items]) => (
                            <div key={category} className="mb-3 last:mb-0">
                              <h4 className="mb-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                {t.nutrition.categoryLabels[category]}
                              </h4>
                              <ul className="flex flex-col gap-1">{items.map(renderFoodRow)}</ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
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
