import { Badge } from '@/components/ui/Badge';
import { ORDER_STATUS_LABELS } from '@/constants';
import type { OrderStatus } from '@/types/order.types';

const STATUS_VARIANT: Record<OrderStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  pending: 'warning',
  confirmed: 'info',
  packed: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return <Badge variant={STATUS_VARIANT[status]}>{ORDER_STATUS_LABELS[status]}</Badge>;
}
