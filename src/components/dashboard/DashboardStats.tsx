import { kecamatanData, recentAlerts } from "./dashboardMockData";

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  iconBg: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, color, iconBg, icon }: StatCardProps) {
  return (
    <div className={`hover-lift rounded-2xl border p-4 ${color}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="text-xs mt-0.5 opacity-70 truncate">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardStats() {
  const totalKonflik = kecamatanData.reduce((sum, k) => sum + k.totalKonflik, 0);
  const totalTinggi = kecamatanData.reduce((sum, k) => sum + k.risikoTinggi, 0);
  const totalSedang = kecamatanData.reduce((sum, k) => sum + k.risikoSedang, 0);
  const totalRendah = kecamatanData.reduce((sum, k) => sum + k.risikoRendah, 0);
  const kecamatanTerdampak = kecamatanData.filter((k) => k.totalKonflik > 0).length;
  const sangatTinggi = recentAlerts.filter((a) => a.tingkatRisiko === "Sangat Tinggi").length;

  return (
    <div className="stagger-children grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard
        label="Total Konflik"
        value={totalKonflik}
        color="bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 text-gray-800 dark:text-white/90 shadow-sm"
        iconBg="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      />
      <StatCard
        label="Sangat Tinggi"
        value={sangatTinggi}
        color="bg-gradient-to-br from-error-50 to-white dark:from-error-900/20 dark:to-gray-900 border-error-200/80 dark:border-error-800/50 text-error-700 dark:text-error-400"
        iconBg="bg-error-100 dark:bg-error-500/20 text-error-600 dark:text-error-400"
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        }
      />
      <StatCard
        label="Risiko Tinggi"
        value={totalTinggi}
        color="bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-900 border-orange-200/80 dark:border-orange-800/50 text-orange-700 dark:text-orange-400"
        iconBg="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400"
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatCard
        label="Risiko Sedang"
        value={totalSedang}
        color="bg-gradient-to-br from-warning-50 to-white dark:from-warning-900/20 dark:to-gray-900 border-warning-200/80 dark:border-warning-800/50 text-warning-700 dark:text-warning-400"
        iconBg="bg-warning-100 dark:bg-warning-500/20 text-warning-600 dark:text-warning-400"
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatCard
        label="Risiko Rendah"
        value={totalRendah}
        color="bg-gradient-to-br from-success-50 to-white dark:from-success-900/20 dark:to-gray-900 border-success-200/80 dark:border-success-800/50 text-success-700 dark:text-success-400"
        iconBg="bg-success-100 dark:bg-success-500/20 text-success-600 dark:text-success-400"
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatCard
        label="Kecamatan Terdampak"
        value={kecamatanTerdampak}
        color="bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/20 dark:to-gray-900 border-brand-200/80 dark:border-brand-800/50 text-brand-700 dark:text-brand-400"
        iconBg="bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400"
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      />
    </div>
  );
}
