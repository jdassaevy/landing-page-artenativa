export interface MapLocationInput {
  address: string | null;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
}

function buildLocationQuery(location: MapLocationInput): string {
  if (
    typeof location.latitude === "number" &&
    Number.isFinite(location.latitude) &&
    typeof location.longitude === "number" &&
    Number.isFinite(location.longitude)
  ) {
    return `${location.latitude},${location.longitude}`;
  }

  return [location.address, location.city, location.state]
    .map((value) => value?.trim() ?? "")
    .filter(Boolean)
    .join(", ");
}

export function buildMapsEmbedUrl(location: MapLocationInput, apiKey: string): string {
  const key = apiKey.trim();
  const query = buildLocationQuery(location);

  if (!key || !query) return "";

  return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${encodeURIComponent(query)}`;
}
