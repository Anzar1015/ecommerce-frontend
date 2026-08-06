import type { Order, OrderStatus } from './order.types';
import type { InventorySummary } from './inventory.types';

export type OrderStatusCounts = Record<OrderStatus, number>;

export interface RevenueSummary {
  totalRevenue: number;
  todayRevenue: number;
  monthRevenue: number;
  paidOrderCount: number;
}

export interface ProductStatusCounts {
  total: number;
  active: number;
  draft: number;
  archived: number;
}

export interface DashboardSummary {
  revenue: RevenueSummary;
  orders: { total: number; byStatus: OrderStatusCounts };
  products: ProductStatusCounts;
  customers: { total: number; newThisMonth: number };
  inventory: InventorySummary;
  recentOrders: Order[];
}
