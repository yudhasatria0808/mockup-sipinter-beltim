import api from './api';
import type { User, UserDetail, UserCreateRequest, UserUpdateRequest, UserResetPasswordRequest } from '../types/user';
import type { PaginatedResponse } from '../types';

export const userService = {
  async getPaginated(req: { generalSearch?: string; pageNumber: number; pageSize: number }): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    if (req.generalSearch) params.append('generalSearch', req.generalSearch);
    params.append('pageNumber', req.pageNumber.toString());
    params.append('pageSize', req.pageSize.toString());

    const res = await api.get(`/api/users?${params.toString()}`);
    return res.data;
  },

  async getById(id: string): Promise<UserDetail> {
    const res = await api.get(`/api/users/${id}`);
    return res.data.data;
  },

  async create(data: UserCreateRequest): Promise<UserDetail> {
    const res = await api.post('/api/users', data);
    return res.data.data;
  },

  async update(id: string, data: UserUpdateRequest): Promise<UserDetail> {
    const res = await api.put(`/api/users/${id}`, data);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/users/${id}`);
  },

  async toggleStatus(id: string): Promise<void> {
    await api.post(`/api/users/${id}/toggle-status`);
  },

  async resetPassword(id: string, data: UserResetPasswordRequest): Promise<void> {
    await api.post(`/api/users/${id}/reset-password`, data);
  },
};

export default userService;
