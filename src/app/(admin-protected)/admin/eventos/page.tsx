import type { Metadata } from "next";
import { connection } from "next/server";

import { EventManager } from "@/components/admin/event-manager";
import {
  createEvent,
  duplicateEvent,
  setEventStatus,
  setFeaturedPopupEvent,
  updateEvent,
} from "@/lib/actions/admin/events";
import { getAdminEvents } from "@/lib/queries/admin/events";

export const metadata: Metadata = {
  title: "Eventos",
};

export default async function AdminEventsPage() {
  await connection();
  const events = await getAdminEvents();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brown-700)]">
          Gestão de eventos
        </p>
        <h1 className="mt-2 font-serif text-5xl font-semibold tracking-[-0.035em] sm:text-6xl">
          Agenda e divulgação
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--brown-700)]">
          Crie rascunhos, publique eventos, configure reserva de mesas e ingressos pelo WhatsApp, destaque a programação na Home e escolha um único popup ativo.
        </p>
      </div>

      <div className="mt-10">
        <EventManager
          events={events}
          onCreate={createEvent}
          onUpdate={updateEvent}
          onDuplicate={duplicateEvent}
          onSetStatus={setEventStatus}
          onSetFeatured={setFeaturedPopupEvent}
        />
      </div>
    </main>
  );
}
