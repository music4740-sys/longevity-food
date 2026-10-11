import { foods } from "@/lib/data";
import { getLoadedIngredients } from "@/lib/ingredients";
import type { Food } from "@/types";

// "매일 활용하기 좋은 식재료" — the curated everyday list the app steers people
// toward (picker's first tab, daily group strip, coaching suggestions).

export const STAPLE_GROUPS = ["veg", "fruit", "protein", "carb", "fat"] as const;
export type StapleGroup = (typeof STAPLE_GROUPS)[number];

type Source =
  | { dish: string } //                 data/foods.json entry, by name
  | { ing: [family: string, name: string] }; // raw ingredient, by family + display name

interface StapleSpec {
  label: string;
  emoji: string;
  group: StapleGroup;
  source: Source;
}

const veg = (label: string, emoji: string, family: string, name: string): StapleSpec => ({
  label, emoji, group: "veg", source: { ing: [family, name] },
});
const fruitIng = (label: string, family: string, name: string): StapleSpec => ({
  label, emoji: "🍓", group: "fruit", source: { ing: [family, name] },
});
const fruitDish = (label: string, emoji: string): StapleSpec => ({
  label, emoji, group: "fruit", source: { dish: label },
});

export const DAILY_STAPLES: StapleSpec[] = [
  // 채소
  veg("양배추", "🥬", "양배추", "양배추 (생것)"),
  veg("배추", "🥬", "배추", "가을 재배 (생것)"),
  veg("오이", "🥒", "오이", "오이 개량종 생것"),
  veg("양상추", "🥬", "상추", "완전결구상추(양상추) 청상추 (생것)"),
  veg("깻잎", "🌿", "들깨", "들깨 잎 생것"),
  veg("부추", "🌿", "부추", "부추 재래종 생것"),
  veg("브로콜리", "🥦", "브로콜리", "브로콜리 (생것)"),
  veg("콜리플라워", "🥦", "꽃양배추(콜리플라워)", "꽃양배추(콜리플라워) (생것)"),
  veg("양파", "🧅", "양파", "양파 (생것)"),
  veg("대파", "🌱", "파", "대파 (생것)"),
  veg("마늘", "🧄", "마늘", "구근 (생것)"),
  veg("무", "🥕", "무", "조선무 뿌리 (생것)"),
  veg("가지", "🍆", "가지", "가지 (생것)"),
  veg("피망", "🫑", "피망", "피망 빨간색 생것"),
  veg("버섯", "🍄", "느타리버섯", "느타리버섯 (생것)"),
  // 과일
  fruitDish("사과", "🍎"),
  fruitDish("배", "🍐"),
  fruitDish("포도", "🍇"),
  fruitDish("딸기", "🍓"),
  fruitDish("블루베리", "🫐"),
  fruitIng("라즈베리", "라즈베리", "라즈베리 (생것)"),
  fruitIng("체리", "체리", "체리 (생것)"),
  fruitDish("복숭아", "🍑"),
  fruitDish("자두", "🍑"),
  fruitIng("파인애플", "파인애플", "파인애플 (생것)"),
  // 단백질
  { label: "달걀", emoji: "🥚", group: "protein", source: { ing: ["달걀", "달걀 (삶은것)"] } },
  { label: "두부", emoji: "🧈", group: "protein", source: { dish: "두부" } },
  { label: "무염 생선", emoji: "🐟", group: "protein", source: { ing: ["대구류", "대구 (생것)"] } },
  { label: "고등어", emoji: "🐟", group: "protein", source: { ing: ["고등어류", "고등어류 고등어 육 생것"] } },
  { label: "연어", emoji: "🍣", group: "protein", source: { ing: ["연어류", "대서양연어 (생것)"] } },
  { label: "닭가슴살", emoji: "🍗", group: "protein", source: { ing: ["닭고기", "가슴(껍질 제거) (생것)"] } },
  { label: "닭안심", emoji: "🍗", group: "protein", source: { dish: "닭안심" } },
  { label: "돼지 안심", emoji: "🥩", group: "protein", source: { ing: ["돼지고기", "안심(안심살) (생것)"] } },
  { label: "소고기 우둔살", emoji: "🥩", group: "protein", source: { ing: ["소고기", "한우(1등급) 우둔(우둔살) (생것)"] } },
  { label: "새우", emoji: "🦐", group: "protein", source: { ing: ["새우류", "중하 생것 부산"] } },
  { label: "무가당 플레인 요거트", emoji: "🥛", group: "protein", source: { dish: "플레인요구르트" } },
  { label: "무가당 두유", emoji: "🥛", group: "protein", source: { dish: "두유" } },
  // 탄수화물·곡류
  { label: "흰쌀", emoji: "🍚", group: "carb", source: { dish: "흰쌀밥" } },
  { label: "귀리", emoji: "🌾", group: "carb", source: { ing: ["귀리밥", "귀리밥 도정"] } },
  { label: "보리", emoji: "🌾", group: "carb", source: { dish: "보리밥" } },
  { label: "현미", emoji: "🍚", group: "carb", source: { dish: "현미밥" } },
  { label: "메밀", emoji: "🌾", group: "carb", source: { ing: ["메밀", "메밀 도정 생것"] } },
  { label: "고구마", emoji: "🍠", group: "carb", source: { ing: ["고구마", "고구마 (구운것)"] } },
  { label: "감자", emoji: "🥔", group: "carb", source: { ing: ["감자", "대지 (삶은것)"] } },
  // 건강한 지방·향신료
  { label: "올리브유", emoji: "🫒", group: "fat", source: { ing: ["올리브유", "올리브유"] } },
  { label: "들기름", emoji: "🫒", group: "fat", source: { ing: ["들기름", "들기름"] } },
  { label: "아마씨유", emoji: "🫒", group: "fat", source: { ing: ["아마씨유", "아마씨유"] } },
  { label: "무염 참깨", emoji: "🌰", group: "fat", source: { ing: ["참깨", "흰깨 (볶은것)"] } },
  { label: "무염 호두", emoji: "🌰", group: "fat", source: { dish: "호두" } },
  { label: "후추·식초·레몬즙", emoji: "🍋", group: "fat", source: { dish: "레몬즙" } },
];

export interface ResolvedStaple {
  label: string;
  emoji: string;
  group: StapleGroup;
  food: Food;
}

let resolved: { count: number; list: ResolvedStaple[]; byFoodId: Map<string, ResolvedStaple> } | null = null;

/** Staples whose data is available. Raw-ingredient ones appear once ingredients have loaded. */
export function resolveStaples(): ResolvedStaple[] {
  const ingredients = getLoadedIngredients();
  if (resolved && resolved.count === ingredients.length) return resolved.list;

  const dishByName = new Map(foods.map((food) => [food.name, food]));
  const ingByKey = new Map(ingredients.map((food) => [`${food.family}|${food.name}`, food]));
  const list: ResolvedStaple[] = [];
  for (const spec of DAILY_STAPLES) {
    const food =
      "dish" in spec.source ? dishByName.get(spec.source.dish) : ingByKey.get(spec.source.ing.join("|"));
    if (food) list.push({ label: spec.label, emoji: spec.emoji, group: spec.group, food });
  }
  resolved = { count: ingredients.length, list, byFoodId: new Map(list.map((s) => [s.food.id, s])) };
  return list;
}

export function getStapleByFoodId(foodId: string): ResolvedStaple | undefined {
  resolveStaples();
  return resolved?.byFoodId.get(foodId);
}
