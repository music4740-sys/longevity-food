const RECENTS_KEY = "longevity-food-nutrition-recents";
const MAX_RECENTS = 20;

export function getRecents(): string[] {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Moves foodId to the front (most recent), dedup, capped at MAX_RECENTS. */
export function pushRecent(foodId: string): string[] {
  const current = getRecents();
  const next = [foodId, ...current.filter((id) => id !== foodId)].slice(0, MAX_RECENTS);
  try {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — fail silently.
  }
  return next;
}
