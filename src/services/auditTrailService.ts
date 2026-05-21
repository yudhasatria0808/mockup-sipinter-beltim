import api from './api';
import type { AuditTrailQuery, AuditTrailPagedResult } from '../types/auditTrail';

export const auditTrailService = {
  async getTableNames(): Promise<string[]> {
    const res = await api.get('/api/audit-trail/tables');
    return res.data.data;
  },

  async getList(query: AuditTrailQuery): Promise<AuditTrailPagedResult> {
    const params = new URLSearchParams();
    if (query.tableName) params.append('tableName', query.tableName);
    if (query.action) params.append('action', query.action);
    if (query.userId) params.append('userId', query.userId);
    if (query.fromDate) params.append('fromDate', query.fromDate);
    if (query.toDate) params.append('toDate', query.toDate);
    params.append('page', query.page.toString());
    params.append('pageSize', query.pageSize.toString());

    const res = await api.get(`/api/audit-trail?${params.toString()}`);
    return res.data;
  },
};

export default auditTrailService;
