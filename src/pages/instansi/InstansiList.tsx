import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, SearchIcon, EditIcon, TrashIcon } from "../../components/icons";
import type { Instansi } from "../../types/instansi";
import { mockInstansi } from "./mockData";

export default function InstansiList() {
  const navigate = useNavigate();
  const [data, setData] = useState<Instansi[]>(mockInstansi);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = data.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const handleDelete = (id: string, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus instansi "${nama}"?`)) return;
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const columns: DataTableColumn<Instansi>[] = [
    {
      key: "no",
      header: "No",
      headerClassName: "w-12",
      className: "text-xs text-gray-600 dark:text-gray-400",
      render: (_, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "nama",
      header: "Nama Instansi",
      className: "font-medium text-gray-800 dark:text-white/90",
    },
    {
      key: "deskripsi",
      header: "Deskripsi",
      render: (item) => (
        <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {item.deskripsi || "-"}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageMeta title="Master Data Instansi" description="Kelola Master Data Instansi" />
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Master Data Instansi
          </h2>
          <Button size="sm" onClick={() => navigate("/instansi/create")} className="gap-1.5">
            <PlusIcon /> Tambah
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[180px] max-w-xs">
            <Input
              type="text"
              placeholder="Cari nama atau deskripsi..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
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
                onClick={() => navigate(`/instansi/edit/${item.id}`)}
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
