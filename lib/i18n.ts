import ko from "@/locales/ko.json";
import en from "@/locales/en.json";
import ja from "@/locales/ja.json";
import zh from "@/locales/zh.json";
import es from "@/locales/es.json";
import fr from "@/locales/fr.json";
import type { IngredientTag, LocalizedText } from "@/types";

export type Locale = "ko" | "en" | "ja" | "zh" | "es" | "fr";

export const LOCALES: Locale[] = ["ko", "en", "ja", "zh", "es", "fr"];

const dictionaries = { ko, en, ja, zh, es, fr } as const;

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
