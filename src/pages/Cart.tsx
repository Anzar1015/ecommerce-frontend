import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import { CartItemRow } from '@/components/features/cart/CartItemRow';
import { CartSummary } from '@/components/features/cart/CartSummary';
import { useCart } from '@/hooks/useCart';

export default function Cart() {
  const { items, summary, updateQuantity, removeItem } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Cart' }]} />
      <h1 className="mt-2 text-2xl font-semibold text-text-primary">Your Cart</h1>

      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<ShoppingBag className="h-6 w-6" aria-hidden="true" />}
            title="Your cart is empty"
            description="Browse the shop and add something you like."
            action={
              <Link to="/shop">
                <Button>Browse products</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="divide-y divide-surface-divider rounded-xl border border-surface-border bg-white px-4">
            {items.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                onUpdateQuantity={(quantity) => updateQuantity(item.productId, quantity)}
                onRemove={() => removeItem(item.productId)}
              />
            ))}
          </div>

          <div className="flex h-fit flex-col gap-4 rounded-xl border border-surface-border bg-white p-4">
            <CartSummary summary={summary} />
            <Link to="/checkout">
              <Button className="w-full">Proceed to checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
