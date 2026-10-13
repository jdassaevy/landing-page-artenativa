import { describe, expect, it } from "vitest";

import { classSchema } from "./class";

const validClass = {
  period_id: "11111111-1111-4111-8111-111111111111",
  location_id: "22222222-2222-4222-8222-222222222222",
  modality: "Dança Gaúcha",
  weekday: 1,
  start_time: "18:30",
  end_time: "19:30",
  is_active: true,
};

describe("classSchema", () => {
  it("accepts a valid class and trims modality", () => {
    const result = classSchema.parse({ ...validClass, modality: "  Dança Gaúcha  " });
    expect(result.modality).toBe("Dança Gaúcha");
  });

  it.each([0, 8])("rejects weekday %s", (weekday) => {
    const result = classSchema.safeParse({ ...validClass, weekday });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.weekday).toBeDefined();
    }
  });

  it("rejects end time equal to or before start time", () => {
    for (const end_time of ["18:30", "18:00"]) {
      const result = classSchema.safeParse({ ...validClass, end_time });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.end_time).toBeDefined();
      }
    }
  });

  it("requires period and location UUIDs", () => {
    const result = classSchema.safeParse({
      ...validClass,
      period_id: "",
      location_id: "not-a-uuid",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.period_id).toBeDefined();
      expect(fields.location_id).toBeDefined();
    }
  });
});
