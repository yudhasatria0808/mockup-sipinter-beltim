import api from './api';
import type { PaginatedResponse } from '../types';
import type { PeristiwaKonflik } from '../types/peristiwa-konflik';

interface ListItem {
  id: string; periode: string; namaPeristiwa: string;
  kabupaten: string; kecamatan: string; desa: string;
  korbanKritis: number; korbanLukaLuka: number; korbanMengungsi: number;
  kerugianMateril: number; tingkatRisiko: string; status: string;
  createdBy: string; createdAt: string;
}

interface PaginatedParams {
  generalSearch?: string; tingkatRisiko?: string; status?: string;
  pageNumber: number; pageSize: number;
}

interface EWSResponse {
  stats: { total: number; sangatTinggi: number; tinggi: number; sedang: number; rendah: number; totalKorbanKritis: number; totalKorbanLuka: number; totalKorbanMengungsi: number; totalKerugian: number };
  items: PeristiwaKonflik[];
}

export interface PeristiwaKonflikPayload {
  periode: string; namaPeristiwa: string; sumberSebabKonflik?: string;
  latarBelakangKejadian?: string; deskripsiAkibatPeristiwa?: string;
  korbanKritis: number; korbanLukaLuka: number; korbanMengungsi: number; kerugianMateril: number;
  upayaPenanganan?: string; upayaPemulihan?: string;
  kabupaten: string; kecamatan: string; desa: string;
  alamatDetail?: string; titikKoordinat?: string;
  sumberInformasi?: string; keterangan?: string; saranTindakLanjut?: string;
  tingkatRisiko: string; status: string;
}

export const peristiwaKonflikService = {
  async getPaginated(req: PaginatedParams): Promise<PaginatedResponse<ListItem>> {
    const params = new URLSearchParams();
    if (req.generalSearch) params.append('generalSearch', req.generalSearch);
    if (req.tingkatRisiko) params.append('tingkatRisiko', req.tingkatRisiko);
    if (req.status) params.append('status', req.status);
    params.append('pageNumber', req.pageNumber.toString());
    params.append('pageSize', req.pageSize.toString());
    const res = await api.get(`/api/peristiwa-konflik?${params.toString()}`);
    return res.data;
  },

  async getEWS(tingkatRisiko?: string): Promise<EWSResponse> {
    const params = new URLSearchParams();
    if (tingkatRisiko) params.append('tingkatRisiko', tingkatRisiko);
    const res = await api.get(`/api/peristiwa-konflik/ews?${params.toString()}`);
    return res.data.data;
  },

  async getById(id: string): Promise<PeristiwaKonflik> {
    const res = await api.get(`/api/peristiwa-konflik/${id}`);
    return res.data.data;
  },

  async create(data: PeristiwaKonflikPayload): Promise<PeristiwaKonflik> {
    const res = await api.post('/api/peristiwa-konflik', data);
    return res.data.data;
  },

  async update(id: string, data: PeristiwaKonflikPayload): Promise<PeristiwaKonflik> {
    const res = await api.put(`/api/peristiwa-konflik/${id}`, data);
    return res.data.data;
  },

  async approve(id: string, action: 'disetujui' | 'ditolak', catatan?: string): Promise<PeristiwaKonflik> {
    const res = await api.post(`/api/peristiwa-konflik/${id}/approval`, { action, catatan });
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/peristiwa-konflik/${id}`);
  },
};

export default peristiwaKonflikService;
