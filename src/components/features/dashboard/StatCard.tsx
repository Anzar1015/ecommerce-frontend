import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  helperText?: string;
  accent?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

const accentStyles: Record<NonNullable<StatCardProps['accent']>, string> = {
  primary: 'bg-brand-accent text-brand-primary',
  success: 'bg-semantic-success/10 text-semantic-success',
  warning: 'bg-semantic-warning/10 text-semantic-warning',
  error: 'bg-semantic-error/10 text-semantic-error',
  info: 'bg-semantic-info/10 text-semantic-info',
};

export function StatCard({ icon: Icon, label, value, helperText, accent = 'primary' }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-surface-border bg-white p-4">
      <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', accentStyles[accent])}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="truncate text-xl font-semibold text-text-primary">{value}</p>
        {helperText && <p className="text-xs text-text-muted">{helperText}</p>}
      </div>
    </div>
  );
}
