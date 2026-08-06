import { Link } from 'react-router-dom';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/Table';
import { EmptyState } from '@/components/common/EmptyState';
import { OrderStatusBadge } from '@/components/features/orders/OrderStatusBadge';
import { formatCurrency } from '@/utils/format';
import type { Order } from '@/types/order.types';

interface RecentOrdersTableProps {
  orders: Order[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  if (orders.length === 0) {
    return <EmptyState title="No orders yet" description="Recent orders will show up here." />;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Order</TableHeaderCell>
          <TableHeaderCell>Customer</TableHeaderCell>
          <TableHeaderCell>Total</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Placed</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.map((order) => {
          const customer = typeof order.user === 'string' ? null : order.user;
          return (
            <TableRow key={order.id}>
              <TableCell>
                <Link to={`/admin/orders/${order.id}`} className="font-medium text-brand-primary hover:underline">
                  {order.orderNumber}
                </Link>
              </TableCell>
              <TableCell>{customer?.name ?? '—'}</TableCell>
              <TableCell>{formatCurrency(order.total)}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
