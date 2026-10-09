"use server";

import { randomUUID } from "node:crypto";

import { updateTag } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { eventSchema } from "@/schemas/event";

import {
  actionFailure,
  type AdminActionResult,
  entityIdSchema,
  validationFailure,
} from "./result";

const eventStatusSchema = z.enum(["draft", "published", "archived"]);

type UntypedRpcResult = PromiseLike<{
  data: unknown;
  error: { message: string } | null;
}>;

type FeaturedPopupRpc = (
  name: "set_featured_popup_event",
  args: { target_event_id: string },
) => UntypedRpcResult;

function invalidateEventCaches() {
  updateTag(CACHE_TAGS.events);
  updateTag(CACHE_TAGS.dashboard);
}

async function featureEvent(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  eventId: string,
) {
  const rpc = supabase.rpc as unknown as FeaturedPopupRpc;
  return rpc("set_featured_popup_event", { target_event_id: eventId });
}

export async function createEvent(input: unknown): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const supabase = await createServerSupabaseClient();
  const shouldFeature = parsed.data.show_as_popup;
  const payload = { ...parsed.data, show_as_popup: false };

  const { data, error } = await supabase
    .from("events")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        message: "Já existe um evento com esse slug.",
        fieldErrors: { slug: ["Escolha um slug diferente."] },
      };
    }
    return actionFailure("Não foi possível criar o evento.");
  }

  if (shouldFeature) {
    const { error: featureError } = await featureEvent(supabase, data.id);
    if (featureError) {
      await supabase.from("events").delete().eq("id", data.id);
      return actionFailure("O evento não foi criado porque não foi possível defini-lo como destaque.");
    }
  }

  invalidateEventCaches();
  return { ok: true, message: "Evento criado com sucesso.", id: data.id };
}

export async function updateEvent(
  id: string,
  input: unknown,
): Promise<AdminActionResult> {
  await requireAdmin();

  const parsedId = entityIdSchema.safeParse(id);
  if (!parsedId.success) return validationFailure(parsedId.error);

  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const supabase = await createServerSupabaseClient();
  const shouldFeature = parsed.data.show_as_popup && parsed.data.status === "published";
  const { show_as_popup: _requestedFeature, ...rest } = parsed.data;
  const payload = parsed.data.status === "published"
    ? rest
    : { ...rest, show_as_popup: false };

  const { data, error } = await supabase
    .from("events")
    .update(payload)
    .eq("id", parsedId.data)
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        message: "Já existe um evento com esse slug.",
        fieldErrors: { slug: ["Escolha um slug diferente."] },
      };
    }
    return actionFailure("Não foi possível atualizar o evento.");
  }
  if (!data) return actionFailure("Evento não encontrado.");

  if (shouldFeature) {
    const { error: featureError } = await featureEvent(supabase, parsedId.data);
    if (featureError) {
      return actionFailure("O evento foi atualizado, mas não foi possível torná-lo destaque.");
    }
  } else if (!parsed.data.show_as_popup || parsed.data.status !== "published") {
    const { error: clearError } = await supabase
      .from("events")
      .update({ show_as_popup: false })
      .eq("id", parsedId.data);
    if (clearError) return actionFailure("Não foi possível atualizar o destaque do evento.");
  }

  invalidateEventCaches();
  return { ok: true, message: "Evento atualizado com sucesso.", id: parsedId.data };
}

export async function duplicateEvent(id: string): Promise<AdminActionResult> {
  await requireAdmin();

  const parsedId = entityIdSchema.safeParse(id);
  if (!parsedId.success) return validationFailure(parsedId.error);

  const supabase = await createServerSupabaseClient();
  const { data: source, error: sourceError } = await supabase
    .from("events")
    .select("title, slug, cover_path, description, event_date, venue_name, venue_address, venue_city, venue_state, maps_url, latitude, longitude, whatsapp_phone, reservation_message, ticket_message, promotion_starts_at, promotion_ends_at")
    .eq("id", parsedId.data)
    .maybeSingle();

  if (sourceError) return actionFailure("Não foi possível carregar o evento para duplicação.");
  if (!source) return actionFailure("Evento não encontrado.");

  const copySuffix = randomUUID().slice(0, 8);
  const { data, error } = await supabase
    .from("events")
    .insert({
      ...source,
      title: `${source.title} (cópia)`,
      slug: `${source.slug}-copia-${copySuffix}`,
      status: "draft",
      show_on_home: false,
      show_as_popup: false,
    })
    .select("id")
    .single();

  if (error) return actionFailure("Não foi possível duplicar o evento.");

  invalidateEventCaches();
  return { ok: true, message: "Evento duplicado como rascunho.", id: data.id };
}

export async function setEventStatus(
  id: string,
  status: string,
): Promise<AdminActionResult> {
  await requireAdmin();

  const parsedId = entityIdSchema.safeParse(id);
  if (!parsedId.success) return validationFailure(parsedId.error);

  const parsedStatus = eventStatusSchema.safeParse(status);
  if (!parsedStatus.success) return validationFailure(parsedStatus.error);

  const supabase = await createServerSupabaseClient();

  if (parsedStatus.data === "published") {
    const { data: current, error: loadError } = await supabase
      .from("events")
      .select("title, slug, cover_path, description, event_date, venue_name, venue_address, venue_city, venue_state, maps_url, latitude, longitude, whatsapp_phone, reservation_message, ticket_message, status, show_on_home, show_as_popup, promotion_starts_at, promotion_ends_at")
      .eq("id", parsedId.data)
      .maybeSingle();

    if (loadError) return actionFailure("Não foi possível validar o evento antes da publicação.");
    if (!current) return actionFailure("Evento não encontrado.");

    const publishValidation = eventSchema.safeParse({ ...current, status: "published" });
    if (!publishValidation.success) return validationFailure(publishValidation.error);
  }

  const update = parsedStatus.data === "published"
    ? { status: parsedStatus.data }
    : { status: parsedStatus.data, show_as_popup: false };

  const { data, error } = await supabase
    .from("events")
    .update(update)
    .eq("id", parsedId.data)
    .select("id")
    .maybeSingle();

  if (error) return actionFailure("Não foi possível alterar o status do evento.");
  if (!data) return actionFailure("Evento não encontrado.");

  invalidateEventCaches();
  return {
    ok: true,
    message:
      parsedStatus.data === "published"
        ? "Evento publicado."
        : parsedStatus.data === "archived"
          ? "Evento arquivado."
          : "Evento movido para rascunho.",
    id: parsedId.data,
  };
}

export async function setFeaturedPopupEvent(id: string): Promise<AdminActionResult> {
  await requireAdmin();

  const parsedId = entityIdSchema.safeParse(id);
  if (!parsedId.success) return validationFailure(parsedId.error);

  const supabase = await createServerSupabaseClient();
  const { error } = await featureEvent(supabase, parsedId.data);

  if (error) return actionFailure("Não foi possível definir o evento como destaque do popup.");

  invalidateEventCaches();
  return {
    ok: true,
    message: "Evento definido como destaque do popup.",
    id: parsedId.data,
  };
}
