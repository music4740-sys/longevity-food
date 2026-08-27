import CartView from "@/components/CartView";
import type { Locale } from "@/lib/i18n";

export default async function CartPage({ params }: PageProps<"/[locale]/cart">) {
  // Locale is validated once in app/[locale]/layout.tsx; safe to trust here.
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  return <CartView locale={locale} />;
}
