import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { CheckIcon as SaveIcon, CloseIcon } from "../../components/icons";
import type { Aspek } from "../../types/aspek";
import { mockAspek } from "./mockData";

export default function AspekForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      const found = mockAspek.find((a) => a.id === id);
      if (found) {
        setNama(found.nama);
        setDeskripsi(found.deskripsi);
      } else {
        alert("Data tidak ditemukan");
        navigate("/aspek");
      }
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nama.trim()) errs.nama = "Nama aspek wajib diisi";
    if (!deskripsi.trim()) errs.deskripsi = "Deskripsi wajib diisi";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (isEdit && id) {
      const idx = mockAspek.findIndex((a) => a.id === id);
      if (idx !== -1) {
        mockAspek[idx] = { id, nama, deskripsi } as Aspek;
      }
    } else {
      mockAspek.push({ id: String(Date.now()), nama, deskripsi });
    }

    navigate("/aspek");
  };

  return (
    <>
      <PageMeta
        title={isEdit ? "Edit Aspek" : "Tambah Aspek"}
        description="Form Master Data Aspek"
      />
      <div className="max-w-xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            {isEdit ? "Edit Aspek" : "Tambah Aspek"}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama */}
            <div className="space-y-1.5">
              <Label htmlFor="nama">
                Nama Aspek <span className="text-error-500">*</span>
              </Label>
              <Input
                id="nama"
                type="text"
                placeholder="Masukkan nama aspek"
                value={nama}
                onChange={(e) => {
                  setNama(e.target.value);
                  setErrors((prev) => ({ ...prev, nama: "" }));
                }}
              />
              {errors.nama && <p className="text-xs text-error-500">{errors.nama}</p>}
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <Label htmlFor="deskripsi">
                Deskripsi <span className="text-error-500">*</span>
              </Label>
              <textarea
                id="deskripsi"
                rows={4}
                placeholder="Masukkan deskripsi aspek"
                value={deskripsi}
                onChange={(e) => {
                  setDeskripsi(e.target.value);
                  setErrors((prev) => ({ ...prev, deskripsi: "" }));
                }}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
              {errors.deskripsi && <p className="text-xs text-error-500">{errors.deskripsi}</p>}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button type="submit" size="sm" className="gap-1.5">
                <SaveIcon /> Simpan
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => navigate("/aspek")}
              >
                <CloseIcon /> Batal
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
