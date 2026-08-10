import type { ShippingMethod } from './order.types';

export interface ShippingMethodOption {
  method: ShippingMethod;
  label: string;
  estimatedDelivery: string;
  baseFee: number;
  /** Computed fee for the subtotal passed to the request; falls back to baseFee if no subtotal was given. */
  fee: number;
}

export interface ShippingMethodsResult {
  methods: ShippingMethodOption[];
  freeShippingThreshold: number;
}
