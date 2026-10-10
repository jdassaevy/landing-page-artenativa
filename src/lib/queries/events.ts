import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache/tags";
import {
  isEventUpcoming,
  selectPopupEvent,
} from "@/lib/domain/events";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { SiteEvent } from "@/types/domain";

const EVENT_COLUMNS =
  "id, title, slug, description, event_date, status, show_on_home, show_as_popup, promotion_starts_at, promotion_ends_at, cover_path, venue_name, venue_address, venue_city, venue_state, maps_url, latitude, longitude, whatsapp_phone, reservation_message, ticket_message";

export async function getUpcomingEvents(): Promise<SiteEvent[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.events);

  const now = new Date();
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("status", "published")
    .gte("event_date", now.toISOString())
    .order("event_date", { ascending: true });

  if (error) throw new Error(`Não foi possível carregar os eventos: ${error.message}`);
  return ((data ?? []) as SiteEvent[]).filter((event) => isEventUpcoming(event, now));
}

export async function getEventBySlug(slug: string): Promise<SiteEvent | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.events);

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(`Não foi possível carregar o evento: ${error.message}`);
  return (data as SiteEvent | null) ?? null;
}

export async function getPublishedEventSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.events);

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("events")
    .select("slug")
    .eq("status", "published")
    .order("event_date", { ascending: false });

  if (error) {
    throw new Error(`Não foi possível carregar os slugs de eventos: ${error.message}`);
  }

  return (data ?? []).map((event) => event.slug);
}

export async function getPopupEvent(): Promise<SiteEvent | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.events);

  const now = new Date();
  const events = await getUpcomingEvents();
  return selectPopupEvent(events, now);
}
