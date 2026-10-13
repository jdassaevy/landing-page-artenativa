import { describe, expect, it } from "vitest";

import { periodSchema } from "./period";

const validPeriod = {
  name: "1º Trimestre 2027",
  starts_at: "2027-01-10",
  ends_at: "2027-03-31",
  is_current: false,
};

describe("periodSchema", () => {
  it("accepts a valid period and trims its name", () => {
    const result = periodSchema.parse({ ...validPeriod, name: "  1º Trimestre 2027  " });
    expect(result.name).toBe("1º Trimestre 2027");
  });

  it("rejects a blank name", () => {
    const result = periodSchema.safeParse({ ...validPeriod, name: "   " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    }
  });

  it("rejects a period ending before it starts", () => {
    const result = periodSchema.safeParse({
      ...validPeriod,
      starts_at: "2027-04-01",
      ends_at: "2027-03-31",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.ends_at).toBeDefined();
    }
  });

  it("rejects malformed ISO dates", () => {
    const result = periodSchema.safeParse({ ...validPeriod, starts_at: "31/01/2027" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.starts_at).toBeDefined();
    }
  });
});
