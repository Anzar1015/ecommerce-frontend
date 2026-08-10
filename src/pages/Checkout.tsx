import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Tag, Truck, Wallet, X, Zap } from 'lucide-react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AddressCard } from '@/components/features/addresses/AddressCard';
import { AddressForm } from '@/components/features/addresses/AddressForm';
import { OrderTotals } from '@/components/features/orders/OrderTotals';
import { useCart } from '@/hooks/useCart';
import { useAddresses } from '@/hooks/useAddresses';
import { useCreateAddress } from '@/hooks/useAddressMutations';
import { useCheckout } from '@/hooks/useOrderMutations';
import { useValidateCoupon } from '@/hooks/useValidateCoupon';
import { useShippingMethods } from '@/hooks/useShippingMethods';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { AddressFormSchemaValues } from '@/utils/addressValidation';
import type { ValidateCouponResult } from '@/types/coupon.types';
import type { ShippingMethod } from '@/types/order.types';

const SHIPPING_METHOD_ICONS: Record<ShippingMethod, typeof Truck> = { standard: Truck, express: Zap };

export default function Checkout() {
  const navigate = useNavigate();
  const { items, summary } = useCart();
  const { data: addresses, isLoading, isError, refetch } = useAddresses();
  const createAddress = useCreateAddress();
  const checkout = useCheckout();
  const validateCoupon = useValidateCoupon();
  const { data: shippingMethods } = useShippingMethods(summary.subtotal);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResult | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');

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
      { addressId: selectedAddressId, paymentMethod: 'cod', couponCode: appliedCoupon?.code, shippingMethod },
      { onSuccess: (order) => navigate(`/orders/${order.id}`, { replace: true }) }
    );
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    validateCoupon.mutate(couponInput.trim(), { onSuccess: (result) => setAppliedCoupon(result) });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
  };

  const selectedShippingFee =
    shippingMethods?.methods.find((option) => option.method === shippingMethod)?.fee ?? 0;
  const discountAmount = appliedCoupon?.discountAmount ?? 0;
  const estimatedTotal = Math.max(0, Math.round((summary.subtotal - discountAmount + selectedShippingFee) * 100) / 100);

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
            <h2 className="text-base font-semibold text-text-primary">Shipping method</h2>
            <div className="mt-3 flex flex-col gap-3">
              {(shippingMethods?.methods ?? []).map((option) => {
                const Icon = SHIPPING_METHOD_ICONS[option.method];
                const isSelected = shippingMethod === option.method;
                return (
                  <button
                    key={option.method}
                    type="button"
                    onClick={() => setShippingMethod(option.method)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border p-4 text-left transition-colors',
                      isSelected ? 'border-brand-primary bg-brand-accent/40' : 'border-surface-border hover:bg-surface-card'
                    )}
                  >
                    <Icon
                      className={cn('h-5 w-5', isSelected ? 'text-brand-primary' : 'text-text-muted')}
                      aria-hidden="true"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">{option.label}</p>
                      <p className="text-xs text-text-secondary">{option.estimatedDelivery}</p>
                    </div>
                    <span className="text-sm font-semibold text-text-primary">
                      {option.fee > 0 ? formatCurrency(option.fee) : 'Free'}
                    </span>
                  </button>
                );
              })}
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

          <div className="border-t border-surface-border pt-4">
            {appliedCoupon ? (
              <div className="flex items-center justify-between gap-2 rounded-lg bg-semantic-success/10 px-3 py-2 text-sm text-semantic-success">
                <span className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4" aria-hidden="true" />
                  {appliedCoupon.code} applied
                </span>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  aria-label="Remove coupon"
                  className="rounded p-0.5 hover:bg-semantic-success/20"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="flex items-end gap-2">
                <Input
                  label="Coupon code"
                  placeholder="e.g. SAVE10"
                  value={couponInput}
                  onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleApplyCoupon}
                  isLoading={validateCoupon.isPending}
                  disabled={!couponInput.trim()}
                >
                  Apply
                </Button>
              </div>
            )}
          </div>

          <OrderTotals
            subtotal={summary.subtotal}
            discount={appliedCoupon?.discountAmount ?? 0}
            shippingFee={selectedShippingFee}
            tax={0}
            total={estimatedTotal}
            couponCode={appliedCoupon?.code}
          />

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
