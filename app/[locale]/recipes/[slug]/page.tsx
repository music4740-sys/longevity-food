import { notFound } from "next/navigation";
import IngredientChecklist from "@/components/IngredientChecklist";
import ScoreBreakdown from "@/components/ScoreBreakdown";
import { getRecipeBySlug, getRecipeLongevityScore, recipes } from "@/lib/data";
import { getDictionary, localizedText, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export default async function RecipeDetailPage({
  params,
}: PageProps<"/[locale]/recipes/[slug]">) {
  // Locale is validated once in app/[locale]/layout.tsx; safe to trust here.
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;

  const recipe = getRecipeBySlug(slug);
  if (!recipe) {
    notFound();
  }

  const t = getDictionary(locale);
  const score = getRecipeLongevityScore(recipe);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {localizedText(recipe.title, locale)}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {localizedText(recipe.description, locale)}
          </p>
        </div>

        <IngredientChecklist recipeId={recipe.id} ingredients={recipe.ingredients} locale={locale} />

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {t.recipe.stepsTitle}
          </h2>
          <ol className="flex flex-col gap-2">
            {recipe.steps
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((step) => (
                <li
                  key={step.order}
                  className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {step.order}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-zinc-800 dark:text-zinc-200">
                      {localizedText(step.instruction, locale)}
                    </span>
                    {step.detail && (
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {localizedText(step.detail, locale)}
                      </span>
                    )}
                  </div>
                </li>
              ))}
          </ol>
        </section>

        <ScoreBreakdown score={score} locale={locale} />
      </main>
      <footer className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="mx-auto max-w-xl text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {t.common.disclaimer}
        </p>
      </footer>
    </div>
  );
}
