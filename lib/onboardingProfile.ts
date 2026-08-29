import { plans } from "@/lib/data";
import type { Locale } from "@/lib/i18n";
import type { OnboardingProfile, Plan } from "@/types";

const PROFILE_STORAGE_KEY = "longevity-food-onboarding-profile";

export function getProfile(): OnboardingProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OnboardingProfile) : {};
  } catch {
    return {};
  }
}

export function saveProfile(patch: Partial<OnboardingProfile>): void {
  try {
    const current = getProfile();
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — fail silently.
  }
}

// One concern per plan's primary tag, except weight-management which also
// pulls in the "light-eating" plan — see data/plans.json for the source tags.
export const CONCERN_TAGS = [
  "blood-sugar",
  "heart-health",
  "gut-health",
  "plant-based",
  "balanced",
  "cardiovascular",
  "brain-health",
  "anti-inflammatory",
  "skin-hair",
  "muscle-health",
  "weight-management",
  "blue-zone",
] as const;

export type ConcernTag = (typeof CONCERN_TAGS)[number];

export function getPlansForConcern(concern: ConcernTag): Plan[] {
  if (concern === "weight-management") {
    return plans.filter(
      (plan) => plan.tags.includes("weight-management") || plan.tags.includes("light-eating"),
    );
  }
  return plans.filter((plan) => plan.tags.includes(concern));
}

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

// Marks onboarding as seen (skipped or completed) so middleware stops
// redirecting to it, and remembers which locale to send bare "/" visits to
// from then on.
export function markOnboardingComplete(locale: Locale): void {
  document.cookie = `onboarding-complete=1; path=/; max-age=${ONE_YEAR_SECONDS}`;
  document.cookie = `locale=${locale}; path=/; max-age=${ONE_YEAR_SECONDS}`;
}
