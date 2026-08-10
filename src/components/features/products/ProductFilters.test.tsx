import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductFilters } from './ProductFilters';
import type { ProductQueryParams } from '@/types/product.types';

vi.mock('@/services/category.service', () => ({
  categoryApi: {
    list: vi.fn().mockResolvedValue([
      { id: '1', name: 'Electronics', slug: 'electronics' },
      { id: '2', name: 'Apparel', slug: 'apparel' },
    ]),
  },
}));

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe('ProductFilters', () => {
  it('toggles a rating filter on click and off on second click', async () => {
    const onChange = vi.fn();
    const filters: ProductQueryParams = {};
    renderWithClient(<ProductFilters filters={filters} onChange={onChange} onClear={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: /4.*& up/ }));
    expect(onChange).toHaveBeenCalledWith({ rating: 4, page: 1 });
  });

  it('unsets the rating filter when the active rating is clicked again', async () => {
    const onChange = vi.fn();
    renderWithClient(<ProductFilters filters={{ rating: 4 }} onChange={onChange} onClear={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: /4.*& up/ }));
    expect(onChange).toHaveBeenCalledWith({ rating: undefined, page: 1 });
  });

  it('sets minDiscount when "On sale only" is checked, clears it when unchecked', async () => {
    const onChange = vi.fn();
    renderWithClient(<ProductFilters filters={{}} onChange={onChange} onClear={vi.fn()} />);

    await userEvent.click(screen.getByLabelText('On sale only'));
    expect(onChange).toHaveBeenCalledWith({ minDiscount: 1, page: 1 });
  });

  it('sets inStock when "In stock only" is checked', async () => {
    const onChange = vi.fn();
    renderWithClient(<ProductFilters filters={{}} onChange={onChange} onClear={vi.fn()} />);

    await userEvent.click(screen.getByLabelText('In stock only'));
    expect(onChange).toHaveBeenCalledWith({ inStock: true, page: 1 });
  });

  it('calls onClear from the header Clear all button', async () => {
    const onClear = vi.fn();
    renderWithClient(<ProductFilters filters={{}} onChange={vi.fn()} onClear={onClear} />);

    await userEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('updates the brand filter as the user types', async () => {
    const onChange = vi.fn();
    renderWithClient(<ProductFilters filters={{}} onChange={onChange} onClear={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('Brand'), 'A');
    expect(onChange).toHaveBeenCalledWith({ brand: 'A', page: 1 });
  });
});
