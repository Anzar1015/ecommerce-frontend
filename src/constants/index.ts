export const CURRENCY = 'INR';
export const DEFAULT_PAGE_SIZE = 12;

export const PRODUCT_SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popularity', label: 'Popularity' },
];

export const RATING_FILTER_OPTIONS = [4, 3, 2, 1] as const;

export const PRODUCT_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

export const ORDER_STATUS_SEQUENCE = [
  'pending',
  'confirmed',
  'packed',
  'shipped',
  'out_for_delivery',
  'delivered',
] as const;

// 'pending' reads as "Order Placed" to match spec 13.4's naming, while
// keeping the underlying value ('pending') unchanged everywhere else.
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ADMIN_ORDER_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'pending', label: 'Order Placed' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'packed', label: 'Packed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const SHIPPING_METHOD_LABELS: Record<string, string> = {
  standard: 'Standard Delivery',
  express: 'Express Delivery',
};

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
