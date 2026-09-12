const FAVORITES_KEY = "longevity-food-nutrition-favorites";

function loadAll(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveAll(ids: string[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — fail silently.
  }
}

export function getFavorites(): Set<string> {
  return new Set(loadAll());
}

export function toggleFavorite(foodId: string): Set<string> {
  const current = loadAll();
  const next = current.includes(foodId)
    ? current.filter((id) => id !== foodId)
    : [...current, foodId];
  saveAll(next);
  return new Set(next);
}
