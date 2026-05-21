import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { tkaService } from "../../services/tkaService";
import type { TKA, JenisIzinTinggal } from "../../types/tka";

const izinConfig: Record<JenisIzinTinggal, { color: string; bg: string; border: string; dot: string }> = {
  KITAP: {
    color: "text-success-700 dark:text-success-400",
    bg: "bg-success-50 dark:bg-success-900/20",
    border: "border-success-200 dark:border-success-800",
    dot: "bg-success-500",
  },
  KITAS: {
    color: "text-warning-700 dark:text-warning-400",
    bg: "bg-warning-50 dark:bg-warning-900/20",
    border: "border-warning-200 dark:border-warning-800",
    dot: "bg-warning-500",
  },
  Visa: {
    color: "text-brand-700 dark:text-brand-400",
    bg: "bg-brand-50 dark:bg-brand-900/20",
    border: "border-brand-200 dark:border-brand-800",
    dot: "bg-brand-500",
  },
};

const izinOrder: JenisIzinTinggal[] = ["KITAP", "KITAS", "Visa"];

function StatCard({
  label,
  value,
  cfg,
}: {
  label: string;
  value: number;
  cfg: typeof izinConfig[JenisIzinTinggal];
}) {
  return (
    <div className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
      <p className={`text-2xl font-bold ${cfg.color}`}>{value}</p>
      <p className={`text-sm mt-0.5 ${cfg.color} opacity-80`}>{label}</p>
    </div>
  );
}

