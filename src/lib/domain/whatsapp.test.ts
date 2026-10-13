import { describe, expect, it } from "vitest";

import { buildWhatsAppUrl, normalizeWhatsAppPhone } from "./whatsapp";

describe("WhatsApp helpers", () => {
  it("normalizes Brazilian mobile numbers to a wa.me compatible digit string", () => {
    expect(normalizeWhatsAppPhone("(48) 99978-4892")).toBe("5548999784892");
    expect(normalizeWhatsAppPhone("+55 48 99978-4892")).toBe("5548999784892");
  });

  it("builds a URL with encoded message text", () => {
    expect(
      buildWhatsAppUrl({
        phone: "(48) 99978-4892",
        message: "Olá! Quero reservar uma mesa para o evento.",
      }),
    ).toBe(
      "https://wa.me/5548999784892?text=Ol%C3%A1!%20Quero%20reservar%20uma%20mesa%20para%20o%20evento.",
    );
  });

  it("rejects an empty or implausible phone number", () => {
    expect(() => normalizeWhatsAppPhone(" ")).toThrow();
    expect(() => normalizeWhatsAppPhone("1234")).toThrow();
  });
});
