import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/Table';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Pagination } from '@/components/common/Pagination';
import { SearchBar } from '@/components/common/SearchBar';
import { OrderStatusBadge } from '@/components/features/orders/OrderStatusBadge';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { formatCurrency } from '@/utils/format';
import { ADMIN_ORDER_STATUS_OPTIONS } from '@/constants';
import type { OrderStatus } from '@/types/order.types';

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, refetch } = useAdminOrders({
    page,
    limit: 20,
    status: status || undefined,
    search: search || undefined,
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">Orders</h1>

      <div className="flex flex-wrap gap-4">
        <div className="max-w-xs flex-1">
          <SearchBar
            placeholder="Search order number…"
            onSearch={(query) => {
              setSearch(query);
              setPage(1);
            }}
          />
        </div>
        <div className="max-w-xs">
          <Select
            label="Status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as OrderStatus | '');
              setPage(1);
            }}
            options={[{ value: '', label: 'All statuses' }, ...ADMIN_ORDER_STATUS_OPTIONS]}
          />
        </div>
      </div>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : !data || data.orders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="Orders will appear here once customers start checking out."
        />
      ) : (
        <>
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
              {data.orders.map((order) => {
                const customer = typeof order.user === 'string' ? null : order.user;
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="font-medium text-brand-primary hover:underline"
                      >
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
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
