import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { EditIcon, CloseIcon, CheckIcon } from "../../components/icons";
import type { PotensiKonflik, StatusApproval, LevelRisikoLabel } from "../../types/potensi-konflik";
import { potensiKonflikService } from "../../services/potensiKonflikService";

const statusBadge: Record<StatusApproval, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  menunggu: { label: "Menunggu Approval", className: "bg-warning-50 text-warning-600 dark:bg-warning-900/20 dark:text-warning-400" },
  disetujui: { label: "Disetujui", className: "bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400" },
  ditolak: { label: "Ditolak", className: "bg-error-50 text-error-600 dark:bg-error-900/20 dark:text-error-400" },
};
const risikoColor: Record<LevelRisikoLabel, string> = {
  Rendah: "text-success-700 bg-success-50", Sedang: "text-warning-700 bg-warning-50",
  Tinggi: "text-orange-700 bg-orange-50", "Sangat Tinggi": "text-error-700 bg-error-50",
};

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (<div className="flex gap-2 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"><span className="w-52 shrink-0 text-sm text-gray-500 dark:text-gray-400">{label}</span><span className="text-sm text-gray-800 dark:text-white/90 flex-1">{value || "-"}</span></div>);
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (<div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-1"><h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2 mb-2">{title}</h3>{children}</div>);
}

export default function PotensiKonflikDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PotensiKonflik | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState<"disetujui" | "ditolak">("disetujui");
  const [catatan, setCatatan] = useState("");
  const [approving, setApproving] = useState(false);

  useEffect(() => { if (id) { setLoading(true); potensiKonflikService.getById(id).then(setData).catch(() => { alert("Data tidak ditemukan"); navigate("/potensi-konflik"); }).finally(() => setLoading(false)); } }, [id, navigate]);

  const handleApproval = async () => { if (!id) return; setApproving(true); try { const updated = await potensiKonflikService.approve(id, action, catatan || undefined); setData(updated); setShowModal(false); setCatatan(""); } catch { alert("Gagal memproses"); } finally { setApproving(false); } };

  if (loading) return <div className="flex items-center justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" /></div>;
  if (!data) return <div className="text-center py-20 text-gray-500">Data tidak ditemukan. <button onClick={() => navigate("/potensi-konflik")} className="text-brand-500 underline">Kembali</button></div>;

  const s = statusBadge[data.status];

  return (
    <>
      <PageMeta title="Detail Potensi Konflik" description="Detail Form Potensi Konflik" />
      <div className="max-w-3xl space-y-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div><h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Detail Potensi Konflik</h2><span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.className}`}>{s.label}</span></div>
          <div className="flex gap-2 flex-wrap">
            {data.status === "draft" && <Button size="sm" variant="outline" onClick={() => navigate(`/potensi-konflik/edit/${data.id}`)} className="gap-1.5"><EditIcon /> Edit</Button>}
            {data.status === "menunggu" && (<><Button size="sm" onClick={() => { setAction("disetujui"); setShowModal(true); }} className="gap-1.5 bg-success-500 hover:bg-success-600"><CheckIcon /> Setujui</Button><Button size="sm" variant="outline" onClick={() => { setAction("ditolak"); setShowModal(true); }} className="gap-1.5 border-error-300 text-error-600 hover:bg-error-50"><CloseIcon /> Tolak</Button></>)}
            <Button size="sm" variant="outline" onClick={() => navigate("/potensi-konflik")}>Kembali</Button>
          </div>
        </div>

        <Section title="Informasi Umum">
          <Row label="Periode" value={new Date(data.periode).toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })} />
          <Row label="Aspek" value={<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700">{data.aspek}</span>} />
          <Row label="Nama Potensi Konflik" value={<span className="font-medium">{data.namaPotensiKonflik}</span>} />
        </Section>

        <Section title="Wilayah / Lokasi">
          <Row label="Kabupaten" value={data.kabupaten} /><Row label="Kecamatan" value={data.kecamatan} /><Row label="Desa" value={data.desa} />
          <Row label="Alamat Detail" value={data.alamatDetail} /><Row label="Titik Koordinat" value={data.titikKoordinat} /><Row label="Sumber Informasi" value={data.sumberInformasi} />
        </Section>

        <Section title="Analisis Konflik">
          <Row label="Kemungkinan Potensi Konflik" value={<div className="space-y-1"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${risikoColor[data.kemungkinanPotensiKonflik.level as LevelRisikoLabel] || ""}`}>Level: {data.kemungkinanPotensiKonflik.level}</span><p className="text-sm">{data.kemungkinanPotensiKonflik.deskripsi}</p></div>} />
          <Row label="Sumber/Sebab Permasalahan" value={data.sumberSebabPermasalahan} />
          <Row label="Latar Belakang Masalah" value={data.latarBelakangMasalah} />
          <Row label="Dampak Potensi Konflik" value={<div className="space-y-1"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${risikoColor[data.dampakPotensiKonflik.level as LevelRisikoLabel] || ""}`}>Level: {data.dampakPotensiKonflik.level}</span><p className="text-sm">{data.dampakPotensiKonflik.deskripsi}</p></div>} />
          <Row label="Upaya Penanganan" value={data.upayaPenanganan} />
          <Row label="Keterangan Detail" value={data.keteranganDetail} />
          <Row label="Saran & Tindak Lanjut" value={data.rekomendasi} />
          <Row label="Tingkat Risiko" value={<span className={`px-3 py-1 rounded-full text-sm font-semibold ${risikoColor[data.tingkatRisiko]}`}>{data.tingkatRisiko}</span>} />
        </Section>

        {(data.status === "disetujui" || data.status === "ditolak") && (<Section title="Informasi Approval"><Row label="Status" value={<span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${s.className}`}>{s.label}</span>} />{data.approvedBy && <Row label="Diproses oleh" value={data.approvedBy} />}{data.approvedAt && <Row label="Tanggal Proses" value={new Date(data.approvedAt).toLocaleString("id-ID")} />}{data.catatanApproval && <Row label="Catatan" value={data.catatanApproval} />}</Section>)}

        <Section title="Informasi Pelaporan"><Row label="Dibuat oleh" value={data.createdBy} /><Row label="Tanggal Dibuat" value={new Date(data.createdAt).toLocaleString("id-ID")} /></Section>
      </div>

      {showModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{action === "disetujui" ? "Setujui" : "Tolak"} Data</h3>
        <p className="text-sm text-gray-500">{action === "disetujui" ? "Data akan masuk ke EWS Dashboard." : "Data akan ditolak."}</p>
        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catatan</label><textarea rows={3} placeholder="Catatan..." value={catatan} onChange={(e) => setCatatan(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" /></div>
        <div className="flex gap-3 justify-end"><Button size="sm" variant="outline" onClick={() => setShowModal(false)}>Batal</Button><Button size="sm" disabled={approving} onClick={handleApproval} className={action === "disetujui" ? "bg-success-500 hover:bg-success-600" : "bg-error-500 hover:bg-error-600"}>{approving ? "Memproses..." : action === "disetujui" ? "Setujui" : "Tolak"}</Button></div>
      </div></div>)}
    </>
  );
}
