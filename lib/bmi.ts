import type { ActivityLevel, Gender } from "@/types";

export type BmiCategory = "under" | "normal" | "over" | "obese";

export const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

export function calculateBmi(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

// WHO Asia-Pacific cutoffs (used by KDCA) rather than the global WHO bands —
// this app's primary audience is Korean.
export function bmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return "under";
  if (bmi < 23) return "normal";
  if (bmi < 25) return "over";
  return "obese";
}

interface TdeeParams {
  age: number;
  gender: Exclude<Gender, "unspecified">;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
}

// Mifflin-St Jeor equation. Deliberately not offered for gender "unspecified"
// — the formula needs a sex constant, and guessing one would misrepresent
// the result as more precise than it is.
export function calculateTdee({ age, gender, heightCm, weightKg, activityLevel }: TdeeParams): number {
  const bmr =
    gender === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  return Math.round(bmr * ACTIVITY_MULTIPLIER[activityLevel]);
}
