import { TextareaHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const errorId = `${textareaId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={textareaId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'rounded-lg border bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
            'transition-colors',
            error ? 'border-semantic-error' : 'border-surface-border',
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="text-sm text-semantic-error">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
