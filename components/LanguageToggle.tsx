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

export default function LanguageToggle() {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const currentLocale = segments[1];
  const restOfPath = segments.slice(2).join("/");

  return (
    <nav className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={restOfPath ? `/${locale}/${restOfPath}` : `/${locale}`}
          aria-current={locale === currentLocale ? "page" : undefined}
          className={
            locale === currentLocale
              ? "font-semibold text-emerald-700 dark:text-emerald-400"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          }
        >
          {LOCALE_LABELS[locale]}
        </Link>
      ))}
    </nav>
  );
}
