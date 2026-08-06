import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Wallet } from 'lucide-react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { AddressCard } from '@/components/features/addresses/AddressCard';
import { AddressForm } from '@/components/features/addresses/AddressForm';
import { OrderTotals } from '@/components/features/orders/OrderTotals';
import { useCart } from '@/hooks/useCart';
import { useAddresses } from '@/hooks/useAddresses';
import { useCreateAddress } from '@/hooks/useAddressMutations';
import { useCheckout } from '@/hooks/useOrderMutations';
import { formatCurrency } from '@/utils/format';
import type { AddressFormSchemaValues } from '@/utils/addressValidation';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, summary } = useCart();
  const { data: addresses, isLoading, isError, refetch } = useAddresses();
  const createAddress = useCreateAddress();
  const checkout = useCheckout();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  useEffect(() => {
    if (!addresses || addresses.length === 0) return;
    if (selectedAddressId && addresses.some((address) => address.id === selectedAddressId)) return;
    const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0];
    setSelectedAddressId(defaultAddress.id);
  }, [addresses, selectedAddressId]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState title="Your cart is empty" description="Add items to your cart before checking out." />
      </div>
    );
  }

  const handleAddAddress = async (values: AddressFormSchemaValues) => {
    const address = await createAddress.mutateAsync(values);
    setSelectedAddressId(address.id);
    setIsAddingAddress(false);
  };

  const handlePlaceOrder = () => {
    if (!selectedAddressId) return;
    checkout.mutate(
      { addressId: selectedAddressId, paymentMethod: 'cod' },
      { onSuccess: (order) => navigate(`/orders/${order.id}`, { replace: true }) }
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="mt-2 text-2xl font-semibold text-text-primary">Checkout</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-text-primary">Shipping address</h2>
              {addresses && addresses.length > 0 && !isAddingAddress && (
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(true)}
                  className="text-sm font-medium text-brand-primary hover:underline"
                >
                  + Add new address
                </button>
              )}
            </div>

            <div className="mt-3">
              {isError ? (
                <ErrorState onRetry={() => refetch()} />
              ) : isLoading ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : isAddingAddress || !addresses || addresses.length === 0 ? (
                <div className="rounded-xl border border-surface-border bg-white p-4">
                  <AddressForm
                    onSubmit={handleAddAddress}
                    onCancel={addresses && addresses.length > 0 ? () => setIsAddingAddress(false) : undefined}
                    isSubmitting={createAddress.isPending}
                    submitLabel="Save and use this address"
                  />
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {addresses.map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      selectable
                      isSelected={selectedAddressId === address.id}
                      onSelect={() => setSelectedAddressId(address.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-primary">Payment method</h2>
            <div className="mt-3 flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-brand-primary bg-brand-accent/40 p-4">
                <Wallet className="h-5 w-5 text-brand-primary" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Cash on Delivery</p>
                  <p className="text-xs text-text-secondary">Pay when your order arrives.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-surface-border p-4 opacity-60">
                <CreditCard className="h-5 w-5 text-text-muted" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Credit / Debit Card &middot; Razorpay</p>
                  <p className="text-xs text-text-secondary">Coming soon.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="flex h-fit flex-col gap-4 rounded-xl border border-surface-border bg-white p-4">
          <h2 className="text-base font-semibold text-text-primary">Order summary</h2>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-card text-xs text-text-secondary">
                    {item.quantity}
                  </span>
                  <span className="line-clamp-1 text-text-primary">{item.product.name}</span>
                </div>
                <span className="shrink-0 text-text-secondary">
                  {formatCurrency(item.product.finalPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <OrderTotals subtotal={summary.subtotal} shippingFee={0} total={summary.subtotal} />

          <Button
            onClick={handlePlaceOrder}
            disabled={!selectedAddressId}
            isLoading={checkout.isPending}
            className="w-full"
          >
            <Truck className="h-4 w-4" aria-hidden="true" />
            Place order
          </Button>
        </div>
      </div>
    </div>
  );
}
