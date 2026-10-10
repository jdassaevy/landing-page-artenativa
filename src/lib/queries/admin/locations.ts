import "server-only";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAdminLocations() {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("locations")
    .select("id, name, address, city, state, maps_url, latitude, longitude, image_path, is_active")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Não foi possível carregar os locais do painel: ${error.message}`);
  }

  return data ?? [];
}
