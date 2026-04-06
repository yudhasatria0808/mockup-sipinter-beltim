import { ReactNode } from "react";

// Icons
const ChevronLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// Column definition
export interface DataTableColumn<T> {
  key: string;
  header: string;
  className?: string;
  headerClassName?: string;
  render?: (item: T, index: number) => ReactNode;
}

// Pagination state
export interface PaginationState {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

// Props
interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  loadingText?: string;
  pagination?: PaginationState;
  onPageChange?: (page: number) => void;
  actions?: (item: T, index: number) => ReactNode;
  rowKey?: (item: T, index: number) => string | number;
}

export default function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyText = "Tidak ada data",
  loadingText = "Memuat data...",
  pagination,
  onPageChange,
  actions,
  rowKey,
}: DataTableProps<T>) {
  const totalColumns = columns.length + (actions ? 1 : 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 ${col.headerClassName || ""}`}
                >
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500 dark:text-gray-400 w-24">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={totalColumns}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  {loadingText}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={totalColumns}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={rowKey ? rowKey(item, index) : index}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 ${col.className || ""}`}
                    >
                      {col.render ? col.render(item, index) : String((item as Record<string, unknown>)[col.key] ?? "-")}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        {actions(item, index)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {data.length} dari {pagination.totalCount} data
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={pagination.pageNumber <= 1}
              onClick={() => onPageChange?.(pagination.pageNumber - 1)}
              className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
            >
              <ChevronLeftIcon />
            </button>
            <span className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400">
              {pagination.pageNumber} / {pagination.totalPages || 1}
            </span>
            <button
              disabled={pagination.pageNumber >= pagination.totalPages}
              onClick={() => onPageChange?.(pagination.pageNumber + 1)}
              className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
