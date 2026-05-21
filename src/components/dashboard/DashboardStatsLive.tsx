import { useNavigate } from "react-router";
import type { DashboardStats } from "../../services/dashboardService";

interface DashboardStatsLiveProps {
  stats: DashboardStats | null;
  loading: boolean;
}

interface StatCardProps {
  label: string;
  value: number | string;
  color: string;
  iconBg: string;
  icon: React.ReactNode;
  subtitle?: string;
  onClick?: () => void;
}

function StatCard({ label, value, color, iconBg, icon, subtitle, onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-4 ${color} transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="text-xs mt-0.5 opacity-70 truncate">{label}</p>
          {subtitle && <p className="text-[10px] mt-0.5 opacity-50 truncate">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2">
          <div className="h-6 w-12 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardStatsLive({ stats, loading }: DashboardStatsLiveProps) {
  const navigate = useNavigate();

  if (loading || !stats) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  // Aggregated risk levels across all categories (disetujui only)
  const totalSangatTinggi = stats.kewaspadaan.sangatTinggi + stats.potensiKonflik.sangatTinggi + stats.peristiwaKonflik.sangatTinggi;
  const totalTinggi = stats.kewaspadaan.tinggi + stats.potensiKonflik.tinggi + stats.peristiwaKonflik.tinggi;
  const totalSedang = stats.kewaspadaan.sedang + stats.potensiKonflik.sedang + stats.peristiwaKonflik.sedang;
  const totalRendah = stats.kewaspadaan.rendah + stats.potensiKonflik.rendah + stats.peristiwaKonflik.rendah;

  return (
    <div className="space-y-4">
      {/* Row 1: Per-module counts */}
      <div className="stagger-children grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          label="Kewaspadaan Dini"
          value={stats.kewaspadaan.total}
          subtitle="Disetujui"
          onClick={() => navigate('/kewaspadaan')}
          color="bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/20 dark:to-gray-900 border-brand-200/80 dark:border-brand-800/50 text-brand-700 dark:text-brand-400"
          iconBg="bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
        <StatCard
          label="Potensi Konflik"
          value={stats.potensiKonflik.total}
          subtitle="Disetujui"
          onClick={() => navigate('/potensi-konflik')}
          color="bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-gray-900 border-amber-200/80 dark:border-amber-800/50 text-amber-700 dark:text-amber-400"
          iconBg="bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          }
        />
        <StatCard
          label="Peristiwa Konflik"
          value={stats.peristiwaKonflik.total}
          subtitle="Disetujui"
          onClick={() => navigate('/peristiwa-konflik')}
          color="bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-gray-900 border-red-200/80 dark:border-red-800/50 text-red-700 dark:text-red-400"
          iconBg="bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
          }
        />
        <StatCard
          label="WNA Terdaftar"
          value={stats.wna.total}
          onClick={() => navigate('/wna')}
          color="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900 border-purple-200/80 dark:border-purple-800/50 text-purple-700 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="TKA Terdaftar"
          value={stats.tka.total}
          onClick={() => navigate('/tka')}
          color="bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-900/20 dark:to-gray-900 border-cyan-200/80 dark:border-cyan-800/50 text-cyan-700 dark:text-cyan-400"
          iconBg="bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      {/* Row 2: Risk level breakdown */}
      <div className="stagger-children grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Sangat Tinggi"
          value={totalSangatTinggi}
          subtitle={`K:${stats.kewaspadaan.sangatTinggi} P:${stats.potensiKonflik.sangatTinggi} E:${stats.peristiwaKonflik.sangatTinggi}`}
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
          subtitle={`K:${stats.kewaspadaan.tinggi} P:${stats.potensiKonflik.tinggi} E:${stats.peristiwaKonflik.tinggi}`}
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
          subtitle={`K:${stats.kewaspadaan.sedang} P:${stats.potensiKonflik.sedang} E:${stats.peristiwaKonflik.sedang}`}
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
          subtitle={`K:${stats.kewaspadaan.rendah} P:${stats.potensiKonflik.rendah} E:${stats.peristiwaKonflik.rendah}`}
          color="bg-gradient-to-br from-success-50 to-white dark:from-success-900/20 dark:to-gray-900 border-success-200/80 dark:border-success-800/50 text-success-700 dark:text-success-400"
          iconBg="bg-success-100 dark:bg-success-500/20 text-success-600 dark:text-success-400"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>
    </div>
  );
}
