import { useState } from "react";
import PageMeta from "../components/common/PageMeta";
import BelitungTimurMap from "../components/dashboard/BelitungTimurMap";
import DashboardHeatmap from "../components/dashboard/DashboardHeatmap";
import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardRecentAlerts from "../components/dashboard/DashboardRecentAlerts";

export default function AdminDashboard() {
  const [selectedKecamatan, setSelectedKecamatan] = useState<string | null>(null);

  return (
    <>
      <PageMeta title="Dashboard | SISKAMLING Belitung Timur" description="Dashboard Monitoring Konflik Belitung Timur" />
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
          <div className="hidden items-center gap-2 rounded-full bg-success-50 px-3 py-1.5 dark:bg-success-500/10 sm:flex">
            <span className="h-2 w-2 rounded-full bg-success-500 animate-pulse" />
            <span className="text-xs font-medium text-success-700 dark:text-success-400">Live</span>
          </div>
        </div>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Map & Heatmap */}
        <div className="grid grid-cols-1 gap-6">
          {/* Peta Belitung Timur */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
                <svg className="h-4 w-4 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                Peta Sebaran Konflik
              </h3>
            </div>
            <BelitungTimurMap
              selectedKecamatan={selectedKecamatan}
              onSelectKecamatan={setSelectedKecamatan}
            />
          </div>

          {/* Heatmap */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-500/10">
                <svg className="h-4 w-4 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                Heatmap Intensitas per Kecamatan
              </h3>
            </div>
            <DashboardHeatmap onSelectKecamatan={setSelectedKecamatan} />
          </div>
        </div>

        {/* Recent Alerts */}
        <DashboardRecentAlerts selectedKecamatan={selectedKecamatan} />
      </div>
    </>
  );
}
