import { Link } from 'react-router-dom';
import { Package, CreditCard, Truck, User, Tag, Info, Trash2, LucideIcon } from 'lucide-react';
import { useMarkNotificationRead, useDeleteNotification } from '@/hooks/useNotificationMutations';
import { cn } from '@/utils/cn';
import type { Notification, NotificationType } from '@/types/notification.types';

const TYPE_ICON: Record<NotificationType, LucideIcon> = {
  ORDER: Package,
  PAYMENT: CreditCard,
  SHIPPING: Truck,
  ACCOUNT: User,
  PROMOTION: Tag,
  SYSTEM: Info,
};

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

interface NotificationItemProps {
  notification: Notification;
  onNavigate?: () => void;
}

export function NotificationItem({ notification, onNavigate }: NotificationItemProps) {
  const markAsRead = useMarkNotificationRead();
  const deleteNotification = useDeleteNotification();
  const Icon = TYPE_ICON[notification.type];

  const handleClick = () => {
    if (!notification.isRead) markAsRead.mutate(notification.id);
    onNavigate?.();
  };

  const content = (
    <>
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
          notification.isRead ? 'bg-surface-card text-text-muted' : 'bg-brand-accent text-brand-primary'
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn('text-sm', notification.isRead ? 'text-text-secondary' : 'font-semibold text-text-primary')}>
          {notification.title}
        </p>
        <p className="line-clamp-2 text-xs text-text-secondary">{notification.message}</p>
        <p className="mt-1 text-xs text-text-muted">{relativeTime(notification.createdAt)}</p>
      </div>
      {!notification.isRead && (
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-primary" aria-label="Unread" />
      )}
    </>
  );

  return (
    <div className="group flex items-start gap-3 border-b border-surface-divider px-4 py-3 last:border-b-0 hover:bg-surface-card">
      {notification.link ? (
        <Link to={notification.link} onClick={handleClick} className="flex flex-1 items-start gap-3">
          {content}
        </Link>
      ) : (
        <button type="button" onClick={handleClick} className="flex flex-1 items-start gap-3 text-left">
          {content}
        </button>
      )}
      <button
        type="button"
        onClick={() => deleteNotification.mutate(notification.id)}
        aria-label="Delete notification"
        className="mt-1 shrink-0 rounded p-1 text-text-muted opacity-0 hover:bg-semantic-error/10 hover:text-semantic-error group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
