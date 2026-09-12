"use client";

import { useEffect, useState } from "react";
import { formatDateKey, listLoggedDates } from "@/lib/nutritionLog";
import type { Locale } from "@/lib/i18n";

interface NutritionCalendarProps {
  locale: Locale;
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

export default function NutritionCalendar({ locale, selectedDate, onSelect }: NutritionCalendarProps) {
  const [viewMonth, setViewMonth] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );
  const [loggedDates, setLoggedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoggedDates(listLoggedDates());
  }, [selectedDate]);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const weekdayLabels = Array.from({ length: 7 }, (_, i) => weekdayFormatter.format(new Date(2024, 0, i + 7)));

  function shiftMonth(delta: number) {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }

  const selectedKey = formatDateKey(selectedDate);
  const todayKey = formatDateKey(new Date());

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="px-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          aria-label="previous month"
        >
          ◀
        </button>
        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          {viewMonth.toLocaleDateString(locale, { year: "numeric", month: "long" })}
        </span>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="px-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          aria-label="next month"
        >
          ▶
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-zinc-400 dark:text-zinc-500">
        {weekdayLabels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <span key={i} />;
          const key = formatDateKey(date);
          const isSelected = key === selectedKey;
          const isToday = key === todayKey;
          const hasEntries = loggedDates.has(key);
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(date)}
              className={`relative flex h-9 flex-col items-center justify-center rounded-lg text-xs ${
                isSelected
                  ? "bg-emerald-600 font-bold text-white"
                  : isToday
                    ? "font-bold text-emerald-700 dark:text-accent-400"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {date.getDate()}
              {hasEntries && !isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
