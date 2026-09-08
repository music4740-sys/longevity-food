import type { LocalizedText } from "./common";

export interface GrainBlendRatio {
  /** Human-readable blend, e.g. "현미 30% + 백미 50% + 찰보리 20%" */
  label: LocalizedText;
}

export interface TasteGuide {
  id: string;
  /** Must match an Ingredient.name exactly (matched by the "ko" value) so recipes need no linking field. */
  targetIngredient: LocalizedText;
  /** Why this ingredient eaten alone is often found unpalatable (texture/taste, not a health claim) */
  reason: LocalizedText;
  beginnerRatio: GrainBlendRatio;
  advancedRatio: GrainBlendRatio;
  tip: LocalizedText;
}
