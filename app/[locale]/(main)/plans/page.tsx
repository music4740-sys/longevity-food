import PlanListView from "@/components/PlanListView";
import type { Locale } from "@/lib/i18n";

export default async function PlansTabPage({ params }: PageProps<"/[locale]/plans">) {
  // Locale is validated once in app/[locale]/layout.tsx; safe to trust here.
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  return <PlanListView locale={locale} />;
}
