import { api } from './api';
import type { ApiSuccessResponse } from '@/types/auth.types';
import type { DashboardSummary } from '@/types/dashboard.types';

export const dashboardApi = {
  async summary(): Promise<DashboardSummary> {
    const { data } = await api.get<ApiSuccessResponse<{ summary: DashboardSummary }>>('/dashboard/summary');
    return data.data.summary;
  },
};
