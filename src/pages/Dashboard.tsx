import { useState, useEffect, useCallback } from "react";
import PageMeta from "../components/common/PageMeta";
import BelitungTimurMap from "../components/dashboard/BelitungTimurMap";
import DashboardHeatmap from "../components/dashboard/DashboardHeatmap";
import DashboardStatsLive from "../components/dashboard/DashboardStatsLive";
import DashboardRecentAlertsLive from "../components/dashboard/DashboardRecentAlertsLive";
import { dashboardService } from "../services/dashboardService";
import type {
  DashboardStats,
  DashboardRecentItem,
  MapKecamatanData,
  HeatmapPoint,
  HeatmapMatrixData,
} from "../services/dashboardService";

export default function AdminDashboard() {
  const [selectedKecamatan, setSelectedKecamatan] = useState<string | null>(null);

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentItems, setRecentItems] = useState<DashboardRecentItem[]>([]);
  const [mapKecamatan, setMapKecamatan] = useState<MapKecamatanData[]>([]);
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([]);
  const [heatmapMatrix, setHeatmapMatrix] = useState<HeatmapMatrixData | null>(null);

  // Loading states
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingMap, setLoadingMap] = useState(true);
  const [loadingHeatmap, setLoadingHeatmap] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAll = useCallback(async () => {
    setLoadingStats(true);
    setLoadingMap(true);
    setLoadingHeatmap(true);
    setLoadingRecent(true);

    const [statsRes, mapRes, heatmapRes, recentRes] = await Promise.allSettled([
      dashboardService.getStats(),
      dashboardService.getMapData(),
      dashboardService.getHeatmapMatrix(),
      dashboardService.getRecent(10),
    ]);

    if (statsRes.status === 'fulfilled') setStats(statsRes.value);
    setLoadingStats(false);

    if (mapRes.status === 'fulfilled') {
      setMapKecamatan(mapRes.value.kecamatan);
      setHeatmapPoints(mapRes.value.heatmapPoints);
    }
    setLoadingMap(false);

    if (heatmapRes.status === 'fulfilled') setHeatmapMatrix(heatmapRes.value);
    setLoadingHeatmap(false);

    if (recentRes.status === 'fulfilled') setRecentItems(recentRes.value);
    setLoadingRecent(false);

    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchAll, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const isAnyLoading = loadingStats || loadingMap || loadingHeatmap || loadingRecent;

  return (
    <>
      <PageMeta title="Dashboard | SIPINTAR Belitung Timur" description="Dashboard Monitoring Konflik Belitung Timur" />
      <div className="animate-fade-in-up space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              Dashboard Monitoring
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Sistem Informasi Kewaspadaan Dini — Kabupaten Belitung Timur
            </p>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            {lastUpdated && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Diperbarui: {lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={fetchAll}
              disabled={isAnyLoading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg className={`h-3.5 w-3.5 ${isAnyLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <div className="flex items-center gap-2 rounded-full bg-success-50 px-3 py-1.5 dark:bg-success-500/10">
              <span className="h-2 w-2 rounded-full bg-success-500 animate-pulse" />
              <span className="text-xs font-medium text-success-700 dark:text-success-400">Live</span>
            </div>
          </div>
        </div>

        {/* Pending Approval Banner */}
        {stats && stats.pendingApproval.total > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-warning-200 bg-warning-50 p-4 dark:border-warning-800 dark:bg-warning-900/20">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/20">
              <svg className="h-5 w-5 text-warning-600 dark:text-warning-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-warning-800 dark:text-warning-300">
                {stats.pendingApproval.total} laporan menunggu persetujuan
              </p>
              <p className="text-xs text-warning-600 dark:text-warning-400 mt-0.5">
                Kewaspadaan: {stats.pendingApproval.kewaspadaan} • Potensi: {stats.pendingApproval.potensiKonflik} • Peristiwa: {stats.pendingApproval.peristiwaKonflik}
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <DashboardStatsLive stats={stats} loading={loadingStats} />

        {/* Map */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
              <svg className="h-4 w-4 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                Peta Sebaran Konflik — Belitung Timur
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Klik marker atau area untuk filter data • Data real-time dari API
              </p>
            </div>
          </div>
          <BelitungTimurMap
            selectedKecamatan={selectedKecamatan}
            onSelectKecamatan={setSelectedKecamatan}
            kecamatanData={mapKecamatan}
            heatmapPoints={heatmapPoints}
            loading={loadingMap}
          />
        </div>

        {/* Heatmap Matrix */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-500/10">
              <svg className="h-4 w-4 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                Heatmap Intensitas — Aspek × Kecamatan
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Matriks jumlah kejadian berdasarkan aspek dan wilayah
              </p>
            </div>
          </div>
          <DashboardHeatmap
            onSelectKecamatan={setSelectedKecamatan}
            matrixData={heatmapMatrix}
            loading={loadingHeatmap}
          />
        </div>

        {/* Recent Alerts Table */}
        <DashboardRecentAlertsLive items={recentItems} loading={loadingRecent} />
      </div>
    </>
  );
}
