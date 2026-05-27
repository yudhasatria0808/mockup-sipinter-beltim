import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../context/AuthContext";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <PageMeta
        title="SIPINTAR | Sistem Informasi Kewaspadaan Dini"
        description="Sistem Informasi Kewaspadaan Dini Kabupaten Belitung Timur"
      />
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
        {/* Background SVG pattern - more visible */}
        <div className="absolute inset-0">
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1400 900"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Animated pulsing circles */}
            <circle cx="1100" cy="200" r="200" fill="none" stroke="rgba(185,28,28,0.12)" strokeWidth="1.5">
              <animate attributeName="r" values="200;240;200" dur="8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;1;0.8" dur="8s" repeatCount="indefinite" />
            </circle>
            <circle cx="1100" cy="200" r="280" fill="none" stroke="rgba(185,28,28,0.07)" strokeWidth="1">
              <animate attributeName="r" values="280;310;280" dur="10s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="700" r="160" fill="none" stroke="rgba(212,160,23,0.12)" strokeWidth="1.5">
              <animate attributeName="r" values="160;190;160" dur="9s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;1;0.8" dur="9s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="700" r="230" fill="none" stroke="rgba(212,160,23,0.06)" strokeWidth="1">
              <animate attributeName="r" values="230;260;230" dur="12s" repeatCount="indefinite" />
            </circle>
            <circle cx="700" cy="450" r="250" fill="none" stroke="rgba(185,28,28,0.06)" strokeWidth="0.8">
              <animate attributeName="r" values="250;280;250" dur="15s" repeatCount="indefinite" />
            </circle>

            {/* Animated flowing wave lines */}
            <path
              d="M0,200 Q350,150 700,200 T1400,200"
              fill="none"
              stroke="rgba(185,28,28,0.12)"
              strokeWidth="1.5"
            >
              <animate
                attributeName="d"
                values="M0,200 Q350,150 700,200 T1400,200;M0,200 Q350,250 700,200 T1400,200;M0,200 Q350,150 700,200 T1400,200"
                dur="8s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M0,450 Q350,400 700,450 T1400,450"
              fill="none"
              stroke="rgba(212,160,23,0.1)"
              strokeWidth="1.2"
            >
              <animate
                attributeName="d"
                values="M0,450 Q350,400 700,450 T1400,450;M0,450 Q350,500 700,450 T1400,450;M0,450 Q350,400 700,450 T1400,450"
                dur="10s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M0,700 Q350,650 700,700 T1400,700"
              fill="none"
              stroke="rgba(185,28,28,0.08)"
              strokeWidth="1"
            >
              <animate
                attributeName="d"
                values="M0,700 Q350,650 700,700 T1400,700;M0,700 Q350,750 700,700 T1400,700;M0,700 Q350,650 700,700 T1400,700"
                dur="12s"
                repeatCount="indefinite"
              />
            </path>

            {/* Diagonal lines - static but visible */}
            <line x1="0" y1="100" x2="1400" y2="50" stroke="rgba(185,28,28,0.06)" strokeWidth="1" />
            <line x1="0" y1="550" x2="1400" y2="480" stroke="rgba(185,28,28,0.05)" strokeWidth="0.8" />
            <line x1="0" y1="850" x2="1400" y2="780" stroke="rgba(212,160,23,0.05)" strokeWidth="0.8" />

            {/* Rotating shapes */}
            <rect
              x="1220" y="550" width="60" height="60"
              fill="none"
              stroke="rgba(185,28,28,0.12)"
              strokeWidth="1.2"
              rx="8"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 1250 580;360 1250 580"
                dur="25s"
                repeatCount="indefinite"
              />
            </rect>
            <rect
              x="80" y="280" width="45" height="45"
              fill="none"
              stroke="rgba(212,160,23,0.12)"
              strokeWidth="1"
              rx="6"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="360 102 302;0 102 302"
                dur="20s"
                repeatCount="indefinite"
              />
            </rect>
            <polygon
              points="700,60 730,100 700,140 670,100"
              fill="none"
              stroke="rgba(185,28,28,0.12)"
              strokeWidth="1.2"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 700 100;360 700 100"
                dur="18s"
                repeatCount="indefinite"
              />
            </polygon>
            <polygon
              points="1300,750 1330,790 1300,830 1270,790"
              fill="none"
              stroke="rgba(212,160,23,0.1)"
              strokeWidth="1"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 1300 790;-360 1300 790"
                dur="22s"
                repeatCount="indefinite"
              />
            </polygon>
            <polygon
              points="400,780 430,820 370,820"
              fill="none"
              stroke="rgba(185,28,28,0.08)"
              strokeWidth="1"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 400 800;360 400 800"
                dur="30s"
                repeatCount="indefinite"
              />
            </polygon>

            {/* Dotted grid */}
            {Array.from({ length: 10 }).map((_, row) =>
              Array.from({ length: 16 }).map((_, col) => (
                <circle
                  key={`dot-${row}-${col}`}
                  cx={50 + col * 88}
                  cy={50 + row * 88}
                  r="1.3"
                  fill="rgba(185,28,28,0.05)"
                />
              ))
            )}

            {/* Corner accents */}
            <path d="M0,0 L140,0 L0,140 Z" fill="rgba(185,28,28,0.04)" />
            <path d="M1400,900 L1260,900 L1400,760 Z" fill="rgba(212,160,23,0.04)" />
          </svg>
        </div>

        {/* Gradient blobs - slightly more visible */}
        <div className="absolute top-[-10%] right-[10%] w-[35%] h-[35%] rounded-full bg-primary-500/8 blur-[100px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-gold-400/8 blur-[80px]" />
        <div className="absolute top-[40%] left-[50%] w-[25%] h-[25%] rounded-full bg-primary-400/5 blur-[70px]" />

        {/* Navbar */}
        <nav className="relative z-20">
          <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo/logo-beltim.png"
                alt="Logo"
                className="h-10 w-auto"
              />
              <div>
                <span className="text-lg font-bold text-gray-900">SIPINTAR</span>
                <span className="hidden sm:inline text-sm text-gray-500 ml-2">Kabupaten Belitung Timur</span>
              </div>
            </div>
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-300 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Masuk
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 mx-auto max-w-7xl px-6 pt-12 pb-20 lg:pt-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left - Text */}
            <div
              className={`flex-1 transition-all duration-1000 ${
                mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Sistem Informasi{" "}
                <span className="text-primary-600">Kewaspadaan Dini</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
                Platform komprehensif untuk deteksi dini, pemantauan potensi konflik, 
                pengelolaan peristiwa, dan pelaporan WNA & TKA secara real-time 
                di wilayah <strong>Kabupaten Belitung Timur</strong>.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/signin"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-300 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Akses Sistem
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-500 mt-0.5">Monitoring</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">Real-time</div>
                  <div className="text-sm text-gray-500 mt-0.5">Pelaporan</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">Terpadu</div>
                  <div className="text-sm text-gray-500 mt-0.5">Terintegrasi</div>
                </div>
              </div>
            </div>

            {/* Right - Logo with glass effect */}
            <div
              className={`flex-shrink-0 transition-all duration-1000 delay-300 ${
                mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
              }`}
            >
              <div className="relative">
                {/* Glow behind */}
                <div className="absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-primary-500/20 via-primary-300/10 to-gold-400/15 blur-3xl" />
                
                {/* Logo without card background */}
                <img
                  src="/images/logo/logo-aplikasi.png"
                  alt="SIPINTAR Belitung Timur"
                  className="relative h-52 sm:h-60 lg:h-72 w-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Partner logos section */}
        <section className="relative z-10 border-t border-gray-200/60 bg-white/30 backdrop-blur-sm py-10">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-center text-lg font-semibold text-gray-700 mb-8">
              ~ <span className="text-primary-600">BELTIM</span> PRESISI ~
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              <img src="/images/logo/logo-beltim.png" alt="Beltim" className="h-12 w-auto transition-transform duration-300 hover:scale-110" />
              <img src="/images/logo/LOGO KESBANGPOL BELTIM.png" alt="Kesbangpol" className="h-12 w-auto transition-transform duration-300 hover:scale-110" />
              <img src="/images/logo/LOGO KODIM.png" alt="Kodim" className="h-12 w-auto transition-transform duration-300 hover:scale-110" />
              <img src="/images/logo/LOGO BIN.png" alt="BIN" className="h-12 w-auto transition-transform duration-300 hover:scale-110" />
              <img src="/images/logo/LOGO KEJAKSAAN NEGERI PNG.png" alt="Kejaksaan" className="h-12 w-auto transition-transform duration-300 hover:scale-110" />
              <img src="/images/logo/LOGO DPRD BELTIM.png" alt="DPRD" className="h-12 w-auto transition-transform duration-300 hover:scale-110" />
              <img src="/images/logo/LOGO YONIF 845.png" alt="Yonif" className="h-12 w-auto transition-transform duration-300 hover:scale-110" />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2025 SIPINTAR — Kabupaten Belitung Timur
          </p>
        </footer>
      </div>
    </>
  );
}
