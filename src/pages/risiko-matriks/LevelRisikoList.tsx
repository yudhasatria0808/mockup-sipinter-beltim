import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, SearchIcon, EditIcon, TrashIcon } from "../../components/icons";
import type { LevelRisiko } from "../../types/risiko-matriks";
import { levelRisikoService } from "../../services/masterDataService";

export default function LevelRisikoList() {
  const navigate = useNavigate();
  const [data, setData] = useState<LevelRisiko[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await levelRisikoService.getPaginated({
        generalSearch: search, pageNumber: pagination.pageNumber, pageSize: pagination.pageSize,
      });
      setData(res.data ?? []);
      setPagination((p) => ({ ...p, totalPages: res.totalPages, totalCount: res.totalCount }));
    } catch (error) { console.error("Failed to fetch:", error); }
    finally { setLoading(false); }
  }, [search, pagination.pageNumber, pagination.pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus level risiko "${nama}"?`)) return;
    try { await levelRisikoService.delete(id); fetchData(); }
    catch { alert("Gagal menghapus. Pastikan tidak digunakan di matriks."); }
  };

  const columns: DataTableColumn<LevelRisiko>[] = [
    { key: "warna", header: "Warna", headerClassName: "w-24", render: (item) => (
      <div className="flex items-center gap-2">
        <span className="inline-block w-6 h-6 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm" style={{ backgroundColor: item.warna }} />
        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{item.warna}</span>
      </div>
    )},
    { key: "nama", header: "Nama", className: "font-medium text-gray-800 dark:text-white/90" },
    { key: "skor", header: "Rentang Skor", render: (item) => (
      <span className="text-sm text-gray-600 dark:text-gray-400">{item.skorMin} – {item.skorMax}</span>
    )},
  ];

  return (
    <>
      <PageMeta title="Master Level Risiko" description="Kelola Master Level Risiko" />
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Master Level Risiko</h2>
          <Button size="sm" onClick={() => navigate("/risiko/level/create")} className="gap-1.5"><PlusIcon /> Tambah</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[180px] max-w-xs">
            <Input type="text" placeholder="Cari nama..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, pageNumber: 1 })); }} />
          </div>
          <Button type="button" variant="outline" size="sm" className="gap-1.5"
            onClick={() => { setSearch(""); setPagination((p) => ({ ...p, pageNumber: 1 })); }}><SearchIcon /> Reset</Button>
        </div>
        <DataTable columns={columns} data={data} loading={loading} pagination={pagination}
          onPageChange={(page) => setPagination((p) => ({ ...p, pageNumber: page }))} rowKey={(item) => item.id}
          actions={(item) => (
            <>
              <button onClick={() => navigate(`/risiko/level/edit/${item.id}`)}
                className="p-1.5 rounded-md text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors" title="Edit"><EditIcon /></button>
              <button onClick={() => handleDelete(item.id, item.nama)}
                className="p-1.5 rounded-md text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors" title="Hapus"><TrashIcon /></button>
            </>
          )}
        />
      </div>
    </>
  );
}
