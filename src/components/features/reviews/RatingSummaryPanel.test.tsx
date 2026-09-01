import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RatingSummaryPanel } from './RatingSummaryPanel';
import type { RatingSummary } from '@/types/review.types';

const summary: RatingSummary = {
  average: 4.6,
  count: 125,
  distribution: { '5': 100, '4': 15, '3': 6, '2': 3, '1': 1 },
};

describe('RatingSummaryPanel', () => {
  it('renders the average rating and total review count', () => {
    render(<RatingSummaryPanel summary={summary} />);
    expect(screen.getByText('4.6')).toBeInTheDocument();
    expect(screen.getByText('125 Reviews')).toBeInTheDocument();
  });

  it('computes distribution percentages correctly', () => {
    render(<RatingSummaryPanel summary={summary} />);
    // 100/125 = 80%
    expect(screen.getByText('80%')).toBeInTheDocument();
    // 15/125 = 12%
    expect(screen.getByText('12%')).toBeInTheDocument();
  });

  it('shows 0% bars for an empty summary without dividing by zero', () => {
    render(
      <RatingSummaryPanel summary={{ average: 0, count: 0, distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 } }} />
    );
    expect(screen.getByText('0 Reviews')).toBeInTheDocument();
    expect(screen.getAllByText('0%')).toHaveLength(5);
  });
});
