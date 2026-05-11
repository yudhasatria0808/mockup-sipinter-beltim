import type { GeneralSetting } from "../../types/generalSetting";

export const mockGeneralSettings: GeneralSetting[] = [
  { id: "1", key: "APP_NAME", value: "Sistem Informasi Konflik", deskripsi: "Nama aplikasi yang ditampilkan" },
  { id: "2", key: "APP_VERSION", value: "1.0.0", deskripsi: "Versi aplikasi saat ini" },
  { id: "3", key: "MAX_UPLOAD_SIZE", value: "10", deskripsi: "Ukuran maksimal upload file (MB)" },
  { id: "4", key: "SESSION_TIMEOUT", value: "30", deskripsi: "Durasi sesi login (menit)" },
  { id: "5", key: "DEFAULT_LANGUAGE", value: "id", deskripsi: "Bahasa default aplikasi" },
  { id: "6", key: "PAGINATION_SIZE", value: "10", deskripsi: "Jumlah data per halaman" },
  { id: "7", key: "CONTACT_EMAIL", value: "admin@example.com", deskripsi: "Email kontak administrator" },
  { id: "8", key: "MAINTENANCE_MODE", value: "false", deskripsi: "Mode pemeliharaan sistem" },
];
