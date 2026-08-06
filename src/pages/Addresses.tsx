import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AddressCard } from '@/components/features/addresses/AddressCard';
import { AddressForm } from '@/components/features/addresses/AddressForm';
import { useAddresses } from '@/hooks/useAddresses';
import { useCreateAddress, useUpdateAddress, useDeleteAddress } from '@/hooks/useAddressMutations';
import type { AddressFormSchemaValues } from '@/utils/addressValidation';
import type { Address } from '@/types/address.types';

export default function Addresses() {
  const { data: addresses, isLoading, isError, refetch } = useAddresses();
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress(editingAddress?.id ?? '');
  const deleteAddress = useDeleteAddress();

  const openCreate = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const openEdit = (address: Address) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleSubmit = async (values: AddressFormSchemaValues) => {
    if (editingAddress) await updateAddress.mutateAsync(values);
    else await createAddress.mutateAsync(values);
    setIsFormOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;
    await deleteAddress.mutateAsync(addressToDelete.id);
    setAddressToDelete(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Addresses' }]} />
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">My Addresses</h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add address
        </Button>
      </div>

      <div className="mt-6">
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-40 w-full" />
            ))}
          </div>
        ) : addresses && addresses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => openEdit(address)}
                onDelete={() => setAddressToDelete(address)}
              />
            ))}
          </div>
        ) : (
          <EmptyState title="No saved addresses" description="Add an address to speed up checkout." />
        )}
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingAddress ? 'Edit address' : 'Add address'}
      >
        <AddressForm
          initialValues={editingAddress ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={createAddress.isPending || updateAddress.isPending}
          submitLabel={editingAddress ? 'Save changes' : 'Add address'}
        />
      </Modal>

      <Modal isOpen={!!addressToDelete} onClose={() => setAddressToDelete(null)} title="Delete address" size="sm">
        <p className="text-sm text-text-secondary">
          Are you sure you want to delete this address? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setAddressToDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" isLoading={deleteAddress.isPending} onClick={handleConfirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
