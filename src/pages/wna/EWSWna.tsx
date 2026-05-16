import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { mockWNA } from "./mockData";
import type { WNA, StatusTinggal } from "../../types/wna";

const statusConfig: Record<StatusTinggal, { color: string; bg: string; border: string; dot: string }> = {
  "Habis Izin": {
    color: "text-error-700 dark:text-error-400",
    bg: "bg-error-50 dark:bg-error-900/20",
    border: "border-error-200 dark:border-error-800",
    dot: "bg-error-500",
  },
  Aktif: {
    color: "text-success-700 dark:text-success-400",
    bg: "bg-success-50 dark:bg-success-900/20",
    border: "border-success-200 dark:border-success-800",
    dot: "bg-success-500",
  },
  Keluar: {
    color: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-gray-800/50",
    border: "border-gray-200 dark:border-gray-700",
    dot: "bg-gray-400",
  },
  Lainnya: {
    color: "text-brand-700 dark:text-brand-400",
    bg: "bg-brand-50 dark:bg-brand-900/20",
    border: "border-brand-200 dark:border-brand-800",
    dot: "bg-brand-500",
  },
};

// Urutan prioritas: Habis Izin paling atas (perlu perhatian)
const statusOrder: StatusTinggal[] = ["Habis Izin", "Aktif", "Keluar", "Lainnya"];

function StatCard({
  label,
  value,
  cfg,
}: {
  label: string;
  value: number;
  cfg: typeof statusConfig[StatusTinggal];
}) {
  return (
    <div className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
      <p className={`text-2xl font-bold ${cfg.color}`}>{value}</p>
      <p className={`text-sm mt-0.5 ${cfg.color} opacity-80`}>{label}</p>
    </div>
  );
}

