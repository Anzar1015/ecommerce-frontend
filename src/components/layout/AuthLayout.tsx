import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-md rounded-xl border border-surface-border bg-white p-8 shadow-card"
      >
        <Link to="/" className="mb-6 flex items-center gap-2 text-brand-primary">
          <ShoppingBag className="h-6 w-6" aria-hidden="true" />
          <span className="text-lg font-semibold">YourStore</span>
        </Link>

        <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
        <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>

        <div className="mt-6">{children}</div>
      </motion.div>
    </div>
  );
}
