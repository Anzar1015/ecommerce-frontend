import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Tag } from 'lucide-react';

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-secondary to-brand-primary px-8 py-12 sm:px-12 sm:py-16"
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
              <Tag className="h-3.5 w-3.5" aria-hidden="true" />
              Limited-time offer
            </span>
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              Seasonal Sale — Save up to 40%
            </h2>
            <p className="mt-2 text-sm text-white/80 sm:text-base">
              Refresh your collection with premium picks at prices you won't find anywhere else.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex h-12 flex-shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-6 text-base font-medium text-brand-primary transition-colors hover:bg-white/90"
          >
            Shop the Sale
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
