import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { FormPage } from "../../components/templates";
import FormField from "../../components/form/FormField";
import Input from "../../components/form/input/InputField";
import type { TipeWilayah } from "../../types/wilayah";
import { wilayahService, type WilayahDto } from "../../services/masterDataService";

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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [parentOptions, setParentOptions] = useState<WilayahDto[]>([]);

  useEffect(() => {
    wilayahService.getAll().then(setParentOptions).catch(() => {});
    if (isEdit && id) {
      setLoading(true);
      wilayahService.getById(id)
        .then((data) => {
          setTipe(data.tipe as TipeWilayah);
          setNama(data.nama);
          setKodeBps(data.kodeBps);
          setParentId(data.parentId || "");
          setLatitude(data.latitude != null ? String(data.latitude) : "");
          setLongitude(data.longitude != null ? String(data.longitude) : "");
        })
        .catch(() => { alert("Data tidak ditemukan"); navigate("/wilayah"); })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nama.trim()) errs.nama = "Nama wilayah wajib diisi";
    if (!kodeBps.trim()) errs.kodeBps = "Kode BPS wajib diisi";
    if (latitude && isNaN(Number(latitude))) errs.latitude = "Latitude harus angka";
    if (longitude && isNaN(Number(longitude))) errs.longitude = "Longitude harus angka";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = {
        tipe, nama: nama.trim(), kodeBps: kodeBps.trim(),
        parentId: parentId || null,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
      };
      if (isEdit && id) await wilayahService.update(id, payload);
      else await wilayahService.create(payload);
      navigate("/wilayah");
    } catch { alert("Gagal menyimpan data"); }
    finally { setSaving(false); }
  };

  const clearError = (f: string) => setErrors((p) => ({ ...p, [f]: "" }));
  const selectClass = "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500";

  return (
    <FormPage title="Wilayah" isEdit={isEdit} onSubmit={handleSubmit} onCancel={() => navigate("/wilayah")} saving={saving} loading={loading}>
      <FormField label="Tipe" htmlFor="tipe" required>
        <select id="tipe" value={tipe} onChange={(e) => setTipe(e.target.value as TipeWilayah)} className={selectClass}>
          {TIPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </FormField>
      <FormField label="Nama Wilayah" htmlFor="nama" required error={errors.nama}>
        <Input id="nama" type="text" placeholder="Masukkan nama wilayah" value={nama}
          onChange={(e) => { setNama(e.target.value); clearError("nama"); }} />
      </FormField>
      <FormField label="Kode Wilayah (BPS)" htmlFor="kodeBps" required error={errors.kodeBps}>
        <Input id="kodeBps" type="text" placeholder="Contoh: 32, 3204" value={kodeBps}
          onChange={(e) => { setKodeBps(e.target.value); clearError("kodeBps"); }} />
      </FormField>
      <FormField label="Parent Wilayah" htmlFor="parentId">
        <select id="parentId" value={parentId} onChange={(e) => setParentId(e.target.value)} className={selectClass}>
          <option value="">— Tidak ada (root) —</option>
          {parentOptions.filter((w) => w.id !== id).map((w) => (
            <option key={w.id} value={w.id}>[{w.tipe}] {w.nama} ({w.kodeBps})</option>
          ))}
        </select>
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Latitude" htmlFor="latitude" error={errors.latitude}>
          <Input id="latitude" type="text" placeholder="-6.9039" value={latitude}
            onChange={(e) => { setLatitude(e.target.value); clearError("latitude"); }} />
        </FormField>
        <FormField label="Longitude" htmlFor="longitude" error={errors.longitude}>
          <Input id="longitude" type="text" placeholder="107.6186" value={longitude}
            onChange={(e) => { setLongitude(e.target.value); clearError("longitude"); }} />
        </FormField>
      </div>
    </FormPage>
  );
}
