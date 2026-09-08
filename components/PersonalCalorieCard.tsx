"use client";

import { useEffect, useState } from "react";
import { bmiCategory, calculateBmi, calculateTdee, type BmiCategory } from "@/lib/bmi";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getProfile } from "@/lib/onboardingProfile";

interface PersonalCalorieCardProps {
  locale: Locale;
}

const BMI_BADGE_CLASS: Record<BmiCategory, string> = {
  normal:
    "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-accent-900 dark:text-accent-300",
  under:
    "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  over: "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  obese:
    "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-400",
};

export default function PersonalCalorieCard({ locale }: PersonalCalorieCardProps) {
  const t = getDictionary(locale);
  const [bmi, setBmi] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);

  useEffect(() => {
    const { age, gender, heightCm, weightKg, activityLevel } = getProfile();
    if (!heightCm || !weightKg) return;
    setBmi(calculateBmi(heightCm, weightKg));
    if (age && gender && gender !== "unspecified" && activityLevel) {
      setTdee(calculateTdee({ age, gender, heightCm, weightKg, activityLevel }));
    }
  }, []);

  // No onboarding profile on this device (skipped onboarding, cleared
  // storage, etc.) — nothing personal to show, so render nothing.
  if (bmi === null) return null;

  const bmiCategoryLabel: Record<BmiCategory, string> = {
    under: t.onboarding.bmiUnder,
    normal: t.onboarding.bmiNormal,
    over: t.onboarding.bmiOver,
    obese: t.onboarding.bmiObese,
  };

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4 dark:border-accent-900 dark:from-accent-950/40 dark:to-zinc-950">
      <span className="text-xs font-semibold text-emerald-700 dark:text-accent-400">
        {t.plan.personalTargetTitle}
      </span>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm font-semibold text-emerald-900 dark:text-accent-200">
          📊 {t.onboarding.bmiLabel}
        </span>
        <span className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-accent-300">
          {bmi.toFixed(1)}
          <span className={BMI_BADGE_CLASS[bmiCategory(bmi)]}>{bmiCategoryLabel[bmiCategory(bmi)]}</span>
        </span>
      </div>
      {tdee !== null && (
        <div className="flex items-baseline justify-between">
          <span className="flex items-center gap-1 text-sm font-semibold text-emerald-900 dark:text-accent-200">
            🔥 {t.onboarding.calorieLabel}
          </span>
          <span className="text-sm font-bold text-emerald-800 dark:text-accent-300">
            {tdee.toLocaleString(locale)} {t.onboarding.calorieUnit}
          </span>
        </div>
      )}
      <p className="text-xs text-emerald-700/80 dark:text-accent-400/80">{t.onboarding.referenceNote}</p>
    </div>
  );
}
