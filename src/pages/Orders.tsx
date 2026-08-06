import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/common/Pagination';
import { OrderStatusBadge } from '@/components/features/orders/OrderStatusBadge';
import { useMyOrders } from '@/hooks/useOrders';
import { formatCurrency } from '@/utils/format';

export default function Orders() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useMyOrders({ page, limit: 10 });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Orders' }]} />
      <h1 className="mt-2 text-2xl font-semibold text-text-primary">My Orders</h1>

      <div className="mt-6 flex flex-col gap-4">
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : isLoading ? (
          Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-24 w-full" />)
        ) : !data || data.orders.length === 0 ? (
          <EmptyState
            icon={<Package className="h-6 w-6" aria-hidden="true" />}
            title="No orders yet"
            description="Your placed orders will show up here."
          />
        ) : (
          <>
            {data.orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="flex flex-col gap-2 rounded-xl border border-surface-border bg-white p-4 transition-shadow hover:shadow-card sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-text-primary">{order.orderNumber}</p>
                  <p className="text-xs text-text-muted">
                    {new Date(order.createdAt).toLocaleDateString()} &middot; {order.items.length} item
                    {order.items.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-text-primary">{formatCurrency(order.total)}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))}
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
