import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold text-text-primary">Welcome to YourStore</h1>
      <p className="mt-2 text-text-secondary">
        Browse the catalog now — cart and checkout land in the next build steps.
      </p>

      <div className="mt-6 flex justify-center gap-3">
        <Link
          to="/shop"
          className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover"
        >
          Browse products
        </Link>
        <Link
          to="/categories"
          className="rounded-lg border border-surface-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-card"
        >
          Shop by category
        </Link>
      </div>

      {isAuthenticated ? (
        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-sm text-text-secondary">
            Signed in as <span className="font-medium text-text-primary">{user?.email}</span> (
            {user?.role})
          </p>
          <button
            onClick={() => logout()}
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover"
          >
            Log out
          </button>
        </div>
      ) : (
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/login" className="rounded-lg border border-surface-border px-4 py-2 text-sm font-medium">
            Log in
          </Link>
          <Link to="/register" className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white">
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
}
