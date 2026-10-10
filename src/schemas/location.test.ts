import { describe, expect, it } from "vitest";

import { locationSchema } from "./location";

const validLocation = {
  name: "Sede Arte Nativa",
  address: "Rua das Tradições, 100",
  city: "Santo Amaro da Imperatriz",
  state: "SC",
  maps_url: "https://maps.google.com/?q=Santo+Amaro+da+Imperatriz",
  latitude: -27.687,
  longitude: -48.778,
  image_path: null,
  is_active: true,
};

describe("locationSchema", () => {
  it("accepts a valid location and trims textual fields", () => {
    const result = locationSchema.parse({
      ...validLocation,
      name: "  Sede Arte Nativa  ",
      city: "  Santo Amaro da Imperatriz  ",
    });

    expect(result.name).toBe("Sede Arte Nativa");
    expect(result.city).toBe("Santo Amaro da Imperatriz");
  });

  it("rejects a malformed Maps URL", () => {
    const result = locationSchema.safeParse({ ...validLocation, maps_url: "maps://nao-e-url" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.maps_url).toBeDefined();
    }
  });

  it("accepts an empty Maps URL as no URL", () => {
    const result = locationSchema.parse({ ...validLocation, maps_url: "" });
    expect(result.maps_url).toBeNull();
  });

  it("rejects coordinates outside geographic ranges", () => {
    const result = locationSchema.safeParse({
      ...validLocation,
      latitude: 91,
      longitude: -181,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.latitude).toBeDefined();
      expect(fields.longitude).toBeDefined();
    }
  });
});