function WNACard({ item, onClick }: { item: WNA; onClick: () => void }) {
  const cfg = statusConfig[item.statusTinggal];
  const isExpired = new Date(item.masaBerlakuVisa) < new Date();

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-4 ${cfg.bg} ${cfg.border} hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${cfg.dot} ${item.statusTinggal === "Habis Izin" ? "animate-pulse" : ""}`} />
          <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.color}`}>
            {item.statusTinggal}
          </span>
        </div>
        <span className="text-xs text-gray-400 shrink-0">{item.kewarganegaraan}</span>
      </div>

      <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-white/90">
        {item.noPaspor}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
        {item.jenisKelamin} · {item.pekerjaan || "-"}
      </p>

      {/* Visa info */}
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="text-xs bg-white/60 dark:bg-gray-800/60 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-400">
          {item.jenisVisa}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${isExpired ? "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400" : "bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400"}`}>
          s/d {new Date(item.masaBerlakuVisa).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
          {isExpired && " ⚠"}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span className="bg-white/60 dark:bg-gray-800/60 px-2 py-0.5 rounded-full">
          {item.desa}, {item.kecamatan}
        </span>
        <span className="bg-white/60 dark:bg-gray-800/60 px-2 py-0.5 rounded-full">{item.kabupaten}</span>
        {item.lamaTinggal && (
          <span className="bg-white/60 dark:bg-gray-800/60 px-2 py-0.5 rounded-full">
            {item.lamaTinggal}
          </span>
        )}
      </div>

      {item.sponsor && (
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
          <span className="font-medium">Sponsor:</span> {item.sponsor}
        </p>
      )}
    </button>
  );
}

export default function EWSWna() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<StatusTinggal | "">("");
  const [filterVisa, setFilterVisa] = useState("");
  const [filterWilayah, setFilterWilayah] = useState("");

  // Hanya tampilkan yang sudah disetujui
  const approved = mockWNA.filter((d) => d.status === "disetujui");

  const filtered = approved.filter((item) => {
    const matchStatus = filterStatus ? item.statusTinggal === filterStatus : true;
    const matchVisa = filterVisa ? item.jenisVisa === filterVisa : true;
    const matchWilayah = filterWilayah
      ? item.kabupaten.toLowerCase().includes(filterWilayah.toLowerCase()) ||
        item.kecamatan.toLowerCase().includes(filterWilayah.toLowerCase())
      : true;
    return matchStatus && matchVisa && matchWilayah;
  });

  const countByStatus = (s: StatusTinggal) => approved.filter((d) => d.statusTinggal === s).length;

  // Hitung visa yang sudah kadaluarsa
  const expiredCount = approved.filter((d) => new Date(d.masaBerlakuVisa) < new Date()).length;

  // Kewarganegaraan unik
  const negaraList = [...new Set(approved.map((d) => d.kewarganegaraan))];
  const visaList = [...new Set(approved.map((d) => d.jenisVisa))];

  return (
    <>
      <PageMeta title="EWS Warga Negara Asing" description="Pemantauan Warga Negara Asing" />
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              EWS — Warga Negara Asing
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Pemantauan WNA · Data yang telah disetujui</p>
          </div>
          <button
            onClick={() => navigate("/wna")}
            className="text-sm text-brand-500 hover:text-brand-600 font-medium"
          >
            Lihat Semua Data →
          </button>
        </div>

        {/* Stat Cards — Status Tinggal */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statusOrder.map((s) => (
            <StatCard
              key={s}
              label={s}
              value={countByStatus(s)}
              cfg={statusConfig[s]}
            />
          ))}
        </div>

        {/* Ringkasan tambahan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{approved.length}</p>
            <p className="text-xs mt-0.5 text-gray-500">Total WNA Terdaftar</p>
          </div>
          <div className="rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/20 p-4">
            <p className="text-2xl font-bold text-brand-700 dark:text-brand-400">{negaraList.length}</p>
            <p className="text-xs mt-0.5 text-brand-600 dark:text-brand-400 opacity-80">Kewarganegaraan</p>
          </div>
          <div className={`rounded-xl border p-4 ${expiredCount > 0 ? "border-error-200 dark:border-error-800 bg-error-50 dark:bg-error-900/20" : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"}`}>
            <p className={`text-2xl font-bold ${expiredCount > 0 ? "text-error-700 dark:text-error-400" : "text-gray-700 dark:text-gray-300"}`}>
              {expiredCount}
            </p>
            <p className={`text-xs mt-0.5 opacity-80 ${expiredCount > 0 ? "text-error-600 dark:text-error-400" : "text-gray-500"}`}>
              Visa Kadaluarsa
            </p>
          </div>
        </div>

        {/* Distribusi Kewarganegaraan */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Distribusi Status Tinggal
            </span>
            <span className="text-xs text-gray-400">{approved.length} total data disetujui</span>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            {statusOrder.map((s) => {
              const count = countByStatus(s);
              const pct = approved.length > 0 ? (count / approved.length) * 100 : 0;
              if (pct === 0) return null;
              return (
                <div
                  key={s}
                  style={{ width: `${pct}%` }}
                  className={`${statusConfig[s].dot} transition-all`}
                  title={`${s}: ${count}`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {statusOrder.map((s) => (
              <div key={s} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className={`w-2 h-2 rounded-full ${statusConfig[s].dot}`} />
                {s} ({countByStatus(s)})
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as StatusTinggal | "")}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Semua Status Tinggal</option>
            {statusOrder.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filterVisa}
            onChange={(e) => setFilterVisa(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Semua Jenis Visa</option>
            {visaList.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
          <input
            type="text"
            placeholder="Filter wilayah (kabupaten/kecamatan)..."
            value={filterWilayah}
            onChange={(e) => setFilterWilayah(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 min-w-56"
          />
        </div>

        {/* WNA Cards grouped by status */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            Tidak ada data yang sesuai filter.
          </div>
        ) : (
          statusOrder.map((s) => {
            const items = filtered.filter((d) => d.statusTinggal === s);
            if (items.length === 0) return null;
            const cfg = statusConfig[s];
            return (
              <div key={s} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                  <h3 className={`text-sm font-semibold ${cfg.color}`}>
                    {s} ({items.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map((item) => (
                    <WNACard
                      key={item.id}
                      item={item}
                      onClick={() => navigate(`/wna/${item.id}`)}
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
