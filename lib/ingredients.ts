import type { Food, NutrientValues } from "@/types";

// Raw-ingredient nutrition built from the public 원재료성식품 dataset (see
// scripts/build_ingredients.py). ~300 KB, so it is fetched on demand instead of
// being bundled with the app JS.
interface IngredientFile {
  subgroups: string[];
  items: [string, string, string, number, number, ...number[]][];
}

const SUBGROUP_EMOJI: Record<string, string> = {
  "어패류 및 기타 수산물": "🐟",
  채소류: "🥬",
  조미료류: "🧂",
  해조류: "🌿",
  기타: "🍽️",
  과일류: "🍎",
  차류: "🍵",
  "감자 및 전분류": "🥔",
  두류: "🫘",
  "견과 및 종실류": "🥜",
  육류: "🥩",
  난류: "🥚",
  버섯류: "🍄",
  곡류: "🌾",
  당류: "🍬",
  유지류: "🫒",
  우유류: "🥛",
};

// Everyday alternate names so e.g. "계란" finds 달걀 and "쌀" finds 멥쌀.
const FAMILY_ALIASES: Record<string, string[]> = {
  달걀: ["계란"],
  멥쌀: ["쌀", "백미", "현미"],
  김류: ["김", "파래김"],
  소고기: ["쇠고기", "한우"],
  닭고기: ["치킨"],
  고등어류: ["고등어"],
  우유: ["milk"],
};

let cache: Food[] | null = null;
let byId: Map<string, Food> | null = null;
let pending: Promise<Food[]> | null = null;

function toFood(file: IngredientFile, item: IngredientFile["items"][number]): Food {
  const [id, name, family, subIdx, grams, ...n] = item;
  const subgroup = file.subgroups[subIdx];
  const unit = subgroup === "우유류" || subgroup === "차류" ? "ml" : "g";
  const nutrients: NutrientValues = {
    calories: n[0],
    carbs: n[1],
    sugar: n[2],
    protein: n[3],
    fat: n[4],
    saturatedFat: n[5],
    fiber: n[6],
    sodium: n[7],
    calcium: n[8],
    iron: n[9],
  };
  return {
    id,
    category: "ingredient",
    name,
    family,
    subgroup,
    aliases: FAMILY_ALIASES[family],
    emoji: SUBGROUP_EMOJI[subgroup] ?? "🍽️",
    servingLabel: `1회 ${grams}${unit}`,
    servingGrams: grams,
    nutrients,
  };
}

export function loadIngredients(): Promise<Food[]> {
  if (cache) return Promise.resolve(cache);
  pending ??= fetch("/data/ingredients.json")
    .then((res) => {
      if (!res.ok) throw new Error(`ingredients ${res.status}`);
      return res.json() as Promise<IngredientFile>;
    })
    .then((file) => {
      cache = file.items.map((item) => toFood(file, item));
      byId = new Map(cache.map((food) => [food.id, food]));
      return cache;
    })
    .catch((error) => {
      pending = null; // allow a retry on the next open
      console.error("failed to load ingredient data", error);
      return [];
    });
  return pending;
}

/** Ingredients already loaded this session (empty until loadIngredients resolves). */
export function getLoadedIngredients(): Food[] {
  return cache ?? [];
}

export function getIngredientById(id: string): Food | undefined {
  return byId?.get(id);
}
