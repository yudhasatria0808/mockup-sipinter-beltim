import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";

interface BackupItem {
  id: string;
  filename: string;
  size: string;
  createdAt: string;
  type: "otomatis" | "manual";
  status: "berhasil" | "gagal";
}

const mockBackups: BackupItem[] = [
  {
    id: "1",
    filename: "backup_sipintar_20260525_020000.sql",
    size: "12.4 MB",
    createdAt: "2026-05-25 02:00:00",
    type: "otomatis",
    status: "berhasil",
  },
  {
    id: "2",
    filename: "backup_sipintar_20260524_020000.sql",
    size: "12.3 MB",
    createdAt: "2026-05-24 02:00:00",
    type: "otomatis",
    status: "berhasil",
  },
  {
    id: "3",
    filename: "backup_sipintar_20260523_143022.sql",
    size: "12.1 MB",
    createdAt: "2026-05-23 14:30:22",
    type: "manual",
    status: "berhasil",
  },
  {
    id: "4",
    filename: "backup_sipintar_20260523_020000.sql",
    size: "12.1 MB",
    createdAt: "2026-05-23 02:00:00",
    type: "otomatis",
    status: "gagal",
  },
  {
    id: "5",
    filename: "backup_sipintar_20260522_020000.sql",
    size: "11.9 MB",
    createdAt: "2026-05-22 02:00:00",
    type: "otomatis",
    status: "berhasil",
  },
];

export default function BackupRestore() {
  const [backups, setBackups] = useState<BackupItem[]>(mockBackups);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreTarget, setRestoreTarget] = useState<BackupItem | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBackupNow = () => {
    setIsBackingUp(true);
    // Simulasi proses backup
    setTimeout(() => {
      const now = new Date();
      const timestamp = now.toISOString().replace(/[-:T]/g, "").slice(0, 14);
      const newBackup: BackupItem = {
        id: String(Date.now()),
        filename: `backup_sipintar_${timestamp}.sql`,
        size: "12.5 MB",
        createdAt: now.toLocaleString("sv-SE").replace("T", " "),
        type: "manual",
        status: "berhasil",
      };
      setBackups((prev) => [newBackup, ...prev]);
      setIsBackingUp(false);
      showToast("Backup berhasil dibuat!", "success");
    }, 2000);
  };

  const handleRestore = (item: BackupItem) => {
    setRestoreTarget(item);
    setShowRestoreConfirm(true);
  };

  const confirmRestore = () => {
    setShowRestoreConfirm(false);
    setIsRestoring(true);
    // Simulasi proses restore
    setTimeout(() => {
      setIsRestoring(false);
      setRestoreTarget(null);
      showToast(`Database berhasil di-restore dari ${restoreTarget?.filename}`, "success");
    }, 3000);
  };

  const handleDownload = (item: BackupItem) => {
    showToast(`Mengunduh ${item.filename}...`, "success");
  };

  const handleDelete = (item: BackupItem) => {
    if (!confirm(`Hapus backup "${item.filename}"?`)) return;
    setBackups((prev) => prev.filter((b) => b.id !== item.id));
    showToast("Backup berhasil dihapus", "success");
  };

  return (
    <>
      <PageMeta title="Backup & Restore" description="Kelola backup dan restore database" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Backup & Restore
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Kelola backup database dan restore data sistem
            </p>
          </div>
          <Button size="sm" onClick={handleBackupNow} disabled={isBackingUp} className="gap-1.5">
            {isBackingUp ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Memproses...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                </svg>
                Backup Sekarang
              </>
            )}
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/20">
                <svg className="h-5 w-5 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 4v4h8V4" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Backup</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">{backups.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success-50 dark:bg-success-900/20">
                <svg className="h-5 w-5 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Backup Terakhir</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {backups.length > 0 ? backups[0].createdAt : "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning-50 dark:bg-warning-900/20">
                <svg className="h-5 w-5 text-warning-600 dark:text-warning-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Jadwal Otomatis</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">Setiap hari, 02:00 WIB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Backup List */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">Riwayat Backup</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nama File
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ukuran
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Waktu
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {backups.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
                        </svg>
                        <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                          {item.filename}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{item.size}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{item.createdAt}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.type === "otomatis"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                            : "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                        }`}
                      >
                        {item.type === "otomatis" ? "Otomatis" : "Manual"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.status === "berhasil"
                            ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400"
                            : "bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400"
                        }`}
                      >
                        {item.status === "berhasil" ? "Berhasil" : "Gagal"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {item.status === "berhasil" && (
                          <>
                            <button
                              onClick={() => handleRestore(item)}
                              className="p-1.5 rounded-md text-warning-600 hover:bg-warning-50 dark:hover:bg-warning-900/20 transition-colors"
                              title="Restore"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDownload(item)}
                              className="p-1.5 rounded-md text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                              title="Download"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
                              </svg>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-md text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                          title="Hapus"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {backups.length === 0 && (
            <div className="px-5 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Belum ada data backup</p>
            </div>
          )}
        </div>
      </div>

      {/* Restore Confirmation Modal */}
      {showRestoreConfirm && restoreTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-warning-50 dark:bg-warning-900/20">
                <svg className="h-5 w-5 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  Konfirmasi Restore
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-warning-50/50 dark:bg-warning-900/10 border border-warning-200 dark:border-warning-800/30 p-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Anda akan me-restore database dari backup:
              </p>
              <p className="text-xs font-mono text-warning-700 dark:text-warning-400 mt-1">
                {restoreTarget.filename}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                ⚠️ Semua data saat ini akan diganti dengan data dari backup ini. Pastikan Anda sudah membuat backup terbaru sebelum melanjutkan.
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                variant="primary"
                className="gap-1.5 bg-warning-600 hover:bg-warning-700"
                onClick={confirmRestore}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Ya, Restore
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => { setShowRestoreConfirm(false); setRestoreTarget(null); }}
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Restoring Overlay */}
      {isRestoring && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl p-8 text-center space-y-4">
            <svg className="animate-spin h-10 w-10 mx-auto text-brand-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">Sedang me-restore database...</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mohon tunggu, jangan tutup halaman ini</p>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium ${
              toast.type === "success"
                ? "bg-success-50 border-success-200 text-success-800 dark:bg-success-900/30 dark:border-success-800 dark:text-success-300"
                : "bg-error-50 border-error-200 text-error-800 dark:bg-error-900/30 dark:border-error-800 dark:text-error-300"
            }`}
          >
            {toast.type === "success" ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}
    </>
  );
}
