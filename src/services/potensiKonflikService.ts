import api from './api';
import type { PaginatedResponse } from '../types';
import type { PotensiKonflik } from '../types/potensi-konflik';

interface ListItem {
  id: string; periode: string; aspek: string; namaPotensiKonflik: string;
  kabupaten: string; kecamatan: string; desa: string;
  tingkatRisiko: string; status: string; createdBy: string; createdAt: string;
}

interface PaginatedParams {
  generalSearch?: string; aspek?: string; status?: string;
  pageNumber: number; pageSize: number;
}

interface EWSResponse {
  stats: { total: number; sangatTinggi: number; tinggi: number; sedang: number; rendah: number };
  items: PotensiKonflik[];
}

export interface PotensiKonflikPayload {
  periode: string; aspek: string; kabupaten: string; kecamatan: string; desa: string;
  alamatDetail?: string; titikKoordinat?: string; sumberInformasi?: string;
  namaPotensiKonflik: string;
  kemungkinanLevel: string; kemungkinanDeskripsi?: string;
  sumberSebabPermasalahan?: string; latarBelakangMasalah?: string;
  dampakLevel: string; dampakDeskripsi?: string;
  upayaPenanganan?: string; keteranganDetail?: string;
  rekomendasi: string; tingkatRisiko: string; status: string;
}

export const potensiKonflikService = {
  async getPaginated(req: PaginatedParams): Promise<PaginatedResponse<ListItem>> {
    const params = new URLSearchParams();
    if (req.generalSearch) params.append('generalSearch', req.generalSearch);
    if (req.aspek) params.append('aspek', req.aspek);
    if (req.status) params.append('status', req.status);
    params.append('pageNumber', req.pageNumber.toString());
    params.append('pageSize', req.pageSize.toString());
    const res = await api.get(`/api/potensi-konflik?${params.toString()}`);
    return res.data;
  },

  async getEWS(aspek?: string, tingkatRisiko?: string): Promise<EWSResponse> {
    const params = new URLSearchParams();
    if (aspek) params.append('aspek', aspek);
    if (tingkatRisiko) params.append('tingkatRisiko', tingkatRisiko);
    const res = await api.get(`/api/potensi-konflik/ews?${params.toString()}`);
    return res.data.data;
  },

  async getById(id: string): Promise<PotensiKonflik> {
    const res = await api.get(`/api/potensi-konflik/${id}`);
    return res.data.data;
  },

  async create(data: PotensiKonflikPayload): Promise<PotensiKonflik> {
    const res = await api.post('/api/potensi-konflik', data);
    return res.data.data;
  },

  async update(id: string, data: PotensiKonflikPayload): Promise<PotensiKonflik> {
    const res = await api.put(`/api/potensi-konflik/${id}`, data);
    return res.data.data;
  },

  async approve(id: string, action: 'disetujui' | 'ditolak', catatan?: string): Promise<PotensiKonflik> {
    const res = await api.post(`/api/potensi-konflik/${id}/approval`, { action, catatan });
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/potensi-konflik/${id}`);
  },
};

export default potensiKonflikService;
