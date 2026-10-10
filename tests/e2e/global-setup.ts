import { createClient } from "@supabase/supabase-js";

import type { Database } from "../../src/types/database";
import { E2E_FIXTURES } from "./fixtures";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required E2E environment variable: ${name}`);
  return value;
}

function assertNoError(label: string, error: { message: string } | null) {
  if (error) throw new Error(`${label}: ${error.message}`);
}

export default async function globalSetup() {
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  const cleanupClasses = await supabase
    .from("classes")
    .delete()
    .eq("period_id", E2E_FIXTURES.period.id);
  assertNoError("cleanup classes", cleanupClasses.error);

  const cleanupEvents = await supabase
    .from("events")
    .delete()
    .like("slug", "e2e-%");
  assertNoError("cleanup events", cleanupEvents.error);

  const cleanupPeriod = await supabase
    .from("class_periods")
    .delete()
    .eq("id", E2E_FIXTURES.period.id);
  assertNoError("cleanup period", cleanupPeriod.error);

  const cleanupLocation = await supabase
    .from("locations")
    .delete()
    .eq("id", E2E_FIXTURES.location.id);
  assertNoError("cleanup location", cleanupLocation.error);

  const existingCurrentPeriod = await supabase
    .from("class_periods")
    .update({ is_current: false })
    .eq("is_current", true);
  assertNoError("clear existing current period", existingCurrentPeriod.error);

  const locationInsert = await supabase.from("locations").insert({
    id: E2E_FIXTURES.location.id,
    name: E2E_FIXTURES.location.name,
    address: E2E_FIXTURES.location.address,
    city: E2E_FIXTURES.location.city,
    state: E2E_FIXTURES.location.state,
    maps_url: "https://maps.google.com/?q=Arte+Nativa+E2E",
    latitude: -27.687,
    longitude: -48.778,
    is_active: true,
  });
  assertNoError("seed location", locationInsert.error);

  const periodInsert = await supabase.from("class_periods").insert({
    id: E2E_FIXTURES.period.id,
    name: E2E_FIXTURES.period.name,
    starts_at: "2026-10-01",
    ends_at: "2026-12-31",
    is_current: true,
  });
  assertNoError("seed period", periodInsert.error);

  const classInsert = await supabase.from("classes").insert(
    E2E_FIXTURES.classes.map((item) => ({
      id: item.id,
      period_id: E2E_FIXTURES.period.id,
      location_id: E2E_FIXTURES.location.id,
      modality: item.modality,
      weekday: item.weekday,
      start_time: item.startTime,
      end_time: item.endTime,
      is_active: true,
    })),
  );
  assertNoError("seed classes", classInsert.error);

  const eventInsert = await supabase.from("events").insert([
    {
      id: E2E_FIXTURES.event.id,
      title: E2E_FIXTURES.event.title,
      slug: E2E_FIXTURES.event.slug,
      description: E2E_FIXTURES.event.description,
      event_date: E2E_FIXTURES.event.date,
      venue_name: E2E_FIXTURES.location.name,
      venue_address: E2E_FIXTURES.location.address,
      venue_city: E2E_FIXTURES.location.city,
      venue_state: E2E_FIXTURES.location.state,
      maps_url: "https://maps.google.com/?q=Arte+Nativa+E2E",
      latitude: -27.687,
      longitude: -48.778,
      whatsapp_phone: E2E_FIXTURES.event.phone,
      reservation_message: E2E_FIXTURES.event.reservationMessage,
      ticket_message: E2E_FIXTURES.event.ticketMessage,
      status: "published",
      show_on_home: true,
      show_as_popup: true,
    },
    {
      id: E2E_FIXTURES.pastEvent.id,
      title: E2E_FIXTURES.pastEvent.title,
      slug: E2E_FIXTURES.pastEvent.slug,
      description: "Evento E2E antigo que não deve aparecer na agenda futura.",
      event_date: E2E_FIXTURES.pastEvent.date,
      venue_name: E2E_FIXTURES.location.name,
      venue_address: E2E_FIXTURES.location.address,
      venue_city: E2E_FIXTURES.location.city,
      venue_state: E2E_FIXTURES.location.state,
      status: "published",
      show_on_home: false,
      show_as_popup: false,
    },
  ]);
  assertNoError("seed events", eventInsert.error);

  const users = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (users.error) throw new Error(`list E2E users: ${users.error.message}`);

  const fixtureEmails = new Set([
    E2E_FIXTURES.admin.email,
    E2E_FIXTURES.member.email,
  ]);

  for (const user of users.data.users) {
    if (!user.email || !fixtureEmails.has(user.email)) continue;
    const deleted = await supabase.auth.admin.deleteUser(user.id);
    if (deleted.error) throw new Error(`cleanup E2E user: ${deleted.error.message}`);
  }

  const adminUser = await supabase.auth.admin.createUser({
    email: E2E_FIXTURES.admin.email,
    password: E2E_FIXTURES.admin.password,
    email_confirm: true,
    app_metadata: { role: "admin" },
  });
  if (adminUser.error) throw new Error(`seed admin user: ${adminUser.error.message}`);

  const memberUser = await supabase.auth.admin.createUser({
    email: E2E_FIXTURES.member.email,
    password: E2E_FIXTURES.member.password,
    email_confirm: true,
    app_metadata: { role: "member" },
  });
  if (memberUser.error) throw new Error(`seed member user: ${memberUser.error.message}`);
}
