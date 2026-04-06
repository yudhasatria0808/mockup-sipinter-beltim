import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { CheckIcon as SaveIcon, CloseIcon } from "../../components/icons";
import { mockInstansi } from "./mockData";

export default function InstansiForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      const found = mockInstansi.find((a) => a.id === id);
      if (found) {
        setNama(found.nama);
        setDeskripsi(found.deskripsi);
      } else {
        alert("Data tidak ditemukan");
        navigate("/instansi");
      }
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nama.trim()) errs.nama = "Nama instansi wajib diisi";
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
      const idx = mockInstansi.findIndex((a) => a.id === id);
      if (idx !== -1) mockInstansi[idx] = { id, nama, deskripsi };
    } else {
      mockInstansi.push({ id: String(Date.now()), nama, deskripsi });
    }

    navigate("/instansi");
  };

  return (
    <>
      <PageMeta
        title={isEdit ? "Edit Instansi" : "Tambah Instansi"}
        description="Form Master Data Instansi"
      />
      <div className="max-w-xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            {isEdit ? "Edit Instansi" : "Tambah Instansi"}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="nama">
                Nama Instansi <span className="text-error-500">*</span>
              </Label>
              <Input
                id="nama"
                type="text"
                placeholder="Masukkan nama instansi"
                value={nama}
                onChange={(e) => {
                  setNama(e.target.value);
                  setErrors((prev) => ({ ...prev, nama: "" }));
                }}
              />
              {errors.nama && <p className="text-xs text-error-500">{errors.nama}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="deskripsi">
                Deskripsi <span className="text-error-500">*</span>
              </Label>
              <textarea
                id="deskripsi"
                rows={4}
                placeholder="Masukkan deskripsi instansi"
                value={deskripsi}
                onChange={(e) => {
                  setDeskripsi(e.target.value);
                  setErrors((prev) => ({ ...prev, deskripsi: "" }));
                }}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
              {errors.deskripsi && <p className="text-xs text-error-500">{errors.deskripsi}</p>}
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" size="sm" className="gap-1.5">
                <SaveIcon /> Simpan
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => navigate("/instansi")}
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
