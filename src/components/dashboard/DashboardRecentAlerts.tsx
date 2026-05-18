import { recentAlerts } from "./dashboardMockData";
import type { RecentAlert } from "./dashboardMockData";

interface DashboardRecentAlertsProps {
  selectedKecamatan: string | null;
}

const risikoStyle: Record<string, { dot: string; badge: string }> = {
  "Sangat Tinggi": {
    dot: "bg-error-500 animate-pulse",
    badge: "bg-error-50 text-error-700 ring-1 ring-error-200/50 dark:bg-error-900/20 dark:text-error-400 dark:ring-error-500/20",
  },
  Tinggi: {
    dot: "bg-orange-500",
    badge: "bg-orange-50 text-orange-700 ring-1 ring-orange-200/50 dark:bg-orange-900/20 dark:text-orange-400 dark:ring-orange-500/20",
  },
  Sedang: {
    dot: "bg-warning-500",
    badge: "bg-warning-50 text-warning-700 ring-1 ring-warning-200/50 dark:bg-warning-900/20 dark:text-warning-400 dark:ring-warning-500/20",
  },
  Rendah: {
    dot: "bg-success-500",
    badge: "bg-success-50 text-success-700 ring-1 ring-success-200/50 dark:bg-success-900/20 dark:text-success-400 dark:ring-success-500/20",
  },
};

function AlertRow({ alert }: { alert: RecentAlert }) {
  const style = risikoStyle[alert.tingkatRisiko];
  return (
    <tr className="group border-b border-gray-50 last:border-0 transition-colors hover:bg-brand-50/30 dark:border-gray-800 dark:hover:bg-brand-500/5">
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
            {alert.tingkatRisiko}
          </span>
        </div>
      </td>
      <td className="py-3.5 px-4 text-sm font-medium text-gray-800 dark:text-white/90">
        {alert.kecamatan}
      </td>
      <td className="py-3.5 px-4 text-sm text-gray-600 dark:text-gray-400">
        {alert.desa}
      </td>
      <td className="py-3.5 px-4">
        <span className="inline-flex items-center rounded-lg bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          {alert.aspek}
        </span>
      </td>
      <td className="py-3.5 px-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
        {alert.deskripsi}
      </td>
      <td className="py-3.5 px-4 text-xs text-gray-400 whitespace-nowrap">
        {new Date(alert.tanggal).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>
    </tr>
  );
}

export default function DashboardRecentAlerts({ selectedKecamatan }: DashboardRecentAlertsProps) {
  const filtered = selectedKecamatan
    ? recentAlerts.filter((a) => a.kecamatan === selectedKecamatan)
    : recentAlerts;

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
  );

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none">
      <div className="flex items-center justify-between p-5 pb-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-error-50 dark:bg-error-500/10">
            <svg className="h-4 w-4 text-error-600 dark:text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              Peringatan Terbaru
              {selectedKecamatan && (
                <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                  {selectedKecamatan}
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {sorted.length} kejadian tercatat
            </p>
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-2 p-12 text-center">
          <svg className="h-10 w-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-400">Tidak ada data untuk kecamatan ini.</span>
        </div>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Risiko
                </th>
                <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Kecamatan
                </th>
                <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Desa
                </th>
                <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aspek
                </th>
                <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tanggal
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((alert) => (
                <AlertRow key={alert.id} alert={alert} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
