import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import type { PotensiKonflik, LevelRisikoLabel } from "../../types/potensi-konflik";
import { potensiKonflikService } from "../../services/potensiKonflikService";

const risikoConfig: Record<LevelRisikoLabel, { color: string; bg: string; border: string; dot: string }> = {
  "Sangat Tinggi": { color: "text-error-700 dark:text-error-400", bg: "bg-error-50 dark:bg-error-900/20", border: "border-error-200 dark:border-error-800", dot: "bg-error-500" },
  Tinggi: { color: "text-orange-700 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20", border: "border-orange-200 dark:border-orange-800", dot: "bg-orange-500" },
  Sedang: { color: "text-warning-700 dark:text-warning-400", bg: "bg-warning-50 dark:bg-warning-900/20", border: "border-warning-200 dark:border-warning-800", dot: "bg-warning-500" },
  Rendah: { color: "text-success-700 dark:text-success-400", bg: "bg-success-50 dark:bg-success-900/20", border: "border-success-200 dark:border-success-800", dot: "bg-success-500" },
};
const levelOrder: LevelRisikoLabel[] = ["Sangat Tinggi", "Tinggi", "Sedang", "Rendah"];

function StatCard({ label, value, cfg }: { label: string; value: number; cfg: typeof risikoConfig[LevelRisikoLabel] }) {
  return <div className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}><p className={`text-2xl font-bold ${cfg.color}`}>{value}</p><p className={`text-sm mt-0.5 ${cfg.color} opacity-80`}>{label}</p></div>;
}

function AlertCard({ item, onClick }: { item: PotensiKonflik; onClick: () => void }) {
  const cfg = risikoConfig[item.tingkatRisiko];
  return (
    <button onClick={onClick} className={`w-full text-left rounded-xl border p-4 ${cfg.bg} ${cfg.border} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot} animate-pulse`} /><span className={`text-xs font-semibold uppercase tracking-wide ${cfg.color}`}>{item.tingkatRisiko}</span></div>
        <span className="text-xs text-gray-400 shrink-0">{new Date(item.periode).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-white/90 line-clamp-2">{item.namaPotensiKonflik}</p>
      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{item.kemungkinanPotensiKonflik.deskripsi}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500"><span className="bg-white/60 dark:bg-gray-800/60 px-2 py-0.5 rounded-full">{item.aspek}</span><span className="bg-white/60 dark:bg-gray-800/60 px-2 py-0.5 rounded-full">{item.desa}, {item.kecamatan}</span></div>
      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-1"><span className="font-medium">Rekomendasi:</span> {item.rekomendasi}</p>
    </button>
  );
}

export default function EWSPotensiKonflik() {
  const navigate = useNavigate();
  const [items, setItems] = useState<PotensiKonflik[]>([]);
  const [stats, setStats] = useState({ total: 0, sangatTinggi: 0, tinggi: 0, sedang: 0, rendah: 0 });
  const [loading, setLoading] = useState(true);
  const [filterAspek, setFilterAspek] = useState("");
  const [filterRisiko, setFilterRisiko] = useState<LevelRisikoLabel | "">("");

  useEffect(() => {
    setLoading(true);
    potensiKonflikService.getEWS(filterAspek || undefined, filterRisiko || undefined)
      .then((res) => { setItems(res.items); setStats(res.stats); })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [filterAspek, filterRisiko]);

  const aspekList = [...new Set(items.map((d) => d.aspek))];

  if (loading) return <div className="flex items-center justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" /></div>;

  return (
    <>
      <PageMeta title="EWS Potensi Konflik" description="Early Warning System - Potensi Konflik" />
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div><h2 className="text-base font-semibold text-gray-800 dark:text-white/90">EWS — Potensi Konflik</h2><p className="text-xs text-gray-500 mt-0.5">Early Warning System · Data yang telah disetujui</p></div>
          <button onClick={() => navigate("/potensi-konflik")} className="text-sm text-brand-500 hover:text-brand-600 font-medium">Lihat Semua Data →</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {levelOrder.map((level) => <StatCard key={level} label={level} value={level === "Sangat Tinggi" ? stats.sangatTinggi : level === "Tinggi" ? stats.tinggi : level === "Sedang" ? stats.sedang : stats.rendah} cfg={risikoConfig[level]} />)}
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3"><span className="text-sm font-medium text-gray-700 dark:text-gray-300">Distribusi Tingkat Risiko</span><span className="text-xs text-gray-400">{stats.total} total data disetujui</span></div>
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            {levelOrder.map((level) => { const count = level === "Sangat Tinggi" ? stats.sangatTinggi : level === "Tinggi" ? stats.tinggi : level === "Sedang" ? stats.sedang : stats.rendah; const pct = stats.total > 0 ? (count / stats.total) * 100 : 0; if (pct === 0) return null; return <div key={level} style={{ width: `${pct}%` }} className={`${risikoConfig[level].dot}`} />; })}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <select value={filterAspek} onChange={(e) => setFilterAspek(e.target.value)} className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"><option value="">Semua Aspek</option>{aspekList.map((a) => <option key={a} value={a}>{a}</option>)}</select>
          <select value={filterRisiko} onChange={(e) => setFilterRisiko(e.target.value as LevelRisikoLabel | "")} className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"><option value="">Semua Tingkat Risiko</option>{levelOrder.map((l) => <option key={l} value={l}>{l}</option>)}</select>
        </div>

        {items.length === 0 ? <div className="text-center py-16 text-gray-400 text-sm">Tidak ada data yang sesuai filter.</div> : (
          levelOrder.map((level) => {
            const levelItems = items.filter((d) => d.tingkatRisiko === level);
            if (levelItems.length === 0) return null;
            const cfg = risikoConfig[level];
            return (<div key={level} className="space-y-3"><div className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${cfg.dot}`} /><h3 className={`text-sm font-semibold ${cfg.color}`}>{level} ({levelItems.length})</h3></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{levelItems.map((item) => <AlertCard key={item.id} item={item} onClick={() => navigate(`/potensi-konflik/${item.id}`)} />)}</div></div>);
          })
        )}
      </div>
    </>
  );
}
