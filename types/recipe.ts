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
  benefits?: LocalizedText;
  /** Short scannable keyword chips summarizing benefits (e.g. "Fiber", "Omega-3") — display only, not used in scoring */
  pointTags?: LocalizedText[];
}

export interface RecipeStep {
  order: number;
  instruction: LocalizedText;
  /** Optional supplementary explanation shown below the main instruction */
  detail?: LocalizedText;
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
