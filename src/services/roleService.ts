import api from './api';
import type { Role, RoleDetail, RolePermission, RoleCreateRequest } from '../types/role';
import type { PaginatedResponse } from '../types';

export const roleService = {
  async getPaginated(req: { generalSearch?: string; pageNumber: number; pageSize: number }): Promise<PaginatedResponse<Role>> {
    const params = new URLSearchParams();
    if (req.generalSearch) params.append('generalSearch', req.generalSearch);
    params.append('pageNumber', req.pageNumber.toString());
    params.append('pageSize', req.pageSize.toString());

    const res = await api.get(`/api/roles?${params.toString()}`);
    return res.data;
  },

  async getAll(): Promise<Role[]> {
    const res = await api.get('/api/roles/all');
    return res.data.data;
  },

  async getById(id: string): Promise<RoleDetail> {
    const res = await api.get(`/api/roles/${id}`);
    return res.data.data;
  },

  async getDefaultPermissions(): Promise<RolePermission[]> {
    const res = await api.get('/api/roles/default-permissions');
    return res.data.data;
  },

  async create(data: RoleCreateRequest): Promise<RoleDetail> {
    const res = await api.post('/api/roles', data);
    return res.data.data;
  },

  async update(id: string, data: RoleCreateRequest): Promise<RoleDetail> {
    const res = await api.put(`/api/roles/${id}`, data);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/roles/${id}`);
  },
};

export default roleService;
