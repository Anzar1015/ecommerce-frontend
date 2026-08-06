import { Link } from 'react-router-dom';
import {
  DollarSign,
  CalendarDays,
  Wallet,
  ShoppingCart,
  Package,
  Users,
  Boxes,
  AlertTriangle,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { StatCard } from '@/components/features/dashboard/StatCard';
import { RecentOrdersTable } from '@/components/features/dashboard/RecentOrdersTable';
import { QuickActions } from '@/components/features/dashboard/QuickActions';
import { useDashboardSummary } from '@/hooks/useDashboard';
import { formatCurrency } from '@/utils/format';

export default function AdminDashboard() {
  const { data, isLoading, isError, refetch } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState title="Couldn't load dashboard" onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
        <QuickActions />
      </div>

      {/* Revenue cards */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-text-secondary">Revenue</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={DollarSign}
            label="Total revenue"
            value={formatCurrency(data.revenue.totalRevenue)}
            helperText={`${data.revenue.paidOrderCount} paid orders`}
            accent="success"
          />
          <StatCard
            icon={Wallet}
            label="Today's revenue"
            value={formatCurrency(data.revenue.todayRevenue)}
            accent="primary"
          />
          <StatCard
            icon={CalendarDays}
            label="This month"
            value={formatCurrency(data.revenue.monthRevenue)}
            accent="info"
          />
        </div>
      </div>

      {/* Sales summary */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-text-secondary">Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={ShoppingCart}
            label="Orders"
            value={data.orders.total}
            helperText={`${data.orders.byStatus.pending} pending`}
            accent="primary"
          />
          <StatCard
            icon={Package}
            label="Products"
            value={data.products.total}
            helperText={`${data.products.active} active`}
            accent="info"
          />
          <StatCard
            icon={Users}
            label="Customers"
            value={data.customers.total}
            helperText={`+${data.customers.newThisMonth} this month`}
            accent="success"
          />
          <StatCard
            icon={data.inventory.lowStock + data.inventory.outOfStock > 0 ? AlertTriangle : Boxes}
            label="Inventory"
            value={data.inventory.totalStockUnits}
            helperText={`${data.inventory.lowStock} low · ${data.inventory.outOfStock} out of stock`}
            accent={data.inventory.outOfStock > 0 ? 'error' : data.inventory.lowStock > 0 ? 'warning' : 'success'}
          />
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-secondary">Recent orders</h2>
          <Link to="/admin/orders" className="text-sm font-medium text-brand-primary hover:underline">
            View all
          </Link>
        </div>
        <RecentOrdersTable orders={data.recentOrders} />
      </div>
    </div>
  );
}
