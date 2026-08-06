import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useAdjustStock } from '@/hooks/useInventoryMutations';
import { adjustStockFormSchema, type AdjustStockFormValues } from '@/utils/inventoryValidation';
import type { Product } from '@/types/product.types';

const TYPE_OPTIONS = [
  { value: 'increase', label: 'Increase stock' },
  { value: 'decrease', label: 'Decrease stock' },
  { value: 'set', label: 'Set exact quantity' },
];

interface AdjustStockModalProps {
  product: Product | null;
  onClose: () => void;
}

export function AdjustStockModal({ product, onClose }: AdjustStockModalProps) {
  const adjustStock = useAdjustStock();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdjustStockFormValues>({
    resolver: zodResolver(adjustStockFormSchema),
    defaultValues: { type: 'increase', quantity: 1 },
  });

  useEffect(() => {
    if (product) reset({ type: 'increase', quantity: 1, reason: '' });
  }, [product, reset]);

  if (!product) return null;

  const onSubmit = async (values: AdjustStockFormValues) => {
    await adjustStock.mutateAsync({ productId: product.id, payload: values });
    onClose();
  };

  return (
    <Modal isOpen={!!product} onClose={onClose} title={`Adjust stock — ${product.name}`} size="sm">
      <p className="mb-4 text-sm text-text-secondary">
        Current stock: <span className="font-medium text-text-primary">{product.stock}</span>
      </p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Select label="Adjustment type" options={TYPE_OPTIONS} {...register('type')} />
        <Input
          label="Quantity"
          type="number"
          min={0}
          error={errors.quantity?.message}
          {...register('quantity')}
        />
        <Textarea label="Reason (optional)" rows={2} error={errors.reason?.message} {...register('reason')} />

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={adjustStock.isPending}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
