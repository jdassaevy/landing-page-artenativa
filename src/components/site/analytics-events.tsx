"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";

export type ClassesAnalyticsSource = "home" | "header" | "footer" | "classes_page";

export function trackViewClasses(source: ClassesAnalyticsSource) {
  track("view_classes", { source });
}

export function trackOpenMaps(locationId: string) {
  track("open_maps", { location_id: locationId });
}

export function trackReserveTable(eventId: string) {
  track("reserve_table", { event_id: eventId });
}

export function trackBuyTicket(eventId: string) {
  track("buy_ticket", { event_id: eventId });
}

export function trackViewEvent(eventId: string) {
  track("view_event", { event_id: eventId });
}

export function TrackEventView({ eventId }: { eventId: string }) {
  useEffect(() => {
    trackViewEvent(eventId);
  }, [eventId]);

  return null;
}
