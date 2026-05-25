import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { PageHeader, ActionButton } from "../../components/common";
import SelectField from "../../components/form/SelectField";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, SearchIcon, EditIcon, TrashIcon, EyeIcon } from "../../components/icons";
import type { StatusApproval, JenisIzinTinggal } from "../../types/tka";
import { tkaService } from "../../services/tkaService";
import { useAuth } from "../../context/AuthContext";

const jenisIzinTinggalOptions = ["Visa", "KITAS", "KITAP"];

const statusBadge: Record<StatusApproval, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  menunggu: { label: "Menunggu", className: "bg-warning-50 text-warning-600 dark:bg-warning-900/20 dark:text-warning-400" },
  disetujui: { label: "Disetujui", className: "bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400" },
  ditolak: { label: "Ditolak", className: "bg-error-50 text-error-600 dark:bg-error-900/20 dark:text-error-400" },
};

const izinTinggalBadge: Record<JenisIzinTinggal, string> = {
  Visa: "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400",
  KITAS: "bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400",
  KITAP: "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400",
};

interface ListItem {
  id: string; periode: string; namaTKA: string; jenisKelamin: string;
  namaPerusahaan: string; jabatanKeterampilan?: string;
  kewarganegaraan: string; noPaspor: string;
  nomorIMTA?: string; tanggalBerakhirIMTA?: string;
  jenisIzinTinggal: string;
  kabupaten: string; kecamatan: string; desa: string;
  status: string;
}

export default function TKAList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canCreate = user.permissions.some(p => p.menuName === "Form TKA" && p.canCreate);
  const [data, setData] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterIzin, setFilterIzin] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 0 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tkaService.getPaginated({
        generalSearch: search || undefined,
        jenisIzinTinggal: filterIzin || undefined,
        status: filterStatus || undefined,
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
      });
      setData(res.data ?? []);
      setPagination((p) => ({ ...p, totalPages: res.totalPages, totalCount: res.totalCount }));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [search, filterIzin, filterStatus, pagination.pageNumber, pagination.pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    try { await tkaService.delete(id); fetchData(); } catch { alert("Gagal menghapus"); }
  };

  const isIMTAExpired = (tanggalBerakhir?: string) => tanggalBerakhir ? new Date(tanggalBerakhir) < new Date() : false;

  const columns: DataTableColumn<ListItem>[] = [
    {
      key: "periode",
      header: "Periode",
      render: (row) => new Date(row.periode).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    },
    {
      key: "namaTKA",
      header: "Nama TKA",
      render: (row) => (
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">{row.namaTKA}</p>
          <p className="text-xs text-gray-500">{row.jenisKelamin} · {row.kewarganegaraan}</p>
        </div>
      ),
    },
    {
      key: "perusahaan",
      header: "Perusahaan / Jabatan",
      render: (row) => (
        <div className="space-y-0.5">
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">{row.namaPerusahaan}</p>
          <p className="text-xs text-gray-400">{row.jabatanKeterampilan || "-"}</p>
        </div>
      ),
    },
    {
      key: "imta",
      header: "No. IMTA/RPTKA",
      render: (row) => (
        <div className="space-y-0.5">
          <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{row.nomorIMTA || "-"}</p>
          {row.tanggalBerakhirIMTA && (
            <p className={`text-xs ${isIMTAExpired(row.tanggalBerakhirIMTA) ? "text-error-500" : "text-gray-400"}`}>
              s/d {new Date(row.tanggalBerakhirIMTA).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
              {isIMTAExpired(row.tanggalBerakhirIMTA) && " ⚠"}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "jenisIzinTinggal",
      header: "Izin Tinggal",
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${izinTinggalBadge[row.jenisIzinTinggal as JenisIzinTinggal] || ""}`}>
          {row.jenisIzinTinggal}
        </span>
      ),
    },
    {
      key: "lokasi",
      header: "Lokasi Kerja",
      render: (row) => (
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {row.desa}, {row.kecamatan}<br /><span className="text-gray-400">{row.kabupaten}</span>
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const s = statusBadge[row.status as StatusApproval];
        return s ? <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}>{s.label}</span> : row.status;
      },
    },
  ];

  return (
    <>
      <PageMeta title="Form Tenaga Kerja Asing" description="Daftar Data Tenaga Kerja Asing" />
      <div className="space-y-4">
        <PageHeader
          title="Form Tenaga Kerja Asing (TKA)"
          actions={
            canCreate ? <Button size="sm" onClick={() => navigate("/tka/create")} className="gap-1.5">
              <PlusIcon /> Tambah Data
            </Button> : undefined
          }
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
            <Input placeholder="Cari nama TKA, perusahaan, paspor, wilayah..." value={search} onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, pageNumber: 1 })); }} className="pl-9" />
          </div>
          <SelectField value={filterIzin} onChange={(v) => { setFilterIzin(v); setPagination((p) => ({ ...p, pageNumber: 1 })); }} options={jenisIzinTinggalOptions} placeholder="Semua Jenis Izin Tinggal" className="w-auto min-w-[180px]" />
          <SelectField
            value={filterStatus}
            onChange={(v) => { setFilterStatus(v); setPagination((p) => ({ ...p, pageNumber: 1 })); }}
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
          data={data}
          loading={loading}
          emptyText="Belum ada data tenaga kerja asing."
          pagination={pagination}
          onPageChange={(page) => setPagination((p) => ({ ...p, pageNumber: page }))}
          rowKey={(item) => item.id}
          actions={(item) => (
            <>
              <ActionButton onClick={() => navigate(`/tka/${item.id}`)} icon={<EyeIcon />} title="Lihat Detail" variant="info" />
              {item.status === "draft" && (
                <>
                  <ActionButton onClick={() => navigate(`/tka/edit/${item.id}`)} icon={<EditIcon />} title="Edit" variant="primary" />
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
