import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { mockPotensiKonflik } from "./mockData";
import type { PotensiKonflik, LevelRisikoLabel } from "../../types/potensi-konflik";

const risikoConfig: Record<LevelRisikoLabel, { color: string; bg: string; border: string; dot: string; badge: string }> = {
  "Sangat Tinggi": {
    color: "text-error-700 dark:text-error-400",
    bg: "bg-error-50 dark:bg-error-900/20",
    border: "border-error-200 dark:border-error-800",
    dot: "bg-error-500",
    badge: "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400",
  },
  Tinggi: {
    color: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
    dot: "bg-orange-500",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  Sedang: {
    color: "text-warning-700 dark:text-warning-400",
    bg: "bg-warning-50 dark:bg-warning-900/20",
    border: "border-warning-200 dark:border-warning-800",
    dot: "bg-warning-500",
    badge: "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400",
  },
  Rendah: {
    color: "text-success-700 dark:text-success-400",
    bg: "bg-success-50 dark:bg-success-900/20",
    border: "border-success-200 dark:border-success-800",
    dot: "bg-success-500",
    badge: "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400",
  },
};

const levelOrder: LevelRisikoLabel[] = ["Sangat Tinggi", "Tinggi", "Sedang", "Rendah"];

function StatCard({ label, value, cfg }: { label: string; value: number; cfg: typeof risikoConfig[LevelRisikoLabel] }) {
  return (
    <div className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
      <p className={`text-2xl font-bold ${cfg.color}`}>{value}</p>
      <p className={`text-sm mt-0.5 ${cfg.color} opacity-80`}>{label}</p>
    </div>
  );
}

function AlertCard({ item, onClick }: { item: PotensiKonflik; onClick: () => void }) {
  const cfg = risikoConfig[item.tingkatRisiko];
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-4 ${cfg.bg} ${cfg.border} hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${cfg.dot} animate-pulse`} />
          <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.color}`}>
            {item.tingkatRisiko}
          </span>
        </div>
        <span className="text-xs text-gray-400 shrink-0">
          {new Date(item.periode).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-white/90 line-clamp-2">
        {item.namaPotensiKonflik}
      </p>
      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
        {item.kemungkinanPotensiKonflik.deskripsi}
      </p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span className="bg-white/60 dark:bg-gray-800/60 px-2 py-0.5 rounded-full">{item.aspek}</span>
        <span className="bg-white/60 dark:bg-gray-800/60 px-2 py-0.5 rounded-full">
          {item.desa}, {item.kecamatan}
        </span>
        <span className="bg-white/60 dark:bg-gray-800/60 px-2 py-0.5 rounded-full">{item.kabupaten}</span>
      </div>
      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
        <span className="font-medium">Saran & Tindak Lanjut:</span> {item.rekomendasi}
      </p>
    </button>
  );
}

export default function EWSPotensiKonflik() {
  const navigate = useNavigate();
  const [filterAspek, setFilterAspek] = useState("");
  const [filterRisiko, setFilterRisiko] = useState<LevelRisikoLabel | "">("");

  // Hanya tampilkan yang sudah disetujui
  const approved = mockPotensiKonflik.filter((d) => d.status === "disetujui");

  const filtered = approved.filter((item) => {
    const matchAspek = filterAspek ? item.aspek === filterAspek : true;
    const matchRisiko = filterRisiko ? item.tingkatRisiko === filterRisiko : true;
    return matchAspek && matchRisiko;
  });

  const countByLevel = (level: LevelRisikoLabel) =>
    approved.filter((d) => d.tingkatRisiko === level).length;

  const aspekList = [...new Set(approved.map((d) => d.aspek))];

  return (
    <>
      <PageMeta title="EWS Potensi Konflik" description="Early Warning System - Potensi Konflik" />
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              EWS — Potensi Konflik
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Early Warning System · Data yang telah disetujui</p>
          </div>
          <button
            onClick={() => navigate("/potensi-konflik")}
            className="text-sm text-brand-500 hover:text-brand-600 font-medium"
          >
            Lihat Semua Data →
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {levelOrder.map((level) => (
            <StatCard
              key={level}
              label={level}
              value={countByLevel(level)}
              cfg={risikoConfig[level]}
            />
          ))}
        </div>

        {/* Summary bar */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Distribusi Tingkat Risiko
            </span>
            <span className="text-xs text-gray-400">{approved.length} total data disetujui</span>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            {levelOrder.map((level) => {
              const count = countByLevel(level);
              const pct = approved.length > 0 ? (count / approved.length) * 100 : 0;
              if (pct === 0) return null;
              return (
                <div
                  key={level}
                  style={{ width: `${pct}%` }}
                  className={`${risikoConfig[level].dot} transition-all`}
                  title={`${level}: ${count}`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {levelOrder.map((level) => (
              <div key={level} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className={`w-2 h-2 rounded-full ${risikoConfig[level].dot}`} />
                {level} ({countByLevel(level)})
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={filterAspek}
            onChange={(e) => setFilterAspek(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Semua Aspek</option>
            {aspekList.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select
            value={filterRisiko}
            onChange={(e) => setFilterRisiko(e.target.value as LevelRisikoLabel | "")}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Semua Tingkat Risiko</option>
            {levelOrder.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Alert Cards grouped by level */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            Tidak ada data yang sesuai filter.
          </div>
        ) : (
          levelOrder.map((level) => {
            const items = filtered.filter((d) => d.tingkatRisiko === level);
            if (items.length === 0) return null;
            const cfg = risikoConfig[level];
            return (
              <div key={level} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                  <h3 className={`text-sm font-semibold ${cfg.color}`}>
                    {level} ({items.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map((item) => (
                    <AlertCard
                      key={item.id}
                      item={item}
                      onClick={() => navigate(`/potensi-konflik/${item.id}`)}
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
