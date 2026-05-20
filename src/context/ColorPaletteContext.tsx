import { createContext, useContext, useEffect, useState } from "react";

export type PaletteKey =
  | "red"
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "teal"
  | "indigo"
  | "rose";

export interface PaletteShades {
  25: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface PaletteOption {
  key: PaletteKey;
  label: string;
  shades: PaletteShades;
}

export const palettes: PaletteOption[] = [
  {
    key: "red",
    label: "Merah",
    shades: {
      25: "#fef6f5",
      50: "#fceae8",
      100: "#f8cdc9",
      200: "#f0a29b",
      300: "#e06b60",
      400: "#d44538",
      500: "#b91c1c",
      600: "#9b1818",
      700: "#7f1414",
      800: "#641010",
      900: "#4a0c0c",
      950: "#300808",
    },
  },
  {
    key: "blue",
    label: "Biru",
    shades: {
      25: "#f0f7ff",
      50: "#e0efff",
      100: "#b8d9ff",
      200: "#85bfff",
      300: "#52a3ff",
      400: "#2b8aff",
      500: "#1d6fdb",
      600: "#155bb5",
      700: "#104890",
      800: "#0b366b",
      900: "#072548",
      950: "#041630",
    },
  },
  {
    key: "green",
    label: "Hijau",
    shades: {
      25: "#f3fef6",
      50: "#e6fcec",
      100: "#c3f5d1",
      200: "#8eeaa5",
      300: "#52d974",
      400: "#2ec455",
      500: "#16a34a",
      600: "#12873d",
      700: "#0e6b31",
      800: "#0a5025",
      900: "#07381a",
      950: "#042210",
    },
  },
  {
    key: "purple",
    label: "Ungu",
    shades: {
      25: "#faf5ff",
      50: "#f3e8ff",
      100: "#e4ccff",
      200: "#cba0ff",
      300: "#ad6fff",
      400: "#9645ff",
      500: "#7c22ce",
      600: "#6618a8",
      700: "#511285",
      800: "#3d0d63",
      900: "#2a0944",
      950: "#1a052c",
    },
  },
  {
    key: "orange",
    label: "Oranye",
    shades: {
      25: "#fff8f3",
      50: "#fff0e6",
      100: "#ffdcc2",
      200: "#ffbe8a",
      300: "#ff9a4d",
      400: "#f57d24",
      500: "#d4610a",
      600: "#b04f08",
      700: "#8c3e06",
      800: "#692e05",
      900: "#481f03",
      950: "#2e1302",
    },
  },
  {
    key: "teal",
    label: "Teal",
    shades: {
      25: "#f0fdfa",
      50: "#ccfbf1",
      100: "#99f6e4",
      200: "#5eead4",
      300: "#2dd4bf",
      400: "#14b8a6",
      500: "#0d9488",
      600: "#0a7a70",
      700: "#086058",
      800: "#064842",
      900: "#04312d",
      950: "#021e1b",
    },
  },
  {
    key: "indigo",
    label: "Indigo",
    shades: {
      25: "#f5f5ff",
      50: "#eef0ff",
      100: "#d9ddff",
      200: "#b3b8ff",
      300: "#8a8fff",
      400: "#6366f1",
      500: "#4f46e5",
      600: "#4338ca",
      700: "#3730a3",
      800: "#2c277d",
      900: "#211e5a",
      950: "#161439",
    },
  },
  {
    key: "rose",
    label: "Rose",
    shades: {
      25: "#fff5f7",
      50: "#ffe4ea",
      100: "#ffc9d6",
      200: "#ffa0b8",
      300: "#ff6e94",
      400: "#f43f6e",
      500: "#e11d55",
      600: "#be1848",
      700: "#9a133a",
      800: "#770f2d",
      900: "#550a20",
      950: "#360615",
    },
  },
];

type ColorPaletteContextType = {
  currentPalette: PaletteKey;
  setPalette: (key: PaletteKey) => void;
  getPalette: () => PaletteOption;
};

const ColorPaletteContext = createContext<ColorPaletteContextType | undefined>(
  undefined
);

function applyPaletteToDOM(palette: PaletteOption) {
  const root = document.documentElement;
  const shadeKeys = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

  shadeKeys.forEach((shade) => {
    root.style.setProperty(`--color-primary-${shade}`, palette.shades[shade]);
  });
}

export const ColorPaletteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentPalette, setCurrentPalette] = useState<PaletteKey>("red");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("color-palette") as PaletteKey | null;
    const initial = saved && palettes.find((p) => p.key === saved) ? saved : "red";
    setCurrentPalette(initial);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("color-palette", currentPalette);
    const palette = palettes.find((p) => p.key === currentPalette)!;
    applyPaletteToDOM(palette);
  }, [currentPalette, isInitialized]);

  const setPalette = (key: PaletteKey) => {
    if (palettes.find((p) => p.key === key)) {
      setCurrentPalette(key);
    }
  };

  const getPalette = () => {
    return palettes.find((p) => p.key === currentPalette)!;
  };

  return (
    <ColorPaletteContext.Provider value={{ currentPalette, setPalette, getPalette }}>
      {children}
    </ColorPaletteContext.Provider>
  );
};

export const useColorPalette = () => {
  const context = useContext(ColorPaletteContext);
  if (!context) {
    throw new Error("useColorPalette must be used within a ColorPaletteProvider");
  }
  return context;
};
