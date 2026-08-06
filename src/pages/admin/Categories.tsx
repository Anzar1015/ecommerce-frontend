import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FolderTree, Pencil, Plus, Trash2 } from 'lucide-react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { useCategories } from '@/hooks/useCategories';
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategoryMutations';
import { categoryFormSchema, type CategoryFormSchemaValues } from '@/utils/categoryValidation';
import type { Category } from '@/types/category.types';

export default function AdminCategories() {
  const { data: categories, isLoading, isError, refetch } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory(editingCategory?.id ?? '');
  const deleteCategory = useDeleteCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormSchemaValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { isActive: true },
  });

  useEffect(() => {
    if (isFormOpen) {
      reset(
        editingCategory
          ? { name: editingCategory.name, description: editingCategory.description, isActive: editingCategory.isActive }
          : { name: '', description: '', isActive: true }
      );
    }
  }, [isFormOpen, editingCategory, reset]);

  const openCreateForm = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const isSaving = createCategory.isPending || updateCategory.isPending;

  const onSubmit = async (values: CategoryFormSchemaValues) => {
    if (editingCategory) {
      await updateCategory.mutateAsync(values);
    } else {
      await createCategory.mutateAsync(values);
    }
    setIsFormOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    await deleteCategory.mutateAsync(categoryToDelete.id);
    setCategoryToDelete(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-text-primary">Categories</h1>
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          New category
        </Button>
      </div>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <Skeleton className="h-72 w-full" />
      ) : !categories || categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Create your first category to organize products." />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Slug</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-card">
                      {category.image ? (
                        <img src={category.image.url} alt={category.name} className="h-full w-full object-cover" />
                      ) : (
                        <FolderTree className="h-4 w-4 text-text-muted" aria-hidden="true" />
                      )}
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                </TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>
                  <Badge variant={category.isActive ? 'success' : 'default'}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      aria-label={`Edit ${category.name}`}
                      onClick={() => openEditForm(category)}
                      className="rounded-lg p-2 text-text-secondary hover:bg-surface-card"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${category.name}`}
                      onClick={() => setCategoryToDelete(category)}
                      className="rounded-lg p-2 text-semantic-error hover:bg-semantic-error/10"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingCategory ? 'Edit category' : 'New category'}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <Input label="Name" error={errors.name?.message} {...register('name')} />
          <Textarea label="Description" error={errors.description?.message} {...register('description')} />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="image" className="text-sm font-medium text-text-primary">
              Image
            </label>
            <input id="image" type="file" accept="image/*" {...register('image')} className="text-sm text-text-secondary" />
            {editingCategory?.image && (
              <img src={editingCategory.image.url} alt="" className="mt-2 h-16 w-16 rounded-lg object-cover" />
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input type="checkbox" {...register('isActive')} className="h-4 w-4 rounded border-surface-border" />
            Active (visible to customers)
          </label>

          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingCategory ? 'Save changes' : 'Create category'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        title="Delete category"
        size="sm"
      >
        <p className="text-sm text-text-secondary">
          Are you sure you want to delete{' '}
          <span className="font-medium text-text-primary">{categoryToDelete?.name}</span>? This action
          cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setCategoryToDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" isLoading={deleteCategory.isPending} onClick={handleConfirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
