export interface CartItem {
  recipeId: string;
  /** Ingredient.name.en — unique within a recipe */
  ingredientName: string;
  purchased: boolean;
}

const CART_STORAGE_KEY = "longevity-food-cart";

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — fail silently.
  }
}

export function addToCart(recipeId: string, ingredientNames: string[]): CartItem[] {
  const current = loadCart();
  const existingKeys = new Set(current.map((item) => `${item.recipeId}:${item.ingredientName}`));
  const additions = ingredientNames
    .filter((name) => !existingKeys.has(`${recipeId}:${name}`))
    .map((name): CartItem => ({ recipeId, ingredientName: name, purchased: false }));
  const next = [...current, ...additions];
  saveCart(next);
  return next;
}

export function setPurchased(recipeId: string, ingredientName: string, purchased: boolean): CartItem[] {
  const current = loadCart();
  const next = current.map((item) =>
    item.recipeId === recipeId && item.ingredientName === ingredientName
      ? { ...item, purchased }
      : item,
  );
  saveCart(next);
  return next;
}

export function removeFromCart(recipeId: string, ingredientName: string): CartItem[] {
  const current = loadCart();
  const next = current.filter(
    (item) => !(item.recipeId === recipeId && item.ingredientName === ingredientName),
  );
  saveCart(next);
  return next;
}

export function clearCart(): CartItem[] {
  saveCart([]);
  return [];
}
