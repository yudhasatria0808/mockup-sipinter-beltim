import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { PageHeader } from "../../components/common";
import SelectField from "../../components/form/SelectField";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, SearchIcon, EyeIcon, TrashIcon } from "../../components/icons";
import { forumService, type ForumArahanListItem } from "../../services/forumService";

const prioritasBadge: Record<string, { label: string; className: string }> = {
  biasa: { label: "Biasa", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  penting: { label: "Penting", className: "bg-warning-50 text-warning-600 dark:bg-warning-900/20 dark:text-warning-400" },
  urgent: { label: "Urgent", className: "bg-error-50 text-error-600 dark:bg-error-900/20 dark:text-error-400" },
};

export default function ForumArahanList() {
  const navigate = useNavigate();
  const [data, setData] = useState<ForumArahanListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPrioritas, setFilterPrioritas] = useState("");
  const [pagination, setPagination] = useState({
    pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await forumService.getArahanList({
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
    if (!confirm("Apakah Anda yakin ingin menghapus arahan ini?")) return;
    try { await forumService.deleteArahan(id); fetchData(); }
    catch { alert("Gagal menghapus arahan"); }
  };

  const columns: DataTableColumn<ForumArahanListItem>[] = [
    {
      key: "judul", header: "Judul Arahan",
      render: (item) => (
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90 line-clamp-1">{item.judul}</p>
          {item.forumTopikJudul && (
            <p className="text-xs text-gray-400 mt-0.5">🔗 {item.forumTopikJudul}</p>
          )}
        </div>
      ),
    },
    {
      key: "instansiTujuan", header: "Instansi Tujuan",
      render: (item) => <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{item.instansiTujuan}</span>,
    },
    {
      key: "prioritas", header: "Prioritas",
      render: (item) => {
        const p = prioritasBadge[item.prioritas] || prioritasBadge.biasa;
        return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.className}`}>{p.label}</span>;
      },
    },
    {
      key: "progress", header: "Tindak Lanjut",
      render: (item) => {
        const total = item.jumlahTindakLanjut;
        const done = item.tindakLanjutSelesai;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        return (
          <div className="flex items-center gap-2 min-w-[120px]">
            <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-success-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">{done}/{total}</span>
          </div>
        );
      },
    },
    {
      key: "createdByName", header: "Dari",
      render: (item) => <span className="text-sm text-gray-600 dark:text-gray-400">{item.createdByName}</span>,
    },
    {
      key: "createdAt", header: "Tanggal",
      render: (item) => <span className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>,
    },
  ];

  return (
    <>
      <PageMeta title="Arahan & Disposisi - Forkopimda" description="Arahan dan Disposisi Pimpinan Daerah" />
      <div className="space-y-4">
        <PageHeader title="Arahan & Disposisi" actions={
          <Button size="sm" onClick={() => navigate("/forum/arahan/create")} className="gap-1.5"><PlusIcon /> Buat Arahan</Button>
        } />
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[180px] max-w-xs">
            <Input type="text" placeholder="Cari arahan..." value={search}
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
              <button onClick={() => navigate(`/forum/arahan/${item.id}`)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Detail"><EyeIcon /></button>
              <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" title="Hapus"><TrashIcon /></button>
            </>
          )}
        />
      </div>
    </>
  );
}
