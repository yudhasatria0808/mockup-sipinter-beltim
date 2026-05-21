import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { PageHeader, ActionButton } from "../../components/common";
import SearchBar from "../../components/common/SearchBar";
import Button from "../../components/ui/button/Button";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, EditIcon, TrashIcon } from "../../components/icons";
import type { JenisKonflik } from "../../types/jenisKonflik";
import { jenisKonflikService } from "../../services/masterDataService";

export default function JenisKonflikList() {
  const navigate = useNavigate();
  const [data, setData] = useState<JenisKonflik[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await jenisKonflikService.getPaginated({
        generalSearch: search, pageNumber: pagination.pageNumber, pageSize: pagination.pageSize,
      });
      setData(res.data ?? []);
      setPagination((prev) => ({ ...prev, totalPages: res.totalPages, totalCount: res.totalCount }));
    } catch (error) { console.error("Failed to fetch:", error); }
    finally { setLoading(false); }
  }, [search, pagination.pageNumber, pagination.pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (item: JenisKonflik) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus jenis konflik "${item.nama}"?`)) return;
    try { await jenisKonflikService.delete(item.id); fetchData(); }
    catch { alert("Gagal menghapus data"); }
  };

  const columns: DataTableColumn<JenisKonflik>[] = [
    { key: "nama", header: "Nama Jenis Konflik", className: "font-medium text-gray-800 dark:text-white/90" },
    { key: "deskripsi", header: "Deskripsi", render: (item) => (
      <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.deskripsi || "-"}</span>
    )},
  ];

  return (
    <>
      <PageMeta title="Master Data Jenis Konflik" description="Kelola Master Data Jenis Konflik" />
      <div className="space-y-4">
        <PageHeader title="Master Data Jenis Konflik" actions={
          <Button size="sm" onClick={() => navigate("/jenis-konflik/create")} className="gap-1.5"><PlusIcon /> Tambah</Button>
        } />
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPagination((p) => ({ ...p, pageNumber: 1 })); }} placeholder="Cari nama atau deskripsi..." />
        <DataTable columns={columns} data={data} loading={loading} pagination={pagination}
          onPageChange={(page) => setPagination((p) => ({ ...p, pageNumber: page }))} rowKey={(item) => item.id}
          actions={(item) => (
            <>
              <ActionButton onClick={() => navigate(`/jenis-konflik/edit/${item.id}`)} icon={<EditIcon />} title="Edit" variant="primary" />
              <ActionButton onClick={() => handleDelete(item)} icon={<TrashIcon />} title="Hapus" variant="danger" />
            </>
          )}
        />
      </div>
    </>
  );
}
