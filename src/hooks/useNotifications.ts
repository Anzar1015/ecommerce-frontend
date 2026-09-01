import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { notificationApi } from '@/services/notification.service';
import type { NotificationQueryParams } from '@/types/notification.types';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (params: NotificationQueryParams) => [...notificationKeys.all, 'list', params] as const,
};

/** Polls every 30s so the unread badge stays reasonably fresh without
 * introducing websockets/real-time infra at this scope. */
export function useNotifications(params: NotificationQueryParams) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationApi.list(params),
    placeholderData: keepPreviousData,
    refetchInterval: 30 * 1000,
  });
}
