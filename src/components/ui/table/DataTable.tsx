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
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-800/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${col.headerClassName || ""}`}
                >
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 w-24">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td
                  colSpan={totalColumns}
                  className="px-4 py-12 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                    <span className="text-sm text-gray-500">{loadingText}</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={totalColumns}
                  className="px-4 py-12 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className="h-10 w-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span className="text-sm text-gray-400 dark:text-gray-500">{emptyText}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={rowKey ? rowKey(item, index) : index}
                  className="transition-colors hover:bg-brand-50/30 dark:hover:bg-brand-500/5"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-sm text-gray-700 dark:text-gray-300 ${col.className || ""}`}
                    >
                      {col.render ? col.render(item, index) : String((item as Record<string, unknown>)[col.key] ?? "-")}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3">
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
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-gray-800">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Menampilkan <span className="font-medium text-gray-700 dark:text-gray-300">{data.length}</span> dari{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">{pagination.totalCount}</span> data
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={pagination.pageNumber <= 1}
              onClick={() => onPageChange?.(pagination.pageNumber - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:border-gray-600"
            >
              <ChevronLeftIcon />
            </button>
            <span className="flex h-8 min-w-[4rem] items-center justify-center rounded-lg bg-brand-50 px-3 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
              {pagination.pageNumber} / {pagination.totalPages || 1}
            </span>
            <button
              disabled={pagination.pageNumber >= pagination.totalPages}
              onClick={() => onPageChange?.(pagination.pageNumber + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:border-gray-600"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
