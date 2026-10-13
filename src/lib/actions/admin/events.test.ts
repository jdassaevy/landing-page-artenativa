import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  createServerSupabaseClient: vi.fn(),
}));

vi.mock("@/lib/auth/require-admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/supabase/server", () => ({ createServerSupabaseClient: mocks.createServerSupabaseClient }));

import {
  createEvent,
  duplicateEvent,
  setEventStatus,
  setFeaturedPopupEvent,
  updateEvent,
} from "./events";

describe("admin event action authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAdmin.mockRejectedValue(new Error("forbidden"));
  });

  it.each([
    ["createEvent", () => createEvent({})],
    ["updateEvent", () => updateEvent("not-an-id", {})],
    ["duplicateEvent", () => duplicateEvent("not-an-id")],
    ["setEventStatus", () => setEventStatus("not-an-id", "published")],
    ["setFeaturedPopupEvent", () => setFeaturedPopupEvent("not-an-id")],
  ])("authorizes before %s touches the database", async (_name, action) => {
    await expect(action()).rejects.toThrow("forbidden");
    expect(mocks.requireAdmin).toHaveBeenCalledTimes(1);
    expect(mocks.createServerSupabaseClient).not.toHaveBeenCalled();
  });
});
