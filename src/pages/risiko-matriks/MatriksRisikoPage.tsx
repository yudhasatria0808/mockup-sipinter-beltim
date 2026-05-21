import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { CheckIcon as SaveIcon } from "../../components/icons";
import type { LevelKemungkinan, LevelDampak, LevelRisiko } from "../../types/risiko-matriks";
import {
  levelKemungkinanService,
  levelDampakService,
  levelRisikoService,
  matriksRisikoService,
  type MatriksRisikoDto,
} from "../../services/masterDataService";

interface MatriksCell {
  kemungkinanId: string;
  dampakId: string;
  levelRisikoId: string;
}

export default function MatriksRisikoPage() {
  const [kemungkinanList, setKemungkinanList] = useState<LevelKemungkinan[]>([]);
  const [dampakList, setDampakList] = useState<LevelDampak[]>([]);
  const [risikoList, setRisikoList] = useState<LevelRisiko[]>([]);
  const [matriks, setMatriks] = useState<MatriksCell[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [kemungkinan, dampak, risiko, matriksData] = await Promise.all([
          levelKemungkinanService.getAll(),
          levelDampakService.getAll(),
          levelRisikoService.getAll(),
          matriksRisikoService.getAll(),
        ]);
        setKemungkinanList(kemungkinan);
        setDampakList(dampak);
        setRisikoList(risiko);
        setMatriks(matriksData.map((m: MatriksRisikoDto) => ({
          kemungkinanId: m.kemungkinanId,
          dampakId: m.dampakId,
          levelRisikoId: m.levelRisikoId,
        })));
      } catch (error) { console.error("Failed to load:", error); }
      finally { setLoading(false); }
    };
    loadAll();
  }, []);

  const kemungkinanSorted = [...kemungkinanList].sort((a, b) => b.skor - a.skor);
  const dampakSorted = [...dampakList].sort((a, b) => a.skor - b.skor);

  const getCell = (kemungkinanId: string, dampakId: string) =>
    matriks.find((m) => m.kemungkinanId === kemungkinanId && m.dampakId === dampakId);

  const getLevelRisiko = (levelRisikoId: string) =>
    risikoList.find((r) => r.id === levelRisikoId);

  const handleCellChange = (kemungkinanId: string, dampakId: string, levelRisikoId: string) => {
    setMatriks((prev) => {
      const existing = prev.find((m) => m.kemungkinanId === kemungkinanId && m.dampakId === dampakId);
      if (existing) {
        return prev.map((m) =>
          m.kemungkinanId === kemungkinanId && m.dampakId === dampakId
            ? { ...m, levelRisikoId } : m
        );
      }
      return [...prev, { kemungkinanId, dampakId, levelRisikoId }];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await matriksRisikoService.bulkSave(matriks);
      alert("Matriks risiko berhasil disimpan");
    } catch { alert("Gagal menyimpan matriks"); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Matriks Risiko" description="Mapping Impact × Likelihood → Risk Level" />
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Matriks Risiko</h2>
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
            <SaveIcon /> {saving ? "Menyimpan..." : "Simpan Matriks"}
          </Button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {risikoList.map((level) => (
            <div key={level.id} className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: level.warna }} />
              <span className="text-xs text-gray-600 dark:text-gray-400">{level.nama}</span>
            </div>
          ))}
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-gray-50 dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 p-3 text-left">
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    <div>Kemungkinan ↓</div><div>Dampak →</div>
                  </div>
                </th>
                {dampakSorted.map((d) => (
                  <th key={d.id} className="bg-gray-50 dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 p-3 text-center min-w-[110px]">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{d.nama}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Skor {d.skor}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kemungkinanSorted.map((k) => (
                <tr key={k.id}>
                  <td className="bg-gray-50 dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 p-3">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{k.nama}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Skor {k.skor}</div>
                  </td>
                  {dampakSorted.map((d) => {
                    const cell = getCell(k.id, d.id);
                    const level = cell ? getLevelRisiko(cell.levelRisikoId) : null;
                    const skor = k.skor * d.skor;
                    return (
                      <td key={d.id} className="border-b border-r border-gray-200 dark:border-gray-700 p-2 text-center"
                        style={{ backgroundColor: level ? level.warna + "33" : undefined }}>
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-sm font-bold text-gray-800 dark:text-white/90">{skor}</span>
                          {level && (
                            <span className="text-xs px-1.5 py-0.5 rounded font-medium text-white" style={{ backgroundColor: level.warna }}>{level.nama}</span>
                          )}
                          <select value={cell?.levelRisikoId ?? ""} onChange={(e) => handleCellChange(k.id, d.id, e.target.value)}
                            className="mt-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-1 py-0.5 w-full max-w-[100px]">
                            <option value="">-</option>
                            {risikoList.map((r) => <option key={r.id} value={r.id}>{r.nama}</option>)}
                          </select>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          Skor = Kemungkinan × Dampak. Gunakan dropdown pada setiap sel untuk mengubah level risiko secara manual. Klik "Simpan Matriks" untuk menyimpan perubahan.
        </p>
      </div>
    </>
  );
}
