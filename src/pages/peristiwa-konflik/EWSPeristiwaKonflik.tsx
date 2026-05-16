import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { mockPeristiwaKonflik } from "./mockData";
import type { PeristiwaKonflik, LevelRisikoLabel } from "../../types/peristiwa-konflik";

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

function formatRupiah(value: number): string {
  if (value === 0) return "-";
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(0)} Jt`;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function StatCard({ label, value, cfg }: { label: string; value: number; cfg: typeof risikoConfig[LevelRisikoLabel] }) {
  return (
    <div className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
      <p className={`text-2xl font-bold ${cfg.color}`}>{value}</p>
      <p className={`text-sm mt-0.5 ${cfg.color} opacity-80`}>{label}</p>
    </div>
  );
}

function AlertCard({ item, onClick }: { item: PeristiwaKonflik; onClick: () => void }) {
  const cfg = risikoConfig[item.tingkatRisiko];
  const totalKorban = item.korbanKritis + item.korbanLukaLuka + item.korbanMengungsi;

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
        {item.namaPeristiwa}
      </p>
      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
        {item.deskripsiAkibatPeristiwa}
      </p>

      {/* Korban summary */}
      {totalKorban > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {item.korbanKritis > 0 && (
            <span className="text-xs bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400 px-2 py-0.5 rounded-full">
              Kritis: {item.korbanKritis}
            </span>
          )}
          {item.korbanLukaLuka > 0 && (
            <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-0.5 rounded-full">
              Luka: {item.korbanLukaLuka}
            </span>
          )}
          {item.korbanMengungsi > 0 && (
            <span className="text-xs bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400 px-2 py-0.5 rounded-full">
              Mengungsi: {item.korbanMengungsi}
            </span>
          )}
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span className="bg-white/60 dark:bg-gray-800/60 px-2 py-0.5 rounded-full">
          {item.desa}, {item.kecamatan}
        </span>
        <span className="bg-white/60 dark:bg-gray-800/60 px-2 py-0.5 rounded-full">{item.kabupaten}</span>
        {item.kerugianMateril > 0 && (
          <span className="bg-white/60 dark:bg-gray-800/60 px-2 py-0.5 rounded-full">
            Kerugian: {formatRupiah(item.kerugianMateril)}
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
        <span className="font-medium">Penanganan:</span> {item.upayaPenanganan || "-"}
      </p>
    </button>
  );
}

export default function EWSPeristiwaKonflik() {
  const navigate = useNavigate();
  const [filterRisiko, setFilterRisiko] = useState<LevelRisikoLabel | "">("");
  const [filterWilayah, setFilterWilayah] = useState("");

  // Hanya tampilkan yang sudah disetujui
  const approved = mockPeristiwaKonflik.filter((d) => d.status === "disetujui");

  const filtered = approved.filter((item) => {
    const matchRisiko = filterRisiko ? item.tingkatRisiko === filterRisiko : true;
    const matchWilayah = filterWilayah
      ? item.kabupaten.toLowerCase().includes(filterWilayah.toLowerCase()) ||
        item.kecamatan.toLowerCase().includes(filterWilayah.toLowerCase())
      : true;
    return matchRisiko && matchWilayah;
  });

  const countByLevel = (level: LevelRisikoLabel) =>
    approved.filter((d) => d.tingkatRisiko === level).length;

  const totalKorbanKritis = approved.reduce((s, d) => s + d.korbanKritis, 0);
  const totalKorbanLuka = approved.reduce((s, d) => s + d.korbanLukaLuka, 0);
  const totalMengungsi = approved.reduce((s, d) => s + d.korbanMengungsi, 0);
  const totalKerugian = approved.reduce((s, d) => s + d.kerugianMateril, 0);

  return (
    <>
      <PageMeta title="EWS Peristiwa Konflik" description="Early Warning System - Peristiwa Konflik" />
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              EWS — Peristiwa Konflik
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Early Warning System · Data yang telah disetujui</p>
          </div>
          <button
            onClick={() => navigate("/peristiwa-konflik")}
            className="text-sm text-brand-500 hover:text-brand-600 font-medium"
          >
            Lihat Semua Data →
          </button>
        </div>

        {/* Stat Cards — Tingkat Risiko */}
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

        {/* Ringkasan Korban & Kerugian */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-error-200 dark:border-error-800 bg-error-50 dark:bg-error-900/20 p-4">
            <p className="text-2xl font-bold text-error-700 dark:text-error-400">{totalKorbanKritis}</p>
            <p className="text-xs mt-0.5 text-error-600 dark:text-error-400 opacity-80">Total Korban Kritis</p>
          </div>
          <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 p-4">
            <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">{totalKorbanLuka}</p>
            <p className="text-xs mt-0.5 text-orange-600 dark:text-orange-400 opacity-80">Total Korban Luka</p>
          </div>
          <div className="rounded-xl border border-warning-200 dark:border-warning-800 bg-warning-50 dark:bg-warning-900/20 p-4">
            <p className="text-2xl font-bold text-warning-700 dark:text-warning-400">{totalMengungsi}</p>
            <p className="text-xs mt-0.5 text-warning-600 dark:text-warning-400 opacity-80">Total Mengungsi</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
            <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{formatRupiah(totalKerugian)}</p>
            <p className="text-xs mt-0.5 text-gray-500 opacity-80">Total Kerugian Materil</p>
          </div>
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
            value={filterRisiko}
            onChange={(e) => setFilterRisiko(e.target.value as LevelRisikoLabel | "")}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Semua Tingkat Risiko</option>
            {levelOrder.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <input
            type="text"
            placeholder="Filter wilayah (kabupaten/kecamatan)..."
            value={filterWilayah}
            onChange={(e) => setFilterWilayah(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 min-w-56"
          />
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
                      onClick={() => navigate(`/peristiwa-konflik/${item.id}`)}
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
