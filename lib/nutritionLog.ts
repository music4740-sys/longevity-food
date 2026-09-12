import type { NutritionLogEntry } from "@/types";

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

export function addEntry(date: string, foodId: string, servings = 1): NutritionLogEntry[] {
  const all = loadAll();
  const dayEntries = all[date] ?? [];
  const existing = dayEntries.find((entry) => entry.foodId === foodId);
  const nextDayEntries = existing
    ? dayEntries.map((entry) =>
        entry.foodId === foodId ? { ...entry, servings: entry.servings + servings } : entry,
      )
    : [...dayEntries, { foodId, servings }];
  all[date] = nextDayEntries;
  saveAll(all);
  return nextDayEntries;
}

export function setServings(date: string, foodId: string, servings: number): NutritionLogEntry[] {
  const all = loadAll();
  const dayEntries = all[date] ?? [];
  const nextDayEntries =
    servings <= 0
      ? dayEntries.filter((entry) => entry.foodId !== foodId)
      : dayEntries.map((entry) => (entry.foodId === foodId ? { ...entry, servings } : entry));
  all[date] = nextDayEntries;
  saveAll(all);
  return nextDayEntries;
}

export function removeEntry(date: string, foodId: string): NutritionLogEntry[] {
  const all = loadAll();
  const nextDayEntries = (all[date] ?? []).filter((entry) => entry.foodId !== foodId);
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
