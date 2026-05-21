import api from './api';
import type { PaginatedResponse } from '../types';
import type { Aspek } from '../types/aspek';
import type { JenisKonflik } from '../types/jenisKonflik';
import type { Instansi } from '../types/instansi';
import type { LevelKemungkinan, LevelDampak, LevelRisiko } from '../types/risiko-matriks';

interface PaginatedParams {
  generalSearch?: string;
  pageNumber: number;
  pageSize: number;
  [key: string]: unknown;
}

function buildParams(req: PaginatedParams) {
  const params = new URLSearchParams();
  Object.entries(req).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '')
      params.append(key, String(value));
  });
  return params.toString();
}

// ===== ASPEK =====
export const aspekService = {
  async getPaginated(req: PaginatedParams): Promise<PaginatedResponse<Aspek>> {
    const res = await api.get(`/api/aspek?${buildParams(req)}`);
    return res.data;
  },
  async getAll(): Promise<Aspek[]> {
    const res = await api.get('/api/aspek/all');
    return res.data.data;
  },
  async getById(id: string): Promise<Aspek> {
    const res = await api.get(`/api/aspek/${id}`);
    return res.data.data;
  },
  async create(data: { nama: string; deskripsi?: string }): Promise<Aspek> {
    const res = await api.post('/api/aspek', data);
    return res.data.data;
  },
  async update(id: string, data: { nama: string; deskripsi?: string }): Promise<Aspek> {
    const res = await api.put(`/api/aspek/${id}`, data);
    return res.data.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/aspek/${id}`);
  },
};

// ===== JENIS KONFLIK =====
export const jenisKonflikService = {
  async getPaginated(req: PaginatedParams): Promise<PaginatedResponse<JenisKonflik>> {
    const res = await api.get(`/api/jenis-konflik?${buildParams(req)}`);
    return res.data;
  },
  async getAll(): Promise<JenisKonflik[]> {
    const res = await api.get('/api/jenis-konflik/all');
    return res.data.data;
  },
  async getById(id: string): Promise<JenisKonflik> {
    const res = await api.get(`/api/jenis-konflik/${id}`);
    return res.data.data;
  },
  async create(data: { nama: string; deskripsi?: string }): Promise<JenisKonflik> {
    const res = await api.post('/api/jenis-konflik', data);
    return res.data.data;
  },
  async update(id: string, data: { nama: string; deskripsi?: string }): Promise<JenisKonflik> {
    const res = await api.put(`/api/jenis-konflik/${id}`, data);
    return res.data.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/jenis-konflik/${id}`);
  },
};

// ===== INSTANSI =====
export const instansiService = {
  async getPaginated(req: PaginatedParams): Promise<PaginatedResponse<Instansi>> {
    const res = await api.get(`/api/instansi?${buildParams(req)}`);
    return res.data;
  },
  async getAll(): Promise<Instansi[]> {
    const res = await api.get('/api/instansi/all');
    return res.data.data;
  },
  async getById(id: string): Promise<Instansi> {
    const res = await api.get(`/api/instansi/${id}`);
    return res.data.data;
  },
  async create(data: { nama: string; deskripsi?: string }): Promise<Instansi> {
    const res = await api.post('/api/instansi', data);
    return res.data.data;
  },
  async update(id: string, data: { nama: string; deskripsi?: string }): Promise<Instansi> {
    const res = await api.put(`/api/instansi/${id}`, data);
    return res.data.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/instansi/${id}`);
  },
};

// ===== WILAYAH =====
interface WilayahParams extends PaginatedParams {
  tipe?: string;
  parentId?: string;
}

export interface WilayahDto {
  id: string;
  tipe: string;
  nama: string;
  kodeBps: string;
  parentId?: string | null;
  parentNama?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export const wilayahService = {
  async getPaginated(req: WilayahParams): Promise<PaginatedResponse<WilayahDto>> {
    const res = await api.get(`/api/wilayah?${buildParams(req as PaginatedParams)}`);
    return res.data;
  },
  async getAll(tipe?: string, parentId?: string): Promise<WilayahDto[]> {
    const params = new URLSearchParams();
    if (tipe) params.append('tipe', tipe);
    if (parentId) params.append('parentId', parentId);
    const res = await api.get(`/api/wilayah/all?${params.toString()}`);
    return res.data.data;
  },
  async getById(id: string): Promise<WilayahDto> {
    const res = await api.get(`/api/wilayah/${id}`);
    return res.data.data;
  },
  async create(data: { tipe: string; nama: string; kodeBps: string; parentId?: string | null; latitude?: number | null; longitude?: number | null }): Promise<WilayahDto> {
    const res = await api.post('/api/wilayah', data);
    return res.data.data;
  },
  async update(id: string, data: { tipe: string; nama: string; kodeBps: string; parentId?: string | null; latitude?: number | null; longitude?: number | null }): Promise<WilayahDto> {
    const res = await api.put(`/api/wilayah/${id}`, data);
    return res.data.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/wilayah/${id}`);
  },
};

