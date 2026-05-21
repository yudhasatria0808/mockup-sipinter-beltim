import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { HeatmapMatrixData } from "../../services/dashboardService";

interface DashboardHeatmapProps {
  onSelectKecamatan: (nama: string | null) => void;
  matrixData: HeatmapMatrixData | null;
  loading?: boolean;
}

export default function DashboardHeatmap({ onSelectKecamatan, matrixData, loading }: DashboardHeatmapProps) {
  if (loading || !matrixData) {
    return (
      <div className="animate-pulse">
        <div className="h-[320px] rounded-lg bg-gray-100 dark:bg-gray-800" />
      </div>
    );
  }

  const { aspekList, kecamatanList, matrix } = matrixData;

  // If no data, show empty state
  if (aspekList.length === 0 || kecamatanList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <svg className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
        <span className="text-sm">Belum ada data heatmap</span>
        <span className="text-xs mt-1">Data akan muncul setelah ada laporan yang disetujui</span>
      </div>
    );
  }

  // Transform data for ApexCharts heatmap
  // Each series = one aspek (row), data points = kecamatan (columns)
  const series = aspekList.map((aspek) => {
    const row = matrix.find((m) => m.aspek === aspek);
    return {
      name: aspek,
      data: kecamatanList.map((kec) => ({
        x: kec,
        y: (row ? (row[kec] as number) : 0) || 0,
      })),
    };
  });

  const options: ApexOptions = {
    chart: {
      type: "heatmap",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      events: {
        dataPointSelection: (_event, _chartContext, config) => {
          const kecamatan = kecamatanList[config.dataPointIndex] ?? null;
          onSelectKecamatan(kecamatan);
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: "12px", fontWeight: 600 },
    },
    colors: ["#ef4444"],
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 4,
        colorScale: {
          ranges: [
            { from: 0, to: 0, name: "Tidak ada", color: "#e5e7eb" },
            { from: 1, to: 1, name: "Rendah", color: "#86efac" },
            { from: 2, to: 2, name: "Sedang", color: "#fde047" },
            { from: 3, to: 4, name: "Tinggi", color: "#f97316" },
            { from: 5, to: 100, name: "Sangat Tinggi", color: "#ef4444" },
          ],
        },
      },
    },
    xaxis: {
      labels: {
        style: { fontSize: "11px", colors: "#6b7280" },
        rotate: -45,
        rotateAlways: true,
      },
    },
    yaxis: {
      labels: { style: { fontSize: "11px", colors: "#6b7280" } },
    },
    tooltip: {
      y: { formatter: (val: number) => `${val} kejadian` },
    },
    legend: {
      show: true,
      position: "bottom",
      fontSize: "12px",
    },
  };

  return (
    <div className="max-w-full overflow-x-auto">
      <Chart options={options} series={series} type="heatmap" height={320} />
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
        Klik sel untuk filter berdasarkan kecamatan
      </p>
    </div>
  );
}
