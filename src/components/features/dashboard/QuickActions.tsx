import { Link } from 'react-router-dom';
import { Plus, ShoppingCart, Boxes, FolderTree } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const ACTIONS = [
  { label: 'Add product', to: '/admin/products/new', icon: Plus },
  { label: 'View orders', to: '/admin/orders', icon: ShoppingCart },
  { label: 'Manage inventory', to: '/admin/inventory', icon: Boxes },
  { label: 'Manage categories', to: '/admin/categories', icon: FolderTree },
];

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      {ACTIONS.map((action) => (
        <Link key={action.to} to={action.to}>
          <Button variant="outline" size="sm">
            <action.icon className="h-4 w-4" aria-hidden="true" />
            {action.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}
