import api from './api';
import type { PaginatedResponse } from '../types';
import type { WNA } from '../types/wna';

interface PaginatedParams {
  generalSearch?: string; kewarganegaraan?: string; jenisVisa?: string; statusTinggal?: string; status?: string;
  pageNumber: number; pageSize: number;
}

export const wnaService = {
  async getPaginated(req: PaginatedParams): Promise<PaginatedResponse<WNA>> {
    const params = new URLSearchParams();
    if (req.generalSearch) params.append('generalSearch', req.generalSearch);
    if (req.kewarganegaraan) params.append('kewarganegaraan', req.kewarganegaraan);
    if (req.jenisVisa) params.append('jenisVisa', req.jenisVisa);
    if (req.statusTinggal) params.append('statusTinggal', req.statusTinggal);
    if (req.status) params.append('status', req.status);
    params.append('pageNumber', req.pageNumber.toString());
    params.append('pageSize', req.pageSize.toString());
    const res = await api.get(`/api/wna?${params.toString()}`);
    return res.data;
  },
  async getEWS(kewarganegaraan?: string): Promise<{ stats: unknown; items: WNA[] }> {
    const params = new URLSearchParams();
    if (kewarganegaraan) params.append('kewarganegaraan', kewarganegaraan);
    const res = await api.get(`/api/wna/ews?${params.toString()}`);
    return res.data.data;
  },
  async getById(id: string): Promise<WNA> {
    const res = await api.get(`/api/wna/${id}`);
    return res.data.data;
  },
  async create(data: Omit<WNA, 'id' | 'createdBy' | 'createdAt' | 'approvedBy' | 'approvedAt' | 'catatanApproval'>): Promise<WNA> {
    const res = await api.post('/api/wna', data);
    return res.data.data;
  },
  async update(id: string, data: unknown): Promise<WNA> {
    const res = await api.put(`/api/wna/${id}`, data);
    return res.data.data;
  },
  async approve(id: string, action: 'disetujui' | 'ditolak', catatan?: string): Promise<WNA> {
    const res = await api.post(`/api/wna/${id}/approval`, { action, catatan });
    return res.data.data;
  },
  async delete(id: string): Promise<void> { await api.delete(`/api/wna/${id}`); },
};

export default wnaService;
