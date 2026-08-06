import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-border bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link to="/" className="flex items-center gap-2 text-brand-primary">
              <ShoppingBag className="h-6 w-6" aria-hidden="true" />
              <span className="text-lg font-semibold">YourStore</span>
            </Link>
            <p className="mt-2 max-w-xs text-sm text-text-secondary">
              Premium products, honest prices, and a shopping experience built to last.
            </p>
          </div>

          <nav aria-label="Footer">
            <h3 className="text-sm font-semibold text-text-primary">Shop</h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-text-secondary">
              <li>
                <Link to="/shop" className="hover:text-brand-primary">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-brand-primary">
                  Categories
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-surface-divider pt-6 text-sm text-text-muted">
          &copy; {year} YourStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
