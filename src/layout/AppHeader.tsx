import { useEffect, useRef, useState } from "react";

import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";

const logos = [
  { src: "/images/logo/LOGO BELTIM PNG.png", alt: "Logo Belitung Timur" },
  { src: "/images/logo/LOGO KESBANGPOL BELTIM.png", alt: "Logo Kesbangpol Beltim" },
  { src: "/images/logo/LOGO BIN.png", alt: "Logo BIN" },
  { src: "/images/logo/LOGO KODIM.png", alt: "Logo Kodim" },
  { src: "/images/logo/LOGO KEJAKSAAN NEGERI PNG.png", alt: "Logo Kejaksaan Negeri" },
  { src: "/images/logo/LOGO DPRD BELTIM.png", alt: "Logo DPRD Beltim" },
  { src: "/images/logo/LOGO LANUD PNG.png", alt: "Logo Lanud" },
  { src: "/images/logo/LOGO YONIF 845.png", alt: "Logo Yonif 845" },
];

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-2 z-99999 mx-3 lg:mx-6 rounded-2xl border border-primary-100/50 bg-white/80 backdrop-blur-xl shadow-lg shadow-primary-100/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:shadow-gray-900/30">
      <div className="flex items-center justify-between px-3 py-2 lg:px-5">
        {/* Left: Hamburger + Logos */}
        <div className="flex items-center gap-3">
          <button
            className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 transition-all hover:bg-primary-50 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-primary-400"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>

          {/* Divider */}
          <div className="hidden lg:block w-px h-8 bg-gray-200 dark:bg-gray-700" />

          {/* Logo Instansi */}
          <div className="hidden lg:flex items-center gap-1.5">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 hover:bg-primary-50/80 hover:shadow-md hover:shadow-primary-200/30 hover:scale-110 dark:hover:bg-gray-800/80 dark:hover:shadow-primary-900/20 cursor-pointer"
              >
                <img
                  className="h-7 w-7 object-contain transition-transform duration-300 group-hover:scale-110"
                  src={logo.src}
                  alt={logo.alt}
                />
                {/* Tooltip */}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1 text-[10px] font-medium text-white opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-bottom-9 pointer-events-none dark:bg-gray-700 shadow-lg">
                  {logo.alt.replace("Logo ", "")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggleButton />
          <NotificationDropdown />
          <div className="hidden lg:block w-px h-8 bg-gray-200 dark:bg-gray-700" />
          <UserDropdown />

          {/* Mobile menu toggle */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-700 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile: Logo strip (visible when menu open) */}
      {isApplicationMenuOpen && (
        <div className="flex items-center justify-center gap-2 px-3 pb-3 lg:hidden">
          {logos.map((logo, index) => (
            <img
              key={index}
              className="h-7 w-7 object-contain"
              src={logo.src}
              alt={logo.alt}
            />
          ))}
        </div>
      )}
    </header>
  );
};

export default AppHeader;
