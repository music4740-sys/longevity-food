import type { CuisineRegion } from "@/types";

export type { CuisineRegion };

export const CUISINE_REGIONS: CuisineRegion[] = ["KR", "IT", "IN", "TR", "MX"];

const REGION_STORAGE_KEY = "longevity-food-cuisine-region";

export function getSelectedRegion(): CuisineRegion | null {
  try {
    const raw = localStorage.getItem(REGION_STORAGE_KEY);
    return (CUISINE_REGIONS as string[]).includes(raw ?? "") ? (raw as CuisineRegion) : null;
  } catch {
    return null;
  }
}

export function setSelectedRegion(region: CuisineRegion): void {
  try {
    localStorage.setItem(REGION_STORAGE_KEY, region);
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — fail silently.
  }
}
