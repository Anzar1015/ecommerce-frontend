import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActiveFilterChips } from './ActiveFilterChips';
import type { ProductQueryParams } from '@/types/product.types';

describe('ActiveFilterChips', () => {
  it('renders nothing when no filters are active', () => {
    const { container } = render(
      <ActiveFilterChips filters={{}} onRemove={vi.fn()} onClearAll={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a chip per active filter, formatting price in INR', () => {
    const filters: ProductQueryParams = {
      search: 'phone',
      brand: 'Acme',
      minPrice: 500,
      maxPrice: 2000,
      rating: 4,
      inStock: true,
      minDiscount: 10,
    };
    render(<ActiveFilterChips filters={filters} onRemove={vi.fn()} onClearAll={vi.fn()} />);

    expect(screen.getByText('Search: "phone"')).toBeInTheDocument();
    expect(screen.getByText('Brand: Acme')).toBeInTheDocument();
    expect(screen.getByText(/Price: ₹500.*₹2,000/)).toBeInTheDocument();
    expect(screen.getByText('4★ & up')).toBeInTheDocument();
    expect(screen.getByText('In stock only')).toBeInTheDocument();
    expect(screen.getByText('On sale')).toBeInTheDocument();
  });

  it('removes only the clicked filter', async () => {
    const onRemove = vi.fn();
    render(
      <ActiveFilterChips
        filters={{ search: 'phone', brand: 'Acme' }}
        onRemove={onRemove}
        onClearAll={vi.fn()}
      />
    );

    await userEvent.click(screen.getByText('Brand: Acme'));
    expect(onRemove).toHaveBeenCalledWith({ brand: undefined });
  });

  it('calls onClearAll from the Clear all button', async () => {
    const onClearAll = vi.fn();
    render(<ActiveFilterChips filters={{ search: 'x' }} onRemove={vi.fn()} onClearAll={onClearAll} />);

    await userEvent.click(screen.getByText('Clear all'));
    expect(onClearAll).toHaveBeenCalledOnce();
  });

  it('renders one chip per comma-separated tag and removes only that tag', async () => {
    const onRemove = vi.fn();
    render(
      <ActiveFilterChips filters={{ tags: 'summer,sale' }} onRemove={onRemove} onClearAll={vi.fn()} />
    );

    expect(screen.getByText('Tag: summer')).toBeInTheDocument();
    expect(screen.getByText('Tag: sale')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Tag: summer'));
    expect(onRemove).toHaveBeenCalledWith({ tags: 'sale' });
  });
});
