import { describe, expect, it } from "vitest";

import { eventSchema, eventImageSchema } from "./event";

const validEvent = {
  title: "Baile Arte Nativa",
  slug: "baile-arte-nativa",
  description: "Uma noite de dança e tradição.",
  event_date: "2027-02-20T22:00",
  venue_name: "Salão Principal",
  venue_address: "Rua Exemplo, 123",
  venue_city: "Santo Amaro da Imperatriz",
  venue_state: "SC",
  maps_url: "https://maps.google.com/?q=Arte+Nativa",
  latitude: "-27.6884",
  longitude: "-48.7786",
  whatsapp_phone: "48999999999",
  reservation_message: "Olá! Quero reservar uma mesa.",
  ticket_message: "Olá! Quero comprar um ingresso.",
  status: "published",
  show_on_home: true,
  show_as_popup: false,
  promotion_starts_at: "2027-01-10T10:00",
  promotion_ends_at: "2027-02-20T20:00",
  cover_path: "events/baile.webp",
};

describe("eventSchema", () => {
  it("accepts a complete published event", () => {
    expect(eventSchema.safeParse(validEvent).success).toBe(true);
  });

  it("requires core public information for published events", () => {
    const result = eventSchema.safeParse({
      ...validEvent,
      title: "",
      slug: "",
      venue_name: "",
      venue_address: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.title?.length).toBeGreaterThan(0);
      expect(fields.slug?.length).toBeGreaterThan(0);
      expect(fields.venue_name?.length).toBeGreaterThan(0);
      expect(fields.venue_address?.length).toBeGreaterThan(0);
    }
  });

  it("requires at least one usable WhatsApp commerce message when commerce is configured", () => {
    const result = eventSchema.safeParse({
      ...validEvent,
      reservation_message: "",
      ticket_message: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.reservation_message?.length).toBeGreaterThan(0);
    }
  });

  it("rejects a promotion window whose end precedes its start", () => {
    const result = eventSchema.safeParse({
      ...validEvent,
      promotion_starts_at: "2027-02-20T20:00",
      promotion_ends_at: "2027-01-10T10:00",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.promotion_ends_at?.length).toBeGreaterThan(0);
    }
  });

  it("allows a draft to omit publication-only commerce details", () => {
    const result = eventSchema.safeParse({
      ...validEvent,
      status: "draft",
      whatsapp_phone: "",
      reservation_message: "",
      ticket_message: "",
    });

    expect(result.success).toBe(true);
  });
});

describe("eventImageSchema", () => {
  it("rejects files larger than 8 MiB", () => {
    expect(
      eventImageSchema.safeParse({
        size: 8 * 1024 * 1024 + 1,
        type: "image/webp",
      }).success,
    ).toBe(false);
  });

  it.each(["image/jpeg", "image/png", "image/webp"])("accepts supported MIME %s", (type) => {
    expect(eventImageSchema.safeParse({ size: 1024, type }).success).toBe(true);
  });

  it("rejects unsupported image MIME types", () => {
    expect(eventImageSchema.safeParse({ size: 1024, type: "image/svg+xml" }).success).toBe(false);
  });
});
