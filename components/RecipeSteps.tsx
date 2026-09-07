"use client";

import { useEffect, useState } from "react";
import { getSubstituteGroupById } from "@/lib/data";
import { getSelectedRegion, type CuisineRegion } from "@/lib/cuisineRegion";
import { getDictionary, localizedText, type Locale } from "@/lib/i18n";
import type { Ingredient, RecipeStep } from "@/types";

interface RecipeStepsProps {
  steps: RecipeStep[];
  ingredients: Ingredient[];
  locale: Locale;
}

// Korean object/subject/topic/conjunction particles whose form depends on
// whether the preceding syllable has a batchim (final consonant). Each pair
// is [with-batchim form, without-batchim form].
const KO_PARTICLE_PAIRS: Record<string, [string, string]> = {
  을: ["을", "를"],
  를: ["을", "를"],
  이: ["이", "가"],
  가: ["이", "가"],
  은: ["은", "는"],
  는: ["은", "는"],
  과: ["과", "와"],
  와: ["과", "와"],
};

function hasBatchim(char: string): boolean {
  const code = char.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return false;
  return code % 28 !== 0;
}

// Swaps every occurrence of a substituted ingredient's original name for its
// regional name in free-form step text. For Korean, also fixes the
// batchim-sensitive particle (을/를, 이/가, 은/는, 과/와) that immediately
// follows the name, since step text was authored assuming the original name.
function applySubstitutions(text: string, map: Map<string, string>, locale: Locale): string {
  if (map.size === 0) return text;
  // Longest names first so one ingredient's name can't clobber a substring
  // shared with another (e.g. a short name nested inside a longer one).
  const names = [...map.keys()].sort((a, b) => b.length - a.length);
  let result = text;
  for (const name of names) {
    const replacement = map.get(name)!;
    if (!name || name === replacement) continue;
    let searchFrom = 0;
    let idx = result.indexOf(name, searchFrom);
    while (idx !== -1) {
      const before = result.slice(0, idx);
      let after = result.slice(idx + name.length);
      if (locale === "ko") {
        const particle = after[0];
        const pair = particle ? KO_PARTICLE_PAIRS[particle] : undefined;
        if (pair) {
          const correct = hasBatchim(replacement[replacement.length - 1]) ? pair[0] : pair[1];
          after = correct + after.slice(1);
        }
      }
      result = before + replacement + after;
      searchFrom = before.length + replacement.length;
      idx = result.indexOf(name, searchFrom);
    }
  }
  return result;
}

function buildSubstitutionMap(
  ingredients: Ingredient[],
  locale: Locale,
  region: CuisineRegion | null,
): Map<string, string> {
  const map = new Map<string, string>();
  if (!region) return map;
  for (const ingredient of ingredients) {
    if (!ingredient.substituteGroupId) continue;
    const group = getSubstituteGroupById(ingredient.substituteGroupId);
    const option = group?.options.find((o) => o.country === region);
    if (!option) continue;
    const original = localizedText(ingredient.name, locale);
    const swapped = localizedText(option.ingredient, locale);
    if (original && swapped && original !== swapped) {
      map.set(original, swapped);
    }
  }
  return map;
}

export default function RecipeSteps({ steps, ingredients, locale }: RecipeStepsProps) {
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

  const substitutions = buildSubstitutionMap(ingredients, locale, region);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{t.recipe.stepsTitle}</h2>
      <ol className="flex flex-col gap-2">
        {steps
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((step) => (
            <li
              key={step.order}
              className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="font-semibold text-emerald-700 dark:text-accent-400">{step.order}</span>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-800 dark:text-zinc-200">
                  {applySubstitutions(localizedText(step.instruction, locale), substitutions, locale)}
                </span>
                {step.detail && (
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {applySubstitutions(localizedText(step.detail, locale), substitutions, locale)}
                  </span>
                )}
              </div>
            </li>
          ))}
      </ol>
    </section>
  );
}
