// User Service - mockup mode, static data
import type { User, UserDetail } from '../types/user';
import type { PaginatedResponse } from '../types';

const mockUsers: User[] = [
  { id: '1', username: 'admin', fullName: 'Admin SIPINTAR', email: 'admin@sipintar.go.id', isActive: true, roleId: '1', roleName: 'Administrator', createdDate: '2024-01-01T00:00:00Z' },
  { id: '2', username: 'operator1', fullName: 'Budi Santoso', email: 'operator@sipintar.go.id', isActive: true, roleId: '2', roleName: 'Operator', createdDate: '2024-02-01T00:00:00Z' },
  { id: '3', username: 'viewer1', fullName: 'Bupati Belitung Timur', email: 'pimpinan@sipintar.go.id', isActive: true, roleId: '3', roleName: 'Viewer', createdDate: '2024-03-01T00:00:00Z' },
  { id: '4', username: 'operator2', fullName: 'Siti Rahayu', email: 'siti@sipintar.go.id', isActive: true, roleId: '2', roleName: 'Operator', createdDate: '2024-04-15T00:00:00Z' },
  { id: '5', username: 'viewer2', fullName: 'Camat Manggar', email: 'camat.manggar@sipintar.go.id', isActive: false, roleId: '3', roleName: 'Viewer', createdDate: '2024-05-10T00:00:00Z' },
];

export const userService = {
  async getPaginated(req: { generalSearch?: string; pageNumber: number; pageSize: number }): Promise<PaginatedResponse<User>> {
    const filtered = mockUsers.filter(u =>
      !req.generalSearch ||
      u.fullName.toLowerCase().includes(req.generalSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(req.generalSearch.toLowerCase())
    );
    return { data: filtered, currentPage: req.pageNumber, pageSize: req.pageSize, totalPages: 1, totalCount: filtered.length };
  },
  async getById(id: string): Promise<UserDetail> {
    const user = mockUsers.find(u => u.id === id) ?? mockUsers[0];
    return { ...user, mustChangePassword: false, updatedDate: null };
  },
  async create(_data: unknown): Promise<UserDetail> { return { ...mockUsers[0], mustChangePassword: false, updatedDate: null }; },
  async update(_id: string, _data: unknown): Promise<UserDetail> { return { ...mockUsers[0], mustChangePassword: false, updatedDate: null }; },
  async delete(_id: string): Promise<void> {},
  async toggleStatus(_id: string): Promise<void> {},
  async resetPassword(_id: string, _data: unknown): Promise<void> {},
};

export default userService;
