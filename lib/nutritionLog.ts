import type { MealType, NutritionLogEntry } from "@/types";

const LOG_STORAGE_KEY = "longevity-food-nutrition-log";

type LogByDate = Record<string, NutritionLogEntry[]>;

function loadAll(): LogByDate {
  try {
    const raw = localStorage.getItem(LOG_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LogByDate) : {};
  } catch {
    return {};
  }
}

function saveAll(log: LogByDate): void {
  try {
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(log));
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — fail silently.
  }
}

/** date is a "YYYY-MM-DD" key. */
export function loadLog(date: string): NutritionLogEntry[] {
  return loadAll()[date] ?? [];
}

/** Dates (as "YYYY-MM-DD" keys) that have at least one logged entry — for calendar dots. */
export function listLoggedDates(): Set<string> {
  const all = loadAll();
  const dates = new Set<string>();
  for (const [date, entries] of Object.entries(all)) {
    if (entries.length > 0) dates.add(date);
  }
  return dates;
}

export function addEntry(
  date: string,
  foodId: string,
  mealType: MealType,
  servings = 1,
): NutritionLogEntry[] {
  const all = loadAll();
  const dayEntries = all[date] ?? [];
  const existing = dayEntries.find(
    (entry) => entry.foodId === foodId && entry.mealType === mealType,
  );
  const nextDayEntries = existing
    ? dayEntries.map((entry) =>
        entry.foodId === foodId && entry.mealType === mealType
          ? { ...entry, servings: entry.servings + servings }
          : entry,
      )
    : [...dayEntries, { foodId, mealType, servings }];
  all[date] = nextDayEntries;
  saveAll(all);
  return nextDayEntries;
}

export function setServings(
  date: string,
  foodId: string,
  mealType: MealType,
  servings: number,
): NutritionLogEntry[] {
  const all = loadAll();
  const dayEntries = all[date] ?? [];
  const matches = (entry: NutritionLogEntry) => entry.foodId === foodId && entry.mealType === mealType;
  const nextDayEntries =
    servings <= 0
      ? dayEntries.filter((entry) => !matches(entry))
      : dayEntries.map((entry) => (matches(entry) ? { ...entry, servings } : entry));
  all[date] = nextDayEntries;
  saveAll(all);
  return nextDayEntries;
}

export function removeEntry(date: string, foodId: string, mealType: MealType): NutritionLogEntry[] {
  const all = loadAll();
  const nextDayEntries = (all[date] ?? []).filter(
    (entry) => !(entry.foodId === foodId && entry.mealType === mealType),
  );
  all[date] = nextDayEntries;
  saveAll(all);
  return nextDayEntries;
}

export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
