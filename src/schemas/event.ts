import { z } from "zod";

const emptyToNull = (value: unknown) =>
  value === "" || value === undefined ? null : value;

const optionalText = (max: number) =>
  z.preprocess(emptyToNull, z.string().trim().min(1).max(max).nullable());

const optionalUrl = z.preprocess(
  emptyToNull,
  z
    .string()
    .trim()
    .url("Informe uma URL válida.")
    .nullable(),
);

function optionalCoordinate(min: number, max: number, message: string) {
  return z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? null : value),
    z.coerce.number().min(min, message).max(max, message).nullable(),
  );
}

const booleanFromForm = z.preprocess((value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return ["true", "1", "on", "yes"].includes(value.toLowerCase());
  }
  return value;
}, z.boolean());

const optionalDateTime = z.preprocess(
  emptyToNull,
  z.string().trim().refine((value) => !Number.isNaN(Date.parse(value)), "Informe uma data e horário válidos.").nullable(),
);

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens.")
  .max(180);

export const eventSchema = z
  .object({
    title: z.string().trim().max(180),
    slug: z.string().trim().max(180),
    description: optionalText(12_000),
    event_date: z.string().trim(),
    venue_name: z.string().trim().max(180),
    venue_address: z.string().trim().max(280),
    venue_city: z.string().trim().max(140),
    venue_state: z.string().trim().max(2).transform((value) => value.toUpperCase()),
    maps_url: optionalUrl,
    latitude: optionalCoordinate(-90, 90, "Latitude inválida."),
    longitude: optionalCoordinate(-180, 180, "Longitude inválida."),
    whatsapp_phone: optionalText(30),
    reservation_message: optionalText(1200),
    ticket_message: optionalText(1200),
    status: z.enum(["draft", "published", "archived"]),
    show_on_home: booleanFromForm.default(false),
    show_as_popup: booleanFromForm.default(false),
    promotion_starts_at: optionalDateTime,
    promotion_ends_at: optionalDateTime,
    cover_path: optionalText(512),
  })
  .superRefine((value, ctx) => {
    if (value.status === "published") {
      if (!value.title) {
        ctx.addIssue({ code: "custom", path: ["title"], message: "Informe o título do evento." });
      }

      const slugResult = slugSchema.safeParse(value.slug);
      if (!slugResult.success) {
        ctx.addIssue({
          code: "custom",
          path: ["slug"],
          message: value.slug ? slugResult.error.issues[0]?.message ?? "Slug inválido." : "Informe o slug do evento.",
        });
      }

      if (!value.event_date || Number.isNaN(Date.parse(value.event_date))) {
        ctx.addIssue({ code: "custom", path: ["event_date"], message: "Informe a data do evento." });
      }
      if (!value.venue_name) {
        ctx.addIssue({ code: "custom", path: ["venue_name"], message: "Informe o nome do local." });
      }
      if (!value.venue_address) {
        ctx.addIssue({ code: "custom", path: ["venue_address"], message: "Informe o endereço do evento." });
      }
      if (!value.venue_city) {
        ctx.addIssue({ code: "custom", path: ["venue_city"], message: "Informe a cidade do evento." });
      }
      if (!value.venue_state) {
        ctx.addIssue({ code: "custom", path: ["venue_state"], message: "Informe o estado do evento." });
      }

      const hasCommercePhone = Boolean(value.whatsapp_phone);
      const hasCommerceMessage = Boolean(value.reservation_message || value.ticket_message);
      if (hasCommercePhone && !hasCommerceMessage) {
        ctx.addIssue({
          code: "custom",
          path: ["reservation_message"],
          message: "Informe ao menos uma mensagem para reserva ou ingresso.",
        });
      }
      if (hasCommerceMessage && !hasCommercePhone) {
        ctx.addIssue({
          code: "custom",
          path: ["whatsapp_phone"],
          message: "Informe o WhatsApp para usar os botões de reserva ou ingresso.",
        });
      }
    }

    if (
      value.promotion_starts_at &&
      value.promotion_ends_at &&
      Date.parse(value.promotion_ends_at) < Date.parse(value.promotion_starts_at)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["promotion_ends_at"],
        message: "O fim da promoção não pode ser anterior ao início.",
      });
    }
  });

export const eventImageSchema = z.object({
  size: z.number().int().nonnegative().max(8 * 1024 * 1024, "A imagem deve ter no máximo 8 MiB."),
  type: z.enum(["image/jpeg", "image/png", "image/webp"]),
});

export type EventInput = z.infer<typeof eventSchema>;
export type EventImageInput = z.infer<typeof eventImageSchema>;
