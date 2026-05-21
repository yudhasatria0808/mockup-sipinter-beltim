import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { MapKecamatanData } from "../../services/dashboardService";

interface DashboardKecamatanChartProps {
  data: MapKecamatanData[];
  loading: boolean;
}

export default function DashboardKecamatanChart({ data, loading }: DashboardKecamatanChartProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/80">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-48 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-[280px] rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  const categories = data.map((d) => d.kecamatan);
  const series = [
    { name: 'Kewaspadaan', data: data.map((d) => d.kewaspadaan) },
    { name: 'Potensi Konflik', data: data.map((d) => d.potensiKonflik) },
    { name: 'Peristiwa Konflik', data: data.map((d) => d.peristiwaKonflik) },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      fontFamily: 'Outfit, sans-serif',
      toolbar: { show: false },
      stacked: true,
    },
    colors: ['#3b82f6', '#f59e0b', '#ef4444'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      labels: {
        style: { fontSize: '11px', colors: '#6b7280' },
        rotate: -45,
        rotateAlways: data.length > 5,
      },
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

  const isEmpty = data.length === 0;

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-500/10">
          <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Distribusi per Kecamatan
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Jumlah laporan berdasarkan wilayah
          </p>
        </div>
      </div>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <svg className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-sm">Belum ada data</span>
        </div>
      ) : (
        <Chart options={options} series={series} type="bar" height={280} />
      )}
    </div>
  );
}
