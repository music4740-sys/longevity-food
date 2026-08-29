import Link from "next/link";
import { LOCALE_FLAG, LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n";

// No dictionary text here on purpose: the visitor hasn't picked a language
// yet, and each button already self-identifies in its own script — the one
// piece of copy that would need translating ("select your language") isn't
// worth guessing a locale for.
export default async function OnboardingLanguagePage({
  params,
}: PageProps<"/[locale]/onboarding">) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 px-4 dark:bg-black">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-3xl">🌍</span>
        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          International Longevity Food
        </h1>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-2">
        {LOCALES.map((l) => (
          <Link
            key={l}
            href={`/${l}/onboarding/profile`}
            className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-sm dark:bg-zinc-800">
              {LOCALE_FLAG[l]}
            </span>
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {LOCALE_LABELS[l]}
            </span>
          </Link>
        ))}
      </div>

      <Link
        href={`/${locale}/onboarding/profile`}
        className="text-xs font-medium text-zinc-400 underline-offset-2 hover:underline dark:text-zinc-500"
      >
        Skip
      </Link>
    </div>
  );
}
