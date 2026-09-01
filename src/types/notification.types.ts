export type NotificationType = 'ORDER' | 'PAYMENT' | 'SHIPPING' | 'ACCOUNT' | 'PROMOTION' | 'SYSTEM';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: NotificationType;
}
