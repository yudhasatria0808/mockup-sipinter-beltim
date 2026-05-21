import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { TrendItem } from "../../services/dashboardService";

interface DashboardTrendChartProps {
  data: TrendItem[];
  loading: boolean;
}

export default function DashboardTrendChart({ data, loading }: DashboardTrendChartProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/80">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-[280px] rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  const isEmpty = data.length === 0 || data.every((d) => d.kewaspadaan === 0 && d.potensiKonflik === 0 && d.peristiwaKonflik === 0);

  const categories = data.map((d) => d.bulanLabel);
  const series = [
    { name: 'Kewaspadaan Dini', data: data.map((d) => d.kewaspadaan) },
    { name: 'Potensi Konflik', data: data.map((d) => d.potensiKonflik) },
    { name: 'Peristiwa Konflik', data: data.map((d) => d.peristiwaKonflik) },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'area',
      fontFamily: 'Outfit, sans-serif',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ['#3b82f6', '#f59e0b', '#ef4444'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05, stops: [0, 90, 100] },
    },
    xaxis: {
      categories,
      labels: { style: { fontSize: '11px', colors: '#6b7280' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { fontSize: '11px', colors: '#6b7280' } },
      min: 0,
    },
    grid: {
      borderColor: '#f3f4f6',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      markers: { size: 4, shape: 'circle' as const },
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (val: number) => `${val} laporan` },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
          <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Tren Laporan 6 Bulan Terakhir
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Perbandingan jumlah laporan per kategori
          </p>
        </div>
      </div>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <svg className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <span className="text-sm">Belum ada data tren</span>
        </div>
      ) : (
        <Chart options={options} series={series} type="area" height={280} />
      )}
    </div>
  );
}
