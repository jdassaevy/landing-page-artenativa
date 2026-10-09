import { z } from "zod";

export type FieldErrors = Record<string, string[]>;

export interface AdminActionResult {
  ok: boolean;
  message: string;
  id?: string;
  fieldErrors?: FieldErrors;
  requiresConfirmation?: boolean;
  activeClassCount?: number;
}

export const entityIdSchema = z.string().uuid("Identificador inválido.");

export function validationFailure(error: z.ZodError): AdminActionResult {
  const flattened = error.flatten().fieldErrors;
  const fieldErrors = Object.fromEntries(
    Object.entries(flattened).filter((entry): entry is [string, string[]] => Boolean(entry[1]?.length)),
  );

  return {
    ok: false,
    message: "Revise os campos destacados.",
    fieldErrors,
  };
}

export function actionFailure(message: string): AdminActionResult {
  return { ok: false, message };
}
