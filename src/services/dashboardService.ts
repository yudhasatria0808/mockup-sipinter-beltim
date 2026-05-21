import api from './api';

// ===== Types =====

export interface DashboardStats {
  kewaspadaan: { total: number; sangatTinggi: number; tinggi: number; sedang: number; rendah: number };
  potensiKonflik: { total: number; sangatTinggi: number; tinggi: number; sedang: number; rendah: number };
  peristiwaKonflik: {
    total: number; sangatTinggi: number; tinggi: number; sedang: number; rendah: number;
    totalKorbanKritis: number; totalKorbanLuka: number; totalKorbanMengungsi: number; totalKerugian: number;
  };
  wna: { total: number };
  tka: { total: number };
  pendingApproval: { kewaspadaan: number; potensiKonflik: number; peristiwaKonflik: number; total: number };
}

export interface MapKecamatanData {
  kecamatan: string;
  kodeBps: string | null;
  latitude: number | null;
  longitude: number | null;
  totalKonflik: number;
  risikoTinggi: number;
  risikoSedang: number;
  risikoRendah: number;
  kewaspadaan: number;
  potensiKonflik: number;
  peristiwaKonflik: number;
  wna: number;
  tka: number;
}

export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  intensity: number;
  type: 'kewaspadaan' | 'potensi' | 'peristiwa';
}

export interface MapData {
  kecamatan: MapKecamatanData[];
  heatmapPoints: HeatmapPoint[];
}

export interface HeatmapMatrixData {
  aspekList: string[];
  kecamatanList: string[];
  matrix: Record<string, string | number>[];
}

export interface TrendItem {
  bulan: string;
  bulanLabel: string;
  kewaspadaan: number;
  potensiKonflik: number;
  peristiwaKonflik: number;
}

export interface DashboardRecentItem {
  id: string;
  type: 'kewaspadaan' | 'potensi' | 'peristiwa';
  kecamatan: string;
  desa: string;
  aspek: string;
  tingkatRisiko: string;
  deskripsi: string;
  status: string;
  tanggal: string;
}

export interface AspekDistribusi {
  aspek: string;
  kewaspadaan: number;
  potensiKonflik: number;
  total: number;
}

// ===== Service =====

export const dashboardService = {
  /** Fetch aggregated dashboard statistics */
  async getStats(): Promise<DashboardStats> {
    const res = await api.get('/api/dashboard/stats');
    return res.data.data;
  },

  /** Fetch map data (kecamatan markers + heatmap points) */
  async getMapData(): Promise<MapData> {
    const res = await api.get('/api/dashboard/map');
    return res.data.data;
  },

  /** Fetch heatmap matrix (aspek x kecamatan) */
  async getHeatmapMatrix(): Promise<HeatmapMatrixData> {
    const res = await api.get('/api/dashboard/heatmap');
    return res.data.data;
  },

  /** Fetch monthly trend data */
  async getTrend(months?: number): Promise<TrendItem[]> {
    const params = months ? `?months=${months}` : '';
    const res = await api.get(`/api/dashboard/trend${params}`);
    return res.data.data;
  },

  /** Fetch recent items from all categories */
  async getRecent(limit?: number): Promise<DashboardRecentItem[]> {
    const params = limit ? `?limit=${limit}` : '';
    const res = await api.get(`/api/dashboard/recent${params}`);
    return res.data.data;
  },

  /** Fetch aspek distribution */
  async getAspekDistribution(): Promise<AspekDistribusi[]> {
    const res = await api.get('/api/dashboard/aspek-distribution');
    return res.data.data;
  },
};

export default dashboardService;
