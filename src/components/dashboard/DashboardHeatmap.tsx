import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { konflikPerAspek } from "./dashboardMockData";

interface DashboardHeatmapProps {
  onSelectKecamatan: (nama: string | null) => void;
}

const aspekLabels = ["Keamanan", "Sosial", "Politik", "Ekonomi", "Lingkungan", "Hukum"];

export default function DashboardHeatmap({ onSelectKecamatan }: DashboardHeatmapProps) {
  // Transform data for ApexCharts heatmap
  // Each series = one aspek (row), data points = kecamatan (columns)
  const series = aspekLabels.map((aspek) => ({
    name: aspek,
    data: konflikPerAspek.map((row) => ({
      x: row.kecamatan,
      y: row[aspek.toLowerCase() as keyof typeof row] as number,
    })),
  }));

  const options: ApexOptions = {
    chart: {
      type: "heatmap",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      events: {
        dataPointSelection: (_event, _chartContext, config) => {
          const kecamatan = konflikPerAspek[config.dataPointIndex]?.kecamatan ?? null;
          onSelectKecamatan(kecamatan);
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: 600,
      },
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
            { from: 3, to: 5, name: "Tinggi", color: "#ef4444" },
          ],
        },
      },
    },
    xaxis: {
      labels: {
        style: {
          fontSize: "11px",
          colors: "#6b7280",
        },
        rotate: -45,
        rotateAlways: true,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "11px",
          colors: "#6b7280",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} kejadian`,
      },
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
