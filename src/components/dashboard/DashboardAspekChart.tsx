import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { AspekDistribusi } from "../../services/dashboardService";

interface DashboardAspekChartProps {
  data: AspekDistribusi[];
  loading: boolean;
}

export default function DashboardAspekChart({ data, loading }: DashboardAspekChartProps) {
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

  const labels = data.map((d) => d.aspek);
  const series = data.map((d) => d.total);

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'Outfit, sans-serif',
    },
    labels,
    colors: ['#3b82f6', '#ef4444', '#f59e0b', '#22c55e', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'],
    legend: {
      position: 'bottom',
      fontSize: '12px',
      markers: { size: 4, shape: 'circle' as const },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
      style: { fontSize: '11px', fontWeight: 600 },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            name: { show: true, fontSize: '13px' },
            value: { show: true, fontSize: '18px', fontWeight: 700 },
            total: {
              show: true,
              label: 'Total',
              fontSize: '12px',
              formatter: (w) => {
                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString();
              },
            },
          },
        },
      },
    },
    tooltip: {
      y: { formatter: (val: number) => `${val} laporan` },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { height: 250 },
          legend: { position: 'bottom' },
        },
      },
    ],
  };

  const isEmpty = series.length === 0 || series.every((s) => s === 0);

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-500/10">
          <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Distribusi per Aspek
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Kewaspadaan & Potensi Konflik
          </p>
        </div>
      </div>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <svg className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          </svg>
          <span className="text-sm">Belum ada data</span>
        </div>
      ) : (
        <Chart options={options} series={series} type="donut" height={280} />
      )}
    </div>
  );
}
