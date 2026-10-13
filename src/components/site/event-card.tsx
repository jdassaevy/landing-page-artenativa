import { CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";

import { WhatsAppCta } from "@/components/site/whatsapp-cta";
import type { SiteEvent } from "@/types/domain";

interface EventCardProps {
  event: SiteEvent;
}

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-[var(--sand-200)] bg-[var(--warm-white)] shadow-[0_18px_45px_rgba(58,36,24,0.06)]">
      <div className="min-h-44 bg-[linear-gradient(145deg,var(--brown-700),var(--brown-900))] p-6 text-[var(--warm-white)]">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--sand-200)]">
          <CalendarDays className="size-4" aria-hidden="true" /> {formatEventDate(event.event_date)}
        </p>
        <h3 className="mt-5 max-w-xl font-serif text-4xl font-semibold leading-[0.95] tracking-[-0.03em]">{event.title}</h3>
      </div>

      <div className="p-6">
        {event.description ? <p className="line-clamp-3 text-sm leading-7 text-[var(--brown-700)]">{event.description}</p> : null}
        <div className="mt-5 flex items-start gap-2 text-sm text-[var(--brown-700)]">
          <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[var(--brown-900)]">{event.venue_name}</p>
            <p className="mt-1">{event.venue_address}, {event.venue_city} – {event.venue_state}</p>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={`/eventos/${event.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--beige-400)] px-5 py-2.5 text-sm font-bold text-[var(--brown-900)] transition hover:bg-[var(--offwhite-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)]">
            Ver evento
          </Link>
          <WhatsAppCta phone={event.whatsapp_phone} message={event.reservation_message} label="Reservar mesa" />
        </div>
      </div>
    </article>
  );
}
