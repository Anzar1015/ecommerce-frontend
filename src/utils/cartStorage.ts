import type { GuestCartItem } from '@/types/cart.types';

const STORAGE_KEY = 'guest_cart';

/** Guest carts (not logged in) live entirely in localStorage until the
 * user logs in, at which point they're merged into the server cart. */
export function loadGuestCart(): GuestCartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGuestCart(items: GuestCartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded) — fail silently.
  }
}

export function clearGuestCart(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
