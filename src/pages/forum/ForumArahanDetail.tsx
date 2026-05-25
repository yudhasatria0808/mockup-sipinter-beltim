import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { forumService, type ForumArahanDetail as ArahanDetail } from "../../services/forumService";

const prioritasBadge: Record<string, { label: string; className: string }> = {
  biasa: { label: "Biasa", className: "bg-gray-100 text-gray-600" },
  penting: { label: "Penting", className: "bg-warning-50 text-warning-600" },
  urgent: { label: "Urgent", className: "bg-error-50 text-error-600" },
};

const statusTLBadge: Record<string, { label: string; className: string }> = {
  belum: { label: "Belum", className: "bg-gray-100 text-gray-600" },
  sedang: { label: "Sedang", className: "bg-blue-50 text-blue-600" },
  selesai: { label: "Selesai", className: "bg-success-50 text-success-600" },
};

export default function ForumArahanDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ArahanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tlText, setTlText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await forumService.getArahanById(id);
      setData(result);
    } catch { alert("Arahan tidak ditemukan"); navigate("/forum/arahan"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [id]);

  const handleAddTindakLanjut = async () => {
    if (!id || !tlText.trim()) return;
    setSubmitting(true);
    try {
      const newTL = await forumService.createTindakLanjut(id, tlText.trim());
      setData((prev) => prev ? { ...prev, tindakLanjuts: [newTL, ...prev.tindakLanjuts] } : prev);
      setTlText("");
    } catch { alert("Gagal menambah tindak lanjut"); }
    finally { setSubmitting(false); }
  };

  const handleUpdateStatus = async (tlId: string, newStatus: string) => {
    if (!id) return;
    try {
      const updated = await forumService.updateTindakLanjutStatus(id, tlId, newStatus);
      setData((prev) => prev ? {
        ...prev,
        tindakLanjuts: prev.tindakLanjuts.map(tl => tl.id === tlId ? updated : tl),
      } : prev);
    } catch { alert("Gagal mengubah status"); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
    </div>
  );

  if (!data) return null;

  const pri = prioritasBadge[data.prioritas] || prioritasBadge.biasa;

  return (
    <>
      <PageMeta title={`Arahan: ${data.judul}`} description="Detail Arahan Pimpinan" />
      <div className="max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pri.className}`}>{pri.label}</span>
              <span className="text-sm text-blue-600 font-medium">→ {data.instansiTujuan}</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">{data.judul}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Oleh <span className="font-medium">{data.createdByName}</span> ({data.createdByRole}) • {new Date(data.createdAt).toLocaleString("id-ID")}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => navigate("/forum/arahan")}>← Kembali</Button>
        </div>

        {/* Isi Arahan */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Isi Arahan</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{data.isi}</p>
          {data.forumTopikJudul && (
            <p className="mt-4 text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3">
              🔗 Terkait topik: <span className="font-medium text-gray-600 dark:text-gray-300">{data.forumTopikJudul}</span>
            </p>
          )}
        </div>

        {/* Tindak Lanjut */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Tindak Lanjut ({data.tindakLanjuts.length})
          </h3>

          {/* Add tindak lanjut */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-3">
            <textarea rows={2} placeholder="Tambahkan laporan tindak lanjut..." value={tlText}
              onChange={(e) => setTlText(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            <div className="flex justify-end">
              <Button size="sm" onClick={handleAddTindakLanjut} disabled={submitting || !tlText.trim()}>
                {submitting ? "Mengirim..." : "Tambah Tindak Lanjut"}
              </Button>
            </div>
          </div>

          {data.tindakLanjuts.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Belum ada tindak lanjut untuk arahan ini.</p>
          ) : (
            <div className="space-y-3">
              {data.tindakLanjuts.map((tl) => {
                const st = statusTLBadge[tl.status] || statusTLBadge.belum;
                return (
                  <div key={tl.id} className="rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">{tl.createdByName}
                          <span className="ml-1.5 text-xs font-normal text-gray-400">({tl.createdByRole})</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(tl.createdAt).toLocaleString("id-ID")}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${st.className}`}>{st.label}</span>
                        {tl.status !== "selesai" && (
                          <select
                            value={tl.status}
                            onChange={(e) => handleUpdateStatus(tl.id, e.target.value)}
                            className="text-xs border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300"
                          >
                            <option value="belum">Belum</option>
                            <option value="sedang">Sedang</option>
                            <option value="selesai">Selesai</option>
                          </select>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">{tl.isi}</p>
                    {tl.tanggalSelesai && (
                      <p className="text-xs text-success-600 mt-2">✓ Selesai pada {new Date(tl.tanggalSelesai).toLocaleDateString("id-ID")}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
