export function getBasePath(): string {
  return import.meta.env.VITE_BASE_PATH || "/";
}

export function normalizeBasePath(basePath: string): string {
  if (basePath === "/") return "/";
  return basePath.endsWith("/") ? basePath : `${basePath}/`;
}

export function stripBasePath(pathname: string, basePath: string): string {
  const normalizedBase = normalizeBasePath(basePath);
  if (normalizedBase === "/") return pathname;
  if (pathname.startsWith(normalizedBase)) {
    return `/${pathname.slice(normalizedBase.length)}`;
  }
  return pathname;
}
