import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, SearchIcon, EditIcon, TrashIcon } from "../../components/icons";
import type { LevelKemungkinan } from "../../types/risiko-matriks";
import { mockLevelKemungkinan } from "./mockData";

export default function LevelKemungkinanList() {
  const navigate = useNavigate();
  const [data, setData] = useState<LevelKemungkinan[]>(mockLevelKemungkinan);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = data.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const handleDelete = (id: string, nama: string) => {
    if (!confirm(`Hapus level kemungkinan "${nama}"?`)) return;
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const columns: DataTableColumn<LevelKemungkinan>[] = [
    {
      key: "no",
      header: "No",
      headerClassName: "w-12",
      render: (_, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "skor",
      header: "Skor",
      headerClassName: "w-20",
      render: (item) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-bold text-sm">
          {item.skor}
        </span>
      ),
    },
    {
      key: "nama",
      header: "Nama",
      className: "font-medium text-gray-800 dark:text-white/90",
    },
    {
      key: "deskripsi",
      header: "Deskripsi",
      render: (item) => (
        <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.deskripsi || "-"}</span>
      ),
    },
  ];

  return (
    <>
      <PageMeta title="Master Level Kemungkinan" description="Kelola Master Level Kemungkinan Risiko" />
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Master Level Kemungkinan</h2>
          <Button size="sm" onClick={() => navigate("/risiko/kemungkinan/create")} className="gap-1.5">
            <PlusIcon /> Tambah
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[180px] max-w-xs">
            <Input type="text" placeholder="Cari nama atau deskripsi..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Button type="button" variant="outline" size="sm" className="gap-1.5"
            onClick={() => { setSearch(""); setPage(1); }}>
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
              <button onClick={() => navigate(`/risiko/kemungkinan/edit/${item.id}`)}
                className="p-1.5 rounded-md text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors" title="Edit">
                <EditIcon />
              </button>
              <button onClick={() => handleDelete(item.id, item.nama)}
                className="p-1.5 rounded-md text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors" title="Hapus">
                <TrashIcon />
              </button>
            </>
          )}
        />
      </div>
    </>
  );
}
