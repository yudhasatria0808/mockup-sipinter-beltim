import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import SelectField from "../../components/form/SelectField";
import { forumService } from "../../services/forumService";

export default function ForumTopikForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    judul: "",
    isi: "",
    kategori: "lainnya",
    prioritas: "biasa",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.judul.trim() || !form.isi.trim()) {
      alert("Judul dan isi topik wajib diisi");
      return;
    }
    setLoading(true);
    try {
      await forumService.createTopik(form);
      navigate("/forum/topik");
    } catch { alert("Gagal membuat topik diskusi"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <PageMeta title="Buat Topik Diskusi" description="Buat topik diskusi baru di Forum Forkopimda" />
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Buat Topik Diskusi Baru</h2>
          <Button size="sm" variant="outline" onClick={() => navigate("/forum/topik")}>← Kembali</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Judul Topik <span className="text-error-500">*</span>
              </label>
              <Input type="text" placeholder="Masukkan judul topik diskusi..." value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Kategori</label>
                <SelectField value={form.kategori} onChange={(v) => setForm({ ...form, kategori: v })}
                  options={[
                    { value: "keamanan", label: "Keamanan" },
                    { value: "konflik", label: "Konflik" },
                    { value: "koordinasi", label: "Koordinasi" },
                    { value: "lainnya", label: "Lainnya" },
                  ]} />
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
                Isi Diskusi <span className="text-error-500">*</span>
              </label>
              <textarea rows={6} placeholder="Tuliskan isi topik diskusi..." value={form.isi}
                onChange={(e) => setForm({ ...form, isi: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => navigate("/forum/topik")}>Batal</Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? "Menyimpan..." : "Buat Topik"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
