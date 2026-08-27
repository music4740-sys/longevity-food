import type { LocalizedText } from "./common";
import type { IngredientTag } from "./score";

export interface Ingredient {
  name: LocalizedText;
  amount: string;
  /** Food-group / quality tags consumed by /lib/score.ts to derive the longevity score */
  tags: IngredientTag[];
  /** Links to a SubstituteGroup.id in /data/substitutes.json, if a country-specific swap exists */
  substituteGroupId?: string;
  /** Short, hedged explanation of why this ingredient is included (not a treatment claim) */
  healthNote?: LocalizedText;
}

export interface RecipeStep {
  order: number;
  instruction: LocalizedText;
}

export interface Recipe {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  tags: string[];
  ingredients: Ingredient[];
  steps: RecipeStep[];
}
