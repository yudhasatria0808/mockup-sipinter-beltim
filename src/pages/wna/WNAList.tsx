import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { PageHeader, ActionButton } from "../../components/common";
import SelectField from "../../components/form/SelectField";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, SearchIcon, EditIcon, TrashIcon, EyeIcon } from "../../components/icons";
import type { StatusApproval, StatusTinggal } from "../../types/wna";
import { wnaService } from "../../services/wnaService";

const jenisVisaOptions = [
  "KITAS",
  "KITAP",
  "Visa Kunjungan",
  "Visa Wisata",
  "Visa Dinas",
  "Visa Diplomatik",
  "Visa Pelajar",
  "Visa Kerja",
  "Lainnya",
];

const statusBadge: Record<StatusApproval, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  menunggu: { label: "Menunggu", className: "bg-warning-50 text-warning-600 dark:bg-warning-900/20 dark:text-warning-400" },
  disetujui: { label: "Disetujui", className: "bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400" },
  ditolak: { label: "Ditolak", className: "bg-error-50 text-error-600 dark:bg-error-900/20 dark:text-error-400" },
};

const statusTinggalBadge: Record<StatusTinggal, string> = {
  Aktif: "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400",
  Keluar: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  "Habis Izin": "bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400",
  Lainnya: "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400",
};

interface ListItem {
  id: string; periode: string; jenisKelamin: string;
  kewarganegaraan: string; noPaspor: string; jenisVisa: string;
  masaBerlakuVisa: string; pekerjaan?: string; sponsor?: string;
  kabupaten: string; kecamatan: string; desa: string;
  statusTinggal: string; status: string;
}

export default function WNAList() {
  const navigate = useNavigate();
  const [data, setData] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterVisa, setFilterVisa] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStatusTinggal, setFilterStatusTinggal] = useState("");
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 0 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await wnaService.getPaginated({
        generalSearch: search || undefined,
        jenisVisa: filterVisa || undefined,
        statusTinggal: filterStatusTinggal || undefined,
        status: filterStatus || undefined,
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
      });
      setData(res.data ?? []);
      setPagination((p) => ({ ...p, totalPages: res.totalPages, totalCount: res.totalCount }));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [search, filterVisa, filterStatusTinggal, filterStatus, pagination.pageNumber, pagination.pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    try { await wnaService.delete(id); fetchData(); } catch { alert("Gagal menghapus"); }
  };

  const columns: DataTableColumn<ListItem>[] = [
    {
      key: "periode",
      header: "Periode",
      render: (row) => new Date(row.periode).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    },
    {
      key: "identitas",
      header: "Identitas WNA",
      render: (row) => (
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">{row.noPaspor}</p>
          <p className="text-xs text-gray-500">{row.jenisKelamin} · {row.kewarganegaraan}</p>
        </div>
      ),
    },
    {
      key: "visa",
      header: "Visa / ITAS",
      render: (row) => (
        <div className="space-y-0.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400">
            {row.jenisVisa}
          </span>
          <p className="text-xs text-gray-500">
            s/d {new Date(row.masaBerlakuVisa).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
        </div>
      ),
    },
    {
      key: "pekerjaan",
      header: "Pekerjaan / Sponsor",
      render: (row) => (
        <div className="space-y-0.5">
          <p className="text-sm text-gray-700 dark:text-gray-300">{row.pekerjaan || "-"}</p>
          <p className="text-xs text-gray-400">{row.sponsor || "-"}</p>
        </div>
      ),
    },
    {
      key: "wilayah",
      header: "Domisili",
      render: (row) => (
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {row.desa}, {row.kecamatan}<br /><span className="text-gray-400">{row.kabupaten}</span>
        </span>
      ),
    },
    {
      key: "statusTinggal",
      header: "Ket. Status",
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusTinggalBadge[row.statusTinggal as StatusTinggal] || ""}`}>
          {row.statusTinggal}
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
      <PageMeta title="Form WNA" description="Daftar Data Warga Negara Asing" />
      <div className="space-y-4">
        <PageHeader
          title="Form Warga Negara Asing (WNA)"
          actions={
            <Button size="sm" onClick={() => navigate("/wna/create")} className="gap-1.5">
              <PlusIcon /> Tambah Data
            </Button>
          }
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
            <Input placeholder="Cari no. paspor, kewarganegaraan, wilayah..." value={search} onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, pageNumber: 1 })); }} className="pl-9" />
          </div>
          <SelectField value={filterVisa} onChange={(v) => { setFilterVisa(v); setPagination((p) => ({ ...p, pageNumber: 1 })); }} options={jenisVisaOptions} placeholder="Semua Jenis Visa" className="w-auto min-w-[160px]" />
          <SelectField
            value={filterStatusTinggal}
            onChange={(v) => { setFilterStatusTinggal(v); setPagination((p) => ({ ...p, pageNumber: 1 })); }}
            options={["Aktif", "Keluar", "Habis Izin", "Lainnya"]}
            placeholder="Semua Status Tinggal"
            className="w-auto min-w-[170px]"
          />
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
          emptyText="Belum ada data warga negara asing."
          pagination={pagination}
          onPageChange={(page) => setPagination((p) => ({ ...p, pageNumber: page }))}
          rowKey={(item) => item.id}
          actions={(item) => (
            <>
              <ActionButton onClick={() => navigate(`/wna/${item.id}`)} icon={<EyeIcon />} title="Lihat Detail" variant="info" />
              {item.status === "draft" && (
                <>
                  <ActionButton onClick={() => navigate(`/wna/edit/${item.id}`)} icon={<EditIcon />} title="Edit" variant="primary" />
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
