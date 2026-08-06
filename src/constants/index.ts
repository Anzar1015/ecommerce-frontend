export const CURRENCY = 'USD';
export const DEFAULT_PAGE_SIZE = 12;

export const PRODUCT_SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
  { value: 'rating', label: 'Top Rated' },
];

export const PRODUCT_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

export const ORDER_STATUS_SEQUENCE = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ADMIN_ORDER_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'packed', label: 'Packed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: 'Cash on Delivery',
  stripe: 'Credit / Debit Card',
  razorpay: 'Razorpay',
};

export const STOCK_STATUS_LABELS: Record<string, string> = {
  in_stock: 'In stock',
  low_stock: 'Low stock',
  out_of_stock: 'Out of stock',
};
