import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCw, ShieldCheck, ShoppingBag, Sparkles, Star, Truck } from 'lucide-react';

const badges = [
  { icon: Truck, label: 'Free Shipping' },
  { icon: ShieldCheck, label: '100% Authentic' },
  { icon: RefreshCw, label: 'Easy Returns' },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-start gap-6"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent px-3 py-1 text-xs font-medium text-brand-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            New season arrivals
          </span>

          <h1 className="text-4xl font-bold leading-tight text-brand-primary sm:text-5xl lg:text-6xl">
            Elevate your
            <br />
            everyday style
          </h1>

          <p className="max-w-md text-base text-brand-primary/80 sm:text-lg">
            Discover premium products curated for quality and design — shipped fast, backed by a
            hassle-free guarantee.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/shop"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand-primary px-6 text-base font-medium text-white transition-colors hover:bg-brand-primary-hover"
            >
              Shop Now
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/categories"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-brand-primary/30 px-6 text-base font-medium text-brand-primary transition-colors hover:bg-brand-accent"
            >
              Explore Collections
            </Link>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-4 sm:gap-6">
            {badges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-brand-primary/80">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="relative mx-auto hidden w-full max-w-md lg:block"
        >
          <div className="relative rounded-2xl border border-surface-border bg-white p-6 shadow-card">
            <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl bg-surface-card">
              <div className="absolute h-40 w-40 rounded-full bg-brand-accent" aria-hidden="true" />
              <ShoppingBag className="relative h-16 w-16 text-brand-primary" aria-hidden="true" strokeWidth={1.5} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
              </div>
              <span className="rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white">
                New
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="absolute -bottom-6 -left-8 flex items-center gap-3 rounded-xl border border-surface-border bg-white p-4 shadow-card"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-semantic-warning/10 text-semantic-warning">
              <Star className="h-5 w-5 fill-semantic-warning" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">4.9/5 Rating</p>
              <p className="text-xs text-text-muted">From 10k+ customers</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
