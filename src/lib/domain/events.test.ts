import { describe, expect, it } from "vitest";

import {
  isEventInPromotionWindow,
  isEventUpcoming,
  selectPopupEvent,
} from "./events";

const now = new Date("2026-10-09T18:00:00.000Z");

describe("event temporal rules", () => {
  it("considers a published event at the exact current instant upcoming", () => {
    expect(
      isEventUpcoming(
        { status: "published", event_date: now.toISOString() },
        now,
      ),
    ).toBe(true);
  });

  it("rejects drafts and past events from upcoming", () => {
    expect(
      isEventUpcoming(
        { status: "draft", event_date: "2026-10-10T18:00:00.000Z" },
        now,
      ),
    ).toBe(false);
    expect(
      isEventUpcoming(
        { status: "published", event_date: "2026-10-09T17:59:59.999Z" },
        now,
      ),
    ).toBe(false);
  });

  it("uses an inclusive promotion start and exclusive promotion end", () => {
    const window = {
      promotion_starts_at: now.toISOString(),
      promotion_ends_at: "2026-10-10T18:00:00.000Z",
    };

    expect(isEventInPromotionWindow(window, now)).toBe(true);
    expect(
      isEventInPromotionWindow(window, new Date("2026-10-10T18:00:00.000Z")),
    ).toBe(false);
  });

  it("allows open-ended promotion windows", () => {
    expect(
      isEventInPromotionWindow(
        { promotion_starts_at: null, promotion_ends_at: null },
        now,
      ),
    ).toBe(true);
    expect(
      isEventInPromotionWindow(
        { promotion_starts_at: "2026-10-10T18:00:00.000Z", promotion_ends_at: null },
        now,
      ),
    ).toBe(false);
  });

  it("selects the nearest eligible popup event", () => {
    const events = [
      {
        id: "later",
        status: "published",
        event_date: "2026-10-12T18:00:00.000Z",
        show_as_popup: true,
        promotion_starts_at: null,
        promotion_ends_at: null,
      },
      {
        id: "near",
        status: "published",
        event_date: "2026-10-10T18:00:00.000Z",
        show_as_popup: true,
        promotion_starts_at: null,
        promotion_ends_at: null,
      },
      {
        id: "hidden",
        status: "published",
        event_date: "2026-10-09T20:00:00.000Z",
        show_as_popup: false,
        promotion_starts_at: null,
        promotion_ends_at: null,
      },
    ];

    expect(selectPopupEvent(events, now)?.id).toBe("near");
  });
});
