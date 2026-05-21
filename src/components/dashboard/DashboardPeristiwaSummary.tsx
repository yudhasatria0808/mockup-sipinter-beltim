import type { DashboardStats } from "../../services/dashboardService";

interface DashboardPeristiwaSummaryProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export default function DashboardPeristiwaSummary({ stats, loading }: DashboardPeristiwaSummaryProps) {
  if (loading || !stats) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/80">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-48 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { peristiwaKonflik } = stats;

  const items = [
    {
      label: "Korban Kritis",
      value: peristiwaKonflik.totalKorbanKritis,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: "text-error-600 dark:text-error-400",
      bg: "bg-error-50 dark:bg-error-500/10",
    },
    {
      label: "Korban Luka",
      value: peristiwaKonflik.totalKorbanLuka,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-500/10",
    },
    {
      label: "Mengungsi",
      value: peristiwaKonflik.totalKorbanMengungsi,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "text-warning-600 dark:text-warning-400",
      bg: "bg-warning-50 dark:bg-warning-500/10",
    },
    {
      label: "Kerugian Materil",
      value: peristiwaKonflik.totalKerugian,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-500/10",
    },
  ];

  const formatValue = (value: number, isRupiah: boolean) => {
    if (isRupiah && value > 0) {
      return `Rp ${value.toLocaleString('id-ID')}`;
    }
    return value.toLocaleString('id-ID');
  };

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-500/10">
          <svg className="h-4 w-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Dampak Peristiwa Konflik
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Total {peristiwaKonflik.total} peristiwa tercatat
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.bg} ${item.color}`}>
              {item.icon}
            </div>
            <div className="min-w-0">
              <p className={`text-lg font-bold ${item.color}`}>
                {formatValue(item.value, idx === 3)}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
