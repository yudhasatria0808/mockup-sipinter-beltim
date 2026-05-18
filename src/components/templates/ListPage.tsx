import { useState, useMemo, ReactNode } from "react";
import PageMeta from "../common/PageMeta";
import PageHeader from "../common/PageHeader";
import SearchBar from "../common/SearchBar";
import Button from "../ui/button/Button";
import { DataTable, type DataTableColumn } from "../ui/table";
import { PlusIcon } from "../icons";

interface ListPageProps<T> {
  /** Page title shown in header and meta */
  title: string;
  /** Meta description for SEO */
  metaDescription?: string;
  /** Table column definitions */
  columns: DataTableColumn<T>[];
  /** Full data array (filtering/pagination handled internally) */
  data: T[];
  /** Loading state */
  loading?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Filter function — receives item and search string, return true to include */
  filterFn: (item: T, search: string) => boolean;
  /** Unique key extractor for table rows */
  rowKey: (item: T) => string | number;
  /** Items per page (default: 10) */
  pageSize?: number;
  /** Render action buttons per row */
  actions?: (item: T, index: number) => ReactNode;
  /** Add button click handler — if provided, shows "Tambah" button */
  onAdd?: () => void;
  /** Add button label (default: "Tambah") */
  addLabel?: string;
  /** Extra header actions (rendered alongside Add button) */
  headerActions?: ReactNode;
  /** Extra content between search and table */
  extraContent?: ReactNode;
  /** Empty state text */
  emptyText?: string;
}

/**
 * Reusable list page template.
 * Handles: page meta, header with add button, search bar, filtered/paginated DataTable.
 *
 * Eliminates ~100 lines of boilerplate per list page.
 */
export default function ListPage<T>({
  title,
  metaDescription,
  columns,
  data,
  loading = false,
  searchPlaceholder = "Cari...",
  filterFn,
  rowKey,
  pageSize = 10,
  actions,
  onAdd,
  addLabel = "Tambah",
  headerActions,
  extraContent,
  emptyText,
}: ListPageProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (search ? data.filter((item) => filterFn(item, search)) : data),
    [data, search, filterFn]
  );

  const paginated = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <>
      <PageMeta title={title} description={metaDescription || title} />
      <div className="space-y-4">
        <PageHeader
          title={title}
          actions={
            <>
              {headerActions}
              {onAdd && (
                <Button size="sm" onClick={onAdd} className="gap-1.5">
                  <PlusIcon /> {addLabel}
                </Button>
              )}
            </>
          }
        />

        <SearchBar
          value={search}
          onChange={handleSearchChange}
          placeholder={searchPlaceholder}
        />

        {extraContent}

        <DataTable
          columns={columns}
          data={paginated}
          loading={loading}
          emptyText={emptyText}
          pagination={{
            pageNumber: page,
            pageSize,
            totalPages,
            totalCount: filtered.length,
          }}
          onPageChange={setPage}
          rowKey={rowKey}
          actions={actions}
        />
      </div>
    </>
  );
}
