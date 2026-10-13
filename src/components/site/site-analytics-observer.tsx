"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  trackBuyTicket,
  trackOpenMaps,
  trackReserveTable,
  trackViewClasses,
  trackViewEvent,
} from "@/components/site/analytics-events";

function eventIdentifierFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/eventos\/([^/]+)$/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function eventIdentifierFromCard(element: Element): string | null {
  const article = element.closest("article");
  const eventLink = article?.querySelector<HTMLAnchorElement>('a[href^="/eventos/"]');
  if (!eventLink) return null;
  const match = eventLink.getAttribute("href")?.match(/^\/eventos\/([^/?#]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function locationIdentifier(element: Element, pathname: string): string {
  const locationRoot = element.closest<HTMLElement>('[id^="local-"]');
  if (locationRoot?.id) return locationRoot.id.replace(/^local-/, "");
  return eventIdentifierFromPath(pathname) ?? pathname;
}

function classesSource(element: Element): "header" | "footer" | "classes_page" {
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  return "classes_page";
}

export function SiteAnalyticsObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const eventId = eventIdentifierFromPath(pathname);
    if (eventId) trackViewEvent(eventId);
  }, [pathname]);

  useEffect(() => {
    function handleClick(clickEvent: MouseEvent) {
      const target = clickEvent.target;
      if (!(target instanceof Element)) return;

      const interactive = target.closest<HTMLElement>("a, button");
      if (!interactive) return;

      if (interactive instanceof HTMLAnchorElement) {
        const href = interactive.getAttribute("href") ?? "";

        if (href === "/aulas") {
          trackViewClasses(classesSource(interactive));
          return;
        }

        if (href.includes("google.com/maps/dir")) {
          trackOpenMaps(locationIdentifier(interactive, pathname));
          return;
        }

        if (href.startsWith("https://wa.me/")) {
          const eventId =
            eventIdentifierFromPath(pathname) ??
            eventIdentifierFromCard(interactive);
          if (!eventId) return;

          const label = interactive.textContent?.toLocaleLowerCase("pt-BR") ?? "";
          if (label.includes("reserv")) trackReserveTable(eventId);
          else if (label.includes("ingresso") || label.includes("compr")) trackBuyTicket(eventId);
          return;
        }
      }

      if (
        interactive instanceof HTMLButtonElement &&
        interactive.textContent?.toLocaleLowerCase("pt-BR").includes("carregar mapa")
      ) {
        trackOpenMaps(locationIdentifier(interactive, pathname));
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  return null;
}
