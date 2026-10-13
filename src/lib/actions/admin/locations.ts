"use server";

import { updateTag } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { locationSchema } from "@/schemas/location";

import {
  actionFailure,
  type AdminActionResult,
  entityIdSchema,
  validationFailure,
} from "./result";

function invalidateLocationCaches() {
  updateTag(CACHE_TAGS.locations);
  updateTag(CACHE_TAGS.classes);
  updateTag(CACHE_TAGS.dashboard);
}

export async function createLocation(input: unknown): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = locationSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("locations")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) return actionFailure("Não foi possível criar o local.");

  invalidateLocationCaches();
  return { ok: true, message: "Local criado com sucesso.", id: data.id };
}

export async function updateLocation(
  id: string,
  input: unknown,
): Promise<AdminActionResult> {
  await requireAdmin();

  const parsedId = entityIdSchema.safeParse(id);
  if (!parsedId.success) return validationFailure(parsedId.error);

  const parsed = locationSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("locations")
    .update(parsed.data)
    .eq("id", parsedId.data)
    .select("id")
    .maybeSingle();

  if (error) return actionFailure("Não foi possível atualizar o local.");
  if (!data) return actionFailure("Local não encontrado.");

  invalidateLocationCaches();
  return { ok: true, message: "Local atualizado com sucesso.", id: data.id };
}

export async function setLocationActive(
  id: string,
  isActive: boolean,
  force = false,
): Promise<AdminActionResult> {
  await requireAdmin();

  const parsedId = entityIdSchema.safeParse(id);
  if (!parsedId.success) return validationFailure(parsedId.error);

  const supabase = await createServerSupabaseClient();

  if (!isActive) {
    const { count, error: countError } = await supabase
      .from("classes")
      .select("id", { count: "exact", head: true })
      .eq("location_id", parsedId.data)
      .eq("is_active", true);

    if (countError) return actionFailure("Não foi possível verificar as aulas que usam este local.");

    const activeClassCount = count ?? 0;
    if (activeClassCount > 0 && !force) {
      return {
        ok: false,
        requiresConfirmation: true,
        activeClassCount,
        message: `Este local está sendo usado por ${activeClassCount} aula${activeClassCount === 1 ? " ativa" : "s ativas"}.`,
      };
    }
  }

  const { data, error } = await supabase
    .from("locations")
    .update({ is_active: isActive })
    .eq("id", parsedId.data)
    .select("id")
    .maybeSingle();

  if (error) return actionFailure("Não foi possível alterar o status do local.");
  if (!data) return actionFailure("Local não encontrado.");

  invalidateLocationCaches();
  return {
    ok: true,
    message: isActive ? "Local ativado." : "Local desativado.",
    id: data.id,
  };
}
