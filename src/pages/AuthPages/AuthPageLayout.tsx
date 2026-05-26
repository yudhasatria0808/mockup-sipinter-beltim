import React, { useEffect, useState } from "react";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

// Animated floating particles for right panel
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/30 animate-float-particle"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${Math.random() * 10 + 8}s`,
          }}
        />
      ))}
    </div>
  );
}

// Left side background - light/terang with subtle SVG
function LeftBackground() {
  return (
    <div className="absolute inset-0">
      {/* Base - slightly darker light background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-900 dark:to-primary-950" />

      {/* Soft gradient blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500/8 blur-[80px] dark:bg-primary-900/30" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gold-400/8 blur-[60px] dark:bg-primary-950/40" />
      <div className="absolute top-[50%] left-[30%] w-[30%] h-[30%] rounded-full bg-primary-400/5 blur-[60px]" />

      {/* SVG pattern - bold and variatif */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60 dark:opacity-25"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 600 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Concentric circles - top left */}
        <circle cx="80" cy="120" r="80" fill="none" stroke="rgba(185,28,28,0.2)" strokeWidth="1.2" />
        <circle cx="80" cy="120" r="120" fill="none" stroke="rgba(185,28,28,0.14)" strokeWidth="0.8" />
        <circle cx="80" cy="120" r="160" fill="none" stroke="rgba(185,28,28,0.08)" strokeWidth="0.6" />

        {/* Concentric circles - bottom right */}
        <circle cx="520" cy="880" r="70" fill="none" stroke="rgba(212,160,23,0.2)" strokeWidth="1.2" />
        <circle cx="520" cy="880" r="110" fill="none" stroke="rgba(212,160,23,0.14)" strokeWidth="0.8" />
        <circle cx="520" cy="880" r="150" fill="none" stroke="rgba(212,160,23,0.08)" strokeWidth="0.6" />

        {/* Center large ring */}
        <circle cx="300" cy="500" r="220" fill="none" stroke="rgba(185,28,28,0.07)" strokeWidth="1" />
        <circle cx="300" cy="500" r="280" fill="none" stroke="rgba(185,28,28,0.04)" strokeWidth="0.8" />

        {/* Diagonal lines - varied angles and thickness */}
        <line x1="0" y1="150" x2="600" y2="50" stroke="rgba(185,28,28,0.12)" strokeWidth="1.5" />
        <line x1="0" y1="250" x2="600" y2="180" stroke="rgba(185,28,28,0.06)" strokeWidth="0.8" />
        <line x1="0" y1="400" x2="600" y2="320" stroke="rgba(185,28,28,0.1)" strokeWidth="1.2" />
        <line x1="0" y1="550" x2="600" y2="480" stroke="rgba(212,160,23,0.08)" strokeWidth="1" />
        <line x1="0" y1="700" x2="600" y2="620" stroke="rgba(185,28,28,0.1)" strokeWidth="1.2" />
        <line x1="0" y1="850" x2="600" y2="780" stroke="rgba(185,28,28,0.06)" strokeWidth="0.8" />
        <line x1="0" y1="950" x2="600" y2="870" stroke="rgba(212,160,23,0.1)" strokeWidth="1.5" />

        {/* Cross-hatch lines (opposite direction) */}
        <line x1="600" y1="100" x2="0" y2="250" stroke="rgba(185,28,28,0.05)" strokeWidth="0.6" />
        <line x1="600" y1="400" x2="0" y2="550" stroke="rgba(212,160,23,0.05)" strokeWidth="0.6" />
        <line x1="600" y1="700" x2="0" y2="850" stroke="rgba(185,28,28,0.05)" strokeWidth="0.6" />

        {/* Horizontal accent lines */}
        <line x1="50" y1="300" x2="250" y2="300" stroke="rgba(185,28,28,0.1)" strokeWidth="1" />
        <line x1="350" y1="650" x2="550" y2="650" stroke="rgba(212,160,23,0.1)" strokeWidth="1" />
        <line x1="100" y1="800" x2="300" y2="800" stroke="rgba(185,28,28,0.08)" strokeWidth="0.8" />

        {/* Small decorative squares */}
        <rect x="450" y="150" width="40" height="40" fill="none" stroke="rgba(212,160,23,0.15)" strokeWidth="1" rx="4" transform="rotate(15 470 170)" />
        <rect x="100" y="600" width="30" height="30" fill="none" stroke="rgba(185,28,28,0.12)" strokeWidth="1" rx="3" transform="rotate(-10 115 615)" />
        <rect x="400" y="500" width="25" height="25" fill="none" stroke="rgba(185,28,28,0.1)" strokeWidth="0.8" rx="2" transform="rotate(30 412 512)" />

        {/* Diamond shapes */}
        <polygon points="300,80 320,100 300,120 280,100" fill="none" stroke="rgba(185,28,28,0.15)" strokeWidth="1" />
        <polygon points="150,450 170,470 150,490 130,470" fill="none" stroke="rgba(212,160,23,0.12)" strokeWidth="1" />
        <polygon points="480,700 500,720 480,740 460,720" fill="none" stroke="rgba(185,28,28,0.12)" strokeWidth="1" />

        {/* Triangle accents */}
        <polygon points="500,250 530,290 470,290" fill="none" stroke="rgba(212,160,23,0.12)" strokeWidth="1" />
        <polygon points="80,900 110,940 50,940" fill="none" stroke="rgba(185,28,28,0.1)" strokeWidth="1" />

        {/* Dotted grid */}
        {Array.from({ length: 12 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => (
            <circle
              key={`ldot-${row}-${col}`}
              cx={40 + col * 72}
              cy={40 + row * 80}
              r="1.5"
              fill="rgba(185,28,28,0.07)"
            />
          ))
        )}

        {/* Corner accents - larger */}
        <path d="M0,0 L120,0 L0,120 Z" fill="rgba(185,28,28,0.04)" />
        <path d="M600,1000 L480,1000 L600,880 Z" fill="rgba(212,160,23,0.04)" />
        <path d="M600,0 L600,80 L520,0 Z" fill="rgba(212,160,23,0.03)" />
        <path d="M0,1000 L0,920 L80,1000 Z" fill="rgba(185,28,28,0.03)" />
      </svg>
    </div>
  );
}

// Right side background - bold animated SVG (kept as-is)
function RightBackground() {
  return (
    <div className="absolute inset-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900" />

      {/* Animated gradient blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary-700/40 blur-[100px] animate-orb-drift" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary-800/30 blur-[80px] animate-orb-drift-reverse" />
        <div className="absolute top-[30%] right-[10%] w-[50%] h-[50%] rounded-full bg-gold-600/15 blur-[90px] animate-gradient-shift" />
      </div>

      {/* Animated SVG pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Animated circles */}
        <circle cx="100" cy="200" r="120" fill="none" stroke="rgba(185,28,28,0.4)" strokeWidth="1">
          <animate attributeName="r" values="120;150;120" dur="8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="8s" repeatCount="indefinite" />
        </circle>
        <circle cx="400" cy="400" r="80" fill="none" stroke="rgba(212,160,23,0.35)" strokeWidth="1.5">
          <animate attributeName="r" values="80;110;80" dur="10s" repeatCount="indefinite" />
        </circle>
        <circle cx="250" cy="800" r="150" fill="none" stroke="rgba(185,28,28,0.25)" strokeWidth="0.8">
          <animate attributeName="r" values="150;180;150" dur="14s" repeatCount="indefinite" />
        </circle>

        {/* Flowing wave lines */}
        <path
          d="M0,300 Q125,250 250,300 T500,300"
          fill="none"
          stroke="rgba(185,28,28,0.3)"
          strokeWidth="2"
        >
          <animate
            attributeName="d"
            values="M0,300 Q125,250 250,300 T500,300;M0,300 Q125,350 250,300 T500,300;M0,300 Q125,250 250,300 T500,300"
            dur="8s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M0,600 Q125,550 250,600 T500,600"
          fill="none"
          stroke="rgba(212,160,23,0.2)"
          strokeWidth="1.5"
        >
          <animate
            attributeName="d"
            values="M0,600 Q125,550 250,600 T500,600;M0,600 Q125,650 250,600 T500,600;M0,600 Q125,550 250,600 T500,600"
            dur="12s"
            repeatCount="indefinite"
          />
        </path>

        {/* Rotating geometric shapes */}
        <polygon
          points="400,100 440,140 420,180 380,180 360,140"
          fill="none"
          stroke="rgba(212,160,23,0.25)"
          strokeWidth="1"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 400 140;360 400 140"
            dur="30s"
            repeatCount="indefinite"
          />
        </polygon>
        <rect
          x="50" y="500" width="60" height="60"
          fill="none"
          stroke="rgba(185,28,28,0.2)"
          strokeWidth="1"
          rx="6"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 80 530;360 80 530"
            dur="25s"
            repeatCount="indefinite"
          />
        </rect>
        <polygon
          points="250,50 270,90 250,130 230,90"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 250 90;-360 250 90"
            dur="20s"
            repeatCount="indefinite"
          />
        </polygon>

        {/* Dotted grid */}
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <circle
              key={`rdot-${row}-${col}`}
              cx={40 + col * 80}
              cy={80 + row * 120}
              r="1.5"
              fill="rgba(255,255,255,0.08)"
            />
          ))
        )}
      </svg>

      {/* Floating particles */}
      <FloatingParticles />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}

