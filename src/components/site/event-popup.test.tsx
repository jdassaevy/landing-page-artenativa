import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { popupStorageKey } from "@/lib/domain/popup";
import { EventPopup } from "./event-popup";

const baseEvent = {
  id: "event-a",
  title: "Baile Arte Nativa",
  slug: "baile-arte-nativa",
  description: "Uma noite para celebrar a dança.",
  event_date: "2026-12-10T22:00:00.000Z",
  status: "published",
  show_on_home: true,
  show_as_popup: true,
  promotion_starts_at: null,
  promotion_ends_at: null,
  cover_path: null,
  venue_name: "Salão Principal",
  venue_address: "Rua Exemplo, 123",
  venue_city: "Santo Amaro da Imperatriz",
  venue_state: "SC",
  maps_url: null,
  latitude: null,
  longitude: null,
  whatsapp_phone: "48999999999",
  reservation_message: "Olá! Quero reservar uma mesa para o Baile Arte Nativa.",
  ticket_message: "Olá! Quero comprar ingresso para o Baile Arte Nativa.",
  created_at: "2026-10-01T12:00:00.000Z",
  updated_at: "2026-10-01T12:00:00.000Z",
} as const;

describe("EventPopup", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("opens for an eligible event and closes with Escape", () => {
    render(<EventPopup event={baseEvent} now={() => 1_000_000} />);

    expect(screen.getByRole("dialog", { name: /baile arte nativa/i })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(localStorage.getItem(popupStorageKey("event-a"))).toBe("1000000");
  });

  it("stays silent for the same event when dismissed less than 24 hours ago", () => {
    localStorage.setItem(popupStorageKey("event-a"), String(1_000_000));

    render(<EventPopup event={baseEvent} now={() => 1_000_000 + 60_000} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows a different featured event even when the previous event was dismissed", () => {
    localStorage.setItem(popupStorageKey("event-a"), String(1_000_000));

    render(<EventPopup event={{ ...baseEvent, id: "event-b", title: "Fandango de Primavera" }} now={() => 1_060_000} />);

    expect(screen.getByRole("dialog", { name: /fandango de primavera/i })).toBeInTheDocument();
  });

  it("fails open safely when localStorage contains corrupt dismissal data", () => {
    localStorage.setItem(popupStorageKey("event-a"), "not-a-date");

    render(<EventPopup event={baseEvent} now={() => 1_000_000} />);

    expect(screen.getByRole("dialog", { name: /baile arte nativa/i })).toBeInTheDocument();
  });

  it("traps keyboard focus inside the dialog", () => {
    render(<EventPopup event={baseEvent} now={() => 1_000_000} />);

    const closeButton = screen.getByRole("button", { name: /fechar destaque/i });
    const lastButton = screen.getByRole("button", { name: /agora não/i });

    expect(closeButton).toHaveFocus();

    lastButton.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(closeButton).toHaveFocus();

    closeButton.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(lastButton).toHaveFocus();
  });

  it("restores focus after closing from the visible close button", () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Abrir agenda";
    document.body.appendChild(trigger);
    trigger.focus();

    render(<EventPopup event={baseEvent} now={() => 1_000_000} />);

    fireEvent.click(screen.getByRole("button", { name: /fechar destaque/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    return Promise.resolve().then(() => {
      expect(trigger).toHaveFocus();
      trigger.remove();
    });
  });
});
