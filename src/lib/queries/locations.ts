import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache/tags";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { PublicLocation } from "@/types/domain";

export async function getActiveLocations(): Promise<PublicLocation[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.locations);

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("locations")
    .select(
      "id, name, address, city, state, maps_url, latitude, longitude, image_path",
    )
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) throw new Error(`Não foi possível carregar os locais: ${error.message}`);
  return (data ?? []) as PublicLocation[];
}
