import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { PageHeader } from "../../components/common";
import SelectField from "../../components/form/SelectField";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, SearchIcon, EyeIcon, TrashIcon } from "../../components/icons";
import { forumService, type ForumPengumumanListItem } from "../../services/forumService";

const prioritasBadge: Record<string, { label: string; className: string }> = {
  biasa: { label: "Biasa", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  penting: { label: "Penting", className: "bg-warning-50 text-warning-600 dark:bg-warning-900/20 dark:text-warning-400" },
  urgent: { label: "Urgent", className: "bg-error-50 text-error-600 dark:bg-error-900/20 dark:text-error-400" },
};

export default function ForumPengumumanList() {
  const navigate = useNavigate();
  const [data, setData] = useState<ForumPengumumanListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPrioritas, setFilterPrioritas] = useState("");
  const [pagination, setPagination] = useState({
    pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await forumService.getPengumumanList({
        generalSearch: search || undefined,
        prioritas: filterPrioritas || undefined,
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
      });
      setData(res.data ?? []);
      setPagination((p) => ({ ...p, totalPages: res.totalPages, totalCount: res.totalCount }));
    } catch (error) { console.error("Failed to fetch:", error); }
    finally { setLoading(false); }
  }, [search, filterPrioritas, pagination.pageNumber, pagination.pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) return;
    try { await forumService.deletePengumuman(id); fetchData(); }
    catch { alert("Gagal menghapus pengumuman"); }
  };

  const columns: DataTableColumn<ForumPengumumanListItem>[] = [
    {
      key: "judul", header: "Judul Pengumuman",
      render: (item) => (
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90 line-clamp-1">{item.judul}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.createdByName} ({item.createdByRole})</p>
        </div>
      ),
    },
    {
      key: "prioritas", header: "Prioritas",
      render: (item) => {
        const p = prioritasBadge[item.prioritas] || prioritasBadge.biasa;
        return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.className}`}>{p.label}</span>;
      },
    },
    {
      key: "isActive", header: "Status",
      render: (item) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.isActive ? "bg-success-50 text-success-600" : "bg-gray-100 text-gray-500"}`}>
          {item.isActive ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
    {
      key: "createdAt", header: "Tanggal",
      render: (item) => <span className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>,
    },
  ];

  return (
    <>
      <PageMeta title="Pengumuman - Forkopimda" description="Pengumuman Forum Komunikasi Pimpinan Daerah" />
      <div className="space-y-4">
        <PageHeader title="Pengumuman" actions={
          <Button size="sm" onClick={() => navigate("/forum/pengumuman/create")} className="gap-1.5"><PlusIcon /> Buat Pengumuman</Button>
        } />
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[180px] max-w-xs">
            <Input type="text" placeholder="Cari pengumuman..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, pageNumber: 1 })); }} />
          </div>
          <SelectField value={filterPrioritas} onChange={(v) => { setFilterPrioritas(v); setPagination((p) => ({ ...p, pageNumber: 1 })); }}
            options={[{ value: "biasa", label: "Biasa" }, { value: "penting", label: "Penting" }, { value: "urgent", label: "Urgent" }]}
            placeholder="Semua Prioritas" className="w-auto min-w-[150px]" />
          <Button type="button" variant="outline" size="sm" className="gap-1.5"
            onClick={() => { setSearch(""); setFilterPrioritas(""); setPagination((p) => ({ ...p, pageNumber: 1 })); }}>
            <SearchIcon /> Reset
          </Button>
        </div>
        <DataTable columns={columns} data={data} loading={loading} pagination={pagination}
          onPageChange={(page) => setPagination((p) => ({ ...p, pageNumber: page }))} rowKey={(item) => item.id}
          actions={(item) => (
            <>
              <button onClick={() => navigate(`/forum/pengumuman/${item.id}`)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Detail"><EyeIcon /></button>
              <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" title="Hapus"><TrashIcon /></button>
            </>
          )}
        />
      </div>
    </>
  );
}
