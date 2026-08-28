"use client";

import { useEffect, useState } from "react";
import { CUISINE_REGIONS, getSelectedRegion, setSelectedRegion, type CuisineRegion } from "@/lib/cuisineRegion";
import { getDictionary, type Locale } from "@/lib/i18n";

interface CuisineRegionPickerProps {
  locale: Locale;
}

export default function CuisineRegionPicker({ locale }: CuisineRegionPickerProps) {
  const t = getDictionary(locale);
  const [selected, setSelected] = useState<CuisineRegion | null>(null);

  useEffect(() => {
    setSelected(getSelectedRegion());
  }, []);

  function handleSelect(region: CuisineRegion) {
    setSelectedRegion(region);
    setSelected(region);
    // localStorage's "storage" event only fires in *other* tabs, so same-tab
    // listeners (PlanDayGrid, the score badge) need an explicit nudge to
    // pick up the change immediately instead of waiting for a reload.
    window.dispatchEvent(new Event("cuisine-region-change"));
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        {t.plan.cuisineRegionLabel}
      </span>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {CUISINE_REGIONS.map((region) => (
          <button
            key={region}
            type="button"
            onClick={() => handleSelect(region)}
            aria-pressed={selected === region}
            className={
              selected === region
                ? "flex shrink-0 flex-col items-start gap-0.5 rounded-xl bg-emerald-600 px-3 py-2 text-left"
                : "flex shrink-0 flex-col items-start gap-0.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-left hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900"
            }
          >
            <span
              className={
                selected === region
                  ? "text-sm font-medium text-white"
                  : "text-sm font-medium text-zinc-600 dark:text-zinc-300"
              }
            >
              {t.plan.cuisineRegions[region]}
            </span>
            <span
              className={
                selected === region
                  ? "whitespace-nowrap text-xs text-emerald-50"
                  : "whitespace-nowrap text-xs text-zinc-400 dark:text-zinc-500"
              }
            >
              {t.plan.cuisineRegionDescriptions[region]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
