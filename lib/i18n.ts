import ko from "@/locales/ko.json";
import en from "@/locales/en.json";
import type { IngredientTag, LocalizedText } from "@/types";

export type Locale = "ko" | "en";

const dictionaries = { ko, en } as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function localizedText(text: LocalizedText, locale: Locale): string {
  return text[locale];
}

export function ingredientTagLabel(tag: IngredientTag, locale: Locale): string {
  return getDictionary(locale).ingredientTags[tag];
}
