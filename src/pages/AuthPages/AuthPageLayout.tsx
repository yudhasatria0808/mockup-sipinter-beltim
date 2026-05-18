import React from "react";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/5" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-brand-600/10 blur-3xl dark:bg-brand-600/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-brand-400/5 blur-3xl dark:bg-brand-400/3" />
      </div>

      <div className="relative flex min-h-screen flex-col lg:flex-row">
        {/* Left side - Form */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12">
          {children}
        </div>

        {/* Right side - Branding panel */}
        <div className="hidden lg:flex lg:w-[45%] items-center justify-center relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 dark:from-brand-800 dark:via-brand-900 dark:to-gray-900" />
          
          {/* Animated pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Floating shapes */}
          <div className="absolute top-20 left-10 h-20 w-20 rounded-2xl bg-white/10 rotate-12 animate-pulse" />
          <div className="absolute bottom-32 right-16 h-16 w-16 rounded-full bg-white/10 animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/3 right-10 h-12 w-12 rounded-lg bg-white/10 -rotate-12 animate-pulse [animation-delay:2s]" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center px-12 text-center">
            <div className="mb-8 rounded-2xl bg-white/10 p-6 backdrop-blur-sm ring-1 ring-white/20">
              <img
                className="h-60 w-auto drop-shadow-lg"
                src="/images/logo/logo-beltim.png"
                alt="Logo Belitung Timur"
              />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-white">
              SIPINTAR
            </h2>
            {/* <p className="max-w-sm text-base text-white/70 leading-relaxed">
              Sistem Informasi Perencanaan dan Penganggaran Terpadu Daerah
            </p> */}
            <div className="mt-8 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm ring-1 ring-white/20">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-white/80">Kabupaten Belitung Timur</span>
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
