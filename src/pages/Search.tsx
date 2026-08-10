import { useSearchParams } from 'react-router-dom';
import { ProductCatalog } from '@/components/features/products/ProductCatalog';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search') ?? '';

  return (
    <ProductCatalog
      title={query ? `Search results for "${query}"` : 'Search'}
      breadcrumbLabel="Search"
    />
  );
}
