import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Plus, Tag, Trash2 } from 'lucide-react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/common/Pagination';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { useCoupons } from '@/hooks/useCoupons';
import { useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from '@/hooks/useCouponMutations';
import { couponFormSchema, type CouponFormSchemaValues } from '@/utils/couponValidation';
import { formatCurrency } from '@/utils/format';
import type { Coupon } from '@/types/coupon.types';

const COUPON_TYPE_OPTIONS = [
  { value: 'PERCENTAGE', label: 'Percentage' },
  { value: 'FIXED_AMOUNT', label: 'Fixed amount (₹)' },
];

function toDateInputValue(iso: string): string {
  return iso.slice(0, 10);
}

function couponStatus(coupon: Coupon): { label: string; variant: 'success' | 'default' | 'warning' | 'error' } {
  if (!coupon.isActive) return { label: 'Disabled', variant: 'default' };
  const now = Date.now();
  if (now < new Date(coupon.startDate).getTime()) return { label: 'Upcoming', variant: 'warning' };
  if (now > new Date(coupon.endDate).getTime()) return { label: 'Expired', variant: 'error' };
  return { label: 'Active', variant: 'success' };
}

export default function AdminCoupons() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useCoupons({ page, limit: 20 });

  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon(editingCoupon?.id ?? '');
  const deleteCoupon = useDeleteCoupon();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CouponFormSchemaValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: { type: 'PERCENTAGE', minimumOrderAmount: 0, firstOrderOnly: false, isActive: true },
  });

  useEffect(() => {
    if (!isFormOpen) return;
    if (editingCoupon) {
      reset({
        code: editingCoupon.code,
        description: editingCoupon.description,
        type: editingCoupon.type,
        value: editingCoupon.value,
        minimumOrderAmount: editingCoupon.minimumOrderAmount,
        maximumDiscount: editingCoupon.maximumDiscount,
        startDate: toDateInputValue(editingCoupon.startDate),
        endDate: toDateInputValue(editingCoupon.endDate),
        usageLimit: editingCoupon.usageLimit,
        perUserLimit: editingCoupon.perUserLimit,
        firstOrderOnly: editingCoupon.firstOrderOnly,
        isActive: editingCoupon.isActive,
      });
    } else {
      reset({ type: 'PERCENTAGE', minimumOrderAmount: 0, firstOrderOnly: false, isActive: true });
    }
  }, [isFormOpen, editingCoupon, reset]);

  const openCreateForm = () => {
    setEditingCoupon(null);
    setIsFormOpen(true);
  };

  const openEditForm = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsFormOpen(true);
  };

  const isSaving = createCoupon.isPending || updateCoupon.isPending;
  const selectedType = watch('type');

  const onSubmit = async (values: CouponFormSchemaValues) => {
    if (editingCoupon) {
      await updateCoupon.mutateAsync(values);
    } else {
      await createCoupon.mutateAsync(values);
    }
    setIsFormOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!couponToDelete) return;
    await deleteCoupon.mutateAsync(couponToDelete.id);
    setCouponToDelete(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-text-primary">Coupons</h1>
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          New coupon
        </Button>
      </div>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <Skeleton className="h-72 w-full" />
      ) : !data || data.coupons.length === 0 ? (
        <EmptyState
          icon={<Tag className="h-6 w-6" aria-hidden="true" />}
          title="No coupons yet"
          description="Create a coupon to offer discounts and promotions."
        />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Code</TableHeaderCell>
                <TableHeaderCell>Discount</TableHeaderCell>
                <TableHeaderCell>Validity</TableHeaderCell>
                <TableHeaderCell>Usage</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.coupons.map((coupon) => {
                const status = couponStatus(coupon);
                return (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{coupon.code}</span>
                        {coupon.description && (
                          <span className="line-clamp-1 text-xs text-text-muted">{coupon.description}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                      {coupon.maximumDiscount !== undefined && coupon.type === 'PERCENTAGE' && (
                        <span className="block text-xs text-text-muted">
                          up to {formatCurrency(coupon.maximumDiscount)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(coupon.startDate).toLocaleDateString()} –{' '}
                      {new Date(coupon.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {coupon.usedCount}
                      {coupon.usageLimit !== undefined ? ` / ${coupon.usageLimit}` : ''}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          aria-label={`Edit ${coupon.code}`}
                          onClick={() => openEditForm(coupon)}
                          className="rounded-lg p-2 text-text-secondary hover:bg-surface-card"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${coupon.code}`}
                          onClick={() => setCouponToDelete(coupon)}
                          className="rounded-lg p-2 text-semantic-error hover:bg-semantic-error/10"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingCoupon ? 'Edit coupon' : 'New coupon'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Code" placeholder="SAVE10" error={errors.code?.message} {...register('code')} />
            <Select
              label="Type"
              error={errors.type?.message}
              options={COUPON_TYPE_OPTIONS}
              {...register('type')}
            />
          </div>

          <Textarea label="Description (optional)" error={errors.description?.message} {...register('description')} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={selectedType === 'PERCENTAGE' ? 'Value (%)' : 'Value (₹)'}
              type="number"
              step="0.01"
              error={errors.value?.message}
              {...register('value')}
            />
            {selectedType === 'PERCENTAGE' && (
              <Input
                label="Maximum discount (₹, optional)"
                type="number"
                step="0.01"
                error={errors.maximumDiscount?.message}
                {...register('maximumDiscount')}
              />
            )}
          </div>

          <Input
            label="Minimum order amount (₹)"
            type="number"
            step="0.01"
            error={errors.minimumOrderAmount?.message}
            {...register('minimumOrderAmount')}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Start date" type="date" error={errors.startDate?.message} {...register('startDate')} />
            <Input label="End date" type="date" error={errors.endDate?.message} {...register('endDate')} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Total usage limit (optional)"
              type="number"
              error={errors.usageLimit?.message}
              {...register('usageLimit')}
            />
            <Input
              label="Per-user limit (optional)"
              type="number"
              error={errors.perUserLimit?.message}
              {...register('perUserLimit')}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input type="checkbox" {...register('firstOrderOnly')} className="h-4 w-4 rounded border-surface-border" />
            First-time orders only
          </label>

          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input type="checkbox" {...register('isActive')} className="h-4 w-4 rounded border-surface-border" />
            Active
          </label>

          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingCoupon ? 'Save changes' : 'Create coupon'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!couponToDelete} onClose={() => setCouponToDelete(null)} title="Delete coupon" size="sm">
        <p className="text-sm text-text-secondary">
          Are you sure you want to delete <span className="font-medium text-text-primary">{couponToDelete?.code}</span>?
          This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setCouponToDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" isLoading={deleteCoupon.isPending} onClick={handleConfirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
