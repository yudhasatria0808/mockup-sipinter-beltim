import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { useAuth, type UserRole } from "../context/AuthContext";
import {
  HorizontaLDots,
  GridIcon,
  PlugInIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BoxCubeIcon,
  FolderIcon,
  PieChartIcon,
  AlertIcon,
  BoltIcon,
} from "../icons";

interface NavItem {
  label: string;
  path: string;
}

interface NavGroup {
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
  roles?: UserRole[];
}

const navGroups: NavGroup[] = [
  {
    label: "Admin",
    icon: <BoxCubeIcon />,
    roles: ["administrator"],
    items: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Roles", path: "/roles" },
      { label: "Users", path: "/users" },
      { label: "Audit Trail", path: "/audit-trail" },
    ],
  },
  {
    label: "Master Data",
    icon: <FolderIcon />,
    roles: ["administrator"],
    items: [
      { label: "Aspek", path: "/aspek" },
      { label: "Jenis Konflik", path: "/jenis-konflik" },
      { label: "Instansi", path: "/instansi" },
      { label: "Wilayah", path: "/wilayah" },
    ],
  },
  {
    label: "Matriks Risiko",
    icon: <PieChartIcon />,
    roles: ["administrator"],
    items: [
      { label: "Level Kemungkinan", path: "/risiko/kemungkinan" },
      { label: "Level Dampak", path: "/risiko/dampak" },
      { label: "Level Risiko", path: "/risiko/level" },
      { label: "Matriks Risiko", path: "/risiko/matriks" },
    ],
  },
  {
    label: "Kewaspadaan Dini",
    icon: <AlertIcon />,
    roles: ["operator", "administrator"],
    items: [
      { label: "Form Kewaspadaan Dini", path: "/kewaspadaan" },
      { label: "EWS Dashboard", path: "/ews" },
    ],
  },
  {
    label: "Potensi Konflik",
    icon: <AlertIcon />,
    roles: ["operator", "administrator"],
    items: [
      { label: "Form Potensi Konflik", path: "/potensi-konflik" },
      { label: "EWS Potensi Konflik", path: "/ews/potensi-konflik" },
    ],
  },
  {
    label: "Peristiwa Konflik",
    icon: <AlertIcon />,
    roles: ["operator", "administrator"],
    items: [
      { label: "Form Peristiwa Konflik", path: "/peristiwa-konflik" },
      { label: "EWS Peristiwa Konflik", path: "/ews/peristiwa-konflik" },
    ],
  },
  {
    label: "Warga Negara Asing",
    icon: <PlugInIcon />,
    roles: ["operator", "administrator"],
    items: [
      { label: "Form WNA", path: "/wna" },
      { label: "EWS WNA", path: "/ews/wna" },
    ],
  },
  {
    label: "Tenaga Kerja Asing",
    icon: <PlugInIcon />,
    roles: ["operator", "administrator"],
    items: [
      { label: "Form TKA", path: "/tka" },
      { label: "EWS TKA", path: "/ews/tka" },
    ],
  },
  {
    label: "Monitoring & EWS",
    icon: <PieChartIcon />,
    roles: ["user"],
    items: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "EWS Kewaspadaan Dini", path: "/ews" },
      { label: "EWS Potensi Konflik", path: "/ews/potensi-konflik" },
      { label: "EWS Peristiwa Konflik", path: "/ews/peristiwa-konflik" },
      { label: "EWS WNA", path: "/ews/wna" },
      { label: "EWS TKA", path: "/ews/tka" },
    ],
  },
  {
    label: "Tindak Lanjut",
    icon: <BoxCubeIcon />,
    roles: ["user", "administrator"],
    items: [
      { label: "Keputusan & Tindak Lanjut", path: "/tindak-lanjut" },
    ],
  },
  {
    label: "Laporan & Notifikasi",
    icon: <FolderIcon />,
    items: [
      { label: "Notifikasi", path: "/notifikasi" },
      { label: "Laporan Periodik", path: "/laporan" },
    ],
  },
  {
    label: "Pengaturan",
    icon: <BoltIcon />,
    roles: ["administrator"],
    items: [
      { label: "General Setting", path: "/general-setting" },
      { label: "Pengaturan Tampilan", path: "/pengaturan-tampilan" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();
  const isExpand = isExpanded || isHovered || isMobileOpen;

  const visibleGroups = navGroups.filter(
    (group) => !group.roles || group.roles.includes(user.role)
  );

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(navGroups.map((g) => [g.label, true]))
  );

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const isGroupActive = (group: NavGroup) =>
    group.items.some((item) => isActive(item.path));

  const toggleGroup = (label: string) => {
    if (!isExpand) return;
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside
      className={`fixed top-0 left-0 px-4 h-screen transition-all duration-300 ease-in-out z-50 border-r border-primary-100/60 bg-gradient-to-b from-white via-primary-25/50 to-primary-50/30 dark:border-gray-800 dark:from-gray-900 dark:via-gray-900 dark:to-primary-950/30
        ${isExpand ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className={`py-6 flex ${!isExpand ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/" className="flex items-center gap-3">
          <img className="h-8" src="/images/logo/logo-beltim.png" alt="Logo Belitung Timur" />
          {isExpand && (
            <span className="text-sm font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent dark:from-primary-300 dark:to-primary-500">SIPINTAR</span>
          )}
        </Link>
      </div>

      {/* Role indicator */}
      {isExpand && (
        <div className="mb-4 rounded-xl bg-gradient-to-r from-primary-50 to-primary-25 px-3 py-2.5 dark:from-primary-500/10 dark:to-primary-500/5 border border-primary-100/50 dark:border-primary-500/10">
          <p className="text-[10px] uppercase tracking-wider text-primary-500/80 dark:text-primary-400/70 font-semibold">Level Akses</p>
          <p className="text-xs font-semibold text-primary-800 dark:text-primary-300 mt-0.5">{user.roleName}</p>
        </div>
      )}

      <div className="flex flex-col overflow-y-auto no-scrollbar h-[calc(100vh-140px)]">
        <nav className="flex flex-col gap-0.5">
          {visibleGroups.map((group) => {
            const isOpen = openGroups[group.label];
            const groupActive = isGroupActive(group);

            return (
              <div key={group.label} className="mb-1">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.label)}
                  title={!isExpand ? group.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer
                    ${groupActive
                      ? "text-primary-700 dark:text-primary-400 bg-primary-50/70 dark:bg-primary-500/10 shadow-sm shadow-primary-100/50 dark:shadow-none"
                      : "text-gray-500 dark:text-gray-400 hover:bg-primary-25/60 dark:hover:bg-gray-800/50 hover:text-gray-800 dark:hover:text-gray-200"
                    }
                    ${!isExpand ? "lg:justify-center" : "justify-between"}
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`shrink-0 size-5 ${groupActive ? "text-primary-600 dark:text-primary-400" : ""}`}>
                      {group.icon}
                    </span>
                    {isExpand && (
                      <span className="text-xs font-semibold uppercase tracking-wider truncate">
                        {group.label}
                      </span>
                    )}
                  </div>
                  {isExpand && (
                    <span className="shrink-0 transition-transform duration-200">
                      {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </span>
                  )}
                  {!isExpand && (
                    <span className="sr-only">{group.label}</span>
                  )}
                </button>

                {/* Collapsed: show dots separator */}
                {!isExpand && (
                  <div className="flex justify-center my-1 text-gray-300 dark:text-gray-700">
                    <HorizontaLDots className="size-4" />
                  </div>
                )}

                {/* Items */}
                <div
                  className={`overflow-hidden transition-all duration-200 ease-in-out ${
                    isOpen || !isExpand ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <ul className={`flex flex-col gap-0.5 ${isExpand ? "pl-3 mt-1 mb-2" : "mb-2"}`}>
                    {group.items.map((item) => {
                      const active = isActive(item.path);
                      return (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            className={`relative flex items-center w-full gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm transition-all duration-200 group
                              ${active
                                ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md shadow-primary-600/25 dark:from-primary-600 dark:to-primary-800 dark:shadow-primary-600/15"
                                : "text-gray-600 hover:bg-primary-50/60 hover:text-primary-800 dark:text-gray-400 dark:hover:bg-primary-500/5 dark:hover:text-primary-300"
                              }`}
                          >
                            <span className={`shrink-0 ${active ? "text-white/80" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`}>
                              {item.path === "/dashboard" ? <PlugInIcon /> : <GridIcon />}
                            </span>
                            {isExpand && (
                              <span className="truncate">{item.label}</span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
