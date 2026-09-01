import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReviewCard } from './ReviewCard';
import type { Review } from '@/types/review.types';

vi.mock('@/services/review.service', () => ({
  reviewApi: {
    toggleHelpful: vi.fn().mockResolvedValue({}),
  },
}));

const baseReview: Review = {
  id: 'r1',
  user: { id: 'u1', name: 'Priya Sharma' },
  product: 'p1',
  order: 'o1',
  rating: 5,
  title: 'Excellent purchase',
  comment: 'Works exactly as described, very happy with the quality.',
  images: [],
  isVerifiedPurchase: true,
  status: 'approved',
  helpfulCount: 3,
  hasVoted: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

function renderCard(props: Partial<React.ComponentProps<typeof ReviewCard>> = {}) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <ReviewCard review={baseReview} {...props} />
    </QueryClientProvider>
  );
}

describe('ReviewCard', () => {
  it('shows the Verified Purchase badge and review content', () => {
    renderCard();
    expect(screen.getByText('Verified Purchase')).toBeInTheDocument();
    expect(screen.getByText('Excellent purchase')).toBeInTheDocument();
    expect(screen.getByText(/Works exactly as described/)).toBeInTheDocument();
    expect(screen.getByText(/Priya Sharma/)).toBeInTheDocument();
  });

  it('shows the helpful vote count', () => {
    renderCard();
    expect(screen.getByText('Helpful (3)')).toBeInTheDocument();
  });

  it('shows edit/delete actions only when isOwn is true', () => {
    const { rerender } = render(
      <QueryClientProvider client={new QueryClient()}>
        <ReviewCard review={baseReview} />
      </QueryClientProvider>
    );
    expect(screen.queryByLabelText('Edit review')).not.toBeInTheDocument();

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <ReviewCard review={baseReview} isOwn onEdit={vi.fn()} onDelete={vi.fn()} />
      </QueryClientProvider>
    );
    expect(screen.getByLabelText('Edit review')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete review')).toBeInTheDocument();
  });

  it('disables the helpful button on your own review', () => {
    renderCard({ isOwn: true });
    expect(screen.getByText(/Helpful/)).toBeDisabled();
  });

  it('calls onEdit and onDelete when their buttons are clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    renderCard({ isOwn: true, onEdit, onDelete });

    await user.click(screen.getByLabelText('Edit review'));
    expect(onEdit).toHaveBeenCalledOnce();

    await user.click(screen.getByLabelText('Delete review'));
    expect(onDelete).toHaveBeenCalledOnce();
  });
});
