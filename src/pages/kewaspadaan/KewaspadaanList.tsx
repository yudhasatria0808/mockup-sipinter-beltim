import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { PageHeader, ActionButton } from "../../components/common";
import SelectField from "../../components/form/SelectField";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, SearchIcon, EditIcon, TrashIcon, EyeIcon } from "../../components/icons";
import type { StatusApproval, LevelRisikoLabel } from "../../types/kewaspadaan";
import { kewaspadaanService } from "../../services/kewaspadaanService";

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

const aspekOptions = ["Keamanan", "Sosial", "Politik", "Ekonomi", "Lingkungan", "Hukum"];

interface ListItem {
  id: string; periode: string; aspek: string; kabupaten: string;
  kecamatan: string; desa: string; tingkatRisiko: string;
  status: string; createdBy: string; createdAt: string;
}

export default function KewaspadaanList() {
  const navigate = useNavigate();
  const [data, setData] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterAspek, setFilterAspek] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [pagination, setPagination] = useState({
    pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await kewaspadaanService.getPaginated({
        generalSearch: search || undefined,
        aspek: filterAspek || undefined,
        status: filterStatus || undefined,
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
      });
      setData(res.data ?? []);
      setPagination((p) => ({ ...p, totalPages: res.totalPages, totalCount: res.totalCount }));
    } catch (error) { console.error("Failed to fetch:", error); }
    finally { setLoading(false); }
  }, [search, filterAspek, filterStatus, pagination.pageNumber, pagination.pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    try { await kewaspadaanService.delete(id); fetchData(); }
    catch { alert("Gagal menghapus data"); }
  };

  const columns: DataTableColumn<ListItem>[] = [
    {
      key: "periode", header: "Periode",
      render: (item) => new Date(item.periode).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    },
    { key: "aspek", header: "Aspek" },
    {
      key: "wilayah", header: "Wilayah",
      render: (item) => <span className="text-sm text-gray-600 dark:text-gray-400">{item.desa}, {item.kecamatan}</span>,
    },
    {
      key: "tingkatRisiko", header: "Tingkat Risiko",
      render: (item) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${risikoColor[item.tingkatRisiko as LevelRisikoLabel] || ""}`}>
          {item.tingkatRisiko}
        </span>
      ),
    },
    {
      key: "status", header: "Status",
      render: (item) => {
        const s = statusBadge[item.status as StatusApproval];
        return s ? <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}>{s.label}</span> : item.status;
      },
    },
    {
      key: "createdBy", header: "Dibuat Oleh",
      render: (item) => <span className="text-sm text-gray-600 dark:text-gray-400">{item.createdBy}</span>,
    },
  ];

  return (
    <>
      <PageMeta title="Form Kewaspadaan Dini" description="Data Kewaspadaan Dini Daerah" />
      <div className="space-y-4">
        <PageHeader title="Form Kewaspadaan Dini" actions={
          <Button size="sm" onClick={() => navigate("/kewaspadaan/create")} className="gap-1.5"><PlusIcon /> Tambah</Button>
        } />
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[180px] max-w-xs">
            <Input type="text" placeholder="Cari aspek, wilayah..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, pageNumber: 1 })); }} />
          </div>
          <SelectField value={filterAspek} onChange={(v) => { setFilterAspek(v); setPagination((p) => ({ ...p, pageNumber: 1 })); }}
            options={aspekOptions} placeholder="Semua Aspek" className="w-auto min-w-[150px]" />
          <SelectField value={filterStatus} onChange={(v) => { setFilterStatus(v); setPagination((p) => ({ ...p, pageNumber: 1 })); }}
            options={[{ value: "draft", label: "Draft" }, { value: "menunggu", label: "Menunggu" }, { value: "disetujui", label: "Disetujui" }, { value: "ditolak", label: "Ditolak" }]}
            placeholder="Semua Status" className="w-auto min-w-[150px]" />
          <Button type="button" variant="outline" size="sm" className="gap-1.5"
            onClick={() => { setSearch(""); setFilterAspek(""); setFilterStatus(""); setPagination((p) => ({ ...p, pageNumber: 1 })); }}>
            <SearchIcon /> Reset
          </Button>
        </div>
        <DataTable columns={columns} data={data} loading={loading} pagination={pagination}
          onPageChange={(page) => setPagination((p) => ({ ...p, pageNumber: page }))} rowKey={(item) => item.id}
          actions={(item) => (
            <>
              <ActionButton onClick={() => navigate(`/kewaspadaan/${item.id}`)} icon={<EyeIcon />} title="Detail" variant="info" />
              <ActionButton onClick={() => navigate(`/kewaspadaan/edit/${item.id}`)} icon={<EditIcon />} title="Edit" variant="primary" />
              <ActionButton onClick={() => handleDelete(item.id)} icon={<TrashIcon />} title="Hapus" variant="danger" />
            </>
          )}
        />
      </div>
    </>
  );
}
