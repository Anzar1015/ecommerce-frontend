import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductSearchBar } from './ProductSearchBar';

vi.mock('@/services/product.service', () => ({
  productApi: {
    suggest: vi.fn().mockResolvedValue([
      { id: '1', name: 'iPhone 15', slug: 'iphone-15', price: 79900 },
    ]),
  },
}));

function renderBar(props: Partial<React.ComponentProps<typeof ProductSearchBar>> = {}) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const onSearch = props.onSearch ?? vi.fn();
  const utils = render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <ProductSearchBar value="" onSearch={onSearch} {...props} />
      </MemoryRouter>
    </QueryClientProvider>
  );
  return { ...utils, onSearch };
}

describe('ProductSearchBar', () => {
  it('debounces onSearch instead of firing on every keystroke', async () => {
    const { onSearch } = renderBar();
    const input = screen.getByLabelText('Search products');

    fireEvent.change(input, { target: { value: 'iphone' } });
    expect(onSearch).not.toHaveBeenCalled();

    await waitFor(() => expect(onSearch).toHaveBeenCalledWith('iphone'), { timeout: 2000 });
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('submits immediately on Enter without waiting for the debounce', async () => {
    const user = userEvent.setup();
    const { onSearch } = renderBar();

    await user.type(screen.getByLabelText('Search products'), 'phone{Enter}');
    expect(onSearch).toHaveBeenCalledWith('phone');
  });

  it('shows suggestion results once the debounced query resolves', async () => {
    const { getByLabelText } = renderBar();
    fireEvent.change(getByLabelText('Search products'), { target: { value: 'iph' } });
    fireEvent.focus(getByLabelText('Search products'));

    await waitFor(() => expect(screen.getByText('iPhone 15')).toBeInTheDocument(), { timeout: 2000 });
  });
});
