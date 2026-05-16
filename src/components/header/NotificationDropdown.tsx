import { useState } from "react";
import { useNavigate } from "react-router";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useAuth } from "../../context/AuthContext";
import { mockNotifikasi, type Notifikasi } from "../../data/notifikasi";

const prioritasIcon: Record<string, string> = {
  kritis: "bg-error-500",
  tinggi: "bg-orange-500",
  sedang: "bg-warning-500",
  rendah: "bg-success-500",
};

function timeAgo(dateStr: string): string {
  const now = new Date("2026-05-16T10:00:00Z");
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}j lalu`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay}h lalu`;
  const diffMonth = Math.floor(diffDay / 30);
  return `${diffMonth}bln lalu`;
}

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Map role ke tujuanLevel notifikasi
  const roleToLevel = { operator: "operator", administrator: "administrator", user: "user" } as const;
  const myNotifs = mockNotifikasi.filter((n) => n.tujuanLevel === roleToLevel[user.role]);

  const unreadCount = myNotifs.filter((n) => n.status === "belum_dibaca").length;
  const recentNotifs = myNotifs.slice(0, 6);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleNotifClick = (notif: Notifikasi) => {
    closeDropdown();
    if (notif.laporanPath) {
      navigate(notif.laporanPath);
    }
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
        aria-label="Notifikasi"
      >
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-error-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
            <span className="absolute inline-flex w-full h-full bg-error-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notifikasi
          </h5>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-error-50 text-error-600 dark:bg-error-900/20 dark:text-error-400">
              {unreadCount} baru
            </span>
          )}
        </div>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {recentNotifs.map((notif) => {
            const isUnread = notif.status === "belum_dibaca";
            return (
              <li key={notif.id}>
                <DropdownItem
                  onItemClick={() => handleNotifClick(notif)}
                  className={`flex gap-3 rounded-lg border-b border-gray-100 p-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5 ${
                    isUnread ? "bg-brand-50/30 dark:bg-brand-900/10" : ""
                  }`}
                >
                  <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 shrink-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${prioritasIcon[notif.prioritas]}`} />
                    {notif.prioritas === "kritis" && (
                      <span className={`absolute inset-0 rounded-full ${prioritasIcon[notif.prioritas]} opacity-20 animate-ping`} />
                    )}
                  </span>

                  <span className="block min-w-0 flex-1">
                    <span className="mb-1 block text-theme-sm text-gray-500 dark:text-gray-400">
                      <span className={`font-medium ${isUnread ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                        {notif.judul}
                      </span>
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {notif.pesan}
                    </span>
                    <span className="flex items-center gap-2 mt-1 text-gray-400 text-theme-xs dark:text-gray-500">
                      <span>{notif.pengirim}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>{timeAgo(notif.createdAt)}</span>
                    </span>
                  </span>
                </DropdownItem>
              </li>
            );
          })}
        </ul>
        <button
          onClick={() => { closeDropdown(); navigate("/notifikasi"); }}
          className="block w-full px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          Lihat Semua Notifikasi
        </button>
      </Dropdown>
    </div>
  );
}
