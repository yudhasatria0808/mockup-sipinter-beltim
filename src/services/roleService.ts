// Role Service - mockup mode, static data
import type { Role, RoleDetail, RolePermission } from '../types/role';
import type { PaginatedResponse } from '../types';

const mockRoles: Role[] = [
  { id: '1', name: 'Administrator', description: 'Full access', isProtected: true },
  { id: '2', name: 'Operator', description: 'Limited access', isProtected: false },
  { id: '3', name: 'Viewer', description: 'Read only', isProtected: false },
];

export const roleService = {
  async getPaginated(req: { generalSearch?: string; pageNumber: number; pageSize: number }): Promise<PaginatedResponse<Role>> {
    const filtered = mockRoles.filter(r =>
      !req.generalSearch || r.name.toLowerCase().includes(req.generalSearch.toLowerCase())
    );
    return { data: filtered, currentPage: req.pageNumber, pageSize: req.pageSize, totalPages: 1, totalCount: filtered.length };
  },
  async getAll(): Promise<Role[]> { return mockRoles; },
  async getById(id: string): Promise<RoleDetail> {
    const role = mockRoles.find(r => r.id === id) ?? mockRoles[0];
    return { ...role, rolePermission: [] };
  },
  async getDefaultPermissions(): Promise<RolePermission[]> { return []; },
  async create(_data: unknown): Promise<RoleDetail> { return { ...mockRoles[0], rolePermission: [] }; },
  async update(_id: string, _data: unknown): Promise<RoleDetail> { return { ...mockRoles[0], rolePermission: [] }; },
  async delete(_id: string): Promise<void> {},
};

export default roleService;
