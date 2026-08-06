import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-text-secondary">
      <Link to="/" className="flex items-center hover:text-brand-primary" aria-label="Home">
        <Home className="h-4 w-4" aria-hidden="true" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <Fragment key={`${item.label}-${index}`}>
            <ChevronRight className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
            {item.to && !isLast ? (
              <Link to={item.to} className="hover:text-brand-primary">
                {item.label}
              </Link>
            ) : (
              <span aria-current={isLast ? 'page' : undefined} className="text-text-primary">
                {item.label}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
