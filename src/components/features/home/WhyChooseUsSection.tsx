import { motion } from 'framer-motion';
import { Gem, Headphones, RefreshCw, ShieldCheck, Truck, Zap } from 'lucide-react';

const features = [
  { icon: Truck, title: 'Free Shipping', description: 'On all orders over $50, delivered to your door.' },
  { icon: ShieldCheck, title: 'Secure Payments', description: 'Your transactions are encrypted and protected.' },
  { icon: RefreshCw, title: 'Easy Returns', description: '30-day hassle-free returns on every order.' },
  { icon: Headphones, title: '24x7 Support', description: 'Our team is here to help around the clock.' },
  { icon: Gem, title: 'Premium Quality', description: 'Every product is vetted for lasting quality.' },
  { icon: Zap, title: 'Fast Delivery', description: 'Get your orders faster with express shipping.' },
];

export function WhyChooseUsSection() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-text-primary sm:text-3xl">Why Choose Us</h2>
          <p className="mx-auto mt-1 max-w-xl text-sm text-text-secondary">
            A shopping experience built around trust, speed, and quality.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex flex-col items-start gap-3 rounded-xl border border-surface-border bg-white p-6 transition-shadow hover:shadow-card"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-accent text-brand-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-text-primary">{title}</h3>
              <p className="text-sm text-text-secondary">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