function TKACard({ item, onClick }: { item: TKA; onClick: () => void }) {
  const cfg = izinConfig[item.jenisIzinTinggal];
  const isExpired = new Date(item.tanggalBerakhirIMTA) < new Date();

  // Hitung sisa hari IMTA
  const sisaHari = Math.ceil(
    (new Date(item.tanggalBerakhirIMTA).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isNearExpiry = sisaHari > 0 && sisaHari <= 30;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-4 ${cfg.bg} ${cfg.border} hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${cfg.dot}`} />
          <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.color}`}>
            {item.jenisIzinTinggal}
          </span>
        </div>
        <span className="text-xs text-gray-400 shrink-0">{item.kewarganegaraan}</span>
      </div>

      <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-white/90">
        {item.namaTKA}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
        {item.jenisKelamin} · {item.jabatanKeterampilan}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
        {item.namaPerusahaan}
      </p>

      {/* IMTA info */}
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="text-xs bg-white/60 dark:bg-gray-800/60 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-400 font-mono">
          {item.nomorIMTA}
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            isExpired
              ? "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400"
              : isNearExpiry
              ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
              : "bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400"
          }`}
        >
          {isExpired
            ? `Kadaluarsa ⚠`
            : isNearExpiry
            ? `Berakhir ${sisaHari} hari lagi ⚠`
            : `s/d ${new Date(item.tanggalBerakhirIMTA).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}`}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span className="bg-white/60 dark:bg-gray-800/60 px-2 py-0.5 rounded-full">
          {item.desa}, {item.kecamatan}
        </span>
        <span className="bg-white/60 dark:bg-gray-800/60 px-2 py-0.5 rounded-full">{item.kabupaten}</span>
      </div>

      {item.keterangan && (
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
          <span className="font-medium">Ket:</span> {item.keterangan}
        </p>
      )}
    </button>
  );
}

export default function EWSTka() {
  const navigate = useNavigate();
  const [items, setItems] = useState<TKA[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterKewarganegaraan, setFilterKewarganegaraan] = useState("");

  useEffect(() => {
    setLoading(true);
    tkaService.getEWS(filterKewarganegaraan || undefined)
      .then((res) => setItems(res.items))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [filterKewarganegaraan]);

  const filtered = items;

  const countByIzin = (izin: JenisIzinTinggal) =>
    items.filter((d) => d.jenisIzinTinggal === izin).length;

  const expiredCount = items.filter(
    (d) => new Date(d.tanggalBerakhirIMTA) < new Date()
  ).length;

  const nearExpiryCount = items.filter((d) => {
    const sisa = Math.ceil(
      (new Date(d.tanggalBerakhirIMTA).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return sisa > 0 && sisa <= 30;
  }).length;

  const negaraList = [...new Set(items.map((d: TKA) => d.kewarganegaraan))];

  if (loading) return <div className="flex items-center justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" /></div>;

  return (
    <>
      <PageMeta title="EWS Tenaga Kerja Asing" description="Pemantauan Tenaga Kerja Asing" />
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              EWS — Tenaga Kerja Asing
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Pemantauan TKA · Data yang telah disetujui</p>
          </div>
          <button
            onClick={() => navigate("/tka")}
            className="text-sm text-brand-500 hover:text-brand-600 font-medium"
          >
            Lihat Semua Data →
          </button>
        </div>

        {/* Stat Cards — Jenis Izin Tinggal */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {izinOrder.map((izin) => (
            <StatCard
              key={izin}
              label={izin}
              value={countByIzin(izin)}
              cfg={izinConfig[izin]}
            />
          ))}
        </div>

        {/* Ringkasan tambahan */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{items.length}</p>
            <p className="text-xs mt-0.5 text-gray-500">Total TKA Terdaftar</p>
          </div>
          <div className="rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/20 p-4">
            <p className="text-2xl font-bold text-brand-700 dark:text-brand-400">{negaraList.length}</p>
            <p className="text-xs mt-0.5 text-brand-600 dark:text-brand-400 opacity-80">Kewarganegaraan</p>
          </div>
          <div className={`rounded-xl border p-4 ${nearExpiryCount > 0 ? "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20" : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"}`}>
            <p className={`text-2xl font-bold ${nearExpiryCount > 0 ? "text-orange-700 dark:text-orange-400" : "text-gray-700 dark:text-gray-300"}`}>
              {nearExpiryCount}
            </p>
            <p className={`text-xs mt-0.5 opacity-80 ${nearExpiryCount > 0 ? "text-orange-600 dark:text-orange-400" : "text-gray-500"}`}>
              IMTA Hampir Berakhir
            </p>
          </div>
          <div className={`rounded-xl border p-4 ${expiredCount > 0 ? "border-error-200 dark:border-error-800 bg-error-50 dark:bg-error-900/20" : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"}`}>
            <p className={`text-2xl font-bold ${expiredCount > 0 ? "text-error-700 dark:text-error-400" : "text-gray-700 dark:text-gray-300"}`}>
              {expiredCount}
            </p>
            <p className={`text-xs mt-0.5 opacity-80 ${expiredCount > 0 ? "text-error-600 dark:text-error-400" : "text-gray-500"}`}>
              IMTA Kadaluarsa
            </p>
          </div>
        </div>

        {/* Distribusi Jenis Izin Tinggal */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Distribusi Jenis Izin Tinggal
            </span>
            <span className="text-xs text-gray-400">{items.length} total data disetujui</span>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            {izinOrder.map((izin) => {
              const count = countByIzin(izin);
              const pct = items.length > 0 ? (count / items.length) * 100 : 0;
              if (pct === 0) return null;
              return (
                <div
                  key={izin}
                  style={{ width: `${pct}%` }}
                  className={`${izinConfig[izin].dot} transition-all`}
                  title={`${izin}: ${count}`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {izinOrder.map((izin) => (
              <div key={izin} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className={`w-2 h-2 rounded-full ${izinConfig[izin].dot}`} />
                {izin} ({countByIzin(izin)})
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={filterKewarganegaraan}
            onChange={(e) => setFilterKewarganegaraan(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Semua Kewarganegaraan</option>
            {negaraList.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        {/* TKA Cards grouped by jenis izin tinggal */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            Tidak ada data yang sesuai filter.
          </div>
        ) : (
          izinOrder.map((izin) => {
            const items = filtered.filter((d) => d.jenisIzinTinggal === izin);
            if (items.length === 0) return null;
            const cfg = izinConfig[izin];
            return (
              <div key={izin} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                  <h3 className={`text-sm font-semibold ${cfg.color}`}>
                    {izin} ({items.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map((item) => (
                    <TKACard
                      key={item.id}
                      item={item}
                      onClick={() => navigate(`/tka/${item.id}`)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
