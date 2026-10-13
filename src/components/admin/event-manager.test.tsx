import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EventManager } from "./event-manager";

const events = [
  {
    id: "event-1",
    title: "Baile Arte Nativa",
    slug: "baile-arte-nativa",
    cover_path: null,
    description: "Noite de dança.",
    event_date: "2027-02-20T22:00:00.000Z",
    venue_name: "Salão Principal",
    venue_address: "Rua A, 10",
    venue_city: "Santo Amaro da Imperatriz",
    venue_state: "SC",
    maps_url: null,
    latitude: null,
    longitude: null,
    whatsapp_phone: "48999999999",
    reservation_message: "Quero reservar mesa.",
    ticket_message: "Quero ingresso.",
    status: "published",
    show_on_home: true,
    show_as_popup: true,
    promotion_starts_at: null,
    promotion_ends_at: null,
    created_at: "2026-10-01T12:00:00.000Z",
    updated_at: "2026-10-01T12:00:00.000Z",
  },
];

function renderManager() {
  return render(
    <EventManager
      events={events}
      onCreate={vi.fn()}
      onUpdate={vi.fn()}
      onDuplicate={vi.fn()}
      onSetStatus={vi.fn()}
      onSetFeatured={vi.fn()}
    />,
  );
}

describe("EventManager", () => {
  it("shows status, home and popup state for existing events", () => {
    renderManager();

    expect(screen.getByText("Baile Arte Nativa")).toBeInTheDocument();
    expect(screen.getByText("Publicado")).toBeInTheDocument();
    expect(screen.getByText("Na Home")).toBeInTheDocument();
    expect(screen.getByText("Popup ativo")).toBeInTheDocument();
  });

  it("opens the complete event form", () => {
    renderManager();
    fireEvent.click(screen.getByRole("button", { name: /novo evento/i }));

    expect(screen.getByLabelText(/^título$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^slug$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data e horário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nome do local/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^endereço$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^whatsapp$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mensagem para reserva/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mensagem para ingresso/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mostrar na home/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/usar como popup/i)).toBeInTheDocument();
  });

  it("opens an existing event for editing with values filled", () => {
    renderManager();
    fireEvent.click(screen.getByRole("button", { name: /editar baile arte nativa/i }));

    expect(screen.getByLabelText(/^título$/i)).toHaveValue("Baile Arte Nativa");
    expect(screen.getByLabelText(/^slug$/i)).toHaveValue("baile-arte-nativa");
    expect(screen.getByLabelText(/mostrar na home/i)).toBeChecked();
    expect(screen.getByLabelText(/usar como popup/i)).toBeChecked();
  });
});
