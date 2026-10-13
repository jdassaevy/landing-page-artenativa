import { describe, expect, it } from "vitest";

import {
  AdminAuthorizationError,
  authorizeAdminClaims,
} from "./require-admin";

describe("authorizeAdminClaims", () => {
  it("rejects a missing authenticated identity", () => {
    expect(() => authorizeAdminClaims(null)).toThrow(AdminAuthorizationError);
  });

  it("rejects an authenticated user without the admin app metadata role", () => {
    expect(() =>
      authorizeAdminClaims({
        sub: "user-1",
        email: "member@example.com",
        app_metadata: { role: "member" },
        user_metadata: {},
      }),
    ).toThrow(AdminAuthorizationError);
  });

  it("does not trust admin role from user_metadata", () => {
    expect(() =>
      authorizeAdminClaims({
        sub: "user-2",
        email: "fake-admin@example.com",
        app_metadata: {},
        user_metadata: { role: "admin" },
      }),
    ).toThrow(AdminAuthorizationError);
  });

  it("accepts admin role only from app_metadata", () => {
    expect(
      authorizeAdminClaims({
        sub: "admin-1",
        email: "admin@example.com",
        app_metadata: { role: "admin" },
        user_metadata: { role: "member" },
      }),
    ).toEqual({
      id: "admin-1",
      email: "admin@example.com",
    });
  });

  it("accepts a verified admin claim even when email is absent", () => {
    expect(
      authorizeAdminClaims({
        sub: "admin-2",
        app_metadata: { role: "admin" },
        user_metadata: {},
      }),
    ).toEqual({
      id: "admin-2",
      email: null,
    });
  });
});
