"use client";

import { CalendarDays, X } from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { isPopupDismissedWithinWindow, popupStorageKey } from "@/lib/domain/popup";
import type { SiteEvent } from "@/types/domain";

interface EventPopupProps {
  event: SiteEvent;
  now?: () => number;
}

const subscribeToNoopStore = () => () => undefined;

export function EventPopup({ event, now = Date.now }: EventPopupProps) {
  const [dismissedEventId, setDismissedEventId] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const isEligible = useSyncExternalStore(
    subscribeToNoopStore,
    () => {
      try {
        const dismissedAt = window.localStorage.getItem(popupStorageKey(event.id));
        return !isPopupDismissedWithinWindow(dismissedAt, now());
      } catch {
        return true;
      }
    },
    () => false,
  );

  const open = isEligible && dismissedEventId !== event.id;

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();
  }, [open]);

  const close = useCallback(() => {
    try {
      window.localStorage.setItem(popupStorageKey(event.id), String(now()));
    } catch {
      // Storage failure must never prevent closing the highlight.
    }
    setDismissedEventId(event.id);
    queueMicrotask(() => previousFocusRef.current?.focus());
  }, [event.id, now]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, open]);

  if (!open) return null;

  const eventDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(event.event_date));

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-[var(--brown-900)]/72 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(mouseEvent) => {
        if (mouseEvent.currentTarget === mouseEvent.target) close();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={`event-popup-title-${event.id}`}
        className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/15 bg-[var(--warm-white)] shadow-[0_30px_90px_rgba(28,15,9,0.42)] motion-safe:animate-[fade-in_180ms_ease-out]"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={close}
          aria-label="Fechar destaque"
          className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full border border-[var(--sand-200)] bg-[var(--warm-white)] text-[var(--brown-900)] shadow-sm transition hover:bg-[var(--offwhite-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)]"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <div className="grid md:grid-cols-[0.78fr_1.22fr]">
          <div className="min-h-52 bg-[linear-gradient(145deg,var(--brown-700),var(--brown-900))] p-6 text-[var(--warm-white)] md:min-h-full">
            <CalendarDays className="size-7 text-[var(--sand-200)]" aria-hidden="true" />
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[var(--sand-200)]">Evento em destaque</p>
            <p className="mt-3 font-serif text-3xl font-semibold leading-tight">{eventDate}</p>
          </div>

          <div className="p-6 pt-16 sm:p-8 sm:pt-16">
            <h2 id={`event-popup-title-${event.id}`} className="font-serif text-4xl font-semibold leading-[0.95] tracking-[-0.03em] text-[var(--brown-900)] sm:text-5xl">
              {event.title}
            </h2>
            {event.description ? <p className="mt-5 line-clamp-4 text-sm leading-7 text-[var(--brown-700)]">{event.description}</p> : null}
            <p className="mt-5 text-sm font-semibold text-[var(--brown-900)]">{event.venue_name}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/eventos/${event.slug}`}
                onClick={() => setDismissedEventId(event.id)}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--brown-900)] px-5 py-2.5 text-sm font-bold text-[var(--warm-white)] transition hover:bg-[var(--brown-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)] focus-visible:ring-offset-2"
              >
                Ver detalhes
              </Link>
              <button type="button" onClick={close} className="inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold text-[var(--brown-700)] transition hover:bg-[var(--offwhite-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)]">
                Agora não
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
