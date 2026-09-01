import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationBell } from './NotificationBell';

const listMock = vi.fn();

vi.mock('@/services/notification.service', () => ({
  notificationApi: {
    list: (...args: unknown[]) => listMock(...args),
  },
}));

function renderBell() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <NotificationBell />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('NotificationBell', () => {
  it('shows the unread count badge', async () => {
    listMock.mockResolvedValue({
      notifications: [],
      pagination: { page: 1, limit: 1, total: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
      unreadCount: 4,
    });

    renderBell();
    await waitFor(() => expect(screen.getByText('4')).toBeInTheDocument());
  });

  it('shows no badge when there are no unread notifications', async () => {
    listMock.mockResolvedValue({
      notifications: [],
      pagination: { page: 1, limit: 1, total: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
      unreadCount: 0,
    });

    renderBell();
    await waitFor(() => expect(listMock).toHaveBeenCalled());
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('caps the badge at "99+"', async () => {
    listMock.mockResolvedValue({
      notifications: [],
      pagination: { page: 1, limit: 1, total: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
      unreadCount: 150,
    });

    renderBell();
    await waitFor(() => expect(screen.getByText('99+')).toBeInTheDocument());
  });

  it('opens the notification panel when clicked', async () => {
    listMock.mockResolvedValue({
      notifications: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
      unreadCount: 0,
    });
    const user = userEvent.setup();
    renderBell();

    await user.click(screen.getByLabelText('Notifications'));
    await waitFor(() => expect(screen.getByText('No notifications')).toBeInTheDocument());
  });
});
