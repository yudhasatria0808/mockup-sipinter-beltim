import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import SelectField from "../../components/form/SelectField";
import { forumService } from "../../services/forumService";

export default function ForumArahanForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    judul: "",
    isi: "",
    prioritas: "biasa",
    instansiTujuan: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.judul.trim() || !form.isi.trim() || !form.instansiTujuan.trim()) {
      alert("Judul, isi, dan instansi tujuan wajib diisi");
      return;
    }
    setLoading(true);
    try {
      await forumService.createArahan(form);
      navigate("/forum/arahan");
    } catch { alert("Gagal membuat arahan"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <PageMeta title="Buat Arahan" description="Buat arahan/disposisi baru" />
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Buat Arahan Baru</h2>
          <Button size="sm" variant="outline" onClick={() => navigate("/forum/arahan")}>← Kembali</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Judul Arahan <span className="text-error-500">*</span>
              </label>
              <Input type="text" placeholder="Masukkan judul arahan..." value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Instansi Tujuan <span className="text-error-500">*</span>
                </label>
                <Input type="text" placeholder="Contoh: Polres, Kodim, Kejaksaan..." value={form.instansiTujuan}
                  onChange={(e) => setForm({ ...form, instansiTujuan: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Prioritas</label>
                <SelectField value={form.prioritas} onChange={(v) => setForm({ ...form, prioritas: v })}
                  options={[
                    { value: "biasa", label: "Biasa" },
                    { value: "penting", label: "Penting" },
                    { value: "urgent", label: "Urgent" },
                  ]} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Isi Arahan <span className="text-error-500">*</span>
              </label>
              <textarea rows={6} placeholder="Tuliskan isi arahan/disposisi..." value={form.isi}
                onChange={(e) => setForm({ ...form, isi: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => navigate("/forum/arahan")}>Batal</Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? "Menyimpan..." : "Buat Arahan"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
