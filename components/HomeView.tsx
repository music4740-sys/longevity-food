import Link from "next/link";
import PlanCard from "@/components/PlanCard";
import { plans } from "@/lib/data";
import { getDictionary, type Locale } from "@/lib/i18n";

interface HomeViewProps {
  locale: Locale;
}

export default function HomeView({ locale }: HomeViewProps) {
  const t = getDictionary(locale);
  const featuredPlans = plans.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-6">
        <section className="flex flex-col gap-2 rounded-2xl bg-emerald-50 p-5 dark:bg-emerald-950">
          <p className="text-base font-semibold leading-relaxed text-emerald-900 dark:text-emerald-100">
            {t.home.trustHeadline1}
          </p>
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            {t.home.trustHeadline2}
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {t.home.featuredPlansTitle}
          </h2>
          {featuredPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} locale={locale} />
          ))}
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
