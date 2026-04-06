import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { mockLevelKemungkinan, mockLevelDampak, mockLevelRisiko, mockMatriks } from "./mockData";
import type { MatriksRisiko } from "../../types/risiko-matriks";

export default function MatriksRisikoPage() {
  const [matriks, setMatriks] = useState<MatriksRisiko[]>(mockMatriks);

  const kemungkinanSorted = [...mockLevelKemungkinan].sort((a, b) => b.skor - a.skor);
  const dampakSorted = [...mockLevelDampak].sort((a, b) => a.skor - b.skor);

  const getCell = (kemungkinanId: string, dampakId: string) =>
    matriks.find((m) => m.kemungkinanId === kemungkinanId && m.dampakId === dampakId);

  const getLevelRisiko = (levelRisikoId: string) =>
    mockLevelRisiko.find((r) => r.id === levelRisikoId);

  const handleCellChange = (kemungkinanId: string, dampakId: string, levelRisikoId: string) => {
    setMatriks((prev) =>
      prev.map((m) =>
        m.kemungkinanId === kemungkinanId && m.dampakId === dampakId
          ? { ...m, levelRisikoId }
          : m
      )
    );
  };

  return (
    <>
      <PageMeta title="Matriks Risiko" description="Mapping Impact × Likelihood → Risk Level" />
      <div className="space-y-6">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Matriks Risiko</h2>

        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {mockLevelRisiko.map((level) => (
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
                {/* Corner cell */}
                <th className="bg-gray-50 dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 p-3 text-left">
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    <div>Kemungkinan ↓</div>
                    <div>Dampak →</div>
                  </div>
                </th>
                {dampakSorted.map((d) => (
                  <th key={d.id}
                    className="bg-gray-50 dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 p-3 text-center min-w-[110px]">
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
                      <td key={d.id}
                        className="border-b border-r border-gray-200 dark:border-gray-700 p-2 text-center"
                        style={{ backgroundColor: level ? level.warna + "33" : undefined }}>
                        <div className="flex flex-col items-center gap-1">
                          {/* Skor */}
                          <span className="text-sm font-bold text-gray-800 dark:text-white/90">{skor}</span>
                          {/* Level badge */}
                          {level && (
                            <span className="text-xs px-1.5 py-0.5 rounded font-medium text-white"
                              style={{ backgroundColor: level.warna }}>
                              {level.nama}
                            </span>
                          )}
                          {/* Dropdown to override */}
                          <select
                            value={cell?.levelRisikoId ?? ""}
                            onChange={(e) => handleCellChange(k.id, d.id, e.target.value)}
                            className="mt-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-1 py-0.5 w-full max-w-[100px]"
                          >
                            {mockLevelRisiko.map((r) => (
                              <option key={r.id} value={r.id}>{r.nama}</option>
                            ))}
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

        {/* Info */}
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Skor = Kemungkinan × Dampak. Gunakan dropdown pada setiap sel untuk mengubah level risiko secara manual.
        </p>
      </div>
    </>
  );
}
