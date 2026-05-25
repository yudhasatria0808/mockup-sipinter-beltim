import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { forumService, type ForumPengumumanDetail as PengumumanDetail } from "../../services/forumService";

const prioritasBadge: Record<string, { label: string; className: string }> = {
  biasa: { label: "Biasa", className: "bg-gray-100 text-gray-600" },
  penting: { label: "Penting", className: "bg-warning-50 text-warning-600" },
  urgent: { label: "Urgent", className: "bg-error-50 text-error-600" },
};

export default function ForumPengumumanDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PengumumanDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    forumService.getPengumumanById(id)
      .then(setData)
      .catch(() => { alert("Pengumuman tidak ditemukan"); navigate("/forum/pengumuman"); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
    </div>
  );

  if (!data) return null;

  const pri = prioritasBadge[data.prioritas] || prioritasBadge.biasa;

  return (
    <>
      <PageMeta title={`Pengumuman: ${data.judul}`} description="Detail Pengumuman Forum Forkopimda" />
      <div className="max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-lg">📢</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pri.className}`}>{pri.label}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${data.isActive ? "bg-success-50 text-success-600" : "bg-gray-100 text-gray-500"}`}>
                {data.isActive ? "Aktif" : "Nonaktif"}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">{data.judul}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Oleh <span className="font-medium">{data.createdByName}</span> ({data.createdByRole}) • {new Date(data.createdAt).toLocaleString("id-ID")}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => navigate("/forum/pengumuman")}>← Kembali</Button>
        </div>

        {/* Isi */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{data.isi}</p>
        </div>
      </div>
    </>
  );
}
