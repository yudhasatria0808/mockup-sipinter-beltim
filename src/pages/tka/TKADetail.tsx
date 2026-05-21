import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { EditIcon, CloseIcon, CheckIcon } from "../../components/icons";
import type { TKA, StatusApproval, JenisIzinTinggal } from "../../types/tka";
import { tkaService } from "../../services/tkaService";

const statusBadge: Record<StatusApproval, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  menunggu: { label: "Menunggu Approval", className: "bg-warning-50 text-warning-600 dark:bg-warning-900/20 dark:text-warning-400" },
  disetujui: { label: "Disetujui", className: "bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400" },
  ditolak: { label: "Ditolak", className: "bg-error-50 text-error-600 dark:bg-error-900/20 dark:text-error-400" },
};

const izinTinggalColor: Record<JenisIzinTinggal, string> = {
  Visa: "text-brand-700 bg-brand-50 dark:bg-brand-900/20",
  KITAS: "text-warning-700 bg-warning-50 dark:bg-warning-900/20",
  KITAP: "text-success-700 bg-success-50 dark:bg-success-900/20",
};

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex gap-2 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="w-52 shrink-0 text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm text-gray-800 dark:text-white/90 flex-1">{value || "-"}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-1">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2 mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function TKADetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<TKA | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<"disetujui" | "ditolak">("disetujui");
  const [catatan, setCatatan] = useState("");
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      tkaService.getById(id).then(setData).catch(() => { alert("Data tidak ditemukan"); navigate("/tka"); }).finally(() => setLoading(false));
    }
  }, [id, navigate]);

  if (loading) return <div className="flex items-center justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" /></div>;

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-500">
        Data tidak ditemukan.{" "}
        <button onClick={() => navigate("/tka")} className="text-brand-500 underline">
          Kembali
        </button>
      </div>
    );
  }

  const handleApproval = async () => {
    if (!id) return;
    setApproving(true);
    try {
      const updated = await tkaService.approve(id, approvalAction, catatan || undefined);
      setData(updated);
      setShowApprovalModal(false);
      setCatatan("");
    } catch { alert("Gagal memproses"); }
    finally { setApproving(false); }
  };

  const s = statusBadge[data.status];
  const isIMTAExpired = new Date(data.tanggalBerakhirIMTA) < new Date();

  return (
    <>
      <PageMeta title="Detail Data TKA" description="Detail Tenaga Kerja Asing" />
      <div className="max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Detail Tenaga Kerja Asing
            </h2>
            <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.className}`}>
              {s.label}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {data.status === "draft" && (
              <Button size="sm" variant="outline" onClick={() => navigate(`/tka/edit/${data.id}`)} className="gap-1.5">
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
                  className="gap-1.5 border-error-300 text-error-600 hover:bg-error-50"
                >
                  <CloseIcon /> Tolak
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" onClick={() => navigate("/tka")}>
              Kembali
            </Button>
          </div>
        </div>

        {/* Identitas TKA */}
        <Section title="Identitas Tenaga Kerja Asing">
          <Row
            label="Periode"
            value={new Date(data.periode).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          />
          <Row label="Nama TKA" value={<span className="font-semibold">{data.namaTKA}</span>} />
          <Row label="Jenis Kelamin" value={data.jenisKelamin} />
          <Row
            label="Kewarganegaraan"
            value={
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400">
                {data.kewarganegaraan}
              </span>
            }
          />
          <Row label="No. Paspor" value={<span className="font-mono font-medium">{data.noPaspor}</span>} />
          <Row label="Nama Perusahaan" value={data.namaPerusahaan} />
          <Row label="Jabatan / Keterampilan" value={data.jabatanKeterampilan} />
          <Row label="No. Telepon / Komunikasi" value={data.noTelepon || "-"} />
        </Section>

        {/* IMTA / RPTKA */}
        <Section title="Nomor IMTA / RPTKA &amp; Masa Berlaku">
          <Row label="Nomor IMTA / RPTKA" value={<span className="font-mono font-medium">{data.nomorIMTA}</span>} />
          <Row
            label="Tanggal Mulai"
            value={new Date(data.tanggalMulaiIMTA).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          />
          <Row
            label="Tanggal Berakhir"
            value={
              <span className={isIMTAExpired ? "text-error-600 font-medium" : ""}>
                {new Date(data.tanggalBerakhirIMTA).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
                {isIMTAExpired && (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400">
                    Kadaluarsa
                  </span>
                )}
              </span>
            }
          />
          <Row
            label="Jenis Izin Tinggal"
            value={
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${izinTinggalColor[data.jenisIzinTinggal]}`}>
                {data.jenisIzinTinggal}
              </span>
            }
          />
        </Section>

        {/* Lokasi Kerja */}
        <Section title="Lokasi Kerja">
          <Row label="Kabupaten" value={data.kabupaten} />
          <Row label="Kecamatan" value={data.kecamatan} />
          <Row label="Desa" value={data.desa} />
          <Row label="Alamat Detail" value={data.alamatDetail} />
          <Row label="Titik Koordinat" value={data.titikKoordinat} />
        </Section>

        {/* Keterangan & Sumber */}
        <Section title="Keterangan &amp; Sumber Informasi">
          <Row label="Keterangan" value={data.keterangan || "-"} />
          <Row label="Sumber Informasi" value={data.sumberInformasi} />
        </Section>

        {/* Info Approval */}
        {(data.status === "disetujui" || data.status === "ditolak") && (
          <Section title="Informasi Approval">
            <Row
              label="Status"
              value={
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.className}`}>
                  {s.label}
                </span>
              }
            />
            {data.approvedBy && <Row label="Diproses oleh" value={data.approvedBy} />}
            {data.approvedAt && (
              <Row label="Tanggal Proses" value={new Date(data.approvedAt).toLocaleString("id-ID")} />
            )}
            {data.catatanApproval && <Row label="Catatan" value={data.catatanApproval} />}
          </Section>
        )}

        {/* Meta */}
        <Section title="Informasi Pelaporan">
          <Row label="Dibuat oleh" value={data.createdBy} />
          <Row label="Tanggal Dibuat" value={new Date(data.createdAt).toLocaleString("id-ID")} />
        </Section>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
              {approvalAction === "disetujui" ? "Setujui" : "Tolak"} Data TKA
            </h3>
            <p className="text-sm text-gray-500">
              {approvalAction === "disetujui"
                ? "Data TKA akan disetujui dan masuk ke dashboard pemantauan."
                : "Data akan ditolak. Pelapor perlu memperbaiki dan mengirim ulang."}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catatan {approvalAction === "ditolak" && <span className="text-error-500">*</span>}
              </label>
              <textarea
                rows={3}
                placeholder="Tambahkan catatan (opsional)..."
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button size="sm" variant="outline" onClick={() => setShowApprovalModal(false)}>
                Batal
              </Button>
              <Button
                size="sm"
                disabled={approving}
                onClick={handleApproval}
                className={approvalAction === "disetujui" ? "bg-success-500 hover:bg-success-600" : "bg-error-500 hover:bg-error-600"}
              >
                {approvalAction === "disetujui" ? "Setujui" : "Tolak"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
