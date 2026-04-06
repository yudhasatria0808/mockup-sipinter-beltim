---
inclusion: manual
---

# UI/UX Patterns

Acuan UI/UX untuk semua halaman baru. Referensi implementasi: `src/pages/admin/users/` dan `src/pages/admin/roles/`.

---

## Struktur Halaman

Setiap fitur terdiri dari dua tipe halaman:

### 1. Halaman List
File: `src/pages/[fitur]/[Nama]List.tsx`

```
<PageMeta title="..." description="..." />
<div className="space-y-4">
  {/* Header */}
  {/* Search/Filter */}
  {/* DataTable */}
</div>
```

### 2. Halaman Form (Create/Edit)
File: `src/pages/[fitur]/[Nama]Form.tsx`

```
<PageMeta title="..." description="..." />
<form onSubmit={handleSubmit}>
  <div className="space-y-4">
    {/* Header dengan tombol Batal + Simpan */}
    {/* Card section berisi field-field */}
  </div>
</form>
```

---

## Komponen yang Digunakan

### Import standar untuk halaman List
```tsx
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, SearchIcon, EditIcon, TrashIcon } from "../../components/icons";
```

### Import standar untuk halaman Form
```tsx
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { CheckIcon as SaveIcon, CloseIcon } from "../../components/icons";
```

> Sesuaikan jumlah `../` dengan kedalaman folder file tersebut.

---

## Pola Header Halaman

### Header List — judul kiri, tombol tambah kanan
```tsx
<div className="flex items-center justify-between gap-3">
  <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
    Nama Fitur
  </h2>
  <Button size="sm" onClick={() => navigate("/path/create")} className="gap-1.5">
    <PlusIcon /> Tambah
  </Button>
</div>
```

### Header Form — judul kiri, tombol Batal+Simpan kanan
```tsx
<div className="flex items-center justify-between gap-3">
  <div>
    <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
      Tambah / Edit Nama
    </h2>
    <p className="text-xs text-gray-500 dark:text-gray-400">
      Deskripsi singkat
    </p>
  </div>
  <div className="flex gap-2">
    <Button type="button" variant="outline" size="sm" onClick={() => navigate("/path")} className="gap-1.5">
      <CloseIcon /> Batal
    </Button>
    <Button type="submit" size="sm" disabled={saving} className="gap-1.5">
      <SaveIcon /> {saving ? "Menyimpan..." : "Simpan"}
    </Button>
  </div>
</div>
```

---

## Pola Search

Search bar sederhana di bawah header, lebar maksimal `max-w-xs`:

```tsx
<form onSubmit={handleSearch} className="flex gap-2">
  <div className="flex-1 max-w-xs">
    <Input
      type="text"
      placeholder="Cari..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
  <Button type="submit" variant="outline" size="sm" className="gap-1.5">
    <SearchIcon /> Cari
  </Button>
</form>
```

---

## Pola DataTable

```tsx
<DataTable
  columns={columns}
  data={data}
  loading={loading}
  pagination={pagination}
  onPageChange={(page) => setPagination((p) => ({ ...p, pageNumber: page }))}
  rowKey={(item) => item.id}
  actions={(item) => (
    <>
      <button
        onClick={() => navigate(`/path/edit/${item.id}`)}
        className="p-1.5 rounded-md text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
        title="Edit"
      >
        <EditIcon />
      </button>
      <button
        onClick={() => handleDelete(item.id)}
        className="p-1.5 rounded-md text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
        title="Hapus"
      >
        <TrashIcon />
      </button>
    </>
  )}
/>
```

### Definisi kolom DataTable
```tsx
const columns: DataTableColumn<TData>[] = [
  // Kolom nomor urut
  {
    key: "no",
    header: "No",
    headerClassName: "w-12",
    className: "text-xs text-gray-600 dark:text-gray-400",
    render: (_, index) => (pagination.pageNumber - 1) * pagination.pageSize + index + 1,
  },
  // Kolom teks biasa
  {
    key: "name",
    header: "Nama",
    className: "font-medium text-gray-800 dark:text-white/90",
  },
  // Kolom dengan render custom
  {
    key: "field",
    header: "Label",
    render: (item) => item.field || "-",
  },
];
```

---

## Pola Badge / Status

### Status aktif/nonaktif
```tsx
// Aktif
<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400">
  Aktif
</span>

// Nonaktif
<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400">
  Nonaktif
</span>

// Warning / Protected
<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400">
  Protected
</span>
```

---

## Pola Card Section (Form)

Setiap kelompok field dibungkus dalam card:

```tsx
<div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
  <h3 className="mb-3 text-sm font-medium text-gray-800 dark:text-white/90">
    Judul Section
  </h3>
  <div className="grid gap-3 sm:grid-cols-2">
    <div>
      <Label htmlFor="field" className="text-xs">Label Field *</Label>
      <Input id="field" type="text" placeholder="..." value={val} onChange={...} />
    </div>
  </div>
</div>
```

---

## Pola Toggle Switch (Boolean Field)

```tsx
<div>
  <Label className="text-xs">Status</Label>
  <div className="mt-1.5 flex items-center gap-2">
    <label className="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" className="peer sr-only" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
      <div className="h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-brand-500 peer-checked:after:translate-x-4 dark:bg-gray-700"></div>
    </label>
    <span className="text-xs text-gray-600 dark:text-gray-400">
      {isActive ? "Aktif" : "Nonaktif"}
    </span>
  </div>
</div>
```

---

## Pola Select Native

Untuk dropdown pilihan, gunakan `<select>` native dengan class berikut:

```tsx
<select
  className="h-10 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
  value={value}
  onChange={(e) => setValue(e.target.value)}
>
  <option value="" disabled>Pilih opsi</option>
  {options.map((opt) => (
    <option key={opt.value} value={opt.value}>{opt.label}</option>
  ))}
</select>
```

---

## Pola State Management Halaman

### State standar halaman List
```tsx
const [data, setData] = useState<TData[]>([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [pagination, setPagination] = useState({
  pageNumber: 1,
  pageSize: 10,
  totalPages: 1,
  totalCount: 0,
});
```

### State standar halaman Form
```tsx
const { id } = useParams<{ id: string }>();
const isEdit = Boolean(id);
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);
// ... field states
```

### Loading state saat fetch form
```tsx
if (loading) {
  return (
    <div className="flex items-center justify-center py-16">
      <p className="text-sm text-gray-500">Memuat data...</p>
    </div>
  );
}
```

---

## Navigasi Antar Halaman

- Dari list ke form create: `navigate("/path/create")`
- Dari list ke form edit: `navigate(\`/path/edit/${item.id}\`)`
- Dari form kembali ke list: `navigate("/path")`
- Setelah save berhasil: `navigate("/path")`

---

## Ikon yang Tersedia

Import dari `../../components/icons`:

| Ikon | Kegunaan |
|------|----------|
| `PlusIcon` | Tombol tambah |
| `EditIcon` | Tombol edit di tabel |
| `TrashIcon` | Tombol hapus di tabel |
| `SearchIcon` | Tombol cari |
| `CheckIcon` (alias `SaveIcon`) | Tombol simpan form |
| `CloseIcon` | Tombol batal form |
| `ChevronDownIcon` | Accordion / expand |
| `RefreshIcon` | Tombol refresh |
| `EyeIcon` | Tombol lihat detail |
