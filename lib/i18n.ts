import ko from "@/locales/ko.json";
import en from "@/locales/en.json";
import ja from "@/locales/ja.json";
import zh from "@/locales/zh.json";
import es from "@/locales/es.json";
import fr from "@/locales/fr.json";
import type { IngredientTag, LocalizedText } from "@/types";

export type Locale = "ko" | "en" | "ja" | "zh" | "es" | "fr";

export const LOCALES: Locale[] = ["ko", "en", "ja", "zh", "es", "fr"];

// Each language's own name in its own script — intentionally not translated
// (a language picker showing "한국어" translated into English defeats the
// point). Shared by LanguageToggle (settings) and the onboarding language step.
export const LOCALE_LABELS: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
  es: "Español",
  fr: "Français",
};

// Display-only decoration, not translated UI text — same reasoning as
// REGION_EMOJI in HomeView.tsx.
export const LOCALE_FLAG: Record<Locale, string> = {
  ko: "🇰🇷",
  en: "🇺🇸",
  ja: "🇯🇵",
  zh: "🇨🇳",
  es: "🇪🇸",
  fr: "🇫🇷",
};

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
