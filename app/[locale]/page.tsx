import HomeView from "@/components/HomeView";
import type { Locale } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[locale]">) {
  // Locale is validated once in app/[locale]/layout.tsx; safe to trust here.
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  return <HomeView locale={locale} />;
}
