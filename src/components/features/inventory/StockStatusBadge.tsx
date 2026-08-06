import { Badge } from '@/components/ui/Badge';
import { STOCK_STATUS_LABELS } from '@/constants';
import type { StockStatus } from '@/types/inventory.types';

const STATUS_VARIANT: Record<StockStatus, 'success' | 'warning' | 'error'> = {
  in_stock: 'success',
  low_stock: 'warning',
  out_of_stock: 'error',
};

interface StockStatusBadgeProps {
  status: StockStatus;
}

export function StockStatusBadge({ status }: StockStatusBadgeProps) {
  return <Badge variant={STATUS_VARIANT[status]}>{STOCK_STATUS_LABELS[status]}</Badge>;
}
