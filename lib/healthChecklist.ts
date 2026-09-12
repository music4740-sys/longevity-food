const CHECKLIST_KEY = "longevity-food-health-checklist";

export const HEALTH_CHECKLIST_ITEMS = [
  "sleep",
  "hydration",
  "exercise",
  "nutritionBalance",
  "sedentary",
  "checkup",
  "noSmokingDrinking",
  "mentalCare",
] as const;

export type HealthChecklistItem = (typeof HEALTH_CHECKLIST_ITEMS)[number];

type DayChecklist = Partial<Record<HealthChecklistItem, boolean>>;

function loadAll(): Record<string, DayChecklist> {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    return raw ? (JSON.parse(raw) as Record<string, DayChecklist>) : {};
  } catch {
    return {};
  }
}

function saveAll(all: Record<string, DayChecklist>): void {
  try {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(all));
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — fail silently.
  }
}

export function loadChecklist(date: string): DayChecklist {
  return loadAll()[date] ?? {};
}

export function toggleChecklistItem(date: string, item: HealthChecklistItem): DayChecklist {
  const all = loadAll();
  const day = all[date] ?? {};
  const next = { ...day, [item]: !day[item] };
  all[date] = next;
  saveAll(all);
  return next;
}
