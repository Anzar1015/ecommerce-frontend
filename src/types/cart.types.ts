/** Normalized cart line item used throughout the app, regardless of whether
 * it originated from the server (logged-in) or localStorage (guest). */
export interface CartProductSnapshot {
  id: string;
  name: string;
  slug: string;
  image?: string;
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: CartProductSnapshot;
}

export interface CartSummary {
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
}

/** Shape persisted to localStorage for guest carts — intentionally minimal. */
export interface GuestCartItem {
  productId: string;
  quantity: number;
  product: CartProductSnapshot;
}

// --- Raw API response shapes (server/logged-in cart) ---

export interface CartApiProduct {
  id: string;
  name: string;
  slug: string;
  images: { url: string; publicId: string }[];
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  status: string;
}

export interface CartApiItem {
  product: CartApiProduct;
  quantity: number;
}

export interface CartApiResponse {
  cart: {
    id: string;
    items: CartApiItem[];
    createdAt: string;
    updatedAt: string;
  };
  summary: CartSummary;
}
