import api from './api';
import type { PaginatedResponse } from '../types';

// ─── Types ───────────────────────────────────────────────

export interface ForumTopikListItem {
  id: string;
  judul: string;
  kategori: string;
  prioritas: string;
  status: string;
  jumlahKomentar: number;
  createdByName: string;
  createdByRole: string;
  createdAt: string;
  lastActivityAt?: string;
}

export interface ForumKomentarItem {
  id: string;
  isi: string;
  createdByName: string;
  createdByRole: string;
  createdAt: string;
}

export interface ForumTopikDetail {
  id: string;
  judul: string;
  isi: string;
  kategori: string;
  prioritas: string;
  status: string;
  kewaspadaanDiniId?: string;
  peristiwaKonflikId?: string;
  createdByName: string;
  createdByRole: string;
  createdAt: string;
  komentars: ForumKomentarItem[];
}

export interface ForumArahanListItem {
  id: string;
  judul: string;
  prioritas: string;
  instansiTujuan: string;
  forumTopikId?: string;
  forumTopikJudul?: string;
  jumlahTindakLanjut: number;
  tindakLanjutSelesai: number;
  createdByName: string;
  createdByRole: string;
  createdAt: string;
}

export interface ForumTindakLanjutItem {
  id: string;
  isi: string;
  status: string;
  tanggalSelesai?: string;
  createdByName: string;
  createdByRole: string;
  createdAt: string;
}

export interface ForumArahanDetail {
  id: string;
  judul: string;
  isi: string;
  prioritas: string;
  instansiTujuan: string;
  forumTopikId?: string;
  forumTopikJudul?: string;
  createdByName: string;
  createdByRole: string;
  createdAt: string;
  tindakLanjuts: ForumTindakLanjutItem[];
}

export interface ForumPengumumanListItem {
  id: string;
  judul: string;
  prioritas: string;
  isActive: boolean;
  createdByName: string;
  createdByRole: string;
  createdAt: string;
}

export interface ForumPengumumanDetail {
  id: string;
  judul: string;
  isi: string;
  prioritas: string;
  isActive: boolean;
  createdByName: string;
  createdByRole: string;
  createdAt: string;
}

// ─── Service ─────────────────────────────────────────────

export const forumService = {
  // Topik
  async getTopikList(params?: {
    generalSearch?: string;
    kategori?: string;
    prioritas?: string;
    status?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<ForumTopikListItem>> {
    const query = new URLSearchParams();
    if (params?.generalSearch) query.append('generalSearch', params.generalSearch);
    if (params?.kategori) query.append('kategori', params.kategori);
    if (params?.prioritas) query.append('prioritas', params.prioritas);
    if (params?.status) query.append('status', params.status);
    query.append('pageNumber', String(params?.pageNumber ?? 1));
    query.append('pageSize', String(params?.pageSize ?? 10));
    const res = await api.get(`/api/forum/topik?${query.toString()}`);
    return res.data;
  },

  async getTopikById(id: string): Promise<ForumTopikDetail> {
    const res = await api.get(`/api/forum/topik/${id}`);
    return res.data.data;
  },

  async createTopik(data: {
    judul: string;
    isi: string;
    kategori?: string;
    prioritas?: string;
    kewaspadaanDiniId?: string;
    peristiwaKonflikId?: string;
  }): Promise<ForumTopikDetail> {
    const res = await api.post('/api/forum/topik', data);
    return res.data.data;
  },

  async updateTopik(id: string, data: {
    judul: string;
    isi: string;
    kategori: string;
    prioritas: string;
    status: string;
  }): Promise<void> {
    await api.put(`/api/forum/topik/${id}`, data);
  },

  async deleteTopik(id: string): Promise<void> {
    await api.delete(`/api/forum/topik/${id}`);
  },

  async createKomentar(topikId: string, isi: string): Promise<ForumKomentarItem> {
    const res = await api.post(`/api/forum/topik/${topikId}/komentar`, { isi });
    return res.data.data;
  },

  async deleteKomentar(topikId: string, komentarId: string): Promise<void> {
    await api.delete(`/api/forum/topik/${topikId}/komentar/${komentarId}`);
  },

  // Arahan
  async getArahanList(params?: {
    generalSearch?: string;
    prioritas?: string;
    instansiTujuan?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<ForumArahanListItem>> {
    const query = new URLSearchParams();
    if (params?.generalSearch) query.append('generalSearch', params.generalSearch);
    if (params?.prioritas) query.append('prioritas', params.prioritas);
    if (params?.instansiTujuan) query.append('instansiTujuan', params.instansiTujuan);
    query.append('pageNumber', String(params?.pageNumber ?? 1));
    query.append('pageSize', String(params?.pageSize ?? 10));
    const res = await api.get(`/api/forum/arahan?${query.toString()}`);
    return res.data;
  },

  async getArahanById(id: string): Promise<ForumArahanDetail> {
    const res = await api.get(`/api/forum/arahan/${id}`);
    return res.data.data;
  },

  async createArahan(data: {
    judul: string;
    isi: string;
    prioritas?: string;
    instansiTujuan: string;
    forumTopikId?: string;
  }): Promise<ForumArahanDetail> {
    const res = await api.post('/api/forum/arahan', data);
    return res.data.data;
  },

  async updateArahan(id: string, data: {
    judul: string;
    isi: string;
    prioritas: string;
    instansiTujuan: string;
  }): Promise<void> {
    await api.put(`/api/forum/arahan/${id}`, data);
  },

  async deleteArahan(id: string): Promise<void> {
    await api.delete(`/api/forum/arahan/${id}`);
  },

  async createTindakLanjut(arahanId: string, isi: string): Promise<ForumTindakLanjutItem> {
    const res = await api.post(`/api/forum/arahan/${arahanId}/tindak-lanjut`, { isi });
    return res.data.data;
  },

  async updateTindakLanjutStatus(arahanId: string, tindakLanjutId: string, status: string): Promise<ForumTindakLanjutItem> {
    const res = await api.put(`/api/forum/arahan/${arahanId}/tindak-lanjut/${tindakLanjutId}/status`, { status });
    return res.data.data;
  },

  // Pengumuman
  async getPengumumanList(params?: {
    generalSearch?: string;
    prioritas?: string;
    isActive?: boolean;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<ForumPengumumanListItem>> {
    const query = new URLSearchParams();
    if (params?.generalSearch) query.append('generalSearch', params.generalSearch);
    if (params?.prioritas) query.append('prioritas', params.prioritas);
    if (params?.isActive !== undefined) query.append('isActive', String(params.isActive));
    query.append('pageNumber', String(params?.pageNumber ?? 1));
    query.append('pageSize', String(params?.pageSize ?? 10));
    const res = await api.get(`/api/forum/pengumuman?${query.toString()}`);
    return res.data;
  },

  async getPengumumanById(id: string): Promise<ForumPengumumanDetail> {
    const res = await api.get(`/api/forum/pengumuman/${id}`);
    return res.data.data;
  },

  async createPengumuman(data: {
    judul: string;
    isi: string;
    prioritas?: string;
  }): Promise<ForumPengumumanDetail> {
    const res = await api.post('/api/forum/pengumuman', data);
    return res.data.data;
  },

  async updatePengumuman(id: string, data: {
    judul: string;
    isi: string;
    prioritas: string;
    isActive: boolean;
  }): Promise<void> {
    await api.put(`/api/forum/pengumuman/${id}`, data);
  },

  async deletePengumuman(id: string): Promise<void> {
    await api.delete(`/api/forum/pengumuman/${id}`);
  },
};

export default forumService;
