export const CACHE_TAGS = {
  classes: "classes",
  locations: "locations",
  events: "events",
  dashboard: "dashboard",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
