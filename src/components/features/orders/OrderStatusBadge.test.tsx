import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrderStatusBadge } from './OrderStatusBadge';

describe('OrderStatusBadge', () => {
  it('labels "pending" as "Order Placed" (spec 13.4 naming)', () => {
    render(<OrderStatusBadge status="pending" />);
    expect(screen.getByText('Order Placed')).toBeInTheDocument();
  });

  it('renders the "Out for Delivery" status', () => {
    render(<OrderStatusBadge status="out_for_delivery" />);
    expect(screen.getByText('Out for Delivery')).toBeInTheDocument();
  });

  it('renders every other status label correctly', () => {
    const { rerender } = render(<OrderStatusBadge status="confirmed" />);
    expect(screen.getByText('Confirmed')).toBeInTheDocument();

    rerender(<OrderStatusBadge status="delivered" />);
    expect(screen.getByText('Delivered')).toBeInTheDocument();

    rerender(<OrderStatusBadge status="cancelled" />);
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });
});
