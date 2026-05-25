import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import SelectField from "../../components/form/SelectField";
import { forumService } from "../../services/forumService";

export default function ForumPengumumanForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    judul: "",
    isi: "",
    prioritas: "biasa",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.judul.trim() || !form.isi.trim()) {
      alert("Judul dan isi pengumuman wajib diisi");
      return;
    }
    setLoading(true);
    try {
      await forumService.createPengumuman(form);
      navigate("/forum/pengumuman");
    } catch { alert("Gagal membuat pengumuman"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <PageMeta title="Buat Pengumuman" description="Buat pengumuman baru untuk Forum Forkopimda" />
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Buat Pengumuman Baru</h2>
          <Button size="sm" variant="outline" onClick={() => navigate("/forum/pengumuman")}>← Kembali</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Judul Pengumuman <span className="text-error-500">*</span>
              </label>
              <Input type="text" placeholder="Masukkan judul pengumuman..." value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })} />
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Isi Pengumuman <span className="text-error-500">*</span>
              </label>
              <textarea rows={6} placeholder="Tuliskan isi pengumuman..." value={form.isi}
                onChange={(e) => setForm({ ...form, isi: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => navigate("/forum/pengumuman")}>Batal</Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? "Menyimpan..." : "Buat Pengumuman"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
