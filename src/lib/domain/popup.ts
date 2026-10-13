export const POPUP_SILENCE_MS = 86_400_000;

export function popupStorageKey(eventId: string): string {
  const normalizedId = eventId.trim();
  if (!normalizedId) throw new Error("Event id is required for popup storage.");
  return `arte-nativa:event-popup:dismissed:${normalizedId}`;
}

function parseDismissedAt(value: number | string | null | undefined): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string" || value.trim() === "") return null;

  const numericValue = Number(value);
  if (Number.isFinite(numericValue)) return numericValue;

  const dateValue = Date.parse(value);
  return Number.isFinite(dateValue) ? dateValue : null;
}

export function isPopupDismissedWithinWindow(
  dismissedAt: number | string | null | undefined,
  now = Date.now(),
): boolean {
  const timestamp = parseDismissedAt(dismissedAt);
  if (timestamp === null || timestamp > now) return false;
  return now - timestamp < POPUP_SILENCE_MS;
}
