"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clearCart, loadCart, removeFromCart, setPurchased, type CartItem } from "@/lib/cart";
import { getRecipeById } from "@/lib/data";
import { getDictionary, localizedText, type Locale } from "@/lib/i18n";

interface CartViewProps {
  locale: Locale;
}

export default function CartView({ locale }: CartViewProps) {
  const t = getDictionary(locale);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  function toggle(recipeId: string, ingredientName: string, purchased: boolean) {
    setItems(setPurchased(recipeId, ingredientName, purchased));
  }

  function remove(recipeId: string, ingredientName: string) {
    setItems(removeFromCart(recipeId, ingredientName));
  }

  function handleClearAll() {
    if (window.confirm(t.common.cartClearAllConfirm)) {
      setItems(clearCart());
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-2 px-4 py-6 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.common.cartEmpty}</p>
        </main>
      </div>
    );
  }

  const groups = new Map<string, CartItem[]>();
  for (const item of items) {
    const list = groups.get(item.recipeId) ?? [];
    list.push(item);
    groups.set(item.recipeId, list);
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{t.common.cartTitle}</h1>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            {t.common.cartClearAll}
          </button>
        </div>
        {[...groups.entries()].map(([recipeId, groupItems]) => {
          const recipe = getRecipeById(recipeId);
          return (
            <section
              key={recipeId}
              className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              {recipe ? (
                <Link
                  href={`/${locale}/recipes/${recipe.slug}`}
                  className="text-sm font-semibold text-emerald-700 dark:text-emerald-400"
                >
                  {localizedText(recipe.title, locale)}
                </Link>
              ) : (
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  {recipeId}
                </span>
              )}
              <ul className="flex flex-col gap-1.5">
                {groupItems.map((item) => {
                  const ingredient = recipe?.ingredients.find(
                    (candidate) => candidate.name.en === item.ingredientName,
                  );
                  return (
                    <li key={item.ingredientName} className="flex items-center justify-between gap-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item.purchased}
                          onChange={(event) =>
                            toggle(item.recipeId, item.ingredientName, event.target.checked)
                          }
                          className="h-4 w-4 accent-emerald-600"
                        />
                        <span
                          className={
                            item.purchased
                              ? "text-zinc-400 line-through dark:text-zinc-600"
                              : "text-zinc-800 dark:text-zinc-200"
                          }
                        >
                          {ingredient ? localizedText(ingredient.name, locale) : item.ingredientName}
                        </span>
                      </label>
                      <div className="flex shrink-0 items-center gap-2">
                        {ingredient && (
                          <span className="text-xs text-zinc-400 dark:text-zinc-500">
                            {ingredient.amount}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => remove(item.recipeId, item.ingredientName)}
                          aria-label={t.common.cartRemoveItem}
                          className="text-zinc-400 hover:text-red-600 dark:text-zinc-600 dark:hover:text-red-400"
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </main>
    </div>
  );
}
