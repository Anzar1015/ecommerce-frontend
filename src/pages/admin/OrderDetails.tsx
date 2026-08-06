import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { OrderStatusBadge } from '@/components/features/orders/OrderStatusBadge';
import { OrderStatusTimeline } from '@/components/features/orders/OrderStatusTimeline';
import { OrderItemsList } from '@/components/features/orders/OrderItemsList';
import { OrderTotals } from '@/components/features/orders/OrderTotals';
import { useAdminOrderDetails } from '@/hooks/useAdminOrders';
import { useUpdateOrderStatus } from '@/hooks/useAdminOrderMutations';
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '@/constants';
import type { OrderStatus } from '@/types/order.types';

const ORDER_STATUS_SEQUENCE: OrderStatus[] = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];
const CANCELLABLE_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'packed', 'shipped'];

function getNextStatusOptions(current: OrderStatus): OrderStatus[] {
  const options: OrderStatus[] = [];
  const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(current);
  if (currentIndex !== -1 && currentIndex < ORDER_STATUS_SEQUENCE.length - 1) {
    options.push(ORDER_STATUS_SEQUENCE[currentIndex + 1]);
  }
  if (CANCELLABLE_STATUSES.includes(current)) options.push('cancelled');
  return options;
}

export default function AdminOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError, refetch } = useAdminOrderDetails(id);
  const updateStatus = useUpdateOrderStatus();
  const [nextStatus, setNextStatus] = useState<OrderStatus | ''>('');
  const [note, setNote] = useState('');

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (isError || !order) {
    return <ErrorState title="Order not found" onRetry={() => refetch()} />;
  }

  const nextOptions = getNextStatusOptions(order.status);
  const customer = typeof order.user === 'string' ? null : order.user;

  const handleUpdate = async () => {
    if (!nextStatus) return;
    await updateStatus.mutateAsync({ id: order.id, status: nextStatus, note: note || undefined });
    setNextStatus('');
    setNote('');
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: 'Orders', to: '/admin/orders' }, { label: order.orderNumber }]} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">{order.orderNumber}</h1>
          <p className="text-sm text-text-secondary">
            {customer ? `${customer.name} · ${customer.email}` : 'Customer'} &middot;{' '}
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="rounded-xl border border-surface-border bg-white p-4">
        <OrderStatusTimeline status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
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

          {nextOptions.length > 0 && (
            <div className="flex flex-col gap-3 rounded-xl border border-surface-border bg-white p-4">
              <h2 className="text-sm font-semibold text-text-primary">Update status</h2>
              <Select
                label="New status"
                placeholder="Select next status"
                value={nextStatus}
                onChange={(event) => setNextStatus(event.target.value as OrderStatus)}
                options={nextOptions.map((option) => ({ value: option, label: ORDER_STATUS_LABELS[option] }))}
              />
              <Textarea
                label="Note (optional)"
                rows={2}
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
              <Button onClick={handleUpdate} disabled={!nextStatus} isLoading={updateStatus.isPending}>
                Update order
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
