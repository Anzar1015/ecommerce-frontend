import { api } from './api';
import type { ApiSuccessResponse } from '@/types/auth.types';
import type { Address, AddressFormValues } from '@/types/address.types';

export const addressApi = {
  async list(): Promise<Address[]> {
    const { data } = await api.get<ApiSuccessResponse<{ addresses: Address[] }>>('/addresses');
    return data.data.addresses;
  },

  async create(values: AddressFormValues): Promise<Address> {
    const { data } = await api.post<ApiSuccessResponse<{ address: Address }>>('/addresses', values);
    return data.data.address;
  },

  async update(id: string, values: Partial<AddressFormValues>): Promise<Address> {
    const { data } = await api.patch<ApiSuccessResponse<{ address: Address }>>(
      `/addresses/${id}`,
      values
    );
    return data.data.address;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/addresses/${id}`);
  },
};
