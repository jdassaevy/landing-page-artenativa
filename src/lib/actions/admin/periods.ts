"use server";

import { updateTag } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { periodSchema } from "@/schemas/period";

import {
  actionFailure,
  type AdminActionResult,
  entityIdSchema,
  validationFailure,
} from "./result";

const duplicatePeriodSchema = z
  .object({
    source_period_id: z.string().uuid("Selecione um período de origem válido."),
    new_name: z.string().trim().min(1, "Informe o nome do novo período.").max(120),
    new_starts_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data inicial válida."),
    new_ends_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data final válida."),
  })
  .superRefine((value, context) => {
    if (value.new_ends_at < value.new_starts_at) {
      context.addIssue({
        code: "custom",
        path: ["new_ends_at"],
        message: "A data final não pode ser anterior à data inicial.",
      });
    }
  });

function invalidatePeriodCaches() {
  updateTag(CACHE_TAGS.classes);
  updateTag(CACHE_TAGS.dashboard);
}

type UntypedRpcResult = PromiseLike<{
  data: unknown;
  error: { message: string } | null;
}>;

type SetCurrentPeriodRpc = (
  name: "set_current_class_period",
  args: { target_period_id: string },
) => UntypedRpcResult;

export async function createPeriod(input: unknown): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = periodSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const supabase = await createServerSupabaseClient();
  const shouldBecomeCurrent = parsed.data.is_current;
  const { data, error } = await supabase
    .from("class_periods")
    .insert({ ...parsed.data, is_current: false })
    .select("id")
    .single();

  if (error) return actionFailure("Não foi possível criar o período.");

  if (shouldBecomeCurrent) {
    const rpc = supabase.rpc as unknown as SetCurrentPeriodRpc;
    const { error: switchError } = await rpc("set_current_class_period", {
      target_period_id: data.id,
    });

    if (switchError) {
      await supabase.from("class_periods").delete().eq("id", data.id);
      return actionFailure("O período não foi criado porque não foi possível torná-lo atual.");
    }
  }

  invalidatePeriodCaches();
  return { ok: true, message: "Período criado com sucesso.", id: data.id };
}

export async function duplicatePeriod(input: unknown): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = duplicatePeriodSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("duplicate_class_period", {
    source_period_id: parsed.data.source_period_id,
    new_name: parsed.data.new_name,
    new_starts_at: parsed.data.new_starts_at,
    new_ends_at: parsed.data.new_ends_at,
  });

  if (error) return actionFailure("Não foi possível duplicar o período e suas aulas.");

  invalidatePeriodCaches();
  return { ok: true, message: "Período e aulas duplicados com sucesso.", id: data };
}

export async function setCurrentPeriod(id: string): Promise<AdminActionResult> {
  await requireAdmin();

  const parsedId = entityIdSchema.safeParse(id);
  if (!parsedId.success) return validationFailure(parsedId.error);

  const supabase = await createServerSupabaseClient();
  const rpc = supabase.rpc as unknown as SetCurrentPeriodRpc;
  const { error } = await rpc("set_current_class_period", {
    target_period_id: parsedId.data,
  });

  if (error) return actionFailure("Não foi possível definir o período como atual.");

  invalidatePeriodCaches();
  return { ok: true, message: "Período atual alterado com sucesso.", id: parsedId.data };
}
