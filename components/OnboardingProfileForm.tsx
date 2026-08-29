"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { bmiCategory, calculateBmi, calculateTdee } from "@/lib/bmi";
import { getDictionary, type Locale } from "@/lib/i18n";
import { saveProfile } from "@/lib/onboardingProfile";
import type { ActivityLevel, Gender } from "@/types";

const GENDERS: Gender[] = ["male", "female", "unspecified"];
const ACTIVITY_LEVELS: ActivityLevel[] = ["sedentary", "light", "moderate", "active"];

interface OnboardingProfileFormProps {
  locale: Locale;
}

export default function OnboardingProfileForm({ locale }: OnboardingProfileFormProps) {
  const router = useRouter();
  const t = getDictionary(locale);

  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(null);

  const genderLabel: Record<Gender, string> = {
    male: t.onboarding.genderMale,
    female: t.onboarding.genderFemale,
    unspecified: t.onboarding.genderUnspecified,
  };
  const activityLabel: Record<ActivityLevel, string> = {
    sedentary: t.onboarding.activitySedentary,
    light: t.onboarding.activityLight,
    moderate: t.onboarding.activityModerate,
    active: t.onboarding.activityActive,
  };
  const bmiCategoryLabel: Record<ReturnType<typeof bmiCategory>, string> = {
    under: t.onboarding.bmiUnder,
    normal: t.onboarding.bmiNormal,
    over: t.onboarding.bmiOver,
    obese: t.onboarding.bmiObese,
  };

  const heightNum = Number(heightCm);
  const weightNum = Number(weightKg);
  const ageNum = Number(age);
  const hasBmiInputs = heightCm !== "" && weightKg !== "" && heightNum > 0 && weightNum > 0;

  const bmi = useMemo(
    () => (hasBmiInputs ? calculateBmi(heightNum, weightNum) : null),
    [hasBmiInputs, heightNum, weightNum],
  );

  const tdee = useMemo(() => {
    if (!hasBmiInputs || age === "" || ageNum <= 0 || !gender || gender === "unspecified" || !activityLevel) {
      return null;
    }
    return calculateTdee({ age: ageNum, gender, heightCm: heightNum, weightKg: weightNum, activityLevel });
  }, [hasBmiInputs, age, ageNum, gender, heightNum, weightNum, activityLevel]);

  function goNext(save: boolean) {
    if (save) {
      saveProfile({
        age: age !== "" ? ageNum : undefined,
        gender: gender ?? undefined,
        heightCm: heightCm !== "" ? heightNum : undefined,
        weightKg: weightKg !== "" ? weightNum : undefined,
        activityLevel: activityLevel ?? undefined,
      });
    }
    router.push(`/${locale}/onboarding/goal`);
  }

  const inputClass =
    "rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-emerald-950";

  function pillClass(active: boolean) {
    return active
      ? "rounded-xl bg-emerald-600 px-3 py-2 text-center text-sm font-medium text-white"
      : "rounded-xl border border-zinc-200 bg-white px-3 py-2 text-center text-sm font-medium text-zinc-600 hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300";
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {t.onboarding.profileTitle}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.onboarding.profileSub}</p>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {t.onboarding.ageLabel}
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder={t.onboarding.agePlaceholder}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {t.onboarding.heightLabel} ({t.onboarding.heightUnit})
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder={t.onboarding.heightPlaceholder}
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {t.onboarding.weightLabel} ({t.onboarding.weightUnit})
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder={t.onboarding.weightPlaceholder}
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {t.onboarding.genderLabel}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  aria-pressed={gender === g}
                  onClick={() => setGender(g)}
                  className={pillClass(gender === g)}
                >
                  {genderLabel[g]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {t.onboarding.activityLabel}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {ACTIVITY_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  aria-pressed={activityLevel === level}
                  onClick={() => setActivityLevel(level)}
                  className={pillClass(activityLevel === level)}
                >
                  {activityLabel[level]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
          {bmi === null ? (
            <p className="text-sm text-emerald-800 dark:text-emerald-300">
              {t.onboarding.emptyCalcNote}
            </p>
          ) : (
            <>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                  {t.onboarding.bmiLabel}
                </span>
                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  {bmi.toFixed(1)} · {bmiCategoryLabel[bmiCategory(bmi)]}
                </span>
              </div>
              {tdee !== null ? (
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                    {t.onboarding.calorieLabel}
                  </span>
                  <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    {tdee.toLocaleString(locale)} {t.onboarding.calorieUnit}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  {t.onboarding.calorieNeedsGenderNote}
                </p>
              )}
            </>
          )}
          <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
            {t.onboarding.referenceNote}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => goNext(false)}
            className="flex-1 rounded-xl border border-zinc-200 bg-white py-3 text-sm font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
          >
            {t.onboarding.skipButton}
          </button>
          <button
            type="button"
            onClick={() => goNext(true)}
            className="flex-1 rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white"
          >
            {t.onboarding.nextButton}
          </button>
        </div>
      </main>
    </div>
  );
}
