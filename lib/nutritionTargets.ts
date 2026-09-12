import type { MealType, NutrientValues } from "@/types";

// 식약처(식품의약품안전처) "1일 영양성분 기준치" 공개 자료 기준의 일반 성인 참고값.
// 개인 맞춤 열량 목표가 있으면(TDEE) calories만 대체해서 사용.
export const DEFAULT_DAILY_TARGETS: NutrientValues = {
  calories: 2000,
  carbs: 324,
  sugar: 100,
  protein: 55,
  fat: 54,
  saturatedFat: 15,
  fiber: 25,
  sodium: 2000,
  calcium: 700,
  iron: 12,
};

// "많을수록 좋다"가 아니라 "기준치를 넘기면 과다 섭취"로 판단하는 영양소.
export const UPPER_BOUND_NUTRIENTS = new Set<keyof NutrientValues>([
  "calories",
  "sugar",
  "sodium",
  "saturatedFat",
]);

// 끼니별 부족 판단은 하루 기준치를 이 비중만큼 나눠서 비교(참고용 배분).
export const MEAL_FRACTIONS: Record<MealType, number> = {
  breakfast: 0.25,
  lunch: 0.35,
  dinner: 0.3,
  snack: 0.1,
};
