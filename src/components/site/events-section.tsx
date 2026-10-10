import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { EventCard } from "@/components/site/event-card";
import type { SiteEvent } from "@/types/domain";

interface EventsSectionProps {
  events: SiteEvent[];
  compact?: boolean;
}

export function EventsSection({ events, compact = false }: EventsSectionProps) {
  const visibleEvents = compact ? events.filter((event) => event.show_on_home).slice(0, 3) : events;

  return (
    <section id="eventos" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal>
        <div className="grid gap-6 border-b border-[var(--sand-200)] pb-10 md:grid-cols-[0.78fr_1.22fr] md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brown-700)]">Agenda</p>
            <h2 className="mt-3 font-serif text-5xl font-semibold leading-none tracking-[-0.035em] sm:text-6xl">Próximos encontros.</h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[var(--brown-700)] md:justify-self-end">
            Bailes, apresentações e encontros da Arte Nativa, com detalhes de local e contato direto para reserva ou ingresso.
          </p>
        </div>
      </Reveal>

      {visibleEvents.length ? (
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {visibleEvents.map((event, index) => (
            <Reveal key={event.id} delay={index * 0.05}>
              <EventCard event={event} />
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal className="mt-10">
          <div className="rounded-[1.75rem] border border-dashed border-[var(--beige-400)] bg-[var(--offwhite-100)] p-8 text-center">
            <p className="font-serif text-3xl font-semibold text-[var(--brown-900)]">Nenhum evento publicado por enquanto.</p>
            <p className="mt-3 text-sm leading-7 text-[var(--brown-700)]">Assim que a próxima programação estiver confirmada, ela aparece aqui.</p>
          </div>
        </Reveal>
      )}

      {compact ? (
        <Reveal className="mt-8 flex justify-end">
          <Link href="/eventos" className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-[var(--brown-900)] transition hover:bg-[var(--offwhite-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)]">
            Ver agenda completa <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      ) : null}
    </section>
  );
}
