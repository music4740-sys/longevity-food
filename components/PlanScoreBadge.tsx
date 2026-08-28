"use client";

import { useEffect, useState } from "react";
import { getSelectedRegion, type CuisineRegion } from "@/lib/cuisineRegion";
import { getPlanAverageLongevityScore } from "@/lib/data";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { Plan } from "@/types";

interface PlanScoreBadgeProps {
  plan: Plan;
  locale: Locale;
}

export default function PlanScoreBadge({ plan, locale }: PlanScoreBadgeProps) {
  const t = getDictionary(locale);
  const [region, setRegion] = useState<CuisineRegion | null>(null);

  useEffect(() => {
    setRegion(getSelectedRegion());
    const onChange = () => setRegion(getSelectedRegion());
    window.addEventListener("storage", onChange);
    window.addEventListener("cuisine-region-change", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("cuisine-region-change", onChange);
    };
  }, []);

  const averageScore = getPlanAverageLongevityScore(plan, region);

  return (
    <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
      {t.plan.longevityScoreLabel} {averageScore}
      {t.plan.scoreUnit}
    </span>
  );
}
