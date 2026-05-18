import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { PageHeader, ActionButton } from "../../components/common";
import SelectField from "../../components/form/SelectField";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, SearchIcon, EditIcon, TrashIcon, EyeIcon } from "../../components/icons";
import type { PotensiKonflik, StatusApproval, LevelRisikoLabel } from "../../types/potensi-konflik";
import { mockPotensiKonflik, aspekOptions } from "./mockData";

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

export default function PotensiKonflikList() {
  const navigate = useNavigate();
  const [data, setData] = useState<PotensiKonflik[]>(mockPotensiKonflik);
  const [search, setSearch] = useState("");
  const [filterAspek, setFilterAspek] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = data.filter((item) => {
    const matchSearch =
      item.namaPotensiKonflik.toLowerCase().includes(search.toLowerCase()) ||
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

  const columns: DataTableColumn<PotensiKonflik>[] = [
    {
      key: "periode",
      header: "Periode",
      render: (row) => new Date(row.periode).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    },
    {
      key: "namaPotensiKonflik",
      header: "Nama Potensi Konflik",
      render: (row) => <span className="line-clamp-2 max-w-xs">{row.namaPotensiKonflik}</span>,
    },
    {
      key: "aspek",
      header: "Aspek",
      render: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400">
          {row.aspek}
        </span>
      ),
    },
    {
      key: "wilayah",
      header: "Wilayah",
      render: (row) => (
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {row.desa}, {row.kecamatan}<br /><span className="text-gray-400">{row.kabupaten}</span>
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
        return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}>{s.label}</span>;
      },
    },
  ];

  return (
    <>
      <PageMeta title="Form Potensi Konflik" description="Daftar Form Potensi Konflik" />
      <div className="space-y-4">
        <PageHeader
          title="Form Potensi Konflik"
          actions={
            <Button size="sm" onClick={() => navigate("/potensi-konflik/create")} className="gap-1.5">
              <PlusIcon /> Tambah Data
            </Button>
          }
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
            <Input placeholder="Cari nama konflik, wilayah..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
          </div>
          <SelectField value={filterAspek} onChange={(v) => { setFilterAspek(v); setPage(1); }} options={aspekOptions} placeholder="Semua Aspek" className="w-auto min-w-[150px]" />
          <SelectField
            value={filterStatus}
            onChange={(v) => { setFilterStatus(v); setPage(1); }}
            options={[
              { value: "draft", label: "Draft" },
              { value: "menunggu", label: "Menunggu" },
              { value: "disetujui", label: "Disetujui" },
              { value: "ditolak", label: "Ditolak" },
            ]}
            placeholder="Semua Status"
            className="w-auto min-w-[150px]"
          />
        </div>

        <DataTable
          columns={columns}
          data={paginated}
          emptyText="Belum ada data potensi konflik."
          pagination={{ pageNumber: page, pageSize, totalPages, totalCount: filtered.length }}
          onPageChange={setPage}
          rowKey={(item) => item.id}
          actions={(item) => (
            <>
              <ActionButton onClick={() => navigate(`/potensi-konflik/${item.id}`)} icon={<EyeIcon />} title="Lihat Detail" variant="info" />
              {item.status === "draft" && (
                <>
                  <ActionButton onClick={() => navigate(`/potensi-konflik/edit/${item.id}`)} icon={<EditIcon />} title="Edit" variant="primary" />
                  <ActionButton onClick={() => handleDelete(item.id)} icon={<TrashIcon />} title="Hapus" variant="danger" />
                </>
              )}
            </>
          )}
        />
      </div>
    </>
  );
}
