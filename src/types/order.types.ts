export type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
// 'stripe' | 'razorpay' are reserved for when those providers go live on the backend.
export type PaymentMethod = 'cod' | 'stripe' | 'razorpay';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  product: string;
  name: string;
  image?: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  changedAt: string;
  note?: string;
}

export interface OrderPayment {
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string;
  providerReference?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  user: string | { id: string; name: string; email: string };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  payment: OrderPayment;
  subtotal: number;
  shippingFee: number;
  total: number;
  cancelledAt?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutPayload {
  addressId: string;
  paymentMethod?: PaymentMethod;
}

export interface OrderHistoryQueryParams {
  page?: number;
  limit?: number;
}

export interface AdminOrderQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
}
