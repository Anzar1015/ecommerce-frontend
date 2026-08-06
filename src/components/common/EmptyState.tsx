import { ReactNode } from 'react';
import { PackageSearch } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-surface-border bg-surface py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-card text-text-muted">
        {icon ?? <PackageSearch className="h-6 w-6" aria-hidden="true" />}
      </div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      {description && <p className="max-w-sm text-sm text-text-secondary">{description}</p>}
      {action}
    </div>
  );
}
