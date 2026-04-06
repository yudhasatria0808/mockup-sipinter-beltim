import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, SearchIcon, EditIcon, TrashIcon, EyeIcon } from "../../components/icons";
import type { KewaspadaanDini, StatusApproval, LevelRisikoLabel } from "../../types/kewaspadaan";
import { mockKewaspadaan, aspekOptions } from "./mockData";

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

export default function KewaspadaanList() {
  const navigate = useNavigate();
  const [data, setData] = useState<KewaspadaanDini[]>(mockKewaspadaan);
  const [search, setSearch] = useState("");
  const [filterAspek, setFilterAspek] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = data.filter((item) => {
    const matchSearch =
      item.aspek.toLowerCase().includes(search.toLowerCase()) ||
      item.kabupaten.toLowerCase().includes(search.toLowerCase()) ||
      item.kecamatan.toLowerCase().includes(search.toLowerCase()) ||
      item.desa.toLowerCase().includes(search.toLowerCase());
    const matchAspek = filterAspek ? item.aspek === filterAspek : true;
    const matchStatus = filterStatus ? item.status === filterStatus : true;
    return matchSearch && matchAspek && matchStatus;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const handleDelete = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const columns: DataTableColumn<KewaspadaanDini>[] = [
    {
      key: "no",
      header: "No",
      headerClassName: "w-10",
      render: (_, i) => (page - 1) * pageSize + i + 1,
    },
    {
      key: "periode",
      header: "Periode",
      render: (item) => new Date(item.periode).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    },
    { key: "aspek", header: "Aspek" },
    {
      key: "wilayah",
      header: "Wilayah",
      render: (item) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {item.desa}, {item.kecamatan}
        </span>
      ),
    },
    {
      key: "tingkatRisiko",
      header: "Tingkat Risiko",
      render: (item) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${risikoColor[item.tingkatRisiko]}`}>
          {item.tingkatRisiko}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const s = statusBadge[item.status];
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}>
            {s.label}
          </span>
        );
      },
    },
    {
      key: "createdBy",
      header: "Dibuat Oleh",
      render: (item) => <span className="text-sm text-gray-600 dark:text-gray-400">{item.createdBy}</span>,
    },
  ];

  return (
    <>
      <PageMeta title="Form Kewaspadaan Dini" description="Data Kewaspadaan Dini Daerah" />
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Form Kewaspadaan Dini
          </h2>
          <Button size="sm" onClick={() => navigate("/kewaspadaan/create")} className="gap-1.5">
            <PlusIcon /> Tambah
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[180px] max-w-xs">
            <Input
              type="text"
              placeholder="Cari aspek, wilayah..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            value={filterAspek}
            onChange={(e) => { setFilterAspek(e.target.value); setPage(1); }}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Semua Aspek</option>
            {aspekOptions.map((a) => <option key={a} value={a}>{a}</option>)}
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => { setSearch(""); setFilterAspek(""); setFilterStatus(""); setPage(1); }}
          >
            <SearchIcon /> Reset
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={paginated}
          loading={false}
          pagination={{ pageNumber: page, pageSize, totalPages, totalCount: filtered.length }}
          onPageChange={setPage}
          rowKey={(item) => item.id}
          actions={(item) => (
            <>
              <button
                onClick={() => navigate(`/kewaspadaan/${item.id}`)}
                className="p-1.5 rounded-md text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                title="Detail"
              >
                <EyeIcon />
              </button>
              <button
                onClick={() => navigate(`/kewaspadaan/edit/${item.id}`)}
                className="p-1.5 rounded-md text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                title="Edit"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-md text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                title="Hapus"
              >
                <TrashIcon />
              </button>
            </>
          )}
        />
      </div>
    </>
  );
}
