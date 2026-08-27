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
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        {t.plan.cuisineRegionLabel}
      </span>
      <div className="flex flex-wrap gap-2">
        {CUISINE_REGIONS.map((region) => (
          <button
            key={region}
            type="button"
            onClick={() => handleSelect(region)}
            aria-pressed={selected === region}
            className={
              selected === region
                ? "rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white"
                : "rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            }
          >
            {t.plan.cuisineRegions[region]}
          </button>
        ))}
      </div>
    </div>
  );
}
