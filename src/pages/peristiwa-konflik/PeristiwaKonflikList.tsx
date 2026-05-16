import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, SearchIcon, EditIcon, TrashIcon, EyeIcon } from "../../components/icons";
import type { PeristiwaKonflik, StatusApproval, LevelRisikoLabel } from "../../types/peristiwa-konflik";
import { mockPeristiwaKonflik } from "./mockData";

const statusBadge: Record<StatusApproval, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  menunggu: { label: "Menunggu", className: "bg-warning-50 text-warning-600 dark:bg-warning-900/20 dark:text-warning-400" },
  disetujui: { label: "Disetujui", className: "bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400" },
  ditolak: { label: "Ditolak", className: "bg-error-50 text-error-600 dark:bg-error-900/20 dark:text-error-400" },
};

const risikoColor: Record<LevelRisikoLabel, string> = {
  Rendah: "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400",
  Sedang: "bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400",
  Tinggi: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  "Sangat Tinggi": "bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400",
};

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

export default function PeristiwaKonflikList() {
  const navigate = useNavigate();
  const [data, setData] = useState<PeristiwaKonflik[]>(mockPeristiwaKonflik);
  const [search, setSearch] = useState("");
  const [filterRisiko, setFilterRisiko] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = data.filter((item) => {
    const matchSearch =
      item.namaPeristiwa.toLowerCase().includes(search.toLowerCase()) ||
      item.kabupaten.toLowerCase().includes(search.toLowerCase()) ||
      item.kecamatan.toLowerCase().includes(search.toLowerCase()) ||
      item.desa.toLowerCase().includes(search.toLowerCase());
    const matchRisiko = filterRisiko ? item.tingkatRisiko === filterRisiko : true;
    const matchStatus = filterStatus ? item.status === filterStatus : true;
    return matchSearch && matchRisiko && matchStatus;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const handleDelete = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const columns: DataTableColumn<PeristiwaKonflik>[] = [
    {
      key: "no",
      header: "No",
      headerClassName: "w-10",
      render: (_, i) => (page - 1) * pageSize + i + 1,
    },
    {
      key: "periode",
      header: "Periode",
      render: (row) =>
        new Date(row.periode).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "namaPeristiwa",
      header: "Nama Peristiwa",
      render: (row) => (
        <span className="line-clamp-2 max-w-xs">{row.namaPeristiwa}</span>
      ),
    },
    {
      key: "korban",
      header: "Korban",
      render: (row) => (
        <div className="text-xs space-y-0.5">
          {row.korbanKritis > 0 && (
            <div className="text-error-600 dark:text-error-400">Kritis: {row.korbanKritis}</div>
          )}
          {row.korbanLukaLuka > 0 && (
            <div className="text-orange-600 dark:text-orange-400">Luka: {row.korbanLukaLuka}</div>
          )}
          {row.korbanMengungsi > 0 && (
            <div className="text-warning-600 dark:text-warning-400">Mengungsi: {row.korbanMengungsi}</div>
          )}
          {row.korbanKritis === 0 && row.korbanLukaLuka === 0 && row.korbanMengungsi === 0 && (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      key: "kerugian",
      header: "Kerugian Materil",
      render: (row) => (
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {row.kerugianMateril > 0 ? formatRupiah(row.kerugianMateril) : "-"}
        </span>
      ),
    },
    {
      key: "wilayah",
      header: "Wilayah",
      render: (row) => (
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {row.desa}, {row.kecamatan}
          <br />
          <span className="text-gray-400">{row.kabupaten}</span>
        </span>
      ),
    },
    {
      key: "tingkatRisiko",
      header: "Tingkat Risiko",
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${risikoColor[row.tingkatRisiko]}`}>
          {row.tingkatRisiko}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const s = statusBadge[row.status];
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}>
            {s.label}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Aksi",
      headerClassName: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => navigate(`/peristiwa-konflik/${row.id}`)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Lihat Detail"
          >
            <EyeIcon />
          </button>
          {row.status === "draft" && (
            <>
              <button
                onClick={() => navigate(`/peristiwa-konflik/edit/${row.id}`)}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Edit"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => handleDelete(row.id)}
                className="p-1.5 rounded-lg text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20"
                title="Hapus"
              >
                <TrashIcon />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageMeta title="Form Peristiwa Konflik" description="Daftar Form Peristiwa Konflik" />
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Form Peristiwa Konflik
          </h2>
          <Button size="sm" onClick={() => navigate("/peristiwa-konflik/create")} className="gap-1.5">
            <PlusIcon /> Tambah Data
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>
            <Input
              placeholder="Cari nama peristiwa, wilayah..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
          <select
            value={filterRisiko}
            onChange={(e) => { setFilterRisiko(e.target.value); setPage(1); }}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Semua Tingkat Risiko</option>
            <option value="Sangat Tinggi">Sangat Tinggi</option>
            <option value="Tinggi">Tinggi</option>
            <option value="Sedang">Sedang</option>
            <option value="Rendah">Rendah</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="menunggu">Menunggu</option>
            <option value="disetujui">Disetujui</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>

        <DataTable
          columns={columns}
          data={paginated}
          emptyText="Belum ada data peristiwa konflik."
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              Menampilkan {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} dari {filtered.length} data
            </span>
            <div className="flex gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded-lg border ${p === page ? "bg-brand-500 text-white border-brand-500" : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
