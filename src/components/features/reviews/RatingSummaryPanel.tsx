import { Star } from 'lucide-react';
import type { RatingSummary } from '@/types/review.types';

interface RatingSummaryPanelProps {
  summary: RatingSummary;
}

const STARS = [5, 4, 3, 2, 1] as const;

export function RatingSummaryPanel({ summary }: RatingSummaryPanelProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
      <div className="flex shrink-0 flex-col items-center gap-1">
        <span className="text-4xl font-semibold text-text-primary">{summary.average.toFixed(1)}</span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={
                index < Math.round(summary.average)
                  ? 'h-4 w-4 fill-semantic-warning text-semantic-warning'
                  : 'h-4 w-4 text-surface-border'
              }
              aria-hidden="true"
            />
          ))}
        </div>
        <span className="text-xs text-text-secondary">{summary.count} Reviews</span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        {STARS.map((star) => {
          const count = summary.distribution[String(star) as keyof typeof summary.distribution];
          const percentage = summary.count > 0 ? Math.round((count / summary.count) * 100) : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-xs text-text-secondary">
              <span className="w-8 shrink-0">{star} ★</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-card">
                <div
                  className="h-full rounded-full bg-semantic-warning"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-10 shrink-0 text-right">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
