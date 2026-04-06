import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, SearchIcon, EditIcon, TrashIcon } from "../../components/icons";
import type { Wilayah, TipeWilayah } from "../../types/wilayah";
import { mockWilayah } from "./mockData";

const TIPE_OPTIONS: TipeWilayah[] = ["Provinsi", "Kabupaten", "Kota", "Kecamatan", "Kelurahan", "Desa"];

export default function WilayahList() {
  const navigate = useNavigate();
  const [data, setData] = useState<Wilayah[]>(mockWilayah);
  const [search, setSearch] = useState("");
  const [filterTipe, setFilterTipe] = useState<TipeWilayah | "">("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const getParentNama = (parent_id: string | null) => {
    if (!parent_id) return "-";
    return data.find((w) => w.id === parent_id)?.nama ?? "-";
  };

  const filtered = data.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kode_bps.toLowerCase().includes(search.toLowerCase());
    const matchTipe = filterTipe ? item.tipe === filterTipe : true;
    return matchSearch && matchTipe;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const handleDelete = (id: string, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus wilayah "${nama}"?`)) return;
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const columns: DataTableColumn<Wilayah>[] = [
    {
      key: "no",
      header: "No",
      headerClassName: "w-12",
      className: "text-xs text-gray-600 dark:text-gray-400",
      render: (_, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "tipe",
      header: "Tipe",
      render: (item) => (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400">
          {item.tipe}
        </span>
      ),
    },
    {
      key: "nama",
      header: "Nama Wilayah",
      className: "font-medium text-gray-800 dark:text-white/90",
    },
    {
      key: "kode_bps",
      header: "Kode BPS",
      className: "font-mono text-sm text-gray-600 dark:text-gray-400",
    },
    {
      key: "parent_id",
      header: "Parent",
      render: (item) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {getParentNama(item.parent_id)}
        </span>
      ),
    },
    {
      key: "latitude",
      header: "Lat / Lng",
      render: (item) =>
        item.latitude != null && item.longitude != null ? (
          <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
            {item.latitude}, {item.longitude}
          </span>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        ),
    },
  ];

  return (
    <>
      <PageMeta title="Master Wilayah" description="Kelola Master Data Wilayah" />
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Master Wilayah
          </h2>
          <Button size="sm" onClick={() => navigate("/wilayah/create")} className="gap-1.5">
            <PlusIcon /> Tambah
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[180px] max-w-xs">
            <Input
              type="text"
              placeholder="Cari nama atau kode BPS..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            value={filterTipe}
            onChange={(e) => { setFilterTipe(e.target.value as TipeWilayah | ""); setPage(1); }}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Semua Tipe</option>
            {TIPE_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => { setSearch(""); setFilterTipe(""); setPage(1); }}
          >
            <SearchIcon /> Reset
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={paginated}
          loading={false}
          pagination={{ pageNumber: page, pageSize, totalPages, totalCount: filtered.length }}
          onPageChange={setPage}
          rowKey={(item) => item.id}
          actions={(item) => (
            <>
              <button
                onClick={() => navigate(`/wilayah/edit/${item.id}`)}
                className="p-1.5 rounded-md text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                title="Edit"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => handleDelete(item.id, item.nama)}
                className="p-1.5 rounded-md text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                title="Hapus"
              >
                <TrashIcon />
              </button>
            </>
          )}
        />
      </div>
    </>
  );
}
