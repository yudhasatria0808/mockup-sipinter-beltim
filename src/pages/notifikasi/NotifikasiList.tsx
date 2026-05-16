import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../context/AuthContext";
import { mockNotifikasi, type Notifikasi, type NotifikasiPrioritas, type NotifikasiStatus } from "../../data/notifikasi";

const prioritasConfig: Record<NotifikasiPrioritas, { label: string; badge: string; dot: string }> = {
  kritis: { label: "Kritis", badge: "bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400", dot: "bg-error-500 animate-pulse" },
  tinggi: { label: "Tinggi", badge: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400", dot: "bg-orange-500" },
  sedang: { label: "Sedang", badge: "bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400", dot: "bg-warning-500" },
  rendah: { label: "Rendah", badge: "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400", dot: "bg-success-500" },
};

const statusConfig: Record<NotifikasiStatus, { label: string; className: string }> = {
  belum_dibaca: { label: "Belum Dibaca", className: "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400" },
  dibaca: { label: "Dibaca", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  ditindaklanjuti: { label: "Ditindaklanjuti", className: "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400" },
};

function timeAgo(dateStr: string): string {
  const now = new Date("2026-05-16T10:00:00Z");
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay} hari lalu`;
  const diffMonth = Math.floor(diffDay / 30);
  return `${diffMonth} bulan lalu`;
}

export default function NotifikasiList() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Filter notifikasi berdasarkan role aktif
  const roleToLevel = { operator: "operator", administrator: "administrator", user: "user" } as const;
  const myNotifs = mockNotifikasi.filter((n) => n.tujuanLevel === roleToLevel[user.role]);

  const [data, setData] = useState<Notifikasi[]>(myNotifs);
  const [filterPrioritas, setFilterPrioritas] = useState<NotifikasiPrioritas | "">("");
  const [filterStatus, setFilterStatus] = useState<NotifikasiStatus | "">("");

  const filtered = data.filter((n) => {
    if (filterPrioritas && n.prioritas !== filterPrioritas) return false;
    if (filterStatus && n.status !== filterStatus) return false;
    return true;
  });

  const unreadCount = data.filter((n) => n.status === "belum_dibaca").length;

  const markAsRead = (id: string) => {
    setData((prev) =>
      prev.map((n) => n.id === id ? { ...n, status: "dibaca" as NotifikasiStatus, dibacaAt: new Date().toISOString() } : n)
    );
  };

  const markAllAsRead = () => {
    setData((prev) =>
      prev.map((n) => n.status === "belum_dibaca" ? { ...n, status: "dibaca" as NotifikasiStatus, dibacaAt: new Date().toISOString() } : n)
    );
  };

  const handleClick = (notif: Notifikasi) => {
    markAsRead(notif.id);
    if (notif.laporanPath) {
      navigate(notif.laporanPath);
    }
  };

  return (
    <>
      <PageMeta title="Notifikasi" description="Pusat Notifikasi SIPINTAR BELTIM" />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Pusat Notifikasi
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : "Semua notifikasi sudah dibaca"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-brand-500 hover:text-brand-600 font-medium"
            >
              Tandai semua sudah dibaca
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filterPrioritas}
            onChange={(e) => setFilterPrioritas(e.target.value as NotifikasiPrioritas | "")}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
          >
            <option value="">Semua Prioritas</option>
            <option value="kritis">Kritis</option>
            <option value="tinggi">Tinggi</option>
            <option value="sedang">Sedang</option>
            <option value="rendah">Rendah</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as NotifikasiStatus | "")}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
          >
            <option value="">Semua Status</option>
            <option value="belum_dibaca">Belum Dibaca</option>
            <option value="dibaca">Dibaca</option>
            <option value="ditindaklanjuti">Ditindaklanjuti</option>
          </select>
        </div>

        {/* Notification List */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">Tidak ada notifikasi.</div>
          ) : (
            filtered.map((notif) => {
              const pCfg = prioritasConfig[notif.prioritas];
              const sCfg = statusConfig[notif.status];
              const isUnread = notif.status === "belum_dibaca";

              return (
                <button
                  key={notif.id}
                  onClick={() => handleClick(notif)}
                  className={`w-full text-left rounded-xl border p-4 transition-all hover:shadow-md ${
                    isUnread
                      ? "border-brand-200 dark:border-brand-800 bg-brand-50/30 dark:bg-brand-900/10"
                      : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Priority dot */}
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${pCfg.dot}`} />

                    <div className="flex-1 min-w-0">
                      {/* Title row */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className={`text-sm font-medium ${isUnread ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                          {notif.judul}
                        </h4>
                        <span className="text-xs text-gray-400 shrink-0">{timeAgo(notif.createdAt)}</span>
                      </div>

                      {/* Message */}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {notif.pesan}
                      </p>

                      {/* Badges */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pCfg.badge}`}>
                          {pCfg.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sCfg.className}`}>
                          {sCfg.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          dari: {notif.pengirim}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
