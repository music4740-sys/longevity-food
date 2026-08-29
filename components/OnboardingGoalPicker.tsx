"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PlanCard from "@/components/PlanCard";
import { getDictionary, type Locale } from "@/lib/i18n";
import {
  CONCERN_TAGS,
  getPlansForConcern,
  markOnboardingComplete,
  saveProfile,
  type ConcernTag,
} from "@/lib/onboardingProfile";

interface OnboardingGoalPickerProps {
  locale: Locale;
}

export default function OnboardingGoalPicker({ locale }: OnboardingGoalPickerProps) {
  const router = useRouter();
  const t = getDictionary(locale);
  const [concern, setConcern] = useState<ConcernTag | null>(null);

  const matchingPlans = concern ? getPlansForConcern(concern) : [];

  function handleStart(planId: string, slug: string) {
    saveProfile({ concernTag: concern ?? undefined, selectedPlanId: planId });
    markOnboardingComplete(locale);
    router.push(`/${locale}/plans/${slug}`);
  }

  function handleSkip() {
    markOnboardingComplete(locale);
    router.push(`/${locale}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {t.onboarding.goalTitle}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.onboarding.goalSub}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {CONCERN_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={concern === tag}
              onClick={() => setConcern(tag)}
              className={
                concern === tag
                  ? "rounded-xl bg-emerald-600 px-3 py-2.5 text-center text-sm font-medium text-white"
                  : "rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-center text-sm font-medium text-zinc-600 hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
              }
            >
              {t.onboarding.concernTags[tag]}
            </button>
          ))}
        </div>

        {matchingPlans.length > 0 && (
          <div className="flex flex-col gap-3">
            {matchingPlans.map((plan) => (
              <div key={plan.id} className="flex flex-col gap-2">
                <PlanCard plan={plan} locale={locale} />
                <button
                  type="button"
                  onClick={() => handleStart(plan.id, plan.slug)}
                  className="rounded-xl bg-emerald-700 py-2.5 text-sm font-semibold text-white"
                >
                  {t.onboarding.startPlanButton}
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleSkip}
          className="rounded-xl border border-zinc-200 bg-white py-3 text-sm font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
        >
          {t.onboarding.skipToHomeButton}
        </button>
      </main>
    </div>
  );
}
