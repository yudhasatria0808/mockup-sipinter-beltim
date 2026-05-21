import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { PageHeader, ActionButton } from "../../components/common";
import SearchBar from "../../components/common/SearchBar";
import Button from "../../components/ui/button/Button";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, EditIcon, TrashIcon } from "../../components/icons";
import type { TipeWilayah } from "../../types/wilayah";
import { wilayahService, type WilayahDto } from "../../services/masterDataService";

const TIPE_OPTIONS: TipeWilayah[] = ["Provinsi", "Kabupaten", "Kota", "Kecamatan", "Kelurahan", "Desa"];

export default function WilayahList() {
  const navigate = useNavigate();
  const [data, setData] = useState<WilayahDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTipe, setFilterTipe] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await wilayahService.getPaginated({
        generalSearch: search,
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        tipe: filterTipe || undefined,
      });
      setData(res.data ?? []);
      setPagination((prev) => ({
        ...prev, totalPages: res.totalPages, totalCount: res.totalCount,
      }));
    } catch (error) { console.error("Failed to fetch:", error); }
    finally { setLoading(false); }
  }, [search, filterTipe, pagination.pageNumber, pagination.pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (item: WilayahDto) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus wilayah "${item.nama}"?`))
      return;
    try { await wilayahService.delete(item.id); fetchData(); }
    catch { alert("Gagal menghapus wilayah. Pastikan tidak memiliki sub-wilayah."); }
  };

  const columns: DataTableColumn<WilayahDto>[] = [
    {
      key: "tipe", header: "Tipe",
      render: (item) => (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400">
          {item.tipe}
        </span>
      ),
    },
    { key: "nama", header: "Nama Wilayah", className: "font-medium text-gray-800 dark:text-white/90" },
    { key: "kodeBps", header: "Kode BPS", className: "font-mono text-sm text-gray-600 dark:text-gray-400" },
    {
      key: "parentNama", header: "Parent",
      render: (item) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{item.parentNama || "-"}</span>
      ),
    },
    {
      key: "coords", header: "Lat / Lng",
      render: (item) => item.latitude != null && item.longitude != null ? (
        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{item.latitude}, {item.longitude}</span>
      ) : <span className="text-xs text-gray-400">-</span>,
    },
  ];

  return (
    <>
      <PageMeta title="Master Wilayah" description="Kelola Master Data Wilayah" />
      <div className="space-y-4">
        <PageHeader title="Master Wilayah" actions={
          <Button size="sm" onClick={() => navigate("/wilayah/create")} className="gap-1.5"><PlusIcon /> Tambah</Button>
        } />
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[180px] max-w-xs">
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPagination((p) => ({ ...p, pageNumber: 1 })); }}
              placeholder="Cari nama atau kode BPS..." />
          </div>
          <select value={filterTipe}
            onChange={(e) => { setFilterTipe(e.target.value); setPagination((p) => ({ ...p, pageNumber: 1 })); }}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Semua Tipe</option>
            {TIPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <DataTable columns={columns} data={data} loading={loading} pagination={pagination}
          onPageChange={(page) => setPagination((p) => ({ ...p, pageNumber: page }))} rowKey={(item) => item.id}
          actions={(item) => (
            <>
              <ActionButton onClick={() => navigate(`/wilayah/edit/${item.id}`)} icon={<EditIcon />} title="Edit" variant="primary" />
              <ActionButton onClick={() => handleDelete(item)} icon={<TrashIcon />} title="Hapus" variant="danger" />
            </>
          )}
        />
      </div>
    </>
  );
}
