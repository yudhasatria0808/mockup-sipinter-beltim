import api from './api';
import type { PaginatedResponse } from '../types';
import type { TKA } from '../types/tka';

interface PaginatedParams {
  generalSearch?: string; kewarganegaraan?: string; jenisIzinTinggal?: string; status?: string;
  pageNumber: number; pageSize: number;
}

export const tkaService = {
  async getPaginated(req: PaginatedParams): Promise<PaginatedResponse<TKA>> {
    const params = new URLSearchParams();
    if (req.generalSearch) params.append('generalSearch', req.generalSearch);
    if (req.kewarganegaraan) params.append('kewarganegaraan', req.kewarganegaraan);
    if (req.jenisIzinTinggal) params.append('jenisIzinTinggal', req.jenisIzinTinggal);
    if (req.status) params.append('status', req.status);
    params.append('pageNumber', req.pageNumber.toString());
    params.append('pageSize', req.pageSize.toString());
    const res = await api.get(`/api/tka?${params.toString()}`);
    return res.data;
  },
  async getEWS(kewarganegaraan?: string): Promise<{ stats: unknown; items: TKA[] }> {
    const params = new URLSearchParams();
    if (kewarganegaraan) params.append('kewarganegaraan', kewarganegaraan);
    const res = await api.get(`/api/tka/ews?${params.toString()}`);
    return res.data.data;
  },
  async getById(id: string): Promise<TKA> {
    const res = await api.get(`/api/tka/${id}`);
    return res.data.data;
  },
  async create(data: unknown): Promise<TKA> {
    const res = await api.post('/api/tka', data);
    return res.data.data;
  },
  async update(id: string, data: unknown): Promise<TKA> {
    const res = await api.put(`/api/tka/${id}`, data);
    return res.data.data;
  },
  async approve(id: string, action: 'disetujui' | 'ditolak', catatan?: string): Promise<TKA> {
    const res = await api.post(`/api/tka/${id}/approval`, { action, catatan });
    return res.data.data;
  },
  async delete(id: string): Promise<void> { await api.delete(`/api/tka/${id}`); },
};

export default tkaService;
