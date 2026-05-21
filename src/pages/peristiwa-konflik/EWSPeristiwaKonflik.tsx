import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import type { PeristiwaKonflik, LevelRisikoLabel } from "../../types/peristiwa-konflik";
import { peristiwaKonflikService } from "../../services/peristiwaKonflikService";

const risikoConfig: Record<LevelRisikoLabel, { color: string; bg: string; border: string; dot: string }> = {
  "Sangat Tinggi": { color: "text-error-700 dark:text-error-400", bg: "bg-error-50 dark:bg-error-900/20", border: "border-error-200 dark:border-error-800", dot: "bg-error-500" },
  Tinggi: { color: "text-orange-700 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20", border: "border-orange-200 dark:border-orange-800", dot: "bg-orange-500" },
  Sedang: { color: "text-warning-700 dark:text-warning-400", bg: "bg-warning-50 dark:bg-warning-900/20", border: "border-warning-200 dark:border-warning-800", dot: "bg-warning-500" },
  Rendah: { color: "text-success-700 dark:text-success-400", bg: "bg-success-50 dark:bg-success-900/20", border: "border-success-200 dark:border-success-800", dot: "bg-success-500" },
};
const levelOrder: LevelRisikoLabel[] = ["Sangat Tinggi", "Tinggi", "Sedang", "Rendah"];
function formatRupiah(v: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v); }

function AlertCard({ item, onClick }: { item: PeristiwaKonflik; onClick: () => void }) {
  const cfg = risikoConfig[item.tingkatRisiko];
  return (
    <button onClick={onClick} className={`w-full text-left rounded-xl border p-4 ${cfg.bg} ${cfg.border} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot} animate-pulse`} /><span className={`text-xs font-semibold uppercase tracking-wide ${cfg.color}`}>{item.tingkatRisiko}</span></div>
        <span className="text-xs text-gray-400">{new Date(item.periode).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-white/90 line-clamp-2">{item.namaPeristiwa}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {item.korbanKritis > 0 && <span className="bg-error-100 text-error-700 px-2 py-0.5 rounded-full">Kritis: {item.korbanKritis}</span>}
        {item.korbanLukaLuka > 0 && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Luka: {item.korbanLukaLuka}</span>}
        {item.korbanMengungsi > 0 && <span className="bg-warning-100 text-warning-700 px-2 py-0.5 rounded-full">Mengungsi: {item.korbanMengungsi}</span>}
        {item.kerugianMateril > 0 && <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{formatRupiah(item.kerugianMateril)}</span>}
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500"><span className="bg-white/60 px-2 py-0.5 rounded-full">{item.desa}, {item.kecamatan}</span></div>
    </button>
  );
}

export default function EWSPeristiwaKonflik() {
  const navigate = useNavigate();
  const [items, setItems] = useState<PeristiwaKonflik[]>([]);
  const [stats, setStats] = useState({ total: 0, sangatTinggi: 0, tinggi: 0, sedang: 0, rendah: 0, totalKorbanKritis: 0, totalKorbanLuka: 0, totalKorbanMengungsi: 0, totalKerugian: 0 });
  const [loading, setLoading] = useState(true);
  const [filterRisiko, setFilterRisiko] = useState<LevelRisikoLabel | "">("");

  useEffect(() => {
    setLoading(true);
    peristiwaKonflikService.getEWS(filterRisiko || undefined)
      .then((res) => { setItems(res.items); setStats(res.stats); })
      .catch((e) => console.error(e)).finally(() => setLoading(false));
  }, [filterRisiko]);

  if (loading) return <div className="flex items-center justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" /></div>;

  return (
    <>
      <PageMeta title="EWS Peristiwa Konflik" description="Early Warning System - Peristiwa Konflik" />
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div><h2 className="text-base font-semibold text-gray-800 dark:text-white/90">EWS — Peristiwa Konflik</h2><p className="text-xs text-gray-500 mt-0.5">Data peristiwa konflik yang telah disetujui</p></div>
          <button onClick={() => navigate("/peristiwa-konflik")} className="text-sm text-brand-500 hover:text-brand-600 font-medium">Lihat Semua →</button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4"><p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p><p className="text-sm text-gray-500">Total Peristiwa</p></div>
          <div className="rounded-xl border border-error-200 dark:border-error-800 bg-error-50 dark:bg-error-900/20 p-4"><p className="text-2xl font-bold text-error-700 dark:text-error-400">{stats.totalKorbanKritis}</p><p className="text-sm text-error-600 dark:text-error-400">Korban Kritis</p></div>
          <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 p-4"><p className="text-2xl font-bold text-orange-700 dark:text-orange-400">{stats.totalKorbanLuka}</p><p className="text-sm text-orange-600">Luka-luka</p></div>
          <div className="rounded-xl border border-warning-200 dark:border-warning-800 bg-warning-50 dark:bg-warning-900/20 p-4"><p className="text-2xl font-bold text-warning-700 dark:text-warning-400">{stats.totalKorbanMengungsi}</p><p className="text-sm text-warning-600">Mengungsi</p></div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500">Total Kerugian Materil: <span className="font-bold text-gray-800 dark:text-white">{formatRupiah(stats.totalKerugian)}</span></p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select value={filterRisiko} onChange={(e) => setFilterRisiko(e.target.value as LevelRisikoLabel | "")} className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"><option value="">Semua Tingkat Risiko</option>{levelOrder.map((l) => <option key={l} value={l}>{l}</option>)}</select>
        </div>

        {items.length === 0 ? <div className="text-center py-16 text-gray-400 text-sm">Tidak ada data.</div> : (
          levelOrder.map((level) => {
            const levelItems = items.filter((d) => d.tingkatRisiko === level);
            if (levelItems.length === 0) return null;
            const cfg = risikoConfig[level];
            return (<div key={level} className="space-y-3"><div className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${cfg.dot}`} /><h3 className={`text-sm font-semibold ${cfg.color}`}>{level} ({levelItems.length})</h3></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{levelItems.map((item) => <AlertCard key={item.id} item={item} onClick={() => navigate(`/peristiwa-konflik/${item.id}`)} />)}</div></div>);
          })
        )}
      </div>
    </>
  );
}
