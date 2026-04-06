// Audit Trail Service - mockup mode, static data
import type { AuditTrail, AuditTrailQuery, AuditTrailPagedResult } from '../types/auditTrail';

const mockAuditTrails: AuditTrail[] = [
  { id: '1', tableName: 'Users', recordId: 'u-001', action: 'Created', oldValues: null, newValues: { username: 'admin' }, changedColumns: null, userId: '1', userName: 'system', timestamp: '2024-04-01T08:00:00Z', ipAddress: '127.0.0.1' },
  { id: '2', tableName: 'Roles', recordId: 'r-001', action: 'Updated', oldValues: { name: 'Admin' }, newValues: { name: 'Administrator' }, changedColumns: 'name', userId: '1', userName: 'admin', timestamp: '2024-04-02T09:30:00Z', ipAddress: '192.168.1.1' },
  { id: '3', tableName: 'Users', recordId: 'u-002', action: 'Deleted', oldValues: { username: 'olduser' }, newValues: null, changedColumns: null, userId: '1', userName: 'admin', timestamp: '2024-04-03T10:15:00Z', ipAddress: '192.168.1.1' },
];

export const auditTrailService = {
  async getTableNames(): Promise<string[]> {
    return ['Users', 'Roles', 'Permissions'];
  },
  async getList(_query: AuditTrailQuery): Promise<AuditTrailPagedResult> {
    return { data: mockAuditTrails, totalCount: mockAuditTrails.length, page: 1, pageSize: 15, totalPages: 1 };
  },
};

export default auditTrailService;
