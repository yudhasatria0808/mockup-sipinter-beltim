import { recentAlerts } from "./dashboardMockData";
import type { RecentAlert } from "./dashboardMockData";

interface DashboardRecentAlertsProps {
  selectedKecamatan: string | null;
}

const risikoStyle: Record<string, { dot: string; badge: string }> = {
  "Sangat Tinggi": {
    dot: "bg-error-500 animate-pulse",
    badge: "bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400",
  },
  Tinggi: {
    dot: "bg-orange-500",
    badge: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  },
  Sedang: {
    dot: "bg-warning-500",
    badge: "bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400",
  },
  Rendah: {
    dot: "bg-success-500",
    badge: "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400",
  },
};

function AlertRow({ alert }: { alert: RecentAlert }) {
  const style = risikoStyle[alert.tingkatRisiko];
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
            {alert.tingkatRisiko}
          </span>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-gray-800 dark:text-white/90 font-medium">
        {alert.kecamatan}
      </td>
      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
        {alert.desa}
      </td>
      <td className="py-3 px-4">
        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
          {alert.aspek}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
        {alert.deskripsi}
      </td>
      <td className="py-3 px-4 text-xs text-gray-400 whitespace-nowrap">
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

  // Sort by date descending
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between p-5 pb-0">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Peringatan Terbaru
            {selectedKecamatan && (
              <span className="ml-2 text-xs font-normal text-brand-500">
                — {selectedKecamatan}
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {sorted.length} kejadian tercatat
          </p>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-400">
          Tidak ada data untuk kecamatan ini.
        </div>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Risiko
                </th>
                <th className="py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Kecamatan
                </th>
                <th className="py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Desa
                </th>
                <th className="py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aspek
                </th>
                <th className="py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
