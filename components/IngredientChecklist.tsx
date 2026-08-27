"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import IngredientRow from "@/components/IngredientRow";
import { addToCart } from "@/lib/cart";
import { getSelectedRegion, type CuisineRegion } from "@/lib/cuisineRegion";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { Ingredient } from "@/types";

interface IngredientChecklistProps {
  recipeId: string;
  ingredients: Ingredient[];
  locale: Locale;
}

export default function IngredientChecklist({
  recipeId,
  ingredients,
  locale,
}: IngredientChecklistProps) {
  const router = useRouter();
  const t = getDictionary(locale);
  const [checked, setChecked] = useState<Set<string>>(
    () => new Set(ingredients.map((ingredient) => ingredient.name.en)),
  );
  const [selectedRegion, setSelectedRegionState] = useState<CuisineRegion | null>(null);

  useEffect(() => {
    setSelectedRegionState(getSelectedRegion());
  }, []);

  function toggle(name: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  function handleAddToCart() {
    addToCart(recipeId, [...checked]);
    router.push(`/${locale}/cart`);
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        {t.recipe.ingredientsTitle}
      </h2>
      <ul className="flex flex-col gap-2">
        {ingredients.map((ingredient) => (
          <IngredientRow
            key={ingredient.name.en}
            ingredient={ingredient}
            locale={locale}
            checked={checked.has(ingredient.name.en)}
            onToggle={() => toggle(ingredient.name.en)}
            selectedRegion={selectedRegion}
          />
        ))}
      </ul>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={checked.size === 0}
        className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t.recipe.addToCart}
      </button>
    </section>
  );
}
