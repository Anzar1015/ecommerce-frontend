import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again in a moment.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-surface-border bg-surface py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-semantic-error/10 text-semantic-error">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="max-w-sm text-sm text-text-secondary">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
