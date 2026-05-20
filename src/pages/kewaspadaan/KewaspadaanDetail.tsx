import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { EditIcon, CloseIcon, CheckIcon } from "../../components/icons";
import type { KewaspadaanDini, StatusApproval, LevelRisikoLabel } from "../../types/kewaspadaan";
import { mockKewaspadaan } from "./mockData";

const statusBadge: Record<StatusApproval, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  menunggu: { label: "Menunggu Approval", className: "bg-warning-50 text-warning-600 dark:bg-warning-900/20 dark:text-warning-400" },
  disetujui: { label: "Disetujui", className: "bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400" },
  ditolak: { label: "Ditolak", className: "bg-error-50 text-error-600 dark:bg-error-900/20 dark:text-error-400" },
};

const risikoColor: Record<LevelRisikoLabel, string> = {
  Rendah: "text-success-700 bg-success-50 dark:bg-success-900/20",
  Sedang: "text-warning-700 bg-warning-50 dark:bg-warning-900/20",
  Tinggi: "text-orange-700 bg-orange-50 dark:bg-orange-900/20",
  "Sangat Tinggi": "text-error-700 bg-error-50 dark:bg-error-900/20",
};

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex gap-2 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="w-44 shrink-0 text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm text-gray-800 dark:text-white/90 flex-1">{value || "-"}</span>
    </div>
  );
}

export default function KewaspadaanDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<KewaspadaanDini | undefined>(
    mockKewaspadaan.find((d) => d.id === id)
  );
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<"disetujui" | "ditolak">("disetujui");
  const [catatan, setCatatan] = useState("");

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-500">
        Data tidak ditemukan.{" "}
        <button onClick={() => navigate("/kewaspadaan")} className="text-brand-500 underline">Kembali</button>
      </div>
    );
  }

  const handleApproval = () => {
    const idx = mockKewaspadaan.findIndex((d) => d.id === id);
    if (idx !== -1) {
      mockKewaspadaan[idx] = {
        ...mockKewaspadaan[idx],
        status: approvalAction,
        catatanApproval: catatan,
        approvedBy: "Admin Approver",
        approvedAt: new Date().toISOString(),
      };
      setData({ ...mockKewaspadaan[idx] });
    }
    setShowApprovalModal(false);
    setCatatan("");
  };

  const s = statusBadge[data.status];

  return (
    <>
      <PageMeta title="Detail Kewaspadaan Dini" description="Detail Form Kewaspadaan Dini" />
      <div className="max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Detail Kewaspadaan Dini
            </h2>
            <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.className}`}>
              {s.label}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {data.status === "draft" && (
              <Button size="sm" variant="outline" onClick={() => navigate(`/kewaspadaan/edit/${data.id}`)} className="gap-1.5">
                <EditIcon /> Edit
              </Button>
            )}
            {data.status === "menunggu" && (
              <>
                <Button
                  size="sm"
                  onClick={() => { setApprovalAction("disetujui"); setShowApprovalModal(true); }}
                  className="gap-1.5 bg-success-500 hover:bg-success-600"
                >
                  <CheckIcon /> Setujui
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setApprovalAction("ditolak"); setShowApprovalModal(true); }}
                  className="gap-1.5 text-error-500 border-error-300 hover:bg-error-50"
                >
                  <CloseIcon /> Tolak
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" onClick={() => navigate("/kewaspadaan")} className="gap-1.5">
              ← Kembali
            </Button>
          </div>
        </div>

        {/* Informasi Umum */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Informasi Umum</h3>
          <Row label="Periode" value={new Date(data.periode).toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })} />
          <Row label="Aspek" value={data.aspek} />
          <Row label="Dibuat Oleh" value={data.createdBy} />
          <Row label="Tanggal Input" value={new Date(data.createdAt).toLocaleString("id-ID")} />
        </div>

        {/* Wilayah */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Wilayah / Lokasi</h3>
          <Row label="Kabupaten" value={data.kabupaten} />
          <Row label="Kecamatan" value={data.kecamatan} />
          <Row label="Desa" value={data.desa} />
          <Row label="Alamat Detail" value={data.alamatDetail} />
          <Row label="Titik Koordinat" value={data.titikKoordinat} />
          <Row label="Sumber Informasi" value={data.sumberInformasi} />
        </div>

        {/* Analisis Risiko */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Analisis Risiko</h3>
          <Row
            label="Kemungkinan Ancaman"
            value={
              <div>
                <span className="font-medium">{data.kemungkinanAncaman.level}</span>
                <p className="text-gray-500 dark:text-gray-400 mt-0.5">{data.kemungkinanAncaman.deskripsi}</p>
              </div>
            }
          />
          <Row label="Hambatan" value={data.hambatan} />
          <Row label="Tantangan" value={data.tantangan} />
          <Row label="Gangguan" value={data.gangguan} />
          <Row
            label="Prediksi Dampak"
            value={
              <div>
                <span className="font-medium">{data.prediksiDampak.level}</span>
                <p className="text-gray-500 dark:text-gray-400 mt-0.5">{data.prediksiDampak.deskripsi}</p>
              </div>
            }
          />
          <Row label="Saran & Tindak Lanjut" value={data.rekomendasi} />
          <Row
            label="Tingkat Risiko"
            value={
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${risikoColor[data.tingkatRisiko]}`}>
                {data.tingkatRisiko}
              </span>
            }
          />
        </div>

        {/* Approval Info */}
        {(data.status === "disetujui" || data.status === "ditolak") && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Informasi Approval</h3>
            <Row label="Status" value={<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}>{s.label}</span>} />
            <Row label="Diproses Oleh" value={data.approvedBy} />
            <Row label="Tanggal Proses" value={data.approvedAt ? new Date(data.approvedAt).toLocaleString("id-ID") : "-"} />
            {data.catatanApproval && <Row label="Catatan" value={data.catatanApproval} />}
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-900 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
              {approvalAction === "disetujui" ? "Setujui" : "Tolak"} Kewaspadaan Dini
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {approvalAction === "disetujui"
                ? "Data akan disetujui dan masuk ke sistem EWS."
                : "Data akan ditolak dan dikembalikan ke pelapor."}
            </p>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Catatan {approvalAction === "ditolak" && <span className="text-error-500">*</span>}
              </label>
              <textarea
                rows={3}
                placeholder="Tambahkan catatan approval..."
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowApprovalModal(false)}>
                Batal
              </Button>
              <Button
                type="button"
                size="sm"
                className={approvalAction === "disetujui" ? "bg-success-500 hover:bg-success-600" : "bg-error-500 hover:bg-error-600"}
                onClick={handleApproval}
              >
                {approvalAction === "disetujui" ? "Ya, Setujui" : "Ya, Tolak"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
