import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";

interface LaporanItem {
  id: string;
  judul: string;
  periode: string;
  kategori: string;
  tanggalGenerate: string;
  ukuranFile: string;
  format: "excel" | "pdf";
}

const mockLaporan: LaporanItem[] = [
  {
    id: "l1",
    judul: "Laporan Kewaspadaan Dini - Januari 2026",
    periode: "Januari 2026",
    kategori: "Kewaspadaan Dini",
    tanggalGenerate: "2026-02-01T00:00:00Z",
    ukuranFile: "245 KB",
    format: "excel",
  },
  {
    id: "l2",
    judul: "Laporan Potensi Konflik - Januari 2026",
    periode: "Januari 2026",
    kategori: "Potensi Konflik",
    tanggalGenerate: "2026-02-01T00:00:00Z",
    ukuranFile: "312 KB",
    format: "excel",
  },
  {
    id: "l3",
    judul: "Laporan Peristiwa Konflik - Januari 2026",
    periode: "Januari 2026",
    kategori: "Peristiwa Konflik",
    tanggalGenerate: "2026-02-01T00:00:00Z",
    ukuranFile: "198 KB",
    format: "excel",
  },
  {
    id: "l4",
    judul: "Laporan Keberadaan WNA - Januari 2026",
    periode: "Januari 2026",
    kategori: "WNA",
    tanggalGenerate: "2026-02-01T00:00:00Z",
    ukuranFile: "156 KB",
    format: "excel",
  },
  {
    id: "l5",
    judul: "Laporan Keberadaan TKA - Januari 2026",
    periode: "Januari 2026",
    kategori: "TKA",
    tanggalGenerate: "2026-02-01T00:00:00Z",
    ukuranFile: "178 KB",
    format: "excel",
  },
  {
    id: "l6",
    judul: "Ringkasan Eksekutif - Januari 2026",
    periode: "Januari 2026",
    kategori: "Ringkasan",
    tanggalGenerate: "2026-02-01T00:00:00Z",
    ukuranFile: "89 KB",
    format: "pdf",
  },
  {
    id: "l7",
    judul: "Laporan Kewaspadaan Dini - Desember 2025",
    periode: "Desember 2025",
    kategori: "Kewaspadaan Dini",
    tanggalGenerate: "2026-01-01T00:00:00Z",
    ukuranFile: "220 KB",
    format: "excel",
  },
  {
    id: "l8",
    judul: "Ringkasan Eksekutif - Desember 2025",
    periode: "Desember 2025",
    kategori: "Ringkasan",
    tanggalGenerate: "2026-01-01T00:00:00Z",
    ukuranFile: "75 KB",
    format: "pdf",
  },
];

const kategoriOptions = ["Kewaspadaan Dini", "Potensi Konflik", "Peristiwa Konflik", "WNA", "TKA", "Ringkasan"];

export default function LaporanPeriodik() {
  const [filterKategori, setFilterKategori] = useState("");
  const [filterPeriode, setFilterPeriode] = useState("");

  const periodeOptions = [...new Set(mockLaporan.map((l) => l.periode))];

  const filtered = mockLaporan.filter((l) => {
    if (filterKategori && l.kategori !== filterKategori) return false;
    if (filterPeriode && l.periode !== filterPeriode) return false;
    return true;
  });

  const handleDownload = (item: LaporanItem) => {
    // Mockup: simulasi download
    alert(`[Mockup] Mengunduh: ${item.judul}\nFormat: ${item.format.toUpperCase()}\nUkuran: ${item.ukuranFile}`);
  };

  return (
    <>
      <PageMeta title="Laporan Periodik" description="Download Laporan Periodik SIPINTAR BELTIM" />
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Laporan Periodik
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Laporan periodik yang digenerate otomatis oleh sistem untuk kebutuhan pimpinan
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
          >
            <option value="">Semua Kategori</option>
            {kategoriOptions.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <select
            value={filterPeriode}
            onChange={(e) => setFilterPeriode(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
          >
            <option value="">Semua Periode</option>
            {periodeOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Judul Laporan</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Kategori</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Periode</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Format</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Ukuran</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Tanggal</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      Tidak ada laporan ditemukan.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90 font-medium">
                        {item.judul}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.kategori}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.periode}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${
                          item.format === "pdf"
                            ? "bg-error-50 text-error-600 dark:bg-error-900/20 dark:text-error-400"
                            : "bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400"
                        }`}>
                          {item.format}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.ukuranFile}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {new Date(item.tanggalGenerate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button size="sm" variant="outline" onClick={() => handleDownload(item)} className="gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Unduh
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
