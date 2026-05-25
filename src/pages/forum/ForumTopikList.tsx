import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { PageHeader } from "../../components/common";
import SelectField from "../../components/form/SelectField";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, SearchIcon, EyeIcon, TrashIcon } from "../../components/icons";
import { forumService, type ForumTopikListItem } from "../../services/forumService";

const prioritasBadge: Record<string, { label: string; className: string }> = {
  biasa: { label: "Biasa", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  penting: { label: "Penting", className: "bg-warning-50 text-warning-600 dark:bg-warning-900/20 dark:text-warning-400" },
  urgent: { label: "Urgent", className: "bg-error-50 text-error-600 dark:bg-error-900/20 dark:text-error-400" },
};

const kategoriBadge: Record<string, { label: string; className: string }> = {
  keamanan: { label: "Keamanan", className: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" },
  konflik: { label: "Konflik", className: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400" },
  koordinasi: { label: "Koordinasi", className: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" },
  lainnya: { label: "Lainnya", className: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400" },
};

const statusBadge: Record<string, { label: string; className: string }> = {
  aktif: { label: "Aktif", className: "bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400" },
  ditutup: { label: "Ditutup", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  diarsipkan: { label: "Diarsipkan", className: "bg-warning-50 text-warning-600 dark:bg-warning-900/20 dark:text-warning-400" },
};

export default function ForumTopikList() {
  const navigate = useNavigate();
  const [data, setData] = useState<ForumTopikListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [filterPrioritas, setFilterPrioritas] = useState("");
  const [pagination, setPagination] = useState({
    pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await forumService.getTopikList({
        generalSearch: search || undefined,
        kategori: filterKategori || undefined,
        prioritas: filterPrioritas || undefined,
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
      });
      setData(res.data ?? []);
      setPagination((p) => ({ ...p, totalPages: res.totalPages, totalCount: res.totalCount }));
    } catch (error) { console.error("Failed to fetch:", error); }
    finally { setLoading(false); }
  }, [search, filterKategori, filterPrioritas, pagination.pageNumber, pagination.pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus topik ini beserta semua komentarnya?")) return;
    try { await forumService.deleteTopik(id); fetchData(); }
    catch { alert("Gagal menghapus topik"); }
  };

  const columns: DataTableColumn<ForumTopikListItem>[] = [
    {
      key: "judul", header: "Judul Topik",
      render: (item) => (
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90 line-clamp-1">{item.judul}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.createdByName} ({item.createdByRole})</p>
        </div>
      ),
    },
    {
      key: "kategori", header: "Kategori",
      render: (item) => {
        const k = kategoriBadge[item.kategori] || kategoriBadge.lainnya;
        return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${k.className}`}>{k.label}</span>;
      },
    },
    {
      key: "prioritas", header: "Prioritas",
      render: (item) => {
        const p = prioritasBadge[item.prioritas] || prioritasBadge.biasa;
        return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.className}`}>{p.label}</span>;
      },
    },
    {
      key: "status", header: "Status",
      render: (item) => {
        const s = statusBadge[item.status] || statusBadge.aktif;
        return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}>{s.label}</span>;
      },
    },
    {
      key: "jumlahKomentar", header: "Komentar",
      render: (item) => <span className="text-sm text-gray-600 dark:text-gray-400">💬 {item.jumlahKomentar}</span>,
    },
    {
      key: "createdAt", header: "Tanggal",
      render: (item) => <span className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>,
    },
  ];

  return (
    <>
      <PageMeta title="Forum Diskusi - Forkopimda" description="Forum Komunikasi Pimpinan Daerah" />
      <div className="space-y-4">
        <PageHeader title="Forum Diskusi" actions={
          <Button size="sm" onClick={() => navigate("/forum/topik/create")} className="gap-1.5"><PlusIcon /> Buat Topik</Button>
        } />
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[180px] max-w-xs">
            <Input type="text" placeholder="Cari topik..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, pageNumber: 1 })); }} />
          </div>
          <SelectField value={filterKategori} onChange={(v) => { setFilterKategori(v); setPagination((p) => ({ ...p, pageNumber: 1 })); }}
            options={[{ value: "keamanan", label: "Keamanan" }, { value: "konflik", label: "Konflik" }, { value: "koordinasi", label: "Koordinasi" }, { value: "lainnya", label: "Lainnya" }]}
            placeholder="Semua Kategori" className="w-auto min-w-[150px]" />
          <SelectField value={filterPrioritas} onChange={(v) => { setFilterPrioritas(v); setPagination((p) => ({ ...p, pageNumber: 1 })); }}
            options={[{ value: "biasa", label: "Biasa" }, { value: "penting", label: "Penting" }, { value: "urgent", label: "Urgent" }]}
            placeholder="Semua Prioritas" className="w-auto min-w-[150px]" />
          <Button type="button" variant="outline" size="sm" className="gap-1.5"
            onClick={() => { setSearch(""); setFilterKategori(""); setFilterPrioritas(""); setPagination((p) => ({ ...p, pageNumber: 1 })); }}>
            <SearchIcon /> Reset
          </Button>
        </div>
        <DataTable columns={columns} data={data} loading={loading} pagination={pagination}
          onPageChange={(page) => setPagination((p) => ({ ...p, pageNumber: page }))} rowKey={(item) => item.id}
          actions={(item) => (
            <>
              <button onClick={() => navigate(`/forum/topik/${item.id}`)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Detail"><EyeIcon /></button>
              <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" title="Hapus"><TrashIcon /></button>
            </>
          )}
        />
      </div>
    </>
  );
}
