import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { TrashIcon } from "../../components/icons";
import { forumService, type ForumTopikDetail as TopikDetail } from "../../services/forumService";

const prioritasBadge: Record<string, { label: string; className: string }> = {
  biasa: { label: "Biasa", className: "bg-gray-100 text-gray-600" },
  penting: { label: "Penting", className: "bg-warning-50 text-warning-600" },
  urgent: { label: "Urgent", className: "bg-error-50 text-error-600" },
};

const kategoriBadge: Record<string, { label: string; className: string }> = {
  keamanan: { label: "Keamanan", className: "bg-blue-50 text-blue-700" },
  konflik: { label: "Konflik", className: "bg-red-50 text-red-700" },
  koordinasi: { label: "Koordinasi", className: "bg-green-50 text-green-700" },
  lainnya: { label: "Lainnya", className: "bg-purple-50 text-purple-700" },
};

export default function ForumTopikDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<TopikDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [komentarText, setKomentarText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await forumService.getTopikById(id);
      setData(result);
    } catch { alert("Topik tidak ditemukan"); navigate("/forum/topik"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [id]);

  const handleAddKomentar = async () => {
    if (!id || !komentarText.trim()) return;
    setSubmitting(true);
    try {
      const newKomentar = await forumService.createKomentar(id, komentarText.trim());
      setData((prev) => prev ? { ...prev, komentars: [...prev.komentars, newKomentar] } : prev);
      setKomentarText("");
    } catch { alert("Gagal menambah komentar"); }
    finally { setSubmitting(false); }
  };

  const handleDeleteKomentar = async (komentarId: string) => {
    if (!id || !confirm("Hapus komentar ini?")) return;
    try {
      await forumService.deleteKomentar(id, komentarId);
      setData((prev) => prev ? { ...prev, komentars: prev.komentars.filter(k => k.id !== komentarId) } : prev);
    } catch { alert("Gagal menghapus komentar"); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
    </div>
  );

  if (!data) return null;

  const kat = kategoriBadge[data.kategori] || kategoriBadge.lainnya;
  const pri = prioritasBadge[data.prioritas] || prioritasBadge.biasa;

  return (
    <>
      <PageMeta title={`Diskusi: ${data.judul}`} description="Detail Topik Diskusi Forum Forkopimda" />
      <div className="max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${kat.className}`}>{kat.label}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pri.className}`}>{pri.label}</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">{data.judul}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Oleh <span className="font-medium">{data.createdByName}</span> ({data.createdByRole}) • {new Date(data.createdAt).toLocaleString("id-ID")}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => navigate("/forum/topik")}>← Kembali</Button>
        </div>

        {/* Isi Topik */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{data.isi}</p>
        </div>

        {/* Komentar */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Komentar ({data.komentars.length})
          </h3>

          {data.komentars.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Belum ada komentar. Jadilah yang pertama berkomentar.</p>
          ) : (
            <div className="space-y-3">
              {data.komentars.map((k) => (
                <div key={k.id} className="rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">{k.createdByName}
                        <span className="ml-1.5 text-xs font-normal text-gray-400">({k.createdByRole})</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(k.createdAt).toLocaleString("id-ID")}</p>
                    </div>
                    <button onClick={() => handleDeleteKomentar(k.id)}
                      className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" title="Hapus">
                      <TrashIcon />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">{k.isi}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add komentar */}
          {data.status === "aktif" && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-3">
              <textarea rows={3} placeholder="Tulis komentar atau tanggapan..." value={komentarText}
                onChange={(e) => setKomentarText(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
              <div className="flex justify-end">
                <Button size="sm" onClick={handleAddKomentar} disabled={submitting || !komentarText.trim()}>
                  {submitting ? "Mengirim..." : "Kirim Komentar"}
                </Button>
              </div>
            </div>
          )}

          {data.status !== "aktif" && (
            <p className="text-sm text-gray-400 italic text-center py-2">Topik ini sudah ditutup. Tidak bisa menambah komentar.</p>
          )}
        </div>
      </div>
    </>
  );
}
