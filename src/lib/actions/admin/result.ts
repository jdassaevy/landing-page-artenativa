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
  const fieldErrors: FieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field !== "string") continue;

    fieldErrors[field] ??= [];
    fieldErrors[field].push(issue.message);
  }

  return {
    ok: false,
    message: "Revise os campos destacados.",
    fieldErrors,
  };
}

export function actionFailure(message: string): AdminActionResult {
  return { ok: false, message };
}
