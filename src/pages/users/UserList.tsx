import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, SearchIcon, EditIcon, TrashIcon } from "../../components/icons";
import userService from "../../services/userService";
import type { User } from "../../types/user";
import type { PaginatedResponse } from "../../types";

// KeyIcon - specific to user management
const KeyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response: PaginatedResponse<User> = await userService.getPaginated({
        generalSearch: search,
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
      });
      setUsers(response.data ?? []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages,
        totalCount: response.totalCount,
      }));
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, [search, pagination.pageNumber, pagination.pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus user "${name}"?`)) return;
    try {
      await userService.delete(id);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Gagal menghapus user");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await userService.toggleStatus(id);
      fetchUsers();
    } catch (error) {
      console.error("Failed to toggle status:", error);
      alert("Gagal mengubah status user");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  };

  const columns: DataTableColumn<User>[] = [
    {
      key: "no",
      header: "No",
      headerClassName: "w-12",
      className: "text-xs text-gray-600 dark:text-gray-400",
      render: (_, index) => (pagination.pageNumber - 1) * pagination.pageSize + index + 1,
    },
    {
      key: "username",
      header: "Username",
      className: "font-medium text-gray-800 dark:text-white/90",
    },
    {
      key: "fullName",
      header: "Nama Lengkap",
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "roleName",
      header: "Role",
    },
    {
      key: "status",
      header: "Status",
      headerClassName: "w-20",
      render: (item) => (
        <button
          onClick={() => handleToggleStatus(item.id)}
          className="focus:outline-none"
          title={item.isActive ? "Klik untuk nonaktifkan" : "Klik untuk aktifkan"}
        >
          {item.isActive ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400 cursor-pointer hover:opacity-80">
              Aktif
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400 cursor-pointer hover:opacity-80">
              Nonaktif
            </span>
          )}
        </button>
      ),
    },
  ];

  return (
    <>
      <PageMeta title="Admin | User Management" description="Kelola User" />
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            User Management
          </h2>
          <Button size="sm" onClick={() => navigate("/users/create")} className="gap-1.5">
            <PlusIcon /> Tambah
          </Button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 max-w-xs">
            <Input
              type="text"
              placeholder="Cari user..."
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
          data={users}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setPagination((p) => ({ ...p, pageNumber: page }))}
          rowKey={(item) => item.id}
          actions={(item) => (
            <>
              <button
                onClick={() => navigate(`/admin/users/edit/${item.id}`)}
                className="p-1.5 rounded-md text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                title="Edit"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => navigate(`/admin/users/reset-password/${item.id}`)}
                className="p-1.5 rounded-md text-warning-500 hover:bg-warning-50 dark:hover:bg-warning-900/20 transition-colors"
                title="Reset Password"
              >
                <KeyIcon />
              </button>
              <button
                onClick={() => handleDelete(item.id, item.fullName)}
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
