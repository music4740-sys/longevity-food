import CopyAccountButton from "@/components/CopyAccountButton";
import LanguageToggle from "@/components/LanguageToggle";
import { getDictionary, LOCALES, type Locale } from "@/lib/i18n";

const DONATION_ACCOUNT_NUMBER = "9003-3099-8853-8";
const APP_VERSION = "1.0.0";

const HERO_DOT_PATTERN = {
  backgroundImage: [
    "radial-gradient(3px 3px at 85% 20%, rgba(255,255,255,0.28) 0, transparent 60%)",
    "radial-gradient(2.5px 2.5px at 65% 55%, rgba(255,255,255,0.2) 0, transparent 60%)",
    "radial-gradient(2px 2px at 92% 70%, rgba(255,255,255,0.22) 0, transparent 60%)",
    "radial-gradient(2.5px 2.5px at 15% 75%, rgba(255,255,255,0.16) 0, transparent 60%)",
  ].join(", "),
};

export default async function SettingsPage({ params }: PageProps<"/[locale]/settings">) {
  // Locale is validated once in app/[locale]/layout.tsx; safe to trust here.
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-6">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {t.common.settingsTitle}
        </h1>

        <section className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-950 p-4 dark:from-emerald-900 dark:to-black">
          <div aria-hidden className="absolute inset-0 -z-10" style={HERO_DOT_PATTERN} />
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl ring-1 ring-inset ring-white/15">
              🌿
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-emerald-50">{t.common.appName}</p>
              <p className="mt-0.5 truncate text-xs font-medium text-emerald-200">
                {t.home.trustHeadline1}
              </p>
            </div>
            <span className="ml-auto shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-100 ring-1 ring-inset ring-white/15">
              v{APP_VERSION}
            </span>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="px-1 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {t.settings.sectionGeneral}
          </h2>
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <LanguageToggle />
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="px-1 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {t.common.donationTitle}
          </h2>
          <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-base text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                ☕
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  {t.settings.donationCardTitle}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-zinc-400 dark:text-zinc-500">
                  {t.settings.donationCardDesc}
                </p>
              </div>
            </div>
            <dl className="flex flex-col gap-1 border-t border-zinc-100 pt-3 text-sm dark:border-zinc-800">
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500 dark:text-zinc-400">{t.common.donationBankLabel}</dt>
                <dd className="text-zinc-900 dark:text-zinc-50">{t.common.donationBankName}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  {t.common.donationAccountLabel}
                </dt>
                <dd className="text-zinc-900 tabular-nums dark:text-zinc-50">
                  {DONATION_ACCOUNT_NUMBER}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500 dark:text-zinc-400">{t.common.donationHolderLabel}</dt>
                <dd className="text-zinc-900 dark:text-zinc-50">김무정</dd>
              </div>
            </dl>
            <CopyAccountButton
              accountNumber={DONATION_ACCOUNT_NUMBER}
              copyLabel={t.settings.copyAccountNumber}
              copiedLabel={t.settings.copiedFeedback}
            />
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="px-1 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {t.settings.sectionAbout}
          </h2>
          <div className="flex flex-col divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="w-5 shrink-0 text-center text-sm" aria-hidden>
                📦
              </span>
              <span className="flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {t.settings.aboutVersionLabel}
              </span>
              <span className="text-sm tabular-nums text-zinc-400 dark:text-zinc-500">
                {APP_VERSION}
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="w-5 shrink-0 text-center text-sm" aria-hidden>
                🌍
              </span>
              <span className="flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {t.settings.aboutLanguagesLabel}
              </span>
              <span className="text-sm tabular-nums text-zinc-400 dark:text-zinc-500">
                {LOCALES.length}
                {t.settings.languageCountUnit}
              </span>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="mx-auto max-w-md text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {t.common.disclaimer}
        </p>
      </footer>
    </div>
  );
}
