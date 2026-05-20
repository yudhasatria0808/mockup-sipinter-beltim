import PageMeta from "../../components/common/PageMeta";
import {
  palettes,
  useColorPalette,
  type PaletteKey,
} from "../../context/ColorPaletteContext";

export default function PengaturanTampilan() {
  const { currentPalette, setPalette } = useColorPalette();

  return (
    <>
      <PageMeta title="Pengaturan Tampilan | SIPINTAR" />

      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Pengaturan Tampilan
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Sesuaikan warna tema aplikasi sesuai preferensi Anda.
          </p>
        </div>

        {/* Color Palette Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-1">
            Warna Tema
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Pilih warna utama yang akan digunakan di seluruh aplikasi.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {palettes.map((palette) => (
              <PaletteCard
                key={palette.key}
                paletteKey={palette.key}
                label={palette.label}
                shades={palette.shades}
                isActive={currentPalette === palette.key}
                onSelect={setPalette}
              />
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">
            Preview
          </h3>

          <div className="space-y-4">
            {/* Buttons preview */}
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors shadow-sm">
                Primary Button
              </button>
              <button className="px-4 py-2 rounded-lg bg-primary-100 text-primary-700 text-sm font-medium hover:bg-primary-200 transition-colors">
                Secondary Button
              </button>
              <button className="px-4 py-2 rounded-lg border border-primary-300 text-primary-600 text-sm font-medium hover:bg-primary-50 transition-colors">
                Outline Button
              </button>
            </div>

            {/* Badge preview */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                Badge Default
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-500 text-white">
                Badge Solid
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-primary-300 text-primary-600">
                Badge Outline
              </span>
            </div>

            {/* Color scale preview */}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Skala warna primary
              </p>
              <div className="flex rounded-lg overflow-hidden">
                <div className="h-8 flex-1 bg-primary-50" title="50" />
                <div className="h-8 flex-1 bg-primary-100" title="100" />
                <div className="h-8 flex-1 bg-primary-200" title="200" />
                <div className="h-8 flex-1 bg-primary-300" title="300" />
                <div className="h-8 flex-1 bg-primary-400" title="400" />
                <div className="h-8 flex-1 bg-primary-500" title="500" />
                <div className="h-8 flex-1 bg-primary-600" title="600" />
                <div className="h-8 flex-1 bg-primary-700" title="700" />
                <div className="h-8 flex-1 bg-primary-800" title="800" />
                <div className="h-8 flex-1 bg-primary-900" title="900" />
                <div className="h-8 flex-1 bg-primary-950" title="950" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PaletteCard({
  paletteKey,
  label,
  shades,
  isActive,
  onSelect,
}: {
  paletteKey: PaletteKey;
  label: string;
  shades: { 400: string; 500: string; 600: string; 100: string };
  isActive: boolean;
  onSelect: (key: PaletteKey) => void;
}) {
  return (
    <button
      onClick={() => onSelect(paletteKey)}
      className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer
        ${
          isActive
            ? "border-primary-500 bg-primary-50/50 shadow-md dark:border-primary-400 dark:bg-primary-500/10"
            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
        }
      `}
    >
      {/* Color circles */}
      <div className="flex items-center gap-1.5">
        <div
          className="w-6 h-6 rounded-full shadow-inner"
          style={{ backgroundColor: shades[100] }}
        />
        <div
          className="w-8 h-8 rounded-full shadow-sm"
          style={{ backgroundColor: shades[400] }}
        />
        <div
          className="w-10 h-10 rounded-full shadow-md"
          style={{ backgroundColor: shades[500] }}
        />
        <div
          className="w-8 h-8 rounded-full shadow-sm"
          style={{ backgroundColor: shades[600] }}
        />
      </div>

      {/* Label */}
      <span
        className={`text-sm font-medium ${
          isActive
            ? "text-primary-700 dark:text-primary-300"
            : "text-gray-700 dark:text-gray-300"
        }`}
      >
        {label}
      </span>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-2 right-2">
          <svg
            className="w-5 h-5 text-primary-500 dark:text-primary-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </button>
  );
}
