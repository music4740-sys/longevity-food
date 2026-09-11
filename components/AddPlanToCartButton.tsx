"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";
import { getSelectedRegion, type CuisineRegion } from "@/lib/cuisineRegion";
import { getRecipeById } from "@/lib/data";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { DayMeal, Plan } from "@/types";

interface AddPlanToCartButtonProps {
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

export default function AddPlanToCartButton({ plan, locale }: AddPlanToCartButtonProps) {
  const router = useRouter();
  const t = getDictionary(locale);
  const [region, setRegion] = useState<CuisineRegion | null>(null);

  useEffect(() => {
    setRegion(getSelectedRegion());
  }, []);

  function handleAddAll() {
    const recipeIds = plan.days.flatMap((day) => [
      resolveRecipeId(day, "breakfast", region),
      resolveRecipeId(day, "lunch", region),
      resolveRecipeId(day, "dinner", region),
    ]);
    for (const recipeId of new Set(recipeIds)) {
      const recipe = getRecipeById(recipeId);
      if (recipe) {
        addToCart(
          recipeId,
          recipe.ingredients.map((ingredient) => ingredient.name.en),
        );
      }
    }
    router.push(`/${locale}/cart`);
  }

  return (
    <button
      type="button"
      onClick={handleAddAll}
      className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
    >
      {t.plan.addAllToCart}
    </button>
  );
}
