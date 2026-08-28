"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, type Locale } from "@/lib/i18n";

const LOCALE_LABELS: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
  es: "Español",
  fr: "Français",
};

// Display-only decoration, not translated UI text — same reasoning as
// REGION_EMOJI in HomeView.tsx.
const LOCALE_FLAG: Record<Locale, string> = {
  ko: "🇰🇷",
  en: "🇺🇸",
  ja: "🇯🇵",
  zh: "🇨🇳",
  es: "🇪🇸",
  fr: "🇫🇷",
};

export default function LanguageToggle() {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const currentLocale = segments[1];
  const restOfPath = segments.slice(2).join("/");

  return (
    <nav className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
      {LOCALES.map((locale) => {
        const isCurrent = locale === currentLocale;
        return (
          <Link
            key={locale}
            href={restOfPath ? `/${locale}/${restOfPath}` : `/${locale}`}
            aria-current={isCurrent ? "page" : undefined}
            className={
              "flex items-center gap-3 px-4 py-3 " +
              (isCurrent
                ? "bg-emerald-50 dark:bg-emerald-950/40"
                : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60")
            }
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-sm dark:bg-zinc-800">
              {LOCALE_FLAG[locale]}
            </span>
            <span
              className={
                "flex-1 text-sm " +
                (isCurrent
                  ? "font-semibold text-emerald-800 dark:text-emerald-400"
                  : "font-medium text-zinc-600 dark:text-zinc-300")
              }
            >
              {LOCALE_LABELS[locale]}
            </span>
            {isCurrent && (
              <span
                aria-hidden
                className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-emerald-700 text-[10px] text-emerald-50 dark:bg-emerald-600"
              >
                ✓
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
