import OnboardingProfileForm from "@/components/OnboardingProfileForm";
import type { Locale } from "@/lib/i18n";

export default async function OnboardingProfilePage({
  params,
}: PageProps<"/[locale]/onboarding/profile">) {
  // Locale is validated once in app/[locale]/layout.tsx; safe to trust here.
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  return <OnboardingProfileForm locale={locale} />;
}
