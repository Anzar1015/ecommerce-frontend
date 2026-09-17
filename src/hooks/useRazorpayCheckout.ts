import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { loadRazorpayScript } from '@/utils/loadRazorpayScript';
import { useRazorpayConfig, useVerifyPayment } from './usePaymentMutations';
import type { Order } from '@/types/order.types';

interface OpenCheckoutOptions {
  onVerified?: (order: Order) => void;
  onDismiss?: () => void;
}

/** Opens the Razorpay Checkout modal for an order that already has a
 * `razorpayOrderId` (set by checkout or retry-payment), and routes the
 * result through signature verification. Shared by the checkout flow and
 * the "retry payment" flow on an existing order. */
export function useRazorpayCheckout() {
  const { data: config } = useRazorpayConfig();
  const verifyPayment = useVerifyPayment();

  const openCheckout = useCallback(
    async (order: Order, options: OpenCheckoutOptions = {}) => {
      if (!order.payment.razorpayOrderId || !config?.razorpayKeyId) {
        toast.error('Payment could not be started. Please try again.');
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        toast.error('Could not load the payment gateway. Check your connection and try again.');
        return;
      }

      const checkout = new window.Razorpay({
        key: config.razorpayKeyId,
        amount: Math.round(order.total * 100),
        currency: 'INR',
        name: 'YourStore',
        description: `Order ${order.orderNumber}`,
        order_id: order.payment.razorpayOrderId,
        theme: { color: '#2563EB' },
        handler: (response) => {
          verifyPayment.mutate(
            { orderId: order.id, payload: response },
            { onSuccess: (updatedOrder) => options.onVerified?.(updatedOrder) }
          );
        },
        modal: {
          ondismiss: () => options.onDismiss?.(),
        },
      });

      checkout.open();
    },
    [config, verifyPayment]
  );

  return { openCheckout, isVerifying: verifyPayment.isPending };
}
