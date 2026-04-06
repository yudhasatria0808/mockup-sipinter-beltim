import type { LevelKemungkinan, LevelDampak, LevelRisiko, MatriksRisiko } from "../../types/risiko-matriks";

export const mockLevelKemungkinan: LevelKemungkinan[] = [
  { id: "k1", nama: "Sangat Jarang", skor: 1, deskripsi: "Kejadian hampir tidak pernah terjadi, kemungkinan < 10%" },
  { id: "k2", nama: "Jarang", skor: 2, deskripsi: "Kejadian kadang terjadi, kemungkinan 10%–30%" },
  { id: "k3", nama: "Sedang", skor: 3, deskripsi: "Kejadian cukup sering terjadi, kemungkinan 30%–60%" },
  { id: "k4", nama: "Sering", skor: 4, deskripsi: "Kejadian sering terjadi, kemungkinan 60%–90%" },
  { id: "k5", nama: "Sangat Sering", skor: 5, deskripsi: "Kejadian hampir pasti terjadi, kemungkinan > 90%" },
];

export const mockLevelDampak: LevelDampak[] = [
  { id: "d1", nama: "Tidak Signifikan", skor: 1, deskripsi: "Dampak sangat kecil, tidak mempengaruhi operasional" },
  { id: "d2", nama: "Minor", skor: 2, deskripsi: "Dampak kecil, gangguan operasional ringan dan mudah dipulihkan" },
  { id: "d3", nama: "Moderat", skor: 3, deskripsi: "Dampak sedang, gangguan operasional yang memerlukan perhatian" },
  { id: "d4", nama: "Mayor", skor: 4, deskripsi: "Dampak besar, kerugian signifikan dan sulit dipulihkan" },
  { id: "d5", nama: "Katastrofik", skor: 5, deskripsi: "Dampak sangat besar, mengancam keberlangsungan organisasi" },
];

export const mockLevelRisiko: LevelRisiko[] = [
  { id: "r1", nama: "Sangat Rendah", warna: "#22c55e", skorMin: 1, skorMax: 4 },
  { id: "r2", nama: "Rendah", warna: "#84cc16", skorMin: 5, skorMax: 8 },
  { id: "r3", nama: "Sedang", warna: "#eab308", skorMin: 9, skorMax: 12 },
  { id: "r4", nama: "Tinggi", warna: "#f97316", skorMin: 13, skorMax: 19 },
  { id: "r5", nama: "Sangat Tinggi", warna: "#ef4444", skorMin: 20, skorMax: 25 },
];

// Mapping: skor kemungkinan × skor dampak → level risiko id
// Skor = kemungkinan.skor × dampak.skor
function getLevelRisikoId(skorKemungkinan: number, skorDampak: number): string {
  const skor = skorKemungkinan * skorDampak;
  if (skor <= 4) return "r1";
  if (skor <= 8) return "r2";
  if (skor <= 12) return "r3";
  if (skor <= 19) return "r4";
  return "r5";
}

export const mockMatriks: MatriksRisiko[] = mockLevelKemungkinan.flatMap((k) =>
  mockLevelDampak.map((d) => ({
    kemungkinanId: k.id,
    dampakId: d.id,
    levelRisikoId: getLevelRisikoId(k.skor, d.skor),
  }))
);
