import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import { CartItemRow } from './CartItemRow';
import { CartSummary } from './CartSummary';
import { useCart } from '@/hooks/useCart';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, summary, updateQuantity, removeItem } = useCart();

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Your Cart">
      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart className="h-6 w-6" aria-hidden="true" />}
          title="Your cart is empty"
          description="Browse the shop and add something you like."
        />
      ) : (
        <div className="flex flex-col">
          <div className="divide-y divide-surface-divider">
            {items.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                onUpdateQuantity={(quantity) => updateQuantity(item.productId, quantity)}
                onRemove={() => removeItem(item.productId)}
              />
            ))}
          </div>
          <CartSummary summary={summary} />
          <Link to="/cart" onClick={onClose} className="mt-4">
            <Button className="w-full">View cart</Button>
          </Link>
        </div>
      )}
    </Drawer>
  );
}
