import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import type { KewaspadaanDini, LevelRisikoLabel } from "../../types/kewaspadaan";
import { kewaspadaanService } from "../../services/kewaspadaanService";

const risikoConfig: Record<LevelRisikoLabel, { color: string; bg: string; border: string; dot: string }> = {
  "Sangat Tinggi": { color: "text-error-700 dark:text-error-400", bg: "bg-error-50 dark:bg-error-900/20", border: "border-error-200 dark:border-error-800", dot: "bg-error-500" },
  Tinggi: { color: "text-orange-700 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20", border: "border-orange-200 dark:border-orange-800", dot: "bg-orange-500" },
  Sedang: { color: "text-warning-700 dark:text-warning-400", bg: "bg-warning-50 dark:bg-warning-900/20", border: "border-warning-200 dark:border-warning-800", dot: "bg-warning-500" },
  Rendah: { color: "text-success-700 dark:text-success-400", bg: "bg-success-50 dark:bg-success-900/20", border: "border-success-200 dark:border-success-800", dot: "bg-success-500" },
};

const levelOrder: LevelRisikoLabel[] = ["Sangat Tinggi", "Tinggi", "Sedang", "Rendah"];

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm mt-0.5 opacity-80">{label}</p>
    </div>
  );
}

function AlertCard({ item, onClick }: { item: KewaspadaanDini; onClick: () => void }) {
  const cfg = risikoConfig[item.tingkatRisiko];
  return (
    <button onClick={onClick} className={`w-full text-left rounded-xl border p-4 ${cfg.bg} ${cfg.border} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${cfg.dot} animate-pulse`} />
          <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.color}`}>{item.tingkatRisiko}</span>
        </div>
        <span className="text-xs text-gray-400 shrink-0">
          {new Date(item.periode).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      </div>
      <p className="mt-2 text-sm font-medium text-gray-800 dark:text-white/90 line-clamp-2">{item.kemungkinanAncaman.deskripsi}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span className="bg-white/60 dark:bg-gray-800/60 px-2 py-0.5 rounded-full">{item.aspek}</span>
        <span className="bg-white/60 dark:bg-gray-800/60 px-2 py-0.5 rounded-full">{item.desa}, {item.kecamatan}</span>
      </div>
      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
        <span className="font-medium">Saran & Tindak Lanjut:</span> {item.rekomendasi}
      </p>
    </button>
  );
}

export default function EWSDashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState<KewaspadaanDini[]>([]);
  const [stats, setStats] = useState({ total: 0, sangatTinggi: 0, tinggi: 0, sedang: 0, rendah: 0 });
  const [loading, setLoading] = useState(true);
  const [filterRisiko, setFilterRisiko] = useState<LevelRisikoLabel | "">("");
  const [filterAspek, setFilterAspek] = useState("");

  useEffect(() => {
    setLoading(true);
    kewaspadaanService.getEWS(
      filterAspek || undefined,
      filterRisiko || undefined
    ).then((res) => {
      setItems(res.items);
      setStats(res.stats);
    }).catch((err) => console.error("Failed to load EWS:", err))
      .finally(() => setLoading(false));
  }, [filterAspek, filterRisiko]);

  const aspekList = [...new Set(items.map((d) => d.aspek))];

  const grouped = levelOrder.reduce<Record<string, KewaspadaanDini[]>>((acc, level) => {
    acc[level] = items.filter((d) => d.tingkatRisiko === level);
    return acc;
  }, {} as Record<string, KewaspadaanDini[]>);

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
    </div>
  );

  return (
    <>
      <PageMeta title="EWS - Early Warning System" description="Dashboard Early Warning System Kewaspadaan Dini" />
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Early Warning System (EWS)</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Monitoring kewaspadaan dini yang telah disetujui</p>
          </div>
          <button onClick={() => navigate("/kewaspadaan")} className="text-sm text-brand-500 hover:underline">Lihat semua data →</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <StatCard label="Total Aktif" value={stats.total} color="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-white/90" />
          <StatCard label="Sangat Tinggi" value={stats.sangatTinggi} color={`${risikoConfig["Sangat Tinggi"].bg} ${risikoConfig["Sangat Tinggi"].border} ${risikoConfig["Sangat Tinggi"].color}`} />
          <StatCard label="Tinggi" value={stats.tinggi} color={`${risikoConfig["Tinggi"].bg} ${risikoConfig["Tinggi"].border} ${risikoConfig["Tinggi"].color}`} />
          <StatCard label="Sedang" value={stats.sedang} color={`${risikoConfig["Sedang"].bg} ${risikoConfig["Sedang"].border} ${risikoConfig["Sedang"].color}`} />
          <StatCard label="Rendah" value={stats.rendah} color={`${risikoConfig["Rendah"].bg} ${risikoConfig["Rendah"].border} ${risikoConfig["Rendah"].color}`} />
        </div>

        <div className="flex flex-wrap gap-2">
          <select value={filterRisiko} onChange={(e) => setFilterRisiko(e.target.value as LevelRisikoLabel | "")}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Semua Tingkat Risiko</option>
            {levelOrder.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={filterAspek} onChange={(e) => setFilterAspek(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Semua Aspek</option>
            {aspekList.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          {(filterRisiko || filterAspek) && (
            <button onClick={() => { setFilterRisiko(""); setFilterAspek(""); }} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-2">Reset filter</button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Tidak ada data kewaspadaan aktif.</div>
        ) : (
          levelOrder.map((level) => {
            const levelItems = grouped[level];
            if (!levelItems || levelItems.length === 0) return null;
            const cfg = risikoConfig[level];
            return (
              <div key={level}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                  <h3 className={`text-sm font-semibold ${cfg.color}`}>Risiko {level} ({levelItems.length})</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {levelItems.map((item) => (
                    <AlertCard key={item.id} item={item} onClick={() => navigate(`/kewaspadaan/${item.id}`)} />
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
