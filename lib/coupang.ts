import { createHmac } from "crypto";

const DOMAIN = "https://api-gateway.coupang.com";
const SEARCH_PATH = "/v2/providers/affiliate_open_api/apis/openapi/v1/products/search";

export interface CoupangProduct {
  productName: string;
  productImage: string;
  productPrice: number;
  productUrl: string;
  isFreeShipping: boolean;
}

export function isCoupangConfigured(): boolean {
  return Boolean(process.env.COUPANG_ACCESS_KEY && process.env.COUPANG_SECRET_KEY);
}

/** Coupang Partners' HMAC signing scheme: HMAC-SHA256 over `${signedDate}${method}${path}${query}`. */
function sign(method: string, pathWithQuery: string): string {
  const accessKey = process.env.COUPANG_ACCESS_KEY!;
  const secretKey = process.env.COUPANG_SECRET_KEY!;

  const signedDate = new Date()
    .toISOString()
    .replace(/[-:]|\.\d{3}/g, "")
    .slice(0, 15) + "Z";

  const [path, query = ""] = pathWithQuery.split("?");
  const message = `${signedDate}${method}${path}${query}`;
  const signature = createHmac("sha256", secretKey).update(message).digest("hex");

  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${signedDate}, signature=${signature}`;
}

/** Searches Coupang for `keyword` and returns the top match, already tagged with the partner link. */
export async function searchCoupangProduct(keyword: string): Promise<CoupangProduct | null> {
  const query = `keyword=${encodeURIComponent(keyword)}&limit=1`;
  const pathWithQuery = `${SEARCH_PATH}?${query}`;
  const authorization = sign("GET", pathWithQuery);

  const response = await fetch(`${DOMAIN}${pathWithQuery}`, {
    headers: { Authorization: authorization },
  });

  if (!response.ok) {
    return null;
  }

  const body = await response.json();
  const item = body?.data?.productData?.[0];
  if (!item) {
    return null;
  }

  return {
    productName: item.productName,
    productImage: item.productImage,
    productPrice: item.productPrice,
    productUrl: item.productUrl,
    isFreeShipping: Boolean(item.isFreeShipping),
  };
}
