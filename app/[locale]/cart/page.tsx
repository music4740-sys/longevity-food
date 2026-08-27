import { getDictionary, type Locale } from "@/lib/i18n";

export default async function CartPage({ params }: PageProps<"/[locale]/cart">) {
  // Locale is validated once in app/[locale]/layout.tsx; safe to trust here.
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-2 px-4 py-6 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.common.cartEmpty}</p>
      </main>
    </div>
  );
}
