import { BellOff } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Pagination } from '@/components/common/Pagination';
import { NotificationItem } from './NotificationItem';
import { useNotifications } from '@/hooks/useNotifications';
import { useMarkAllNotificationsRead } from '@/hooks/useNotificationMutations';
import { useState } from 'react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useNotifications({ page, limit: 20 });
  const markAllAsRead = useMarkAllNotificationsRead();

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Notifications">
      {data && data.unreadCount > 0 && (
        <button
          type="button"
          onClick={() => markAllAsRead.mutate()}
          disabled={markAllAsRead.isPending}
          className="mb-3 text-sm font-medium text-brand-primary hover:underline disabled:opacity-50"
        >
          Mark all as read
        </button>
      )}

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      ) : !data || data.notifications.length === 0 ? (
        <EmptyState
          icon={<BellOff className="h-6 w-6" aria-hidden="true" />}
          title="No notifications"
          description="You're all caught up."
        />
      ) : (
        <>
          <div className="-mx-6 divide-y divide-surface-divider">
            {data.notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} onNavigate={onClose} />
            ))}
          </div>
          <div className="mt-4">
            <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </Drawer>
  );
}
