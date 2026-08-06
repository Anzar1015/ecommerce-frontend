import { Link } from 'react-router-dom';
import { FolderTree } from 'lucide-react';
import type { Category } from '@/types/category.types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="group flex flex-col items-center gap-3 rounded-xl border border-surface-border bg-white p-6 text-center transition-shadow hover:shadow-card"
    >
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-surface-card text-brand-primary">
        {category.image ? (
          <img src={category.image.url} alt={category.name} className="h-full w-full object-cover" />
        ) : (
          <FolderTree className="h-7 w-7" aria-hidden="true" />
        )}
      </div>
      <span className="text-sm font-medium text-text-primary group-hover:text-brand-primary">
        {category.name}
      </span>
    </Link>
  );
}
