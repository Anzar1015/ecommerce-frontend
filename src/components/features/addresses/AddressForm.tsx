import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { addressFormSchema, type AddressFormSchemaValues } from '@/utils/addressValidation';
import type { Address } from '@/types/address.types';

interface AddressFormProps {
  initialValues?: Address;
  onSubmit: (values: AddressFormSchemaValues) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function AddressForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel = 'Save address',
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormSchemaValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Input label="Full name" error={errors.fullName?.message} {...register('fullName')} />
      <Input label="Phone" type="tel" error={errors.phone?.message} {...register('phone')} />
      <Input label="Address line 1" error={errors.addressLine1?.message} {...register('addressLine1')} />
      <Input
        label="Address line 2 (optional)"
        error={errors.addressLine2?.message}
        {...register('addressLine2')}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input label="City" error={errors.city?.message} {...register('city')} />
        <Input label="State" error={errors.state?.message} {...register('state')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Postal code" error={errors.postalCode?.message} {...register('postalCode')} />
        <Input label="Country" error={errors.country?.message} {...register('country')} />
      </div>

      <label className="flex items-center gap-2 text-sm text-text-primary">
        <input
          type="checkbox"
          {...register('isDefault')}
          className="h-4 w-4 rounded border-surface-border"
        />
        Set as default address
      </label>

      <div className="mt-2 flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
