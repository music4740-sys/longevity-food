"use client";

import { useEffect, useState } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import {
  HEALTH_CHECKLIST_ITEMS,
  loadChecklist,
  toggleChecklistItem,
  type HealthChecklistItem,
} from "@/lib/healthChecklist";

interface HealthChecklistProps {
  dateKey: string;
  locale: Locale;
}

function SleepIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
      <path d="M17 3.2l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z" />
    </svg>
  );
}

function HydrationIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3s6 7.2 6 11.2a6 6 0 1 1-12 0C6 10.2 12 3 12 3Z" />
    </svg>
  );
}

function ExerciseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="9" width="3" height="6" rx="1" />
      <rect x="19" y="9" width="3" height="6" rx="1" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function NutritionBalanceIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8c1.5-1.7 4-1.2 4 1 0 2.2-4 5-4 5s-4-2.8-4-5c0-2.2 2.5-2.7 4-1Z" />
    </svg>
  );
}

function SedentaryIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2" />
      <path d="M10 2h4" />
    </svg>
  );
}

function CheckupIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M12 10v6M9 13h6" />
    </svg>
  );
}

function NoSmokingDrinkingIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3h8l-1 6a3 3 0 0 1-6 0Z" />
      <path d="M12 9v8M9 21h6" />
      <line x1="4" y1="4" x2="20" y2="20" />
    </svg>
  );
}

function MentalCareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v3" />
      <path d="M6 20l3-6a3 3 0 0 1 6 0l3 6" />
      <path d="M6 20h12" />
    </svg>
  );
}

const ITEM_ICONS: Record<HealthChecklistItem, () => React.JSX.Element> = {
  sleep: SleepIcon,
  hydration: HydrationIcon,
  exercise: ExerciseIcon,
  nutritionBalance: NutritionBalanceIcon,
  sedentary: SedentaryIcon,
  checkup: CheckupIcon,
  noSmokingDrinking: NoSmokingDrinkingIcon,
  mentalCare: MentalCareIcon,
};

export default function HealthChecklist({ dateKey, locale }: HealthChecklistProps) {
  const t = getDictionary(locale);
  const [checked, setChecked] = useState<Partial<Record<HealthChecklistItem, boolean>>>({});

  useEffect(() => {
    setChecked(loadChecklist(dateKey));
  }, [dateKey]);

  function handleToggle(item: HealthChecklistItem) {
    setChecked(toggleChecklistItem(dateKey, item));
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        {t.nutrition.healthChecklist.title}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {HEALTH_CHECKLIST_ITEMS.map((item) => {
          const Icon = ITEM_ICONS[item];
          const isChecked = Boolean(checked[item]);
          return (
            <label
              key={item}
              className="flex cursor-pointer items-start gap-2 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                <Icon />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {t.nutrition.healthChecklist.items[item].title}
                </span>
                <span className="block text-xs text-zinc-400 dark:text-zinc-500">
                  {t.nutrition.healthChecklist.items[item].subtitle}
                </span>
              </span>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggle(item)}
                className="mt-1 h-4 w-4 shrink-0 accent-emerald-600"
              />
            </label>
          );
        })}
      </div>
    </section>
  );
}
