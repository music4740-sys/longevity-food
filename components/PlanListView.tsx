import PlanCard from "@/components/PlanCard";
import { plans } from "@/lib/data";
import { getDictionary, type Locale } from "@/lib/i18n";

interface PlanListViewProps {
  locale: Locale;
}

export default function PlanListView({ locale }: PlanListViewProps) {
  const t = getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-6">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} locale={locale} />
        ))}
      </main>
      <footer className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="mx-auto max-w-md text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {t.common.disclaimer}
        </p>
      </footer>
    </div>
  );
}
