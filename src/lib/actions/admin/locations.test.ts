import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  createServerSupabaseClient: vi.fn(),
}));

vi.mock("@/lib/auth/require-admin", () => ({
  requireAdmin: mocks.requireAdmin,
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: mocks.createServerSupabaseClient,
}));

import {
  createLocation,
  setLocationActive,
  updateLocation,
} from "./locations";

describe("admin location action authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAdmin.mockRejectedValue(new Error("forbidden"));
  });

  it.each([
    ["createLocation", () => createLocation({})],
    ["updateLocation", () => updateLocation("not-an-id", {})],
    ["setLocationActive", () => setLocationActive("not-an-id", false)],
  ])("authorizes before %s does any database work", async (_name, action) => {
    await expect(action()).rejects.toThrow("forbidden");
    expect(mocks.requireAdmin).toHaveBeenCalledTimes(1);
    expect(mocks.createServerSupabaseClient).not.toHaveBeenCalled();
  });
});
