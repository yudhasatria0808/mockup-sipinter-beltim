export type TipeWilayah = "Provinsi" | "Kabupaten" | "Kota" | "Kecamatan" | "Kelurahan" | "Desa";

export interface Wilayah {
  id: string;
  tipe: TipeWilayah;
  nama: string;
  kode_bps: string;
  parent_id: string | null;
  latitude?: number | null;
  longitude?: number | null;
}
