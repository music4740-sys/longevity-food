import Link from "next/link";
import PlanCard from "@/components/PlanCard";
import { CUISINE_REGIONS, type CuisineRegion } from "@/lib/cuisineRegion";
import { plans } from "@/lib/data";
import { getDictionary, type Locale } from "@/lib/i18n";

interface HomeViewProps {
  locale: Locale;
}

// Display-only decoration, not translated UI text — same reasoning as country
// badges on substitute options (types/substitute.ts).
const REGION_EMOJI: Record<CuisineRegion, string> = {
  KR: "🍚",
  IT: "🫒",
  IN: "🌶️",
  TR: "🫘",
  MX: "🌽",
};

const HERO_DOT_PATTERN = {
  backgroundImage: [
    "radial-gradient(3px 3px at 12% 22%, rgba(255,255,255,0.35) 0, transparent 60%)",
    "radial-gradient(2.5px 2.5px at 78% 15%, rgba(255,255,255,0.28) 0, transparent 60%)",
    "radial-gradient(2px 2px at 60% 40%, rgba(255,255,255,0.22) 0, transparent 60%)",
    "radial-gradient(3px 3px at 32% 58%, rgba(255,255,255,0.2) 0, transparent 60%)",
    "radial-gradient(2px 2px at 88% 62%, rgba(255,255,255,0.25) 0, transparent 60%)",
    "radial-gradient(2.5px 2.5px at 18% 82%, rgba(255,255,255,0.18) 0, transparent 60%)",
    "radial-gradient(2px 2px at 68% 86%, rgba(255,255,255,0.2) 0, transparent 60%)",
  ].join(", "),
};

export default function HomeView({ locale }: HomeViewProps) {
  const t = getDictionary(locale);
  const featuredPlans = plans.slice(0, 3);

  const whyItems = [
    { icon: "🌍", label: t.home.whyRegionBased },
    { icon: "✓", label: t.home.whyScoreVerified },
    { icon: "語", label: t.home.whyMultilingual },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-6">
        <section className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-950 p-5 dark:from-emerald-900 dark:to-black">
          <div aria-hidden className="absolute inset-0 -z-10" style={HERO_DOT_PATTERN} />
          <p className="text-lg font-bold leading-snug text-emerald-50">
            {t.home.trustHeadline1}
          </p>
          <p className="mt-1.5 text-sm font-medium text-emerald-200">
            {t.home.trustHeadline2}
          </p>

          <div className="-mx-5 -mb-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-5 pt-3">
            {CUISINE_REGIONS.map((region) => (
              <span
                key={region}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50 ring-1 ring-inset ring-white/15"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-[11px]">
                  {REGION_EMOJI[region]}
                </span>
                {t.plan.cuisineRegions[region]}
              </span>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2">
          {whyItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                {item.icon}
              </span>
              <span className="text-xs font-medium leading-tight text-zinc-600 dark:text-zinc-300">
                {item.label}
              </span>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              {t.home.featuredPlansTitle}
            </h2>
            <Link
              href={`/${locale}/plans`}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400"
            >
              {t.home.viewAllPlans}
            </Link>
          </div>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
            {featuredPlans.map((plan) => (
              <div key={plan.id} className="w-64 shrink-0">
                <PlanCard plan={plan} locale={locale} />
              </div>
            ))}
          </div>
          <Link
            href={`/${locale}/plans`}
            className="rounded-xl border border-zinc-200 bg-white py-2.5 text-center text-sm font-semibold text-emerald-700 hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-emerald-400"
          >
            {t.home.viewAllPlans}
          </Link>
        </section>
      </main>
      <footer className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="mx-auto max-w-md text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {t.common.disclaimer}
        </p>
      </footer>
    </div>
  );
}
