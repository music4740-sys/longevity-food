import type { LocalizedText } from "./common";
import type { CuisineRegion } from "./region";

export interface DayMeal {
  /** 1-7 */
  day: number;
  /** Recipe.id — shown when no cuisine region is selected, or the selected region has no variant */
  breakfast: string;
  /** Recipe.id */
  lunch: string;
  /** Recipe.id */
  dinner: string;
  /** Region-specific Recipe.id overrides, e.g. an authentically East Asian breakfast for KR */
  breakfastByRegion?: Partial<Record<CuisineRegion, string>>;
  lunchByRegion?: Partial<Record<CuisineRegion, string>>;
  dinnerByRegion?: Partial<Record<CuisineRegion, string>>;
}

export interface Plan {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  tags: string[];
  /** MVP only supports 7-day plans */
  durationDays: number;
  days: DayMeal[];
}
