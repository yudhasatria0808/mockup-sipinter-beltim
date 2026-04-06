export interface LevelKemungkinan {
  id: string;
  nama: string;
  skor: number; // 1–5
  deskripsi: string;
}

export interface LevelDampak {
  id: string;
  nama: string;
  skor: number; // 1–5
  deskripsi: string;
}

export interface LevelRisiko {
  id: string;
  nama: string;
  warna: string; // hex color
  skorMin: number;
  skorMax: number;
}

export interface MatriksRisiko {
  kemungkinanId: string;
  dampakId: string;
  levelRisikoId: string;
}
