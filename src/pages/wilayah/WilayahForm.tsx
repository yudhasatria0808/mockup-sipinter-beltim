import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { FormPage } from "../../components/templates";
import FormField from "../../components/form/FormField";
import Input from "../../components/form/input/InputField";
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

  const parentOptions = mockWilayah.filter((w) => w.id !== id);

  const selectClass = "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500";

  return (
    <FormPage
      title="Wilayah"
      isEdit={isEdit}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/wilayah")}
    >
      <FormField label="Tipe" htmlFor="tipe" required>
        <select id="tipe" value={tipe} onChange={(e) => setTipe(e.target.value as TipeWilayah)} className={selectClass}>
          {TIPE_OPTIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Nama Wilayah" htmlFor="nama" required error={errors.nama}>
        <Input
          id="nama"
          type="text"
          placeholder="Masukkan nama wilayah"
          value={nama}
          onChange={(e) => { setNama(e.target.value); clearError("nama"); }}
        />
      </FormField>

      <FormField label="Kode Wilayah (BPS)" htmlFor="kode_bps" required error={errors.kode_bps}>
        <Input
          id="kode_bps"
          type="text"
          placeholder="Contoh: 32, 3204, 3273040001"
          value={kodeBps}
          onChange={(e) => { setKodeBps(e.target.value); clearError("kode_bps"); }}
        />
      </FormField>

      <FormField label="Parent Wilayah" htmlFor="parent_id">
        <select id="parent_id" value={parentId} onChange={(e) => setParentId(e.target.value)} className={selectClass}>
          <option value="">— Tidak ada (root) —</option>
          {parentOptions.map((w) => (
            <option key={w.id} value={w.id}>
              [{w.tipe}] {w.nama} ({w.kode_bps})
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Latitude" htmlFor="latitude" error={errors.latitude}>
          <Input
            id="latitude"
            type="text"
            placeholder="-6.9039"
            value={latitude}
            onChange={(e) => { setLatitude(e.target.value); clearError("latitude"); }}
          />
        </FormField>
        <FormField label="Longitude" htmlFor="longitude" error={errors.longitude}>
          <Input
            id="longitude"
            type="text"
            placeholder="107.6186"
            value={longitude}
            onChange={(e) => { setLongitude(e.target.value); clearError("longitude"); }}
          />
        </FormField>
      </div>
    </FormPage>
  );
}
