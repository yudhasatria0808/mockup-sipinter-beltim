import { useNavigate } from "react-router";
import type { DashboardRecentItem } from "../../services/dashboardService";

interface DashboardRecentAlertsLiveProps {
  items: DashboardRecentItem[];
  loading: boolean;
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

const statusStyle: Record<string, string> = {
  menunggu: "bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400",
  disetujui: "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400",
  ditolak: "bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400",
};

const typeLabel: Record<string, { label: string; color: string }> = {
  kewaspadaan: { label: "Kewaspadaan", color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" },
  potensi: { label: "Potensi", color: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" },
  peristiwa: { label: "Peristiwa", color: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400" },
};

function AlertRow({ item }: { item: DashboardRecentItem }) {
  const navigate = useNavigate();
  const style = risikoStyle[item.tingkatRisiko] || risikoStyle["Rendah"];
  const type = typeLabel[item.type] || typeLabel.kewaspadaan;
  const status = statusStyle[item.status] || statusStyle.menunggu;

  const handleClick = () => {
    if (item.type === 'kewaspadaan') navigate(`/kewaspadaan/${item.id}`);
    else if (item.type === 'potensi') navigate(`/potensi-konflik/${item.id}`);
    else if (item.type === 'peristiwa') navigate(`/peristiwa-konflik/${item.id}`);
  };

  return (
    <tr
      onClick={handleClick}
      className="group cursor-pointer border-b border-gray-50 last:border-0 transition-colors hover:bg-brand-50/30 dark:border-gray-800 dark:hover:bg-brand-500/5"
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
            {item.tingkatRisiko}
          </span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${type.color}`}>
          {type.label}
        </span>
      </td>
      <td className="py-3 px-4 text-sm font-medium text-gray-800 dark:text-white/90">
        {item.kecamatan}
      </td>
      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
        {item.desa}
      </td>
      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
        {item.deskripsi}
      </td>
      <td className="py-3 px-4">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${status}`}>
          {item.status}
        </span>
      </td>
      <td className="py-3 px-4 text-xs text-gray-400 whitespace-nowrap">
        {new Date(item.tanggal).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>
    </tr>
  );
}

function TableSkeleton() {
  return (
    <div className="animate-pulse p-5 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 flex-1 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardRecentAlertsLive({ items, loading }: DashboardRecentAlertsLiveProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/80">
        <div className="p-5 pb-0">
          <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
        <TableSkeleton />
      </div>
    );
  }

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
              Laporan Terbaru
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {items.length} laporan terbaru dari semua kategori
            </p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 p-12 text-center">
          <svg className="h-10 w-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-400">Belum ada laporan.</span>
        </div>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Risiko</th>
                <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kategori</th>
                <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kecamatan</th>
                <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Desa</th>
                <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deskripsi</th>
                <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <AlertRow key={`${item.type}-${item.id}`} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
