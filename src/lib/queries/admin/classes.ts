import "server-only";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAdminClassManagementData() {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();

  const [classesResult, periodsResult, locationsResult] = await Promise.all([
    supabase
      .from("classes")
      .select("id, period_id, location_id, modality, weekday, start_time, end_time, is_active")
      .order("weekday", { ascending: true })
      .order("start_time", { ascending: true }),
    supabase
      .from("class_periods")
      .select("id, name, starts_at, ends_at, is_current")
      .order("starts_at", { ascending: false }),
    supabase
      .from("locations")
      .select("id, name, is_active")
      .order("name", { ascending: true }),
  ]);

  if (classesResult.error) {
    throw new Error(`Não foi possível carregar as aulas do painel: ${classesResult.error.message}`);
  }
  if (periodsResult.error) {
    throw new Error(`Não foi possível carregar os períodos do painel: ${periodsResult.error.message}`);
  }
  if (locationsResult.error) {
    throw new Error(`Não foi possível carregar os locais do painel: ${locationsResult.error.message}`);
  }

  return {
    classes: classesResult.data ?? [],
    periods: periodsResult.data ?? [],
    locations: locationsResult.data ?? [],
  };
}
