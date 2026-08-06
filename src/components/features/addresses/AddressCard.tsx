import { KeyboardEvent, MouseEvent } from 'react';
import { MapPin, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import type { Address } from '@/types/address.types';

interface AddressCardProps {
  address: Address;
  onEdit?: () => void;
  onDelete?: () => void;
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function AddressCard({ address, onEdit, onDelete, selectable, isSelected, onSelect }: AddressCardProps) {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (selectable && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onSelect?.();
    }
  };

  const stopAnd = (fn?: () => void) => (event: MouseEvent) => {
    event.stopPropagation();
    fn?.();
  };

  return (
    <div
      role={selectable ? 'button' : undefined}
      tabIndex={selectable ? 0 : undefined}
      onClick={selectable ? onSelect : undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        'flex flex-col gap-2 rounded-xl border bg-white p-4',
        selectable && 'cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
        isSelected ? 'border-brand-primary ring-1 ring-brand-primary' : 'border-surface-border'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-text-muted" aria-hidden="true" />
          <span className="text-sm font-semibold text-text-primary">{address.fullName}</span>
          {address.isDefault && <Badge variant="info">Default</Badge>}
        </div>
        {(onEdit || onDelete) && (
          <div className="flex gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={stopAnd(onEdit)}
                aria-label="Edit address"
                className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-card"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={stopAnd(onDelete)}
                aria-label="Delete address"
                className="rounded-lg p-1.5 text-semantic-error hover:bg-semantic-error/10"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>
      <p className="text-sm text-text-secondary">
        {address.addressLine1}
        {address.addressLine2 ? `, ${address.addressLine2}` : ''}
        <br />
        {address.city}, {address.state} {address.postalCode}
        <br />
        {address.country}
      </p>
      <p className="text-sm text-text-muted">{address.phone}</p>
    </div>
  );
}
