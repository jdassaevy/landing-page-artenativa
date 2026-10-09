import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ track: vi.fn() }));

vi.mock("@vercel/analytics", () => ({
  track: mocks.track,
}));

import {
  TrackEventView,
  trackBuyTicket,
  trackOpenMaps,
  trackReserveTable,
  trackViewClasses,
} from "./analytics-events";

describe("site analytics events", () => {
  beforeEach(() => mocks.track.mockClear());

  it("tracks approved interaction names with non-sensitive identifiers only", () => {
    trackViewClasses("home");
    trackOpenMaps("loc-1");
    trackReserveTable("event-1");
    trackBuyTicket("event-1");

    expect(mocks.track.mock.calls).toEqual([
      ["view_classes", { source: "home" }],
      ["open_maps", { location_id: "loc-1" }],
      ["reserve_table", { event_id: "event-1" }],
      ["buy_ticket", { event_id: "event-1" }],
    ]);
  });

  it("tracks an event page view on mount", () => {
    render(<TrackEventView eventId="event-1" />);
    expect(mocks.track).toHaveBeenCalledWith("view_event", { event_id: "event-1" });
  });
});
