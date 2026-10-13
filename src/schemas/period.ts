import { z } from "zod";

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

const dateSchema = z
  .string()
  .trim()
  .refine(isIsoDate, "Informe uma data válida no formato AAAA-MM-DD.");

const booleanFromForm = z.preprocess((value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return ["true", "1", "on", "yes"].includes(value.toLowerCase());
  }
  return value;
}, z.boolean());

export const periodSchema = z
  .object({
    name: z.string().trim().min(1, "Informe o nome do período.").max(120),
    starts_at: dateSchema,
    ends_at: dateSchema,
    is_current: booleanFromForm.default(false),
  })
  .superRefine((value, context) => {
    if (value.ends_at < value.starts_at) {
      context.addIssue({
        code: "custom",
        path: ["ends_at"],
        message: "A data final não pode ser anterior à data inicial.",
      });
    }
  });

export type PeriodInput = z.infer<typeof periodSchema>;
