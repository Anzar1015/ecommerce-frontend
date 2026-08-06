import { Breadcrumb } from '@/components/common/Breadcrumb';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { CategoryCard } from '@/components/features/categories/CategoryCard';
import { useCategories } from '@/hooks/useCategories';

export default function Categories() {
  const { data: categories, isLoading, isError, refetch } = useCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Categories' }]} />
      <h1 className="mt-2 text-2xl font-semibold text-text-primary">Shop by Category</h1>

      <div className="mt-6">
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-40 w-full" />
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <EmptyState title="No categories yet" description="Check back soon for new collections." />
        )}
      </div>
    </div>
  );
}
