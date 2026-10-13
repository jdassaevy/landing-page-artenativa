import { describe, expect, it } from "vitest";

import {
  POPUP_SILENCE_MS,
  isPopupDismissedWithinWindow,
  popupStorageKey,
} from "./popup";

describe("popup helpers", () => {
  it("scopes dismissal to the event id", () => {
    expect(popupStorageKey("event-a")).not.toBe(popupStorageKey("event-b"));
    expect(popupStorageKey("event-a")).toContain("event-a");
  });

  it("keeps the same event silent for less than 24 hours", () => {
    const now = Date.parse("2026-10-09T18:00:00.000Z");
    const dismissedAt = now - (POPUP_SILENCE_MS - 1);

    expect(isPopupDismissedWithinWindow(dismissedAt, now)).toBe(true);
  });

  it("allows the event to appear again exactly at 24 hours", () => {
    const now = Date.parse("2026-10-09T18:00:00.000Z");
    const dismissedAt = now - POPUP_SILENCE_MS;

    expect(isPopupDismissedWithinWindow(dismissedAt, now)).toBe(false);
  });

  it("fails open for missing, corrupt or future timestamps", () => {
    const now = Date.parse("2026-10-09T18:00:00.000Z");

    expect(isPopupDismissedWithinWindow(null, now)).toBe(false);
    expect(isPopupDismissedWithinWindow("not-a-date", now)).toBe(false);
    expect(isPopupDismissedWithinWindow(now + 1, now)).toBe(false);
  });
});
