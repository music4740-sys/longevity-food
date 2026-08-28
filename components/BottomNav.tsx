"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary, LOCALES, type Locale } from "@/lib/i18n";

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.25 : 1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

function PlansIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.25 : 1.75} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="4" width="17" height="17" rx="2" />
      <path d="M8 2.5v3M16 2.5v3M3.5 9.5h17" />
      <path d="M7.5 13.5h3M7.5 16.5h6" />
    </svg>
  );
}

function CartIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.25 : 1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h2l1.6 10.6a2 2 0 0 0 2 1.7h7.8a2 2 0 0 0 2-1.6L20 8H6" />
      <circle cx="9.5" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.25 : 1.75} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13a7.7 7.7 0 0 0 0-2l2-1.4-2-3.4-2.3.7a7.6 7.6 0 0 0-1.7-1L15 3h-4l-.4 2.9a7.6 7.6 0 0 0-1.7 1l-2.3-.7-2 3.4L6.6 11a7.7 7.7 0 0 0 0 2l-2 1.4 2 3.4 2.3-.7a7.6 7.6 0 0 0 1.7 1L11 21h4l.4-2.9a7.6 7.6 0 0 0 1.7-1l2.3.7 2-3.4-2-1.4Z" />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const rawLocale = segments[1];
  const locale: Locale = (LOCALES as string[]).includes(rawLocale) ? (rawLocale as Locale) : "ko";
  const t = getDictionary(locale);

  const restPath = "/" + segments.slice(2).join("/");
  const isHome = restPath === "/";
  const isPlans = restPath.startsWith("/plans");
  const isCart = restPath.startsWith("/cart");
  const isSettings = restPath.startsWith("/settings");

  const tabs = [
    { href: `/${locale}`, label: t.nav.home, active: isHome, Icon: HomeIcon },
    { href: `/${locale}/plans`, label: t.nav.plans, active: isPlans, Icon: PlansIcon },
    { href: `/${locale}/cart`, label: t.nav.cart, active: isCart, Icon: CartIcon },
    { href: `/${locale}/settings`, label: t.nav.settings, active: isSettings, Icon: SettingsIcon },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-md">
        {tabs.map(({ href, label, active, Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
              active
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            }`}
          >
            <Icon active={active} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
