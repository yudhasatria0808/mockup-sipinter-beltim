import React, { useEffect, useState } from "react";
import { Link } from "react-router";

// Animated floating particles
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

// Full-screen dark animated SVG background (from right panel)
function AnimatedBackground() {
  return (
    <div className="absolute inset-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900" />

      {/* Animated gradient blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary-700/40 blur-[100px] animate-orb-drift" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-800/30 blur-[80px] animate-orb-drift-reverse" />
        <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-gold-600/15 blur-[90px] animate-gradient-shift" />
      </div>

      {/* Animated SVG pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Animated circles */}
        <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(185,28,28,0.4)" strokeWidth="1">
          <animate attributeName="r" values="150;180;150" dur="8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="8s" repeatCount="indefinite" />
        </circle>
        <circle cx="800" cy="300" r="100" fill="none" stroke="rgba(212,160,23,0.35)" strokeWidth="1.5">
          <animate attributeName="r" values="100;130;100" dur="10s" repeatCount="indefinite" />
          <animate attributeName="cx" values="800;830;800" dur="12s" repeatCount="indefinite" />
        </circle>
        <circle cx="600" cy="800" r="180" fill="none" stroke="rgba(185,28,28,0.25)" strokeWidth="0.8">
          <animate attributeName="r" values="180;210;180" dur="14s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="700" r="80" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1">
          <animate attributeName="r" values="80;100;80" dur="7s" repeatCount="indefinite" />
        </circle>

        {/* Flowing wave lines */}
        <path
          d="M0,300 Q250,250 500,300 T1000,300"
          fill="none"
          stroke="rgba(185,28,28,0.3)"
          strokeWidth="2"
        >
          <animate
            attributeName="d"
            values="M0,300 Q250,250 500,300 T1000,300;M0,300 Q250,350 500,300 T1000,300;M0,300 Q250,250 500,300 T1000,300"
            dur="8s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M0,500 Q250,450 500,500 T1000,500"
          fill="none"
          stroke="rgba(212,160,23,0.2)"
          strokeWidth="1.5"
        >
          <animate
            attributeName="d"
            values="M0,500 Q250,450 500,500 T1000,500;M0,500 Q250,550 500,500 T1000,500;M0,500 Q250,450 500,500 T1000,500"
            dur="12s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M0,700 Q250,650 500,700 T1000,700"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        >
          <animate
            attributeName="d"
            values="M0,700 Q250,650 500,700 T1000,700;M0,700 Q250,750 500,700 T1000,700;M0,700 Q250,650 500,700 T1000,700"
            dur="10s"
            repeatCount="indefinite"
          />
        </path>

        {/* Rotating geometric shapes */}
        <polygon
          points="900,150 960,200 930,260 870,260 840,200"
          fill="none"
          stroke="rgba(212,160,23,0.25)"
          strokeWidth="1"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 900 200;360 900 200"
            dur="30s"
            repeatCount="indefinite"
          />
        </polygon>
        <rect
          x="50" y="450" width="80" height="80"
          fill="none"
          stroke="rgba(185,28,28,0.2)"
          strokeWidth="1"
          rx="8"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 90 490;360 90 490"
            dur="25s"
            repeatCount="indefinite"
          />
        </rect>
        <polygon
          points="500,50 530,100 500,150 470,100"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 500 100;-360 500 100"
            dur="20s"
            repeatCount="indefinite"
          />
          <animate attributeName="opacity" values="0.15;0.3;0.15" dur="5s" repeatCount="indefinite" />
        </polygon>

        {/* Dotted grid */}
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 12 }).map((_, col) => (
            <circle
              key={`dot-${row}-${col}`}
              cx={80 + col * 80}
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
      {/* Full-screen animated background */}
      <AnimatedBackground />

      {/* Centered glass card */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6">
        {/* Card */}
        <div
          className={`w-full max-w-md transition-all duration-1000 ease-out ${
            mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          {/* Glow behind card */}
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-primary-500/20 via-white/5 to-gold-500/15 blur-3xl opacity-60" />

          {/* Glass card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            {/* Top highlight reflection */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            {/* Inner glass gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-white/5 to-transparent" />

            {/* Left edge highlight */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/30 via-white/10 to-transparent" />

            {/* Card content */}
            <div className="relative px-7 py-9 sm:px-9 sm:py-10">
              {children}
            </div>
          </div>
        </div>

        {/* Back to landing link */}
        <div
          className={`mt-6 transition-all duration-700 delay-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white/70"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
