import type { LocalizedText } from "./common";

export interface SubstituteOption {
  /** ISO 3166-1 alpha-2 country code, e.g. "KR", "US", "JP", "VN" */
  country: string;
  ingredient: LocalizedText;
  note?: LocalizedText;
}

export interface SubstituteGroup {
  id: string;
  originalIngredient: LocalizedText;
  options: SubstituteOption[];
}
