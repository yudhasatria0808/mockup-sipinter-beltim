import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { kecamatanData } from "./dashboardMockData";

interface BelitungTimurMapProps {
  selectedKecamatan: string | null;
  onSelectKecamatan: (nama: string | null) => void;
}

// Warna marker berdasarkan jumlah konflik
function getMarkerColor(totalKonflik: number): string {
  if (totalKonflik >= 7) return "#ef4444"; // merah
  if (totalKonflik >= 5) return "#f97316"; // oranye
  if (totalKonflik >= 3) return "#eab308"; // kuning
  return "#22c55e"; // hijau
}

function getMarkerRadius(totalKonflik: number): number {
  if (totalKonflik >= 7) return 18;
  if (totalKonflik >= 5) return 15;
  if (totalKonflik >= 3) return 12;
  return 9;
}

// Simplified GeoJSON boundaries for Belitung Timur kecamatan (approximate polygons)
const kecamatanBoundaries: Record<string, L.LatLngExpression[]> = {
  Manggar: [
    [-2.82, 108.20], [-2.82, 108.35], [-2.95, 108.35], [-2.95, 108.20],
  ],
  Gantung: [
    [-2.90, 108.00], [-2.90, 108.15], [-3.02, 108.15], [-3.02, 108.00],
  ],
  Dendang: [
    [-2.72, 108.08], [-2.72, 108.22], [-2.84, 108.22], [-2.84, 108.08],
  ],
  "Kelapa Kampit": [
    [-2.76, 107.87], [-2.76, 108.02], [-2.88, 108.02], [-2.88, 107.87],
  ],
  Damar: [
    [-2.99, 108.03], [-2.99, 108.17], [-3.11, 108.17], [-3.11, 108.03],
  ],
  "Simpang Renggiang": [
    [-2.86, 107.91], [-2.86, 108.05], [-2.98, 108.05], [-2.98, 107.91],
  ],
  "Simpang Pesak": [
    [-3.04, 107.80], [-3.04, 107.95], [-3.16, 107.95], [-3.16, 107.80],
  ],
};

export default function BelitungTimurMap({ selectedKecamatan, onSelectKecamatan }: BelitungTimurMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const polygonsRef = useRef<L.Polygon[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Center of Belitung Timur
    const map = L.map(containerRef.current, {
      center: [-2.93, 108.08],
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    // Draw kecamatan boundaries
    kecamatanData.forEach((kec) => {
      const bounds = kecamatanBoundaries[kec.nama];
      if (!bounds) return;

      const polygon = L.polygon(bounds, {
        color: getMarkerColor(kec.totalKonflik),
        weight: 2,
        opacity: 0.6,
        fillColor: getMarkerColor(kec.totalKonflik),
        fillOpacity: 0.15,
      }).addTo(map);

      polygon.on("click", () => {
        onSelectKecamatan(kec.nama);
      });

      polygon.bindTooltip(kec.nama, {
        permanent: false,
        direction: "center",
        className: "kecamatan-tooltip",
      });

      polygonsRef.current.push(polygon);
    });

    // Draw circle markers for each kecamatan
    kecamatanData.forEach((kec) => {
      const color = getMarkerColor(kec.totalKonflik);
      const radius = getMarkerRadius(kec.totalKonflik);

      const marker = L.circleMarker([kec.latitude, kec.longitude], {
        radius,
        fillColor: color,
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85,
      }).addTo(map);

      marker.bindPopup(`
        <div style="min-width: 160px;">
          <strong style="font-size: 14px;">${kec.nama}</strong>
          <hr style="margin: 6px 0; border-color: #e5e7eb;" />
          <div style="font-size: 12px; line-height: 1.6;">
            <div>Total Konflik: <strong>${kec.totalKonflik}</strong></div>
            <div style="color: #ef4444;">Risiko Tinggi: ${kec.risikoTinggi}</div>
            <div style="color: #eab308;">Risiko Sedang: ${kec.risikoSedang}</div>
            <div style="color: #22c55e;">Risiko Rendah: ${kec.risikoRendah}</div>
          </div>
        </div>
      `);

      marker.on("click", () => {
        onSelectKecamatan(kec.nama);
      });

      markersRef.current.push(marker);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Highlight selected kecamatan
  useEffect(() => {
    polygonsRef.current.forEach((polygon, idx) => {
      const kec = kecamatanData[idx];
      if (!kec) return;
      const isSelected = selectedKecamatan === kec.nama;
      polygon.setStyle({
        weight: isSelected ? 4 : 2,
        opacity: isSelected ? 1 : 0.6,
        fillOpacity: isSelected ? 0.35 : 0.15,
      });
    });
  }, [selectedKecamatan]);

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
      />
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <span>≥ 7 konflik</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#f97316]" />
          <span>5–6 konflik</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#eab308]" />
          <span>3–4 konflik</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
          <span>1–2 konflik</span>
        </div>
      </div>
      {selectedKecamatan && (
        <button
          onClick={() => onSelectKecamatan(null)}
          className="text-xs text-brand-500 hover:underline"
        >
          ✕ Hapus filter kecamatan
        </button>
      )}
    </div>
  );
}
