import type { Tables } from "@/types/database";

export type DanceClass = Tables<"classes">;
export type ClassPeriod = Tables<"class_periods">;
export type Location = Tables<"locations">;
export type SiteEvent = Tables<"events">;

export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  1: "Segunda-feira",
  2: "Terça-feira",
  3: "Quarta-feira",
  4: "Quinta-feira",
  5: "Sexta-feira",
  6: "Sábado",
  7: "Domingo",
};

export type PublicLocation = Pick<
  Location,
  | "id"
  | "name"
  | "address"
  | "city"
  | "state"
  | "maps_url"
  | "latitude"
  | "longitude"
  | "image_path"
>;

export type PublicClass = Pick<
  DanceClass,
  | "id"
  | "modality"
  | "weekday"
  | "start_time"
  | "end_time"
  | "location_id"
  | "period_id"
> & {
  location: PublicLocation | null;
};
