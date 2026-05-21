import api from './api';
import type { PaginatedResponse } from '../types';
import type { KewaspadaanDini } from '../types/kewaspadaan';

interface KewaspadaanListItem {
  id: string;
  periode: string;
  aspek: string;
  kabupaten: string;
  kecamatan: string;
  desa: string;
  tingkatRisiko: string;
  status: string;
  createdBy: string;
  createdAt: string;
}

interface KewaspadaanPaginatedParams {
  generalSearch?: string;
  aspek?: string;
  status?: string;
  pageNumber: number;
  pageSize: number;
}

interface EWSResponse {
  stats: {
    total: number;
    sangatTinggi: number;
    tinggi: number;
    sedang: number;
    rendah: number;
  };
  items: KewaspadaanDini[];
}

export const kewaspadaanService = {
  async getPaginated(req: KewaspadaanPaginatedParams): Promise<PaginatedResponse<KewaspadaanListItem>> {
    const params = new URLSearchParams();
    if (req.generalSearch) params.append('generalSearch', req.generalSearch);
    if (req.aspek) params.append('aspek', req.aspek);
    if (req.status) params.append('status', req.status);
    params.append('pageNumber', req.pageNumber.toString());
    params.append('pageSize', req.pageSize.toString());
    const res = await api.get(`/api/kewaspadaan?${params.toString()}`);
    return res.data;
  },

  async getEWS(aspek?: string, tingkatRisiko?: string): Promise<EWSResponse> {
    const params = new URLSearchParams();
    if (aspek) params.append('aspek', aspek);
    if (tingkatRisiko) params.append('tingkatRisiko', tingkatRisiko);
    const res = await api.get(`/api/kewaspadaan/ews?${params.toString()}`);
    return res.data.data;
  },

  async getById(id: string): Promise<KewaspadaanDini> {
    const res = await api.get(`/api/kewaspadaan/${id}`);
    return res.data.data;
  },

  async create(data: KewaspadaanCreatePayload): Promise<KewaspadaanDini> {
    const res = await api.post('/api/kewaspadaan', data);
    return res.data.data;
  },

  async update(id: string, data: KewaspadaanCreatePayload): Promise<KewaspadaanDini> {
    const res = await api.put(`/api/kewaspadaan/${id}`, data);
    return res.data.data;
  },

  async approve(id: string, action: 'disetujui' | 'ditolak', catatan?: string): Promise<KewaspadaanDini> {
    const res = await api.post(`/api/kewaspadaan/${id}/approval`, { action, catatan });
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/kewaspadaan/${id}`);
  },
};

export interface KewaspadaanCreatePayload {
  periode: string;
  aspek: string;
  kabupaten: string;
  kecamatan: string;
  desa: string;
  alamatDetail?: string;
  titikKoordinat?: string;
  sumberInformasi: string;
  kemungkinanLevel: string;
  kemungkinanDeskripsi: string;
  hambatan?: string;
  tantangan?: string;
  gangguan?: string;
  dampakLevel: string;
  dampakDeskripsi: string;
  rekomendasi: string;
  tingkatRisiko: string;
  status: string;
}

export default kewaspadaanService;
