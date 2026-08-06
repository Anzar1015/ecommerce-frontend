import { useState } from 'react';
import { ImageOff, Package, PackageX, TrendingDown } from 'lucide-react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/Table';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Pagination } from '@/components/common/Pagination';
import { SearchBar } from '@/components/common/SearchBar';
import { StockStatusBadge } from '@/components/features/inventory/StockStatusBadge';
import { AdjustStockModal } from '@/components/features/inventory/AdjustStockModal';
import { useInventory, useInventorySummary } from '@/hooks/useInventory';
import type { Product, StockStatus } from '@/types/product.types';

const STOCK_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'in_stock', label: 'In stock' },
  { value: 'low_stock', label: 'Low stock' },
  { value: 'out_of_stock', label: 'Out of stock' },
];

export default function AdminInventory() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [stockStatus, setStockStatus] = useState<StockStatus | ''>('');
  const [productToAdjust, setProductToAdjust] = useState<Product | null>(null);

  const { data: summary } = useInventorySummary();
  const { data, isLoading, isError, refetch } = useInventory({
    page,
    limit: 20,
    search: search || undefined,
    stockStatus: stockStatus || undefined,
    sort: 'stock_asc',
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">Inventory</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-surface-border bg-white p-4">
          <Package className="h-8 w-8 text-brand-primary" aria-hidden="true" />
          <div>
            <p className="text-xs text-text-secondary">Total products</p>
            <p className="text-xl font-semibold text-text-primary">{summary?.totalProducts ?? '—'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-surface-border bg-white p-4">
          <Package className="h-8 w-8 text-semantic-success" aria-hidden="true" />
          <div>
            <p className="text-xs text-text-secondary">In stock</p>
            <p className="text-xl font-semibold text-text-primary">{summary?.inStock ?? '—'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-surface-border bg-white p-4">
          <TrendingDown className="h-8 w-8 text-semantic-warning" aria-hidden="true" />
          <div>
            <p className="text-xs text-text-secondary">Low stock</p>
            <p className="text-xl font-semibold text-text-primary">{summary?.lowStock ?? '—'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-surface-border bg-white p-4">
          <PackageX className="h-8 w-8 text-semantic-error" aria-hidden="true" />
          <div>
            <p className="text-xs text-text-secondary">Out of stock</p>
            <p className="text-xl font-semibold text-text-primary">{summary?.outOfStock ?? '—'}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="max-w-xs flex-1">
          <SearchBar
            placeholder="Search name or SKU…"
            onSearch={(query) => {
              setSearch(query);
              setPage(1);
            }}
          />
        </div>
        <div className="max-w-xs">
          <Select
            label="Stock status"
            value={stockStatus}
            onChange={(event) => {
              setStockStatus(event.target.value as StockStatus | '');
              setPage(1);
            }}
            options={[{ value: '', label: 'All statuses' }, ...STOCK_STATUS_OPTIONS]}
          />
        </div>
      </div>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : !data || data.products.length === 0 ? (
        <EmptyState title="No products found" description="Try adjusting your search or filters." />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Product</TableHeaderCell>
                <TableHeaderCell>SKU</TableHeaderCell>
                <TableHeaderCell>Stock</TableHeaderCell>
                <TableHeaderCell>Threshold</TableHeaderCell>
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
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.lowStockThreshold}</TableCell>
                  <TableCell>
                    <StockStatusBadge status={product.stockStatus} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => setProductToAdjust(product)}>
                        Adjust stock
                      </Button>
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

      <AdjustStockModal product={productToAdjust} onClose={() => setProductToAdjust(null)} />
    </div>
  );
}
