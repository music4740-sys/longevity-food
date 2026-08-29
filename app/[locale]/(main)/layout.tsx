import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { getDictionary, type Locale } from "@/lib/i18n";

export default async function MainLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  const t = getDictionary(locale as Locale);

  return (
    <div className="flex min-h-full flex-1 flex-col pb-16">
      <header className="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
          <Link
            href={`/${locale}`}
            className="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
          >
            {t.common.appName}
          </Link>
        </div>
      </header>
      {children}
      <BottomNav />
    </div>
  );
}
