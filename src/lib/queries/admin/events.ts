import "server-only";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAdminEvents() {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("events")
    .select("id, title, slug, cover_path, description, event_date, venue_name, venue_address, venue_city, venue_state, maps_url, latitude, longitude, whatsapp_phone, reservation_message, ticket_message, status, show_on_home, show_as_popup, promotion_starts_at, promotion_ends_at, created_at, updated_at")
    .order("event_date", { ascending: false });

  if (error) {
    throw new Error(`Não foi possível carregar os eventos do painel: ${error.message}`);
  }

  return data ?? [];
}
