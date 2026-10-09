"use server";

import { updateTag } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { classSchema } from "@/schemas/class";

import {
  actionFailure,
  type AdminActionResult,
  entityIdSchema,
  validationFailure,
} from "./result";

async function ensureClassReferences(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  locationId: string,
  periodId: string,
): Promise<AdminActionResult | null> {
  const [location, period] = await Promise.all([
    supabase
      .from("locations")
      .select("id, is_active")
      .eq("id", locationId)
      .maybeSingle(),
    supabase
      .from("class_periods")
      .select("id")
      .eq("id", periodId)
      .maybeSingle(),
  ]);

  if (location.error || period.error) {
    return actionFailure("Não foi possível validar o período e o local da aula.");
  }

  if (!location.data?.is_active) {
    return {
      ok: false,
      message: "Selecione um local ativo.",
      fieldErrors: { location_id: ["O local precisa estar ativo para receber uma aula."] },
    };
  }

  if (!period.data) {
    return {
      ok: false,
      message: "Selecione um período válido.",
      fieldErrors: { period_id: ["O período informado não existe."] },
    };
  }

  return null;
}

function invalidateClassCaches() {
  updateTag(CACHE_TAGS.classes);
  updateTag(CACHE_TAGS.dashboard);
}

export async function createClass(input: unknown): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = classSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const supabase = await createServerSupabaseClient();
  const referenceError = await ensureClassReferences(
    supabase,
    parsed.data.location_id,
    parsed.data.period_id,
  );
  if (referenceError) return referenceError;

  const { data, error } = await supabase
    .from("classes")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) return actionFailure("Não foi possível criar a aula.");

  invalidateClassCaches();
  return { ok: true, message: "Aula criada com sucesso.", id: data.id };
}

export async function updateClass(
  id: string,
  input: unknown,
): Promise<AdminActionResult> {
  await requireAdmin();

  const parsedId = entityIdSchema.safeParse(id);
  if (!parsedId.success) return validationFailure(parsedId.error);

  const parsed = classSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const supabase = await createServerSupabaseClient();
  const referenceError = await ensureClassReferences(
    supabase,
    parsed.data.location_id,
    parsed.data.period_id,
  );
  if (referenceError) return referenceError;

  const { data, error } = await supabase
    .from("classes")
    .update(parsed.data)
    .eq("id", parsedId.data)
    .select("id")
    .maybeSingle();

  if (error) return actionFailure("Não foi possível atualizar a aula.");
  if (!data) return actionFailure("Aula não encontrada.");

  invalidateClassCaches();
  return { ok: true, message: "Aula atualizada com sucesso.", id: data.id };
}

export async function setClassActive(
  id: string,
  isActive: boolean,
): Promise<AdminActionResult> {
  await requireAdmin();

  const parsedId = entityIdSchema.safeParse(id);
  if (!parsedId.success) return validationFailure(parsedId.error);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("classes")
    .update({ is_active: isActive })
    .eq("id", parsedId.data)
    .select("id")
    .maybeSingle();

  if (error) return actionFailure("Não foi possível alterar o status da aula.");
  if (!data) return actionFailure("Aula não encontrada.");

  invalidateClassCaches();
  return {
    ok: true,
    message: isActive ? "Aula ativada." : "Aula desativada.",
    id: data.id,
  };
}

export async function duplicateClass(id: string): Promise<AdminActionResult> {
  await requireAdmin();

  const parsedId = entityIdSchema.safeParse(id);
  if (!parsedId.success) return validationFailure(parsedId.error);

  const supabase = await createServerSupabaseClient();
  const { data: source, error: sourceError } = await supabase
    .from("classes")
    .select("period_id, location_id, modality, weekday, start_time, end_time, is_active")
    .eq("id", parsedId.data)
    .maybeSingle();

  if (sourceError) return actionFailure("Não foi possível carregar a aula para duplicação.");
  if (!source) return actionFailure("Aula não encontrada.");

  const referenceError = await ensureClassReferences(
    supabase,
    source.location_id,
    source.period_id,
  );
  if (referenceError) return referenceError;

  const { data, error } = await supabase
    .from("classes")
    .insert(source)
    .select("id")
    .single();

  if (error) return actionFailure("Não foi possível duplicar a aula.");

  invalidateClassCaches();
  return { ok: true, message: "Aula duplicada com sucesso.", id: data.id };
}
