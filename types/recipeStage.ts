import type { LocalizedText } from "./common";

export interface RecipeStageGuide {
  recipeId: string;
  /** Balance stage: everyday-friendly grain ratio + seasoning adjustment */
  stage2Detail: LocalizedText;
  /** Umami stage: natural kick ingredients + texture tips, no calorie blowup */
  stage3Detail: LocalizedText;
}
