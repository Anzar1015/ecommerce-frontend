import { api } from './api';
import type {
  ApiSuccessResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from '@/types/auth.types';

export const authApi = {
  async register(payload: RegisterPayload): Promise<User> {
    const { data } = await api.post<ApiSuccessResponse<{ user: User }>>('/auth/register', payload);
    return data.data.user;
  },

  async login(payload: LoginPayload): Promise<User> {
    const { data } = await api.post<ApiSuccessResponse<{ user: User }>>('/auth/login', payload);
    return data.data.user;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async me(): Promise<User> {
    const { data } = await api.get<ApiSuccessResponse<{ user: User }>>('/auth/me');
    return data.data.user;
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    await api.post('/auth/forgot-password', payload);
  },

  async resetPassword({ token, password }: ResetPasswordPayload): Promise<void> {
    await api.post(`/auth/reset-password/${token}`, { password });
  },
};
