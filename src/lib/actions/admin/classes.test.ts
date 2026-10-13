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
  createClass,
  duplicateClass,
  setClassActive,
  updateClass,
} from "./classes";

describe("admin class action authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAdmin.mockRejectedValue(new Error("forbidden"));
  });

  it.each([
    ["createClass", () => createClass({})],
    ["updateClass", () => updateClass("not-an-id", {})],
    ["setClassActive", () => setClassActive("not-an-id", false)],
    ["duplicateClass", () => duplicateClass("not-an-id")],
  ])("authorizes before %s does any database work", async (_name, action) => {
    await expect(action()).rejects.toThrow("forbidden");
    expect(mocks.requireAdmin).toHaveBeenCalledTimes(1);
    expect(mocks.createServerSupabaseClient).not.toHaveBeenCalled();
  });
});
