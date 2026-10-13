import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache/tags";
import { sortClasses } from "@/lib/domain/classes";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { PublicClass } from "@/types/domain";

type ClassQueryRow = PublicClass & {
  period: { is_current: boolean } | null;
};

export async function getCurrentClasses(): Promise<PublicClass[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.classes, CACHE_TAGS.locations);

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("classes")
    .select(
      "id, modality, weekday, start_time, end_time, location_id, period_id, location:locations!inner(id, name, address, city, state, maps_url, latitude, longitude, image_path), period:class_periods!inner(is_current)",
    )
    .eq("is_active", true)
    .eq("period.is_current", true)
    .order("weekday", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw new Error(`Não foi possível carregar as aulas: ${error.message}`);

  const rows = (data ?? []) as unknown as ClassQueryRow[];
  const publicRows: PublicClass[] = rows
    .filter((row) => row.period?.is_current)
    .map((row) => ({
      id: row.id,
      modality: row.modality,
      weekday: row.weekday,
      start_time: row.start_time,
      end_time: row.end_time,
      location_id: row.location_id,
      period_id: row.period_id,
      location: row.location,
    }));

  return sortClasses(publicRows);
}
