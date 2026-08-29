export type Gender = "male" | "female" | "unspecified";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "active";

export interface OnboardingProfile {
  age?: number;
  gender?: Gender;
  heightCm?: number;
  weightKg?: number;
  activityLevel?: ActivityLevel;
  concernTag?: string;
  selectedPlanId?: string;
}
