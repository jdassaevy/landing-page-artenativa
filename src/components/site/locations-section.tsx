import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { LocationCard } from "@/components/site/location-card";
import type { PublicLocation } from "@/types/domain";

interface LocationsSectionProps {
  locations: PublicLocation[];
  compact?: boolean;
}

export function LocationsSection({ locations, compact = false }: LocationsSectionProps) {
  const visibleLocations = compact ? locations.slice(0, 2) : locations;

  return (
    <section id="locais" className="border-y border-[var(--sand-200)] bg-[var(--offwhite-100)]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brown-700)]">Onde dançamos</p>
              <h2 className="mt-3 font-serif text-5xl font-semibold leading-none tracking-[-0.035em] sm:text-6xl">Encontre a Arte Nativa.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-[var(--brown-700)] md:justify-self-end">
              Endereço e rota ficam sempre disponíveis. O mapa só é carregado quando necessário para manter a navegação rápida, principalmente no celular.
            </p>
          </div>
        </Reveal>

        {visibleLocations.length ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {visibleLocations.map((location, index) => (
              <Reveal key={location.id} delay={index * 0.05}>
                <LocationCard location={location} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="mt-10">
            <div className="rounded-[1.75rem] border border-dashed border-[var(--beige-400)] bg-[var(--warm-white)] p-8 text-center">
              <p className="font-serif text-3xl font-semibold text-[var(--brown-900)]">Locais em atualização.</p>
              <p className="mt-3 text-sm leading-7 text-[var(--brown-700)]">Os endereços ativos serão exibidos aqui assim que forem publicados.</p>
            </div>
          </Reveal>
        )}

        {compact && locations.length > 2 ? (
          <Reveal className="mt-8 flex justify-end">
            <Link href="/locais" className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-[var(--brown-900)] transition hover:bg-[var(--sand-200)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)]">
              Ver todos os locais <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
