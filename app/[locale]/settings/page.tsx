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
      </main>
    </div>
  );
}
