import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { EditIcon, CloseIcon, CheckIcon } from "../../components/icons";
import type { PeristiwaKonflik, StatusApproval, LevelRisikoLabel } from "../../types/peristiwa-konflik";
import { mockPeristiwaKonflik } from "./mockData";

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

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

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

export default function PeristiwaKonflikDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PeristiwaKonflik | undefined>(
    mockPeristiwaKonflik.find((d) => d.id === id)
  );
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<"disetujui" | "ditolak">("disetujui");
  const [catatan, setCatatan] = useState("");

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-500">
        Data tidak ditemukan.{" "}
        <button onClick={() => navigate("/peristiwa-konflik")} className="text-brand-500 underline">
          Kembali
        </button>
      </div>
    );
  }

  const handleApproval = () => {
    const idx = mockPeristiwaKonflik.findIndex((d) => d.id === id);
    if (idx !== -1) {
      mockPeristiwaKonflik[idx] = {
        ...mockPeristiwaKonflik[idx],
        status: approvalAction,
        catatanApproval: catatan,
        approvedBy: "Admin Approver",
        approvedAt: new Date().toISOString(),
      };
      setData({ ...mockPeristiwaKonflik[idx] });
    }
    setShowApprovalModal(false);
    setCatatan("");
  };

  const s = statusBadge[data.status];

  return (
    <>
      <PageMeta title="Detail Peristiwa Konflik" description="Detail Form Peristiwa Konflik" />
      <div className="max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Detail Peristiwa Konflik
            </h2>
            <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.className}`}>
              {s.label}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {data.status === "draft" && (
              <Button size="sm" variant="outline" onClick={() => navigate(`/peristiwa-konflik/edit/${data.id}`)} className="gap-1.5">
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
            <Button size="sm" variant="outline" onClick={() => navigate("/peristiwa-konflik")}>
              Kembali
            </Button>
          </div>
        </div>

        {/* Informasi Umum */}
        <Section title="Informasi Umum">
          <Row
            label="Periode"
            value={new Date(data.periode).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          />
          <Row label="Nama Peristiwa Kejadian" value={<span className="font-medium">{data.namaPeristiwa}</span>} />
          <Row label="Sumber/Sebab Konflik" value={data.sumberSebabKonflik} />
          <Row label="Latar Belakang Kejadian" value={data.latarBelakangKejadian} />
          <Row label="Deskripsi/Akibat Peristiwa" value={data.deskripsiAkibatPeristiwa} />
          <Row
            label="Tingkat Risiko"
            value={
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${risikoColor[data.tingkatRisiko]}`}>
                {data.tingkatRisiko}
              </span>
            }
          />
        </Section>

        {/* Korban & Kerugian */}
        <Section title="Korban &amp; Kerugian">
          <Row
            label="Korban Kritis"
            value={
              <span className={data.korbanKritis > 0 ? "font-semibold text-error-600" : ""}>
                {data.korbanKritis} Orang
              </span>
            }
          />
          <Row
            label="Korban Luka-luka"
            value={
              <span className={data.korbanLukaLuka > 0 ? "font-semibold text-orange-600" : ""}>
                {data.korbanLukaLuka} Orang
              </span>
            }
          />
          <Row
            label="Korban Mengungsi"
            value={
              <span className={data.korbanMengungsi > 0 ? "font-semibold text-warning-600" : ""}>
                {data.korbanMengungsi} Orang
              </span>
            }
          />
          <Row
            label="Kerugian Materil"
            value={
              <span className={data.kerugianMateril > 0 ? "font-semibold" : ""}>
                {data.kerugianMateril > 0 ? formatRupiah(data.kerugianMateril) : "-"}
              </span>
            }
          />
        </Section>

        {/* Upaya */}
        <Section title="Upaya Penanganan &amp; Pemulihan">
          <Row label="Upaya Penanganan" value={data.upayaPenanganan} />
          <Row label="Upaya Pemulihan" value={data.upayaPemulihan} />
        </Section>

        {/* Wilayah / Lokasi */}
        <Section title="Wilayah / Lokasi Peristiwa">
          <Row label="Kabupaten" value={data.kabupaten} />
          <Row label="Kecamatan" value={data.kecamatan} />
          <Row label="Desa" value={data.desa} />
          <Row label="Alamat Detail" value={data.alamatDetail} />
          <Row label="Titik Koordinat" value={data.titikKoordinat} />
          <Row label="Bukti Dukung (Foto)" value={data.buktiFoto || "-"} />
          <Row label="Sumber Informasi" value={data.sumberInformasi} />
          <Row label="Keterangan" value={data.keterangan || "-"} />
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
              {approvalAction === "disetujui" ? "Setujui" : "Tolak"} Data Peristiwa Konflik
            </h3>
            <p className="text-sm text-gray-500">
              {approvalAction === "disetujui"
                ? "Data akan disetujui dan masuk ke EWS Dashboard."
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
