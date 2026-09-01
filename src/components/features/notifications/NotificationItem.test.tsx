import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationItem } from './NotificationItem';
import type { Notification } from '@/types/notification.types';

const markAsReadMock = vi.fn().mockResolvedValue({});
const removeMock = vi.fn().mockResolvedValue(undefined);

vi.mock('@/services/notification.service', () => ({
  notificationApi: {
    markAsRead: (...args: unknown[]) => markAsReadMock(...args),
    remove: (...args: unknown[]) => removeMock(...args),
  },
}));

const baseNotification: Notification = {
  id: 'n1',
  type: 'ORDER',
  title: 'Order Placed',
  message: 'Your order ORD-1 has been placed successfully.',
  link: '/orders/o1',
  isRead: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function renderItem(notification: Notification = baseNotification) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <NotificationItem notification={notification} />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('NotificationItem', () => {
  beforeEach(() => {
    markAsReadMock.mockClear();
    removeMock.mockClear();
  });

  it('renders title and message', () => {
    renderItem();
    expect(screen.getByText('Order Placed')).toBeInTheDocument();
    expect(screen.getByText(/has been placed successfully/)).toBeInTheDocument();
  });

  it('shows an unread indicator for an unread notification', () => {
    renderItem();
    expect(screen.getByLabelText('Unread')).toBeInTheDocument();
  });

  it('does not show an unread indicator once read', () => {
    renderItem({ ...baseNotification, isRead: true });
    expect(screen.queryByLabelText('Unread')).not.toBeInTheDocument();
  });

  it('marks the notification read when clicked', async () => {
    const user = userEvent.setup();
    renderItem();

    await user.click(screen.getByText('Order Placed'));
    expect(markAsReadMock).toHaveBeenCalledWith('n1');
  });

  it('does not re-mark an already-read notification as read', async () => {
    const user = userEvent.setup();
    renderItem({ ...baseNotification, isRead: true });

    await user.click(screen.getByText('Order Placed'));
    expect(markAsReadMock).not.toHaveBeenCalled();
  });

  it('deletes the notification when the delete button is clicked', async () => {
    const user = userEvent.setup();
    renderItem();

    await user.click(screen.getByLabelText('Delete notification'));
    expect(removeMock).toHaveBeenCalledWith('n1');
  });

  it('renders as a button (not a link) when there is no link', () => {
    renderItem({ ...baseNotification, link: undefined });
    expect(screen.getByRole('button', { name: /Order Placed/ })).toBeInTheDocument();
  });
});
