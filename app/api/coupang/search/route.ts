import { NextRequest, NextResponse } from "next/server";
import { isCoupangConfigured, searchCoupangProduct } from "@/lib/coupang";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isCoupangConfigured()) {
    return NextResponse.json({ configured: false, product: null }, { status: 501 });
  }

  const keyword = request.nextUrl.searchParams.get("keyword")?.trim();
  if (!keyword) {
    return NextResponse.json({ error: "keyword is required" }, { status: 400 });
  }

  const product = await searchCoupangProduct(keyword);
  return NextResponse.json({ configured: true, product });
}
