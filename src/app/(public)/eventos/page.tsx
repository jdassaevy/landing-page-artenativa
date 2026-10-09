import type { Metadata } from "next";
import { connection } from "next/server";

import { EventsSection } from "@/components/site/events-section";
import { getUpcomingEvents } from "@/lib/queries/events";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Confira os próximos eventos da Arte Nativa e fale diretamente pelo WhatsApp para reservas e ingressos.",
  alternates: { canonical: "/eventos" },
  openGraph: {
    title: "Eventos | Arte Nativa",
    description: "Confira os próximos eventos da Arte Nativa e fale diretamente pelo WhatsApp para reservas e ingressos.",
    url: "/eventos",
  },
};

export default async function EventsPage() {
  await connection();
  const events = await getUpcomingEvents();

  return (
    <main id="conteudo">
      <div className="border-b border-[var(--sand-200)] bg-[var(--brown-900)] px-4 py-16 text-[var(--warm-white)] sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--sand-200)]">Agenda Arte Nativa</p>
          <h1 className="mt-3 max-w-4xl font-serif text-6xl font-semibold leading-[0.9] tracking-[-0.04em] sm:text-7xl">Encontros que continuam a dança além das aulas.</h1>
        </div>
      </div>
      <EventsSection events={events} />
    </main>
  );
}
