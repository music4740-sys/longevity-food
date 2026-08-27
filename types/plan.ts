import type { LocalizedText } from "./common";

export interface DayMeal {
  /** 1-7 */
  day: number;
  /** Recipe.id */
  breakfast: string;
  /** Recipe.id */
  lunch: string;
  /** Recipe.id */
  dinner: string;
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
