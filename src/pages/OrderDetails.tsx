import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { OrderStatusBadge } from '@/components/features/orders/OrderStatusBadge';
import { OrderStatusTimeline } from '@/components/features/orders/OrderStatusTimeline';
import { OrderItemsList } from '@/components/features/orders/OrderItemsList';
import { OrderTotals } from '@/components/features/orders/OrderTotals';
import { useMyOrderDetails } from '@/hooks/useOrders';
import { useCancelOrder } from '@/hooks/useOrderMutations';
import { PAYMENT_METHOD_LABELS } from '@/constants';
import type { OrderStatus } from '@/types/order.types';

const CANCELLABLE_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'packed', 'shipped'];

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError, refetch } = useMyOrderDetails(id);
  const cancelOrder = useCancelOrder();
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState title="Order not found" description="This order may not exist." onRetry={() => refetch()} />
      </div>
    );
  }

  const canCancel = CANCELLABLE_STATUSES.includes(order.status);

  const handleCancel = async () => {
    await cancelOrder.mutateAsync({ id: order.id });
    setIsCancelOpen(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 print:py-0">
      <div className="print:hidden">
        <Breadcrumb items={[{ label: 'Orders', to: '/orders' }, { label: order.orderNumber }]} />
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">{order.orderNumber}</h1>
          <p className="text-sm text-text-secondary">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <OrderStatusBadge status={order.status} />
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print invoice
          </Button>
          {canCancel && (
            <Button variant="outline" size="sm" onClick={() => setIsCancelOpen(true)}>
              Cancel order
            </Button>
          )}
        </div>
        <div className="hidden print:block">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-surface-border bg-white p-4 print:hidden">
        <OrderStatusTimeline status={order.status} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px] print:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-text-primary">Items</h2>
          <OrderItemsList items={order.items} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-white p-4">
            <h2 className="text-sm font-semibold text-text-primary">Shipping address</h2>
            <p className="mt-2 text-sm text-text-secondary">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
              <br />
              {order.shippingAddress.phone}
            </p>
          </div>

          <div className="rounded-xl border border-surface-border bg-white p-4">
            <h2 className="text-sm font-semibold text-text-primary">Payment</h2>
            <p className="mt-2 text-sm text-text-secondary">
              {PAYMENT_METHOD_LABELS[order.payment.method] ?? order.payment.method} &middot;{' '}
              {order.payment.status === 'paid' ? 'Paid' : 'Payment pending'}
            </p>
          </div>

          <div className="rounded-xl border border-surface-border bg-white p-4">
            <OrderTotals subtotal={order.subtotal} shippingFee={order.shippingFee} total={order.total} />
          </div>
        </div>
      </div>

      <Modal isOpen={isCancelOpen} onClose={() => setIsCancelOpen(false)} title="Cancel order" size="sm">
        <p className="text-sm text-text-secondary">
          Are you sure you want to cancel this order? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsCancelOpen(false)}>
            Keep order
          </Button>
          <Button variant="danger" isLoading={cancelOrder.isPending} onClick={handleCancel}>
            Cancel order
          </Button>
        </div>
      </Modal>
    </div>
  );
}
