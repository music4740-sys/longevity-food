import { getSubstituteGroupById } from "@/lib/data";
import { getDictionary, ingredientTagLabel, localizedText, type Locale } from "@/lib/i18n";
import type { Ingredient } from "@/types";

interface IngredientRowProps {
  ingredient: Ingredient;
  locale: Locale;
}

export default function IngredientRow({ ingredient, locale }: IngredientRowProps) {
  const t = getDictionary(locale);
  const substituteGroup = ingredient.substituteGroupId
    ? getSubstituteGroupById(ingredient.substituteGroupId)
    : undefined;

  return (
    <li className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-medium text-zinc-900 dark:text-zinc-50">
          {localizedText(ingredient.name, locale)}
        </span>
        <span className="shrink-0 text-sm text-zinc-500 dark:text-zinc-400">{ingredient.amount}</span>
      </div>

      {ingredient.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {ingredient.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {ingredientTagLabel(tag, locale)}
            </span>
          ))}
        </div>
      )}

      {ingredient.healthNote && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {localizedText(ingredient.healthNote, locale)}
        </p>
      )}

      {substituteGroup && (
        <details className="text-sm">
          <summary className="cursor-pointer font-medium text-emerald-700 dark:text-emerald-400">
            {t.recipe.substitutesToggle}
          </summary>
          <ul className="mt-2 flex flex-col gap-1.5 pl-1">
            {substituteGroup.options.map((option) => (
              <li key={option.country} className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {option.country}
                  </span>
                  <span className="text-zinc-800 dark:text-zinc-200">
                    {localizedText(option.ingredient, locale)}
                  </span>
                </div>
                {option.note && (
                  <p className="pl-9 text-xs text-zinc-500 dark:text-zinc-400">
                    {localizedText(option.note, locale)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}
    </li>
  );
}
