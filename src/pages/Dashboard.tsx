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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Dashboard Monitoring
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sistem Informasi Kewaspadaan Dini — Kabupaten Belitung Timur
          </p>
        </div>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Map & Heatmap */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Peta Belitung Timur */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-4">
              Peta Sebaran Konflik — Belitung Timur
            </h3>
            <BelitungTimurMap
              selectedKecamatan={selectedKecamatan}
              onSelectKecamatan={setSelectedKecamatan}
            />
          </div>

          {/* Heatmap */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-4">
              Heatmap Intensitas Konflik per Kecamatan
            </h3>
            <DashboardHeatmap onSelectKecamatan={setSelectedKecamatan} />
          </div>
        </div>

        {/* Recent Alerts */}
        <DashboardRecentAlerts selectedKecamatan={selectedKecamatan} />
      </div>
    </>
  );
}