// ===== LEVEL KEMUNGKINAN =====
export const levelKemungkinanService = {
  async getPaginated(req: PaginatedParams): Promise<PaginatedResponse<LevelKemungkinan>> {
    const res = await api.get(`/api/level-kemungkinan?${buildParams(req)}`);
    return res.data;
  },
  async getAll(): Promise<LevelKemungkinan[]> {
    const res = await api.get('/api/level-kemungkinan/all');
    return res.data.data;
  },
  async getById(id: string): Promise<LevelKemungkinan> {
    const res = await api.get(`/api/level-kemungkinan/${id}`);
    return res.data.data;
  },
  async create(data: { nama: string; skor: number; deskripsi?: string }): Promise<LevelKemungkinan> {
    const res = await api.post('/api/level-kemungkinan', data);
    return res.data.data;
  },
  async update(id: string, data: { nama: string; skor: number; deskripsi?: string }): Promise<LevelKemungkinan> {
    const res = await api.put(`/api/level-kemungkinan/${id}`, data);
    return res.data.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/level-kemungkinan/${id}`);
  },
};

// ===== LEVEL DAMPAK =====
export const levelDampakService = {
  async getPaginated(req: PaginatedParams): Promise<PaginatedResponse<LevelDampak>> {
    const res = await api.get(`/api/level-dampak?${buildParams(req)}`);
    return res.data;
  },
  async getAll(): Promise<LevelDampak[]> {
    const res = await api.get('/api/level-dampak/all');
    return res.data.data;
  },
  async getById(id: string): Promise<LevelDampak> {
    const res = await api.get(`/api/level-dampak/${id}`);
    return res.data.data;
  },
  async create(data: { nama: string; skor: number; deskripsi?: string }): Promise<LevelDampak> {
    const res = await api.post('/api/level-dampak', data);
    return res.data.data;
  },
  async update(id: string, data: { nama: string; skor: number; deskripsi?: string }): Promise<LevelDampak> {
    const res = await api.put(`/api/level-dampak/${id}`, data);
    return res.data.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/level-dampak/${id}`);
  },
};

// ===== LEVEL RISIKO =====
export const levelRisikoService = {
  async getPaginated(req: PaginatedParams): Promise<PaginatedResponse<LevelRisiko>> {
    const res = await api.get(`/api/level-risiko?${buildParams(req)}`);
    return res.data;
  },
  async getAll(): Promise<LevelRisiko[]> {
    const res = await api.get('/api/level-risiko/all');
    return res.data.data;
  },
  async getById(id: string): Promise<LevelRisiko> {
    const res = await api.get(`/api/level-risiko/${id}`);
    return res.data.data;
  },
  async create(data: { nama: string; warna: string; skorMin: number; skorMax: number }): Promise<LevelRisiko> {
    const res = await api.post('/api/level-risiko', data);
    return res.data.data;
  },
  async update(id: string, data: { nama: string; warna: string; skorMin: number; skorMax: number }): Promise<LevelRisiko> {
    const res = await api.put(`/api/level-risiko/${id}`, data);
    return res.data.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/level-risiko/${id}`);
  },
};

// ===== MATRIKS RISIKO =====
export interface MatriksRisikoDto {
  id: string;
  kemungkinanId: string;
  kemungkinanNama: string;
  kemungkinanSkor: number;
  dampakId: string;
  dampakNama: string;
  dampakSkor: number;
  levelRisikoId: string;
  levelRisikoNama: string;
  levelRisikoWarna: string;
}

export const matriksRisikoService = {
  async getAll(): Promise<MatriksRisikoDto[]> {
    const res = await api.get('/api/matriks-risiko');
    return res.data.data;
  },
  async create(data: { kemungkinanId: string; dampakId: string; levelRisikoId: string }): Promise<MatriksRisikoDto> {
    const res = await api.post('/api/matriks-risiko', data);
    return res.data.data;
  },
  async bulkSave(items: { kemungkinanId: string; dampakId: string; levelRisikoId: string }[]): Promise<MatriksRisikoDto[]> {
    const res = await api.post('/api/matriks-risiko/bulk', { items });
    return res.data.data;
  },
  async update(id: string, data: { kemungkinanId: string; dampakId: string; levelRisikoId: string }): Promise<MatriksRisikoDto> {
    const res = await api.put(`/api/matriks-risiko/${id}`, data);
    return res.data.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/matriks-risiko/${id}`);
  },
};
