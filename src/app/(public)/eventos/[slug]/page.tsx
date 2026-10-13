import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { LazyMap } from "@/components/site/lazy-map";
import { WhatsAppCta } from "@/components/site/whatsapp-cta";
import { getEventBySlug } from "@/lib/queries/events";
import { buildPublicStorageUrl } from "@/lib/seo";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export const instant = false;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return { title: "Evento não encontrado", robots: { index: false, follow: false } };

  const description = event.description ?? `Confira os detalhes de ${event.title} na Arte Nativa.`;
  const canonical = `/eventos/${event.slug}`;
  const coverUrl = buildPublicStorageUrl("event-covers", event.cover_path);

  return {
    title: event.title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: event.title,
      description,
      type: "article",
      url: canonical,
      images: coverUrl ? [{ url: coverUrl, alt: `Capa de ${event.title}` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      images: coverUrl ? [coverUrl] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  await connection();
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const venueLabel = event.venue_name || event.title;

  return (
    <main id="conteudo">
      <section className="border-b border-[var(--sand-200)] bg-[var(--brown-900)] text-[var(--warm-white)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--sand-200)]">
            <CalendarDays className="size-4" aria-hidden="true" /> {formatDate(event.event_date)}
          </p>
          <h1 className="mt-5 max-w-5xl font-serif text-6xl font-semibold leading-[0.88] tracking-[-0.045em] sm:text-7xl lg:text-8xl">{event.title}</h1>
          <div className="mt-7 flex items-start gap-2 text-sm leading-7 text-[var(--offwhite-100)]/85">
            <MapPin className="mt-1 size-4 shrink-0" aria-hidden="true" />
            <p><strong className="text-[var(--warm-white)]">{venueLabel}</strong><br />{event.venue_address}, {event.venue_city} – {event.venue_state}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-28">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brown-700)]">Sobre o evento</p>
          <div className="mt-4 whitespace-pre-line text-base leading-8 text-[var(--brown-700)]">
            {event.description || "Mais informações serão divulgadas em breve."}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <WhatsAppCta phone={event.whatsapp_phone} message={event.reservation_message} label="Reservar mesa" />
            <WhatsAppCta phone={event.whatsapp_phone} message={event.ticket_message} label="Comprar ingresso" variant="secondary" />
          </div>
        </div>

        <LazyMap
          location={{
            address: event.venue_address,
            city: event.venue_city,
            state: event.venue_state,
            latitude: event.latitude,
            longitude: event.longitude,
          }}
          title={venueLabel}
        />
      </section>
    </main>
  );
}
