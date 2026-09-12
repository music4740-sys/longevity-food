import { getCustomFoods } from "@/lib/customFoods";
import { getFoodById } from "@/lib/data";
import type { Food } from "@/types";

/** Looks up built-in foods first, then this device's custom foods. */
export function findFoodById(id: string): Food | undefined {
  return getFoodById(id) ?? getCustomFoods().find((food) => food.id === id);
}
