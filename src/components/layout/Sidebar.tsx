import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Boxes,
  Settings,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarItem {
  label: string;
  to?: string;
  icon: LucideIcon;
}

const items: SidebarItem[] = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Categories', to: '/admin/categories', icon: FolderTree },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingCart },
  { label: 'Customers', icon: Users },
  { label: 'Inventory', to: '/admin/inventory', icon: Boxes },
  { label: 'Settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-surface-border bg-white md:block">
      <nav className="flex flex-col gap-1 p-4" aria-label="Admin">
        {items.map((item) => {
          const Icon = item.icon;

          if (!item.to) {
            return (
              <span
                key={item.label}
                aria-disabled="true"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-text-muted"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </span>
                <span className="rounded-full bg-surface-card px-2 py-0.5 text-xs">Soon</span>
              </span>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-card',
                  isActive && 'bg-brand-accent text-brand-primary hover:bg-brand-accent'
                )
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
