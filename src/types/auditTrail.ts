export interface AuditTrail {
  id: string;
  tableName: string;
  recordId: string;
  action: string;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  changedColumns: string | null;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress: string | null;
}

export interface AuditTrailQuery {
  tableName?: string;
  recordId?: string;
  action?: string;
  userId?: string;
  fromDate?: string;
  toDate?: string;
  page: number;
  pageSize: number;
}

export interface AuditTrailPagedResult {
  data: AuditTrail[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
