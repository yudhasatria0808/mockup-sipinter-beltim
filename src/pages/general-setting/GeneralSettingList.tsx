import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { DataTable, type DataTableColumn } from "../../components/ui/table";
import { PlusIcon, SearchIcon, EditIcon, TrashIcon, CloseIcon, CheckIcon } from "../../components/icons";
import type { GeneralSetting } from "../../types/generalSetting";
import { mockGeneralSettings } from "./mockData";

type ModalMode = "add" | "edit" | null;

const emptyForm = { key: "", value: "", deskripsi: "" };

export default function GeneralSettingList() {
  const [data, setData] = useState<GeneralSetting[]>(mockGeneralSettings);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editTarget, setEditTarget] = useState<GeneralSetting | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = data.filter(
    (item) =>
      item.key.toLowerCase().includes(search.toLowerCase()) ||
      item.value.toLowerCase().includes(search.toLowerCase()) ||
      (item.deskripsi ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const openAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setEditTarget(null);
    setModalMode("add");
  };

  const openEdit = (item: GeneralSetting) => {
    setForm({ key: item.key, value: item.value, deskripsi: item.deskripsi ?? "" });
    setErrors({});
    setEditTarget(item);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditTarget(null);
    setForm(emptyForm);
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.key.trim()) errs.key = "Key wajib diisi";
    if (!form.value.trim()) errs.value = "Value wajib diisi";
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    if (modalMode === "edit" && editTarget) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editTarget.id
            ? { ...item, key: form.key, value: form.value, deskripsi: form.deskripsi }
            : item
        )
      );
    } else {
      setData((prev) => [
        ...prev,
        { id: String(Date.now()), key: form.key, value: form.value, deskripsi: form.deskripsi },
      ]);
    }
    closeModal();
  };

  const handleDelete = (item: GeneralSetting) => {
    if (!confirm(`Hapus setting "${item.key}"?`)) return;
    setData((prev) => prev.filter((s) => s.id !== item.id));
  };

  const setField = (field: keyof typeof emptyForm, val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const columns: DataTableColumn<GeneralSetting>[] = [
    {
      key: "no",
      header: "No",
      headerClassName: "w-12",
      className: "text-xs text-gray-600 dark:text-gray-400",
      render: (_, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "key",
      header: "Key",
      className: "font-mono font-medium text-gray-800 dark:text-white/90",
    },
    {
      key: "value",
      header: "Value",
      className: "font-mono text-sm text-brand-600 dark:text-brand-400",
    },
    {
      key: "deskripsi",
      header: "Deskripsi",
      render: (item) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">{item.deskripsi || "-"}</span>
      ),
    },
  ];

  return (
    <>
      <PageMeta title="General Setting" description="Kelola konfigurasi umum aplikasi" />
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            General Setting
          </h2>
          <Button size="sm" onClick={openAdd} className="gap-1.5">
            <PlusIcon /> Tambah
          </Button>
        </div>

        {/* Search */}
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[180px] max-w-xs">
            <Input
              type="text"
              placeholder="Cari key, value, atau deskripsi..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => { setSearch(""); setPage(1); }}
          >
            <SearchIcon /> Reset
          </Button>
        </div>

        {/* Table */}
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
                onClick={() => openEdit(item)}
                className="p-1.5 rounded-md text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                title="Edit"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="p-1.5 rounded-md text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                title="Hapus"
              >
                <TrashIcon />
              </button>
            </>
          )}
        />
      </div>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                {modalMode === "edit" ? "Edit Setting" : "Tambah Setting"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <CloseIcon />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="key">Key <span className="text-error-500">*</span></Label>
                <Input
                  id="key"
                  type="text"
                  placeholder="Contoh: APP_NAME"
                  value={form.key}
                  onChange={(e) => setField("key", e.target.value)}
                />
                {errors.key && <p className="text-xs text-error-500">{errors.key}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="value">Value <span className="text-error-500">*</span></Label>
                <Input
                  id="value"
                  type="text"
                  placeholder="Masukkan value"
                  value={form.value}
                  onChange={(e) => setField("value", e.target.value)}
                />
                {errors.value && <p className="text-xs text-error-500">{errors.value}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <textarea
                  id="deskripsi"
                  rows={3}
                  placeholder="Keterangan singkat (opsional)"
                  value={form.deskripsi}
                  onChange={(e) => setField("deskripsi", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button size="sm" className="gap-1.5" onClick={handleSave}>
                <CheckIcon /> Simpan
              </Button>
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={closeModal}>
                <CloseIcon /> Batal
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
