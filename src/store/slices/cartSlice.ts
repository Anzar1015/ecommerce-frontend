import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cartApi } from '@/services/cart.service';
import { loadGuestCart, saveGuestCart, clearGuestCart } from '@/utils/cartStorage';
import { extractErrorMessage } from '@/utils/errors';
import type { RootState } from '../store';
import type { CartApiItem, CartItem, CartProductSnapshot, CartSummary } from '@/types/cart.types';

interface CartState {
  items: CartItem[];
  summary: CartSummary;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

function computeSummary(items: CartItem[]): CartSummary {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.finalPrice * item.quantity, 0);
  return { totalItems: items.length, totalQuantity, subtotal: Math.round(subtotal * 100) / 100 };
}

export function apiItemToCartItem(apiItem: CartApiItem): CartItem {
  return {
    productId: apiItem.product.id,
    quantity: apiItem.quantity,
    product: {
      id: apiItem.product.id,
      name: apiItem.product.name,
      slug: apiItem.product.slug,
      image: apiItem.product.images[0]?.url,
      price: apiItem.product.price,
      discount: apiItem.product.discount,
      finalPrice: apiItem.product.finalPrice,
      stock: apiItem.product.stock,
    },
  };
}

function isAuthenticated(state: RootState): boolean {
  return state.auth.status === 'authenticated';
}

const initialGuestItems = loadGuestCart();

const initialState: CartState = {
  items: initialGuestItems,
  summary: computeSummary(initialGuestItems),
  status: 'idle',
  error: null,
};

/** Loads the cart: from the server if logged in, from localStorage otherwise. */
export const fetchCart = createAsyncThunk('cart/fetch', async (_: void, { getState, rejectWithValue }) => {
  const state = getState() as RootState;
  if (!isAuthenticated(state)) return loadGuestCart();

  try {
    const { cart } = await cartApi.getCart();
    return cart.items.map(apiItemToCartItem);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async (payload: { product: CartProductSnapshot; quantity: number }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;

    if (isAuthenticated(state)) {
      try {
        const { cart } = await cartApi.addItem(payload.product.id, payload.quantity);
        return cart.items.map(apiItemToCartItem);
      } catch (error) {
        return rejectWithValue(extractErrorMessage(error));
      }
    }

    const current = state.cart.items;
    const existing = current.find((item) => item.productId === payload.product.id);
    const next: CartItem[] = existing
      ? current.map((item) =>
          item.productId === payload.product.id
            ? {
                ...item,
                product: payload.product,
                quantity: Math.min(item.quantity + payload.quantity, payload.product.stock),
              }
            : item
        )
      : [
          ...current,
          {
            productId: payload.product.id,
            quantity: Math.min(payload.quantity, payload.product.stock),
            product: payload.product,
          },
        ];

    saveGuestCart(next);
    return next;
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateItem',
  async (payload: { productId: string; quantity: number }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;

    if (isAuthenticated(state)) {
      try {
        const { cart } = await cartApi.updateItem(payload.productId, payload.quantity);
        return cart.items.map(apiItemToCartItem);
      } catch (error) {
        return rejectWithValue(extractErrorMessage(error));
      }
    }

    const current = state.cart.items;
    const next =
      payload.quantity <= 0
        ? current.filter((item) => item.productId !== payload.productId)
        : current.map((item) =>
            item.productId === payload.productId ? { ...item, quantity: payload.quantity } : item
          );

    saveGuestCart(next);
    return next;
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (productId: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;

    if (isAuthenticated(state)) {
      try {
        const { cart } = await cartApi.removeItem(productId);
        return cart.items.map(apiItemToCartItem);
      } catch (error) {
        return rejectWithValue(extractErrorMessage(error));
      }
    }

    const next = state.cart.items.filter((item) => item.productId !== productId);
    saveGuestCart(next);
    return next;
  }
);

/** Called once right after a session becomes authenticated: merges any
 * guest-cart items into the server cart, then clears local storage. */
export const mergeGuestCartOnLogin = createAsyncThunk(
  'cart/mergeOnLogin',
  async (_: void, { rejectWithValue }) => {
    const guestItems = loadGuestCart();

    try {
      if (guestItems.length === 0) {
        const { cart } = await cartApi.getCart();
        return cart.items.map(apiItemToCartItem);
      }

      const { cart } = await cartApi.merge(guestItems);
      clearGuestCart();
      return cart.items.map(apiItemToCartItem);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /** Lets other features (e.g. wishlist move-to-cart) sync the cart
     * from a response that already carries the updated items. */
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.summary = computeSummary(action.payload);
    },
    resetCart: (state) => {
      clearGuestCart();
      state.items = [];
      state.summary = computeSummary([]);
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state: CartState) => {
      state.status = 'loading';
      state.error = null;
    };
    const fulfilled = (state: CartState, action: PayloadAction<CartItem[]>) => {
      state.status = 'succeeded';
      state.items = action.payload;
      state.summary = computeSummary(action.payload);
    };
    const rejected = (state: CartState, action: { payload?: unknown }) => {
      state.status = 'failed';
      state.error = (action.payload as string) ?? 'Something went wrong';
    };

    builder
      .addCase(fetchCart.pending, pending)
      .addCase(fetchCart.fulfilled, fulfilled)
      .addCase(fetchCart.rejected, rejected)
      .addCase(addToCart.pending, pending)
      .addCase(addToCart.fulfilled, fulfilled)
      .addCase(addToCart.rejected, rejected)
      .addCase(updateCartItemQuantity.pending, pending)
      .addCase(updateCartItemQuantity.fulfilled, fulfilled)
      .addCase(updateCartItemQuantity.rejected, rejected)
      .addCase(removeFromCart.pending, pending)
      .addCase(removeFromCart.fulfilled, fulfilled)
      .addCase(removeFromCart.rejected, rejected)
      .addCase(mergeGuestCartOnLogin.pending, pending)
      .addCase(mergeGuestCartOnLogin.fulfilled, fulfilled)
      .addCase(mergeGuestCartOnLogin.rejected, rejected);
  },
});

export const { setCartItems, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
