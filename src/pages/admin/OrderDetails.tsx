import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { OrderStatusBadge } from '@/components/features/orders/OrderStatusBadge';
import { OrderStatusTimeline } from '@/components/features/orders/OrderStatusTimeline';
import { OrderItemsList } from '@/components/features/orders/OrderItemsList';
import { OrderTotals } from '@/components/features/orders/OrderTotals';
import { useAdminOrderDetails } from '@/hooks/useAdminOrders';
import { useUpdateOrderStatus, useUpdateOrderShipping } from '@/hooks/useAdminOrderMutations';
import { useRefundPayment } from '@/hooks/usePaymentMutations';
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS, SHIPPING_METHOD_LABELS } from '@/constants';
import { formatCurrency } from '@/utils/format';
import type { OrderStatus } from '@/types/order.types';

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Payment pending',
  paid: 'Paid',
  failed: 'Payment failed',
  refunded: 'Refunded',
  partially_refunded: 'Partially refunded',
};

const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  'pending',
  'confirmed',
  'packed',
  'shipped',
  'out_for_delivery',
  'delivered',
];
const CANCELLABLE_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery'];

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
  const updateShipping = useUpdateOrderShipping();
  const refundPayment = useRefundPayment();
  const [nextStatus, setNextStatus] = useState<OrderStatus | ''>('');
  const [note, setNote] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courier, setCourier] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    if (order) {
      setTrackingNumber(order.shipping.trackingNumber ?? '');
      setCourier(order.shipping.courier ?? '');
    }
  }, [order]);

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

  const handleSaveShipping = async () => {
    await updateShipping.mutateAsync({
      id: order.id,
      payload: { trackingNumber: trackingNumber.trim() || undefined, courier: courier.trim() || undefined },
    });
  };

  const refundedAmount = order.refunds.reduce((sum, refund) => sum + refund.amount, 0);
  const remainingRefundable = Math.round((order.total - refundedAmount) * 100) / 100;
  const canRefund =
    (order.payment.status === 'paid' || order.payment.status === 'partially_refunded') && remainingRefundable > 0;

  const handleRefund = async () => {
    const amount = refundAmount.trim() ? Number(refundAmount) : undefined;
    await refundPayment.mutateAsync({ orderId: order.id, amount, reason: refundReason.trim() || undefined });
    setRefundAmount('');
    setRefundReason('');
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
              {PAYMENT_STATUS_LABELS[order.payment.status] ?? order.payment.status}
            </p>
            {order.refunds.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1 border-t border-surface-divider pt-2 text-xs text-text-secondary">
                {order.refunds.map((refund) => (
                  <li key={refund.razorpayRefundId} className="flex items-center justify-between">
                    <span>
                      {new Date(refund.createdAt).toLocaleDateString()}
                      {refund.reason ? ` — ${refund.reason}` : ''}
                    </span>
                    <span className="font-medium text-text-primary">{formatCurrency(refund.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {canRefund && (
            <div className="flex flex-col gap-3 rounded-xl border border-surface-border bg-white p-4">
              <h2 className="text-sm font-semibold text-text-primary">Issue refund</h2>
              <Input
                label={`Amount (₹, optional — up to ${formatCurrency(remainingRefundable)})`}
                type="number"
                min={0}
                max={remainingRefundable}
                step="0.01"
                placeholder={`Full refund of ${formatCurrency(remainingRefundable)}`}
                value={refundAmount}
                onChange={(event) => setRefundAmount(event.target.value)}
              />
              <Textarea
                label="Reason (optional)"
                rows={2}
                value={refundReason}
                onChange={(event) => setRefundReason(event.target.value)}
              />
              <Button variant="danger" size="sm" onClick={handleRefund} isLoading={refundPayment.isPending}>
                Issue refund
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-3 rounded-xl border border-surface-border bg-white p-4">
            <h2 className="text-sm font-semibold text-text-primary">Shipping</h2>
            <p className="text-sm text-text-secondary">{SHIPPING_METHOD_LABELS[order.shipping.method]}</p>
            <Input
              label="Tracking number"
              placeholder="e.g. TRK123456789"
              value={trackingNumber}
              onChange={(event) => setTrackingNumber(event.target.value)}
            />
            <Input
              label="Courier"
              placeholder="e.g. BlueDart, Delhivery"
              value={courier}
              onChange={(event) => setCourier(event.target.value)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveShipping}
              isLoading={updateShipping.isPending}
            >
              Save shipping details
            </Button>
          </div>

          <div className="rounded-xl border border-surface-border bg-white p-4">
            <OrderTotals
              subtotal={order.subtotal}
              discount={order.discount}
              shippingFee={order.shippingFee}
              tax={order.tax}
              total={order.total}
              couponCode={order.coupon?.code}
            />
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
