import type { LocalizedText } from "./common";

export interface SubstituteOption {
  /**
   * ISO 3166-1 alpha-2 country code representing one of the 5 cuisine
   * regions: KR (동아시아), IT (지중해·유럽), IN (남아시아·동남아시아),
   * TR (중동·북아프리카), MX (라틴아메리카). Every group has exactly these 5.
   */
  country: string;
  ingredient: LocalizedText;
  note?: LocalizedText;
}

export interface SubstituteGroup {
  id: string;
  originalIngredient: LocalizedText;
  options: SubstituteOption[];
}
