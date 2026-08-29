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
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="relative isolate w-full max-w-xs overflow-hidden rounded-3xl border border-emerald-200 bg-white px-6 py-7 text-center dark:border-emerald-900 dark:bg-zinc-900">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(120%_100%_at_50%_-10%,#d1fae5,transparent_60%)] dark:bg-[radial-gradient(120%_100%_at_50%_-10%,#022c22,transparent_60%)]"
        />
        <div className="mx-auto mb-3 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-900 text-2xl">
          🌍
        </div>
        <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
          International Longevity Food
        </h1>
        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">Choose your language</p>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-2">
        {LOCALES.map((l) => (
          <Link
            key={l}
            href={`/${l}/onboarding/profile`}
            className={
              l === locale
                ? "flex items-center gap-3 rounded-2xl border border-emerald-400 bg-emerald-50 px-4 py-3 dark:border-emerald-700 dark:bg-emerald-950/40"
                : "flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
            }
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-sm dark:bg-zinc-800">
              {LOCALE_FLAG[l]}
            </span>
            <span className="flex-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {LOCALE_LABELS[l]}
            </span>
            <span aria-hidden className="text-zinc-300 dark:text-zinc-600">
              ›
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
