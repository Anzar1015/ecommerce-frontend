import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrderTotals } from './OrderTotals';

describe('OrderTotals', () => {
  it('renders subtotal, shipping and total in INR, with no discount row when discount is 0', () => {
    render(<OrderTotals subtotal={1000} shippingFee={50} total={1050} />);

    expect(screen.getByText('₹1,000.00')).toBeInTheDocument();
    expect(screen.getByText('₹50.00')).toBeInTheDocument();
    expect(screen.getByText('₹1,050.00')).toBeInTheDocument();
    expect(screen.queryByText(/Discount/)).not.toBeInTheDocument();
  });

  it('shows "Free" for zero shipping', () => {
    render(<OrderTotals subtotal={1000} shippingFee={0} total={1000} />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('renders a discount row with the coupon code when a discount is applied', () => {
    render(<OrderTotals subtotal={2000} discount={200} shippingFee={0} total={1800} couponCode="SAVE10" />);

    expect(screen.getByText('Discount (SAVE10)')).toBeInTheDocument();
    expect(screen.getByText('-₹200.00')).toBeInTheDocument();
    expect(screen.getByText('₹1,800.00')).toBeInTheDocument();
  });

  it('always renders the Tax row, even at ₹0.00', () => {
    render(<OrderTotals subtotal={500} shippingFee={0} total={500} />);
    expect(screen.getByText('Tax')).toBeInTheDocument();
  });
});
