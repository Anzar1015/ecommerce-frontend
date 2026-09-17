export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';
export type PaymentMethod = 'cod' | 'stripe' | 'razorpay';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
export type ShippingMethod = 'standard' | 'express';

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
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

export interface OrderRefund {
  amount: number;
  razorpayRefundId: string;
  reason?: string;
  createdAt: string;
}

export interface OrderCoupon {
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  discountAmount: number;
}

export interface OrderShipping {
  method: ShippingMethod;
  trackingNumber?: string;
  courier?: string;
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
  shipping: OrderShipping;
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  coupon?: OrderCoupon;
  refunds: OrderRefund[];
  cancelledAt?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutPayload {
  addressId: string;
  paymentMethod?: PaymentMethod;
  couponCode?: string;
  shippingMethod?: ShippingMethod;
}

export interface UpdateOrderShippingPayload {
  trackingNumber?: string;
  courier?: string;
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
