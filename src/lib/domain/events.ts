type UpcomingEventShape = {
  status: string;
  event_date: string;
};

type PromotionWindowShape = {
  promotion_starts_at: string | null;
  promotion_ends_at: string | null;
};

type PopupEventShape = UpcomingEventShape &
  PromotionWindowShape & {
    id: string;
    show_as_popup: boolean;
  };

function timestamp(value: string | null | undefined): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isEventUpcoming(event: UpcomingEventShape, now: Date): boolean {
  if (event.status !== "published") return false;
  const eventTimestamp = timestamp(event.event_date);
  return eventTimestamp !== null && eventTimestamp >= now.getTime();
}

export function isEventInPromotionWindow(
  event: PromotionWindowShape,
  now: Date,
): boolean {
  const nowTimestamp = now.getTime();
  const startsAt = event.promotion_starts_at
    ? timestamp(event.promotion_starts_at)
    : null;
  const endsAt = event.promotion_ends_at
    ? timestamp(event.promotion_ends_at)
    : null;

  if (event.promotion_starts_at && startsAt === null) return false;
  if (event.promotion_ends_at && endsAt === null) return false;
  if (startsAt !== null && nowTimestamp < startsAt) return false;
  if (endsAt !== null && nowTimestamp >= endsAt) return false;

  return true;
}

export function selectPopupEvent<T extends PopupEventShape>(
  events: readonly T[],
  now: Date,
): T | null {
  const eligible = events.filter(
    (event) =>
      event.show_as_popup &&
      isEventUpcoming(event, now) &&
      isEventInPromotionWindow(event, now),
  );

  return (
    [...eligible].sort((left, right) => {
      const dateDifference =
        Date.parse(left.event_date) - Date.parse(right.event_date);
      return dateDifference || left.id.localeCompare(right.id);
    })[0] ?? null
  );
}
