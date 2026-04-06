import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, SearchIcon, EditIcon, TrashIcon } from "../../components/icons";
import roleService from "../../services/roleService";
import type { Role } from "../../types/role";

export default function RoleList() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
  });

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await roleService.getPaginated({
        generalSearch: search,
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
      });
      setRoles(response.data ?? []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages,
        totalCount: response.totalCount,
      }));
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setLoading(false);
    }
  }, [search, pagination.pageNumber, pagination.pageSize]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus role "${name}"?`)) return;
    try {
      await roleService.delete(id);
      fetchRoles();
    } catch (error) {
      console.error("Failed to delete role:", error);
      alert("Gagal menghapus role");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  };

  const columns: DataTableColumn<Role>[] = [
    {
      key: "no",
      header: "No",
      headerClassName: "w-12",
      className: "text-xs text-gray-600 dark:text-gray-400",
      render: (_, index) => (pagination.pageNumber - 1) * pagination.pageSize + index + 1,
    },
    {
      key: "name",
      header: "Nama Role",
      className: "font-medium text-gray-800 dark:text-white/90",
    },
    {
      key: "description",
      header: "Deskripsi",
      render: (item) => item.description || "-",
    },
    {
      key: "status",
      header: "Status",
      headerClassName: "w-24",
      render: (item) =>
        item.isProtected ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400">
            Protected
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400">
            Normal
          </span>
        ),
    },
  ];

  return (
    <>
      <PageMeta title="Admin | Role Management" description="Kelola Role" />
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Role Management
          </h2>
          <Button size="sm" onClick={() => navigate("/roles/create")} className="gap-1.5">
            <PlusIcon /> Tambah
          </Button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 max-w-xs">
            <Input
              type="text"
              placeholder="Cari role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline" size="sm" className="gap-1.5">
            <SearchIcon /> Cari
          </Button>
        </form>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={roles}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setPagination((p) => ({ ...p, pageNumber: page }))}
          rowKey={(item) => item.id}
          actions={(item) => (
            <>
              <button
                onClick={() => navigate(`/admin/roles/edit/${item.id}`)}
                className="p-1.5 rounded-md text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                title="Edit"
              >
                <EditIcon />
              </button>
              {!item.isProtected && (
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="p-1.5 rounded-md text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                  title="Hapus"
                >
                  <TrashIcon />
                </button>
              )}
            </>
          )}
        />
      </div>
    </>
  );
}
