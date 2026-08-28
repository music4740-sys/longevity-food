import LanguageToggle from "@/components/LanguageToggle";
import { getDictionary, type Locale } from "@/lib/i18n";

export default async function SettingsPage({ params }: PageProps<"/[locale]/settings">) {
  // Locale is validated once in app/[locale]/layout.tsx; safe to trust here.
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-6">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {t.common.settingsTitle}
        </h1>
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {t.common.settingsLanguageLabel}
          </span>
          <LanguageToggle />
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {t.common.donationTitle}
          </span>
          <dl className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-zinc-500 dark:text-zinc-400">{t.common.donationBankLabel}</dt>
              <dd className="text-zinc-900 dark:text-zinc-50">{t.common.donationBankName}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-zinc-500 dark:text-zinc-400">{t.common.donationAccountLabel}</dt>
              <dd className="text-zinc-900 dark:text-zinc-50">9003-3099-8853-8</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-zinc-500 dark:text-zinc-400">{t.common.donationHolderLabel}</dt>
              <dd className="text-zinc-900 dark:text-zinc-50">김무정</dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}
