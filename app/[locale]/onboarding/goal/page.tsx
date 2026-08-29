import OnboardingGoalPicker from "@/components/OnboardingGoalPicker";
import type { Locale } from "@/lib/i18n";

export default async function OnboardingGoalPage({
  params,
}: PageProps<"/[locale]/onboarding/goal">) {
  // Locale is validated once in app/[locale]/layout.tsx; safe to trust here.
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  return <OnboardingGoalPicker locale={locale} />;
}
