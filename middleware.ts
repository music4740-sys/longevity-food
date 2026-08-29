import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALES } from "@/lib/i18n";

export function middleware(request: NextRequest) {
  const onboardingComplete = request.cookies.get("onboarding-complete")?.value === "1";
  if (onboardingComplete) {
    const saved = request.cookies.get("locale")?.value;
    const locale = (LOCALES as string[]).includes(saved ?? "") ? saved : "ko";
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }
  return NextResponse.redirect(new URL("/ko/onboarding", request.url));
}

export const config = {
  matcher: "/",
};
