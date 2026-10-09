"use client";

import { ExternalLink, MapPinned } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { buildMapsEmbedUrl, type MapLocationInput } from "@/lib/maps";

interface LazyMapProps {
  location: MapLocationInput;
  title: string;
  apiKey?: string;
}

function buildDirectionsUrl(location: MapLocationInput): string {
  const destination =
    typeof location.latitude === "number" &&
    Number.isFinite(location.latitude) &&
    typeof location.longitude === "number" &&
    Number.isFinite(location.longitude)
      ? `${location.latitude},${location.longitude}`
      : [location.address, location.city, location.state]
          .map((value) => value?.trim() ?? "")
          .filter(Boolean)
          .join(", ");

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function LazyMap({
  location,
  title,
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY ?? "",
}: LazyMapProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const embedUrl = useMemo(() => buildMapsEmbedUrl(location, apiKey), [location, apiKey]);
  const directionsUrl = useMemo(() => buildDirectionsUrl(location), [location]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || !embedUrl || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [embedUrl]);

  return (
    <div ref={containerRef} className="overflow-hidden rounded-[1.75rem] border border-[var(--sand-200)] bg-[var(--offwhite-100)]">
      <div className="relative min-h-72 sm:min-h-80">
        {shouldLoad && embedUrl ? (
          <iframe
            title={`Mapa de ${title}`}
            src={embedUrl}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full min-h-72 w-full border-0 sm:min-h-80"
          />
        ) : (
          <div className="grid min-h-72 place-items-center px-6 text-center sm:min-h-80">
            <div className="max-w-sm">
              <MapPinned className="mx-auto size-7 text-[var(--brown-700)]" aria-hidden="true" />
              <p className="mt-4 font-serif text-2xl font-semibold text-[var(--brown-900)]">{title}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--brown-700)]">
                {embedUrl
                  ? "O mapa é carregado somente quando você se aproxima desta seção ou pede para visualizar."
                  : "Mapa indisponível no momento. O endereço e a rota continuam acessíveis."}
              </p>
              {embedUrl ? (
                <button
                  type="button"
                  onClick={() => setShouldLoad(true)}
                  className="mt-5 min-h-11 rounded-full bg-[var(--brown-900)] px-5 py-2.5 text-sm font-bold text-[var(--warm-white)] transition hover:bg-[var(--brown-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)] focus-visible:ring-offset-2"
                >
                  Carregar mapa
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-[var(--sand-200)] px-5 py-4">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brown-700)]">Google Maps</span>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-bold text-[var(--brown-900)] transition hover:bg-[var(--sand-200)]/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)]"
        >
          Traçar rota <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
