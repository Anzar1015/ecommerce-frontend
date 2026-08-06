import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'h-11 rounded-lg border bg-white px-3 text-sm text-text-primary placeholder:text-text-muted',
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

Input.displayName = 'Input';
