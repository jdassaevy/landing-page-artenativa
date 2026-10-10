import { z } from "zod";

const timeSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/, "Informe um horário válido.");

function timeToSeconds(value: string): number {
  const [hours, minutes, seconds = "0"] = value.split(":");
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

const booleanFromForm = z.preprocess((value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return ["true", "1", "on", "yes"].includes(value.toLowerCase());
  }
  return value;
}, z.boolean());

export const classSchema = z
  .object({
    period_id: z.string().uuid("Selecione um período válido."),
    location_id: z.string().uuid("Selecione um local válido."),
    modality: z.string().trim().min(1, "Informe a modalidade.").max(120),
    weekday: z.coerce.number().int().min(1, "Dia inválido.").max(7, "Dia inválido."),
    start_time: timeSchema,
    end_time: timeSchema,
    is_active: booleanFromForm.default(true),
  })
  .superRefine((value, context) => {
    if (timeToSeconds(value.end_time) <= timeToSeconds(value.start_time)) {
      context.addIssue({
        code: "custom",
        path: ["end_time"],
        message: "O horário final deve ser depois do horário inicial.",
      });
    }
  });

export type ClassInput = z.infer<typeof classSchema>;
