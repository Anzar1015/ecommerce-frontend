import { api } from './api';
import type { ApiSuccessResponse } from '@/types/auth.types';
import type { PaginationMeta } from '@/types/common.types';
import type { Notification, NotificationQueryParams } from '@/types/notification.types';

interface NotificationListResult {
  notifications: Notification[];
  pagination: PaginationMeta;
  unreadCount: number;
}

export const notificationApi = {
  async list(params: NotificationQueryParams): Promise<NotificationListResult> {
    const { data } = await api.get<ApiSuccessResponse<NotificationListResult>>('/notifications', { params });
    return data.data;
  },

  async markAsRead(id: string): Promise<Notification> {
    const { data } = await api.patch<ApiSuccessResponse<{ notification: Notification }>>(
      `/notifications/${id}/read`
    );
    return data.data.notification;
  },

  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/read-all');
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },
};
