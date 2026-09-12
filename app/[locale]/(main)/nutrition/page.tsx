import { notFound } from "next/navigation";
import NutritionView from "@/components/NutritionView";
import type { Locale } from "@/lib/i18n";

export default async function NutritionPage({ params }: PageProps<"/[locale]/nutrition">) {
  // Locale is validated once in app/[locale]/layout.tsx; safe to trust here.
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  // Food data is Korean-food-only for now — hide the feature elsewhere.
  if (locale !== "ko") {
    notFound();
  }

  return <NutritionView locale={locale} />;
}
