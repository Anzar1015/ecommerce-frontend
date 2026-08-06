import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageOff, Pencil, Plus, Trash2 } from 'lucide-react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Pagination } from '@/components/common/Pagination';
import { StockStatusBadge } from '@/components/features/inventory/StockStatusBadge';
import { useProducts } from '@/hooks/useProducts';
import { useDeleteProduct } from '@/hooks/useProductMutations';
import { formatCurrency } from '@/utils/format';
import { PRODUCT_STATUS_OPTIONS } from '@/constants';
import type { ProductStatus } from '@/types/product.types';

const statusBadgeVariant: Record<ProductStatus, 'default' | 'success' | 'warning'> = {
  draft: 'warning',
  active: 'success',
  archived: 'default',
};

export default function AdminProducts() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ProductStatus | ''>('');
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  const { data, isLoading, isError, refetch } = useProducts({
    page,
    limit: 10,
    sort: 'newest',
    status: status || undefined,
  });
  const deleteProduct = useDeleteProduct();

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    await deleteProduct.mutateAsync(productToDelete.id);
    setProductToDelete(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-text-primary">Products</h1>
        <Link to="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4" aria-hidden="true" />
            New product
          </Button>
        </Link>
      </div>

      <div className="max-w-xs">
        <Select
          label="Status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as ProductStatus | '');
            setPage(1);
          }}
          options={[{ value: '', label: 'All statuses' }, ...PRODUCT_STATUS_OPTIONS]}
        />
      </div>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : !data || data.products.length === 0 ? (
        <EmptyState title="No products yet" description="Create your first product to get started." />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Product</TableHeaderCell>
                <TableHeaderCell>SKU</TableHeaderCell>
                <TableHeaderCell>Price</TableHeaderCell>
                <TableHeaderCell>Stock</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-card">
                        {product.images[0] ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageOff className="h-4 w-4 text-text-muted" aria-hidden="true" />
                        )}
                      </div>
                      <span className="line-clamp-1 font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{formatCurrency(product.finalPrice)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {product.stock}
                      <StockStatusBadge status={product.stockStatus} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant[product.status]}>{product.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        aria-label={`Edit ${product.name}`}
                        className="rounded-lg p-2 text-text-secondary hover:bg-surface-card"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        aria-label={`Delete ${product.name}`}
                        onClick={() => setProductToDelete({ id: product.id, name: product.name })}
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

          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      <Modal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        title="Delete product"
        size="sm"
      >
        <p className="text-sm text-text-secondary">
          Are you sure you want to delete <span className="font-medium text-text-primary">{productToDelete?.name}</span>?
          This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setProductToDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" isLoading={deleteProduct.isPending} onClick={handleConfirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
