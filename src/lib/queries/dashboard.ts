import { requireAdmin } from "@/lib/auth/require-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface DashboardSummary {
  classes: number;
  locations: number;
  events: number;
  periods: number;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();

  const [classes, locations, events, periods] = await Promise.all([
    supabase.from("classes").select("id", { count: "exact", head: true }),
    supabase.from("locations").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("class_periods").select("id", { count: "exact", head: true }),
  ]);

  const firstError = [classes.error, locations.error, events.error, periods.error].find(Boolean);
  if (firstError) {
    throw new Error(`Não foi possível carregar o dashboard: ${firstError.message}`);
  }

  return {
    classes: classes.count ?? 0,
    locations: locations.count ?? 0,
    events: events.count ?? 0,
    periods: periods.count ?? 0,
  };
}
