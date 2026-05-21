import { useNavigate } from "react-router";

interface QuickAction {
  label: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  color: string;
}

const actions: QuickAction[] = [
  {
    label: "Kewaspadaan Dini",
    description: "Buat laporan baru",
    path: "/kewaspadaan/create",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    label: "Potensi Konflik",
    description: "Laporkan potensi",
    path: "/potensi-konflik/create",
    color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
  },
  {
    label: "Peristiwa Konflik",
    description: "Catat peristiwa",
    path: "/peristiwa-konflik/create",
    color: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-500/20",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    ),
  },
  {
    label: "EWS Dashboard",
    description: "Monitoring EWS",
    path: "/ews",
    color: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 group-hover:bg-green-100 dark:group-hover:bg-green-500/20",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: "Laporan Periodik",
    description: "Lihat laporan",
    path: "/laporan",
    color: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: "Tindak Lanjut",
    description: "Kelola keputusan",
    path: "/tindak-lanjut",
    color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-500/20",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
];

export default function DashboardQuickActions() {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
          <svg className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
          Aksi Cepat
        </h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action) => (
          <button
            key={action.path}
            onClick={() => navigate(action.path)}
            className="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 dark:border-gray-800 p-4 text-center transition-all hover:border-gray-200 hover:shadow-sm dark:hover:border-gray-700"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${action.color}`}>
              {action.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-white/80">{action.label}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
