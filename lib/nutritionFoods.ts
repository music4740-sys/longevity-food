import { getCustomFoods } from "@/lib/customFoods";
import { getFoodById } from "@/lib/data";
import { getIngredientById } from "@/lib/ingredients";
import type { Food } from "@/types";

/** Looks up built-in dishes, then loaded raw ingredients, then this device's custom foods. */
export function findFoodById(id: string): Food | undefined {
  return getFoodById(id) ?? getIngredientById(id) ?? getCustomFoods().find((food) => food.id === id);
}
