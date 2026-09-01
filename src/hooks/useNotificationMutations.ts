import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { notificationApi } from '@/services/notification.service';
import { extractErrorMessage } from '@/utils/errors';
import { notificationKeys } from './useNotifications';

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
