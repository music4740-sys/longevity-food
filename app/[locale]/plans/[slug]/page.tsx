import { notFound } from "next/navigation";
import PlanDayGrid from "@/components/PlanDayGrid";
import { getPlanAverageLongevityScore, getPlanBySlug, plans } from "@/lib/data";
import { getDictionary, localizedText, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return plans.map((plan) => ({ slug: plan.slug }));
}

export default async function PlanDetailPage({ params }: PageProps<"/[locale]/plans/[slug]">) {
  // Locale is validated once in app/[locale]/layout.tsx; safe to trust here.
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;

  const plan = getPlanBySlug(slug);
  if (!plan) {
    notFound();
  }

  const t = getDictionary(locale);
  const averageScore = getPlanAverageLongevityScore(plan);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {localizedText(plan.title, locale)}
          </h1>
          <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            {t.plan.longevityScoreLabel} {averageScore}
            {t.plan.scoreUnit}
          </span>
        </div>
        <PlanDayGrid plan={plan} locale={locale} />
      </main>
      <footer className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="mx-auto max-w-4xl text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {t.common.disclaimer}
        </p>
      </footer>
    </div>
  );
}
