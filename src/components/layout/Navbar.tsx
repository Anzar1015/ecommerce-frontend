import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Package,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { SearchBar } from '@/components/common/SearchBar';
import { CartDrawer } from '@/components/features/cart/CartDrawer';
import { cn } from '@/utils/cn';

const navLinks = [
  { to: '/shop', label: 'Shop' },
  { to: '/categories', label: 'Categories' },
];

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { summary } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (query: string) => {
    if (!query) return;
    navigate(`/search?search=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    if (!isAccountMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccountMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-surface-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-brand-primary">
          <ShoppingBag className="h-6 w-6" aria-hidden="true" />
          <span className="text-lg font-semibold">YourStore</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium text-text-secondary hover:text-brand-primary',
                  isActive && 'text-brand-primary'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden flex-1 md:block md:max-w-sm">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          {isAuthenticated && (
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="rounded-lg p-2 text-text-secondary hover:bg-surface-card hover:text-brand-primary"
            >
              <Heart className="h-5 w-5" aria-hidden="true" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open cart"
            className="relative rounded-lg p-2 text-text-secondary hover:bg-surface-card hover:text-brand-primary"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {summary.totalQuantity > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-medium text-white">
                {summary.totalQuantity}
              </span>
            )}
          </button>

          {user?.role === 'admin' && (
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-brand-primary"
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Admin
            </Link>
          )}

          {isAuthenticated ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((open) => !open)}
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-card"
              >
                <User className="h-4 w-4" aria-hidden="true" />
                {user?.name?.split(' ')[0] ?? 'Account'}
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>

              {isAccountMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-surface-border bg-white py-1 shadow-card"
                >
                  <Link
                    to="/orders"
                    role="menuitem"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-card hover:text-text-primary"
                  >
                    <Package className="h-4 w-4" aria-hidden="true" />
                    My Orders
                  </Link>
                  <Link
                    to="/addresses"
                    role="menuitem"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-card hover:text-text-primary"
                  >
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    Addresses
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      logout();
                      setIsAccountMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-text-secondary hover:bg-surface-card hover:text-text-primary"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg border border-surface-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-card"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          aria-label="Open cart"
          className="relative ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg text-text-primary md:hidden"
        >
          <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          {summary.totalQuantity > 0 && (
            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-medium text-white">
              {summary.totalQuantity}
            </span>
          )}
        </button>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-text-primary md:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-surface-border bg-white md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-4">
              <SearchBar onSearch={(q) => { handleSearch(q); setIsMobileMenuOpen(false); }} />
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-text-secondary hover:text-brand-primary"
                >
                  {link.label}
                </NavLink>
              ))}
              {isAuthenticated && (
                <>
                  <Link
                    to="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-medium text-text-secondary hover:text-brand-primary"
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-medium text-text-secondary hover:text-brand-primary"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/addresses"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-medium text-text-secondary hover:text-brand-primary"
                  >
                    Addresses
                  </Link>
                </>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-text-secondary hover:text-brand-primary"
                >
                  Admin dashboard
                </Link>
              )}
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-sm font-medium text-text-secondary hover:text-brand-primary"
                >
                  Log out
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 rounded-lg border border-surface-border px-4 py-2 text-center text-sm font-medium text-text-primary"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 rounded-lg bg-brand-primary px-4 py-2 text-center text-sm font-medium text-white"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
