import { useState, useEffect, useCallback } from "react";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { SearchIcon, EyeIcon, RefreshIcon } from "../../components/icons";
import auditTrailService from "../../services/auditTrailService";
import type { AuditTrail, AuditTrailQuery } from "../../types/auditTrail";

const actionOptions = [
  { value: "", label: "Semua Action" },
  { value: "Created", label: "Created" },
  { value: "Updated", label: "Updated" },
  { value: "Deleted", label: "Deleted" },
];

export default function AuditTrailList() {
  const [data, setData] = useState<AuditTrail[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableNames, setTableNames] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<AuditTrail | null>(null);
  
  const [filters, setFilters] = useState<AuditTrailQuery>({
    tableName: "",
    action: "",
    fromDate: "",
    toDate: "",
    page: 1,
    pageSize: 15,
  });

  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 15,
    totalPages: 1,
    totalCount: 0,
  });

  const fetchTableNames = useCallback(async () => {
    try {
      const tables = await auditTrailService.getTableNames();
      setTableNames(tables);
    } catch (error) {
      console.error("Failed to fetch table names:", error);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await auditTrailService.getList({
        ...filters,
        page: pagination.pageNumber,
        pageSize: pagination.pageSize,
      });
      setData(result.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
      }));
    } catch (error) {
      console.error("Failed to fetch audit trails:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.pageNumber, pagination.pageSize]);

  useEffect(() => {
    fetchTableNames();
  }, [fetchTableNames]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  };

  const handleReset = () => {
    setFilters({
      tableName: "",
      action: "",
      fromDate: "",
      toDate: "",
      page: 1,
      pageSize: 15,
    });
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionBadge = (action: string) => {
    const styles: Record<string, string> = {
      Created: "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400",
      Updated: "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400",
      Deleted: "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400",
      HardDeleted: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[action] || styles.Updated}`}>
        {action}
      </span>
    );
  };

  const tableNameOptions = [
    { value: "", label: "Semua Table" },
    ...tableNames.map((t) => ({ value: t, label: t })),
  ];

  const columns: DataTableColumn<AuditTrail>[] = [
    {
      key: "no",
      header: "No",
      headerClassName: "w-12",
      className: "text-xs text-gray-600 dark:text-gray-400",
      render: (_, index) => (pagination.pageNumber - 1) * pagination.pageSize + index + 1,
    },
    {
      key: "timestamp",
      header: "Waktu",
      headerClassName: "w-40",
      render: (item) => <span className="text-xs">{formatDate(item.timestamp)}</span>,
    },
    {
      key: "tableName",
      header: "Table",
      className: "font-medium text-gray-800 dark:text-white/90",
    },
    {
      key: "action",
      header: "Action",
      headerClassName: "w-24",
      render: (item) => getActionBadge(item.action),
    },
    {
      key: "userName",
      header: "User",
    },
    {
      key: "changedColumns",
      header: "Kolom Berubah",
      render: (item) => (
        <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px] block">
          {item.changedColumns || "-"}
        </span>
      ),
    },
    {
      key: "ipAddress",
      header: "IP Address",
      headerClassName: "w-28",
      render: (item) => <span className="text-xs">{item.ipAddress || "-"}</span>,
    },
  ];

  return (
    <>
      <PageMeta title="Admin | Audit Trail" description="Lihat Audit Trail" />
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Audit Trail
          </h2>
          <Button size="sm" variant="outline" onClick={fetchData} className="gap-1.5">
            <RefreshIcon /> Refresh
          </Button>
        </div>

        {/* Filters */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <Select
            options={tableNameOptions}
            value={filters.tableName}
            onChange={(val) => setFilters((f) => ({ ...f, tableName: val }))}
            placeholder="Pilih Table"
          />
          <Select
            options={actionOptions}
            value={filters.action}
            onChange={(val) => setFilters((f) => ({ ...f, action: val }))}
            placeholder="Pilih Action"
          />
          <Input
            type="date"
            value={filters.fromDate}
            onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
            placeholder="Dari Tanggal"
          />
          <Input
            type="date"
            value={filters.toDate}
            onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
            placeholder="Sampai Tanggal"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="gap-1.5 flex-1">
              <SearchIcon /> Cari
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setPagination((p) => ({ ...p, pageNumber: page }))}
          rowKey={(item) => item.id}
          actions={(item) => (
            <button
              onClick={() => setSelectedItem(item)}
              className="p-1.5 rounded-md text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
              title="Lihat Detail"
            >
              <EyeIcon />
            </button>
          )}
        />
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <AuditDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </>
  );
}

// Detail Modal Component
function AuditDetailModal({ item, onClose }: { item: AuditTrail; onClose: () => void }) {
  const formatJson = (obj: Record<string, unknown> | null) => {
    if (!obj) return "-";
    return JSON.stringify(obj, null, 2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Detail Audit Trail
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)] space-y-4">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Table:</span>
              <p className="font-medium text-gray-800 dark:text-white">{item.tableName}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Record ID:</span>
              <p className="font-mono text-xs text-gray-800 dark:text-white break-all">{item.recordId}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Action:</span>
              <p className="font-medium text-gray-800 dark:text-white">{item.action}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">User:</span>
              <p className="font-medium text-gray-800 dark:text-white">{item.userName}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Waktu:</span>
              <p className="font-medium text-gray-800 dark:text-white">
                {new Date(item.timestamp).toLocaleString("id-ID")}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">IP Address:</span>
              <p className="font-medium text-gray-800 dark:text-white">{item.ipAddress || "-"}</p>
            </div>
          </div>

          {/* Changed Columns */}
          {item.changedColumns && (
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Kolom yang Berubah:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {item.changedColumns.split(",").map((col) => (
                  <span
                    key={col}
                    className="px-2 py-0.5 text-xs rounded bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Old Values */}
          {item.oldValues && (
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Data Sebelum:</span>
              <pre className="mt-1 p-3 text-xs bg-gray-100 dark:bg-gray-900 rounded-lg overflow-x-auto text-gray-800 dark:text-gray-200">
                {formatJson(item.oldValues)}
              </pre>
            </div>
          )}

          {/* New Values */}
          {item.newValues && (
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Data Sesudah:</span>
              <pre className="mt-1 p-3 text-xs bg-gray-100 dark:bg-gray-900 rounded-lg overflow-x-auto text-gray-800 dark:text-gray-200">
                {formatJson(item.newValues)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
