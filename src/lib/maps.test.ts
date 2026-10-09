import { describe, expect, it } from "vitest";

import { buildMapsEmbedUrl } from "./maps";

describe("buildMapsEmbedUrl", () => {
  it("uses coordinates when latitude and longitude are available", () => {
    const url = buildMapsEmbedUrl(
      {
        address: "Rua Exemplo, 123",
        city: "Santo Amaro da Imperatriz",
        state: "SC",
        latitude: -27.6884,
        longitude: -48.7786,
      },
      "browser-key",
    );

    expect(url).toBe(
      "https://www.google.com/maps/embed/v1/place?key=browser-key&q=-27.6884%2C-48.7786",
    );
  });

  it("falls back to an encoded address when coordinates are unavailable", () => {
    const url = buildMapsEmbedUrl(
      {
        address: "Rua João & Maria, 45",
        city: "Santo Amaro da Imperatriz",
        state: "SC",
        latitude: null,
        longitude: null,
      },
      "browser key",
    );

    expect(url).toContain("key=browser%20key");
    expect(url).toContain(
      "q=Rua%20Jo%C3%A3o%20%26%20Maria%2C%2045%2C%20Santo%20Amaro%20da%20Imperatriz%2C%20SC",
    );
  });

  it("returns an empty controlled fallback when the API key is missing", () => {
    expect(
      buildMapsEmbedUrl(
        {
          address: "Rua Exemplo",
          city: "Santo Amaro da Imperatriz",
          state: "SC",
          latitude: null,
          longitude: null,
        },
        "",
      ),
    ).toBe("");
  });

  it("returns an empty controlled fallback when no usable location query exists", () => {
    expect(
      buildMapsEmbedUrl(
        {
          address: "",
          city: "",
          state: "",
          latitude: null,
          longitude: null,
        },
        "browser-key",
      ),
    ).toBe("");
  });
});
