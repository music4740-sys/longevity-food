"use client";

import { useEffect, useState } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { CoupangProduct } from "@/lib/coupang";

interface CoupangBuyButtonProps {
  keyword: string;
  locale: Locale;
}

// Session-scoped so repeated visits to the cart don't re-query the same keyword.
const matchCache = new Map<string, CoupangProduct | null>();

export default function CoupangBuyButton({ keyword, locale }: CoupangBuyButtonProps) {
  const t = getDictionary(locale);
  const [product, setProduct] = useState<CoupangProduct | null>(matchCache.get(keyword) ?? null);

  useEffect(() => {
    if (locale !== "ko" || matchCache.has(keyword)) {
      return;
    }
    let cancelled = false;
    fetch(`/api/coupang/search?keyword=${encodeURIComponent(keyword)}`)
      .then((res) => (res.ok ? res.json() : { product: null }))
      .then((data: { product: CoupangProduct | null }) => {
        matchCache.set(keyword, data.product);
        if (!cancelled) {
          setProduct(data.product);
        }
      })
      .catch(() => {
        matchCache.set(keyword, null);
      });
    return () => {
      cancelled = true;
    };
  }, [keyword, locale]);

  if (locale !== "ko" || !product) {
    return null;
  }

  return (
    <a
      href={product.productUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="shrink-0 rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-amber-600"
    >
      {t.common.coupangBuyButton}
    </a>
  );
}
