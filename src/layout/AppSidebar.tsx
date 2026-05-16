import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
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
}

const navGroups: NavGroup[] = [
  {
    label: "Admin",
    icon: <BoxCubeIcon />,
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
    items: [
      { label: "Form Kewaspadaan Dini", path: "/kewaspadaan" },
      { label: "EWS Dashboard", path: "/ews" },
    ],
  },
  {
    label: "Potensi Konflik",
    icon: <AlertIcon />,
    items: [
      { label: "Form Potensi Konflik", path: "/potensi-konflik" },
      { label: "EWS Potensi Konflik", path: "/ews/potensi-konflik" },
    ],
  },
  {
    label: "Peristiwa Konflik",
    icon: <AlertIcon />,
    items: [
      { label: "Form Peristiwa Konflik", path: "/peristiwa-konflik" },
      { label: "EWS Peristiwa Konflik", path: "/ews/peristiwa-konflik" },
    ],
  },
  {
    label: "Warga Negara Asing",
    icon: <PlugInIcon />,
    items: [
      { label: "Form WNA", path: "/wna" },
      { label: "EWS WNA", path: "/ews/wna" },
    ],
  },
  {
    label: "Tenaga Kerja Asing",
    icon: <PlugInIcon />,
    items: [
      { label: "Form TKA", path: "/tka" },
      { label: "EWS TKA", path: "/ews/tka" },
    ],
  },
  {
    label: "Pengaturan",
    icon: <BoltIcon />,
    items: [
      { label: "General Setting", path: "/general-setting" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const isExpand = isExpanded || isHovered || isMobileOpen;

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
      className={`fixed top-0 left-0 px-5 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen transition-all duration-300 ease-in-out z-50
        ${isExpand ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className={`py-6 flex ${!isExpand ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/" className="flex items-center gap-3">
          {isExpand ? (
            <>
              <img className="h-8 dark:hidden" src="/images/logo/logo.svg" alt="Logo" />
              <img className="hidden h-8 dark:block" src="/images/logo/logo-dark.svg" alt="Logo" />
            </>
          ) : (
            <img className="h-8" src="/images/logo/logo-icon.svg" alt="Logo" />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto no-scrollbar h-[calc(100vh-88px)]">
        <nav className="flex flex-col gap-0.5">
          {navGroups.map((group) => {
            const isOpen = openGroups[group.label];
            const groupActive = isGroupActive(group);

            return (
              <div key={group.label} className="mb-1">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.label)}
                  title={!isExpand ? group.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer
                    ${groupActive
                      ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200"
                    }
                    ${!isExpand ? "lg:justify-center" : "justify-between"}
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`shrink-0 size-5 ${groupActive ? "text-brand-500" : ""}`}>
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
                  <ul className={`flex flex-col gap-1 ${isExpand ? "pl-3 mt-1 mb-2" : "mb-2"}`}>
                    {group.items.map((item) => {
                      const active = isActive(item.path);
                      return (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            className={`menu-item group ${active ? "menu-item-active" : "menu-item-inactive"}`}
                          >
                            <span className={`menu-item-icon-size ${active ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                              {item.path === "/dashboard" ? <PlugInIcon /> : <GridIcon />}
                            </span>
                            {isExpand && (
                              <span className="menu-item-text">{item.label}</span>
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
