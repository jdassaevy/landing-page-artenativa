export interface SitemapEntry {
  url: string;
  lastModified?: Date | string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

const DEFAULT_SITE_URL = "http://localhost:3000";
const PUBLIC_ROUTES = ["/", "/aulas", "/locais", "/eventos", "/sobre"] as const;

export function normalizeSiteUrl(value = process.env.NEXT_PUBLIC_SITE_URL): string {
  const candidate = value?.trim() || DEFAULT_SITE_URL;
  const url = new URL(candidate);
  return url.origin;
}

export function buildCanonicalUrl(
  pathname: string,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL,
): string {
  const origin = normalizeSiteUrl(siteUrl);
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(normalizedPath, `${origin}/`).toString().replace(/\/$/, normalizedPath === "/" ? "/" : "");
}

export function buildSitemapEntries(
  eventSlugs: string[],
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL,
): SitemapEntry[] {
  const origin = normalizeSiteUrl(siteUrl);
  const staticEntries: SitemapEntry[] = PUBLIC_ROUTES.map((pathname) => ({
    url: pathname === "/" ? `${origin}/` : `${origin}${pathname}`,
    changeFrequency: pathname === "/eventos" || pathname === "/aulas" ? "daily" : "weekly",
    priority: pathname === "/" ? 1 : pathname === "/eventos" || pathname === "/aulas" ? 0.9 : 0.7,
  }));

  const eventEntries: SitemapEntry[] = Array.from(new Set(eventSlugs))
    .filter((slug) => slug.trim().length > 0)
    .map((slug) => ({
      url: `${origin}/eventos/${encodeURIComponent(slug.trim())}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [...staticEntries, ...eventEntries];
}

export function buildPublicStorageUrl(
  bucket: string,
  path: string | null | undefined,
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
): string | null {
  const cleanPath = path?.trim();
  const cleanUrl = supabaseUrl?.trim();
  if (!cleanPath || !cleanUrl) return null;

  const origin = new URL(cleanUrl).origin;
  const encodedPath = cleanPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${origin}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodedPath}`;
}
