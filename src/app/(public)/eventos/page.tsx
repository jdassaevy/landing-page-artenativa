import type { Metadata } from "next";
import { Suspense } from "react";
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

async function EventsContent() {
  await connection();
  const events = await getUpcomingEvents();
  return <EventsSection events={events} />;
}

function EventsFallback() {
  return (
    <section className="mx-auto max-w-7xl animate-pulse px-4 py-20 sm:px-6 lg:px-8" aria-busy="true" aria-label="Carregando eventos">
      <div className="h-3 w-36 rounded-full bg-[var(--sand-200)]" />
      <div className="mt-4 h-12 max-w-xl rounded-2xl bg-[var(--sand-200)]" />
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-80 rounded-[1.75rem] bg-[var(--sand-200)]/45" />
        ))}
      </div>
    </section>
  );
}

export default function EventsPage() {
  return (
    <main id="conteudo">
      <div className="border-b border-[var(--sand-200)] bg-[var(--brown-900)] px-4 py-16 text-[var(--warm-white)] sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--sand-200)]">Agenda Arte Nativa</p>
          <h1 className="mt-3 max-w-4xl font-serif text-6xl font-semibold leading-[0.9] tracking-[-0.04em] sm:text-7xl">Encontros que continuam a dança além das aulas.</h1>
        </div>
      </div>
      <Suspense fallback={<EventsFallback />}>
        <EventsContent />
      </Suspense>
    </main>
  );
}
