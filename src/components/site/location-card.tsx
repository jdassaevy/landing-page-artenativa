import { MapPin } from "lucide-react";

import { LazyMap } from "@/components/site/lazy-map";
import type { PublicLocation } from "@/types/domain";

interface LocationCardProps {
  location: PublicLocation;
  mapApiKey?: string;
}

export function LocationCard({ location, mapApiKey }: LocationCardProps) {
  return (
    <article id={`local-${location.id}`} className="overflow-hidden rounded-[2rem] border border-[var(--sand-200)] bg-[var(--warm-white)] shadow-[0_18px_45px_rgba(58,36,24,0.06)]">
      <div className="p-5 sm:p-7">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--brown-700)]">
          <MapPin className="size-4" aria-hidden="true" /> Local Arte Nativa
        </p>
        <h3 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.03em] text-[var(--brown-900)]">
          {location.name}
        </h3>
        <address className="mt-4 not-italic text-sm leading-7 text-[var(--brown-700)]">
          <span className="block font-semibold text-[var(--brown-900)]">{location.address}</span>
          <span>{location.city} – {location.state}</span>
        </address>
      </div>

      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <LazyMap
          location={{
            address: location.address,
            city: location.city,
            state: location.state,
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={location.name}
          apiKey={mapApiKey}
        />
      </div>
    </article>
  );
}
