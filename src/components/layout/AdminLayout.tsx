import { Link, Outlet } from 'react-router-dom';
import { LogOut, ShoppingBag } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/hooks/useAuth';

export function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-surface-border bg-white px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-brand-primary">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <span className="text-base font-semibold">YourStore Admin</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">{user?.name}</span>
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-card"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
