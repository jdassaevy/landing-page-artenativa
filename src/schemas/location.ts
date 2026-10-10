import { z } from "zod";

const optionalUrl = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return null;
  return typeof value === "string" ? value.trim() : value;
}, z.string().refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}, "Informe uma URL válida do Google Maps.").nullable());

function optionalCoordinate(min: number, max: number, message: string) {
  return z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) return null;
    return value;
  }, z.coerce.number().min(min, message).max(max, message).nullable());
}

const booleanFromForm = z.preprocess((value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return ["true", "1", "on", "yes"].includes(value.toLowerCase());
  }
  return value;
}, z.boolean());

export const locationSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do local.").max(160),
  address: z.string().trim().min(1, "Informe o endereço.").max(240),
  city: z.string().trim().min(1, "Informe a cidade.").max(120),
  state: z.string().trim().min(1, "Informe o estado.").max(2).transform((value) => value.toUpperCase()),
  maps_url: optionalUrl,
  latitude: optionalCoordinate(-90, 90, "Latitude inválida."),
  longitude: optionalCoordinate(-180, 180, "Longitude inválida."),
  image_path: z.preprocess(
    (value) => (value === "" || value === undefined ? null : value),
    z.string().trim().min(1).nullable(),
  ),
  is_active: booleanFromForm.default(true),
});

export type LocationInput = z.infer<typeof locationSchema>;
