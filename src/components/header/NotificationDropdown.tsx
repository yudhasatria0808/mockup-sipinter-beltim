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

const prioritasGlow: Record<string, string> = {
  kritis: "ring-error-500/20",
  tinggi: "ring-orange-500/20",
  sedang: "ring-warning-500/20",
  rendah: "ring-success-500/20",
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
        className="relative flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 h-11 w-11 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-750 dark:hover:text-white"
        onClick={toggleDropdown}
        aria-label="Notifikasi"
      >
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-error-400 to-error-600 text-[10px] font-bold text-white shadow-md shadow-error-500/30">
            {unreadCount > 9 ? "9+" : unreadCount}
            <span className="absolute inline-flex w-full h-full rounded-full bg-error-400 opacity-50 animate-ping"></span>
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
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[360px] flex-col rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xl shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none sm:w-[380px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
              <svg className="h-4 w-4 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h5 className="text-base font-semibold text-gray-800 dark:text-gray-200">
              Notifikasi
            </h5>
          </div>
          {unreadCount > 0 && (
            <span className="rounded-full bg-error-50 px-2.5 py-1 text-xs font-semibold text-error-600 dark:bg-error-900/20 dark:text-error-400">
              {unreadCount} baru
            </span>
          )}
        </div>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar -mx-1">
          {recentNotifs.map((notif) => {
            const isUnread = notif.status === "belum_dibaca";
            return (
              <li key={notif.id}>
                <DropdownItem
                  onItemClick={() => handleNotifClick(notif)}
                  className={`flex gap-3 rounded-xl p-3 mx-1 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                    isUnread ? "bg-brand-50/40 dark:bg-brand-900/10" : ""
                  }`}
                >
                  <span className={`relative flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ring-2 ${prioritasGlow[notif.prioritas]} bg-gray-50 dark:bg-gray-800`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${prioritasIcon[notif.prioritas]}`} />
                    {notif.prioritas === "kritis" && (
                      <span className={`absolute inset-0 rounded-xl ${prioritasIcon[notif.prioritas]} opacity-15 animate-ping`} />
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
                    <span className="flex items-center gap-2 mt-1.5 text-gray-400 text-theme-xs dark:text-gray-500">
                      <span>{notif.pengirim}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full dark:bg-gray-600"></span>
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
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750 dark:hover:border-gray-600"
        >
          Lihat Semua Notifikasi
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </Dropdown>
    </div>
  );
}