// Animated radar/pulse rings for right panel
function PulseRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative">
        <div className="absolute inset-0 -m-32 rounded-full border border-white/10 animate-ping-slow" />
        <div className="absolute inset-0 -m-48 rounded-full border border-white/5 animate-ping-slower" />
        <div className="absolute inset-0 -m-64 rounded-full border border-white/[0.03] animate-ping-slowest" />
      </div>
    </div>
  );
}

// Feature card for right panel
function FeatureCard({ icon, title, delay }: { icon: React.ReactNode; title: string; delay: string }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl bg-white/5 backdrop-blur-sm px-4 py-3 border border-white/10 animate-slide-in-right"
      style={{ animationDelay: delay }}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
        {icon}
      </div>
      <span className="text-sm font-medium text-white/80">{title}</span>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Split layout */}
      <div className="relative flex min-h-screen flex-col lg:flex-row">
        {/* Left side - Glass card with form */}
        <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
          {/* Left background */}
          <LeftBackground />

          {/* Card */}
          <div
            className={`relative z-10 w-full max-w-md transition-all duration-1000 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {/* Glow behind card */}
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-primary-500/10 via-transparent to-gold-500/5 blur-3xl opacity-50 dark:from-primary-500/15 dark:to-gold-500/10" />

            {/* Glass card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.06),0_20px_60px_-20px_rgba(0,0,0,0.1)] backdrop-blur-md dark:border-white/20 dark:bg-white/10 dark:shadow-[0_20px_80px_-20px_rgba(0,0,0,0.5)] dark:backdrop-blur-xl">
              {/* Top highlight reflection */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent dark:via-white/40" />
              
              {/* Inner glass gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent dark:from-white/15 dark:via-white/5" />
              
              {/* Left edge highlight */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/60 via-white/30 to-transparent dark:from-white/20 dark:via-white/5" />

              {/* Card content */}
              <div className="relative px-7 py-9 sm:px-9 sm:py-10">
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Branding panel */}
        <div className="hidden lg:flex lg:w-[45%] items-center justify-center relative overflow-hidden">
          {/* Right background */}
          <RightBackground />

          {/* Pulse rings */}
          <PulseRings />

          {/* Content */}
          <div
            className={`relative z-10 flex flex-col items-center px-12 text-center max-w-sm transition-all duration-1000 delay-300 ease-out ${
              mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
            }`}
          >
            {/* Logo with glow */}
            <div className="relative mb-8">
              <div className="absolute inset-0 rounded-3xl bg-white/10 blur-2xl scale-125" />
              <div className="relative rounded-3xl bg-white/5 p-7 backdrop-blur-md border border-white/15 shadow-2xl">
                <img
                  className="h-44 w-auto drop-shadow-2xl"
                  src="/images/logo/logo-beltim.png"
                  alt="Logo Belitung Timur"
                />
              </div>
            </div>

            {/* Title */}
            <h2 className="mb-2 text-3xl font-bold text-white tracking-tight">
              SIPINTAR
            </h2>
            <p className="mb-8 text-sm text-white/50 leading-relaxed max-w-xs">
              Sistem Informasi Kewaspadaan Dini Kabupaten Belitung Timur
            </p>

            {/* Feature highlights */}
            <div className="w-full space-y-3 mb-8">
              <FeatureCard
                icon={
                  <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
                title="Monitoring Keamanan Real-time"
                delay="0.6s"
              />
              <FeatureCard
                icon={
                  <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
                title="Analisis Risiko Terintegrasi"
                delay="0.8s"
              />
              <FeatureCard
                icon={
                  <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="Pemetaan Wilayah Konflik"
                delay="1.0s"
              />
            </div>

            {/* Bottom badge */}
            <div className="flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 backdrop-blur-sm border border-white/10">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold-400" />
              </div>
              <span className="text-sm font-medium text-white/70">Kabupaten Belitung Timur</span>
            </div>
          </div>
        </div>
      </div>

      {/* Theme toggler */}
      <div className="fixed z-50 bottom-6 right-6">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}
