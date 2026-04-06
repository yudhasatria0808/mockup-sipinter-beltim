import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { CheckIcon as SaveIcon, CloseIcon } from "../../components/icons";
import type { TipeWilayah } from "../../types/wilayah";
import { mockWilayah } from "./mockData";

const TIPE_OPTIONS: TipeWilayah[] = ["Provinsi", "Kabupaten", "Kota", "Kecamatan", "Kelurahan", "Desa"];

export default function WilayahForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [tipe, setTipe] = useState<TipeWilayah>("Provinsi");
  const [nama, setNama] = useState("");
  const [kodeBps, setKodeBps] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      const found = mockWilayah.find((w) => w.id === id);
      if (found) {
        setTipe(found.tipe);
        setNama(found.nama);
        setKodeBps(found.kode_bps);
        setParentId(found.parent_id ?? "");
        setLatitude(found.latitude != null ? String(found.latitude) : "");
        setLongitude(found.longitude != null ? String(found.longitude) : "");
      } else {
        alert("Data tidak ditemukan");
        navigate("/wilayah");
      }
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nama.trim()) errs.nama = "Nama wilayah wajib diisi";
    if (!kodeBps.trim()) errs.kode_bps = "Kode BPS wajib diisi";
    if (latitude && isNaN(Number(latitude))) errs.latitude = "Latitude harus berupa angka";
    if (longitude && isNaN(Number(longitude))) errs.longitude = "Longitude harus berupa angka";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const payload = {
      id: id ?? String(Date.now()),
      tipe,
      nama,
      kode_bps: kodeBps,
      parent_id: parentId || null,
      latitude: latitude !== "" ? Number(latitude) : null,
      longitude: longitude !== "" ? Number(longitude) : null,
    };

    if (isEdit && id) {
      const idx = mockWilayah.findIndex((w) => w.id === id);
      if (idx !== -1) mockWilayah[idx] = payload;
    } else {
      mockWilayah.push(payload);
    }

    navigate("/wilayah");
  };

  const clearError = (field: string) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  // Parent options: exclude self and descendants (simple: just exclude self)
  const parentOptions = mockWilayah.filter((w) => w.id !== id);

  return (
    <>
      <PageMeta
        title={isEdit ? "Edit Wilayah" : "Tambah Wilayah"}
        description="Form Master Data Wilayah"
      />
      <div className="max-w-xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            {isEdit ? "Edit Wilayah" : "Tambah Wilayah"}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Tipe */}
            <div className="space-y-1.5">
              <Label htmlFor="tipe">Tipe <span className="text-error-500">*</span></Label>
              <select
                id="tipe"
                value={tipe}
                onChange={(e) => setTipe(e.target.value as TipeWilayah)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {TIPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Nama */}
            <div className="space-y-1.5">
              <Label htmlFor="nama">Nama Wilayah <span className="text-error-500">*</span></Label>
              <Input
                id="nama"
                type="text"
                placeholder="Masukkan nama wilayah"
                value={nama}
                onChange={(e) => { setNama(e.target.value); clearError("nama"); }}
              />
              {errors.nama && <p className="text-xs text-error-500">{errors.nama}</p>}
            </div>

            {/* Kode BPS */}
            <div className="space-y-1.5">
              <Label htmlFor="kode_bps">Kode Wilayah (BPS) <span className="text-error-500">*</span></Label>
              <Input
                id="kode_bps"
                type="text"
                placeholder="Contoh: 32, 3204, 3273040001"
                value={kodeBps}
                onChange={(e) => { setKodeBps(e.target.value); clearError("kode_bps"); }}
              />
              {errors.kode_bps && <p className="text-xs text-error-500">{errors.kode_bps}</p>}
            </div>

            {/* Parent */}
            <div className="space-y-1.5">
              <Label htmlFor="parent_id">Parent Wilayah</Label>
              <select
                id="parent_id"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">— Tidak ada (root) —</option>
                {parentOptions.map((w) => (
                  <option key={w.id} value={w.id}>
                    [{w.tipe}] {w.nama} ({w.kode_bps})
                  </option>
                ))}
              </select>
            </div>

            {/* Lat / Lng */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="latitude">Latitude <span className="text-gray-400 text-xs">(opsional)</span></Label>
                <Input
                  id="latitude"
                  type="text"
                  placeholder="-6.9039"
                  value={latitude}
                  onChange={(e) => { setLatitude(e.target.value); clearError("latitude"); }}
                />
                {errors.latitude && <p className="text-xs text-error-500">{errors.latitude}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="longitude">Longitude <span className="text-gray-400 text-xs">(opsional)</span></Label>
                <Input
                  id="longitude"
                  type="text"
                  placeholder="107.6186"
                  value={longitude}
                  onChange={(e) => { setLongitude(e.target.value); clearError("longitude"); }}
                />
                {errors.longitude && <p className="text-xs text-error-500">{errors.longitude}</p>}
              </div>
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
                onClick={() => navigate("/wilayah")}
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
