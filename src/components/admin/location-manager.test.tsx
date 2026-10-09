import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LocationManager } from "./location-manager";

const locations = [
  { id: "loc-1", name: "Matriz", address: "Rua A, 10", city: "Santo Amaro da Imperatriz", state: "SC", maps_url: null, latitude: null, longitude: null, image_path: null, is_active: true },
  { id: "loc-2", name: "Centro", address: "Rua B, 20", city: "Santo Amaro da Imperatriz", state: "SC", maps_url: null, latitude: null, longitude: null, image_path: null, is_active: false },
];

describe("LocationManager", () => {
  it("shows active and inactive locations with their address", () => {
    render(<LocationManager locations={locations} onCreate={vi.fn()} onUpdate={vi.fn()} onToggleActive={vi.fn()} />);

    expect(screen.getByText("Matriz")).toBeInTheDocument();
    expect(screen.getByText("Rua A, 10")).toBeInTheDocument();
    expect(screen.getByText("Ativo")).toBeInTheDocument();
    expect(screen.getByText("Inativo")).toBeInTheDocument();
  });

  it("opens the approved location fields when creating", () => {
    render(<LocationManager locations={locations} onCreate={vi.fn()} onUpdate={vi.fn()} onToggleActive={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /novo local/i }));

    expect(screen.getByLabelText(/^nome$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^endereço$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^cidade$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^estado$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/url do google maps/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^latitude$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^longitude$/i)).toBeInTheDocument();
  });

  it("requires explicit confirmation before deactivating a location used by active classes", async () => {
    const onToggleActive = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        requiresConfirmation: true,
        activeClassCount: 2,
        message: "Este local está sendo usado por 2 aulas ativas.",
      })
      .mockResolvedValueOnce({ ok: true, message: "Local desativado." });

    render(<LocationManager locations={locations} onCreate={vi.fn()} onUpdate={vi.fn()} onToggleActive={onToggleActive} />);

    fireEvent.click(screen.getByRole("button", { name: /desativar matriz/i }));

    expect(await screen.findByText("Este local está sendo usado por 2 aulas ativas.")).toBeInTheDocument();
    expect(onToggleActive).toHaveBeenCalledWith("loc-1", false, false);

    fireEvent.click(screen.getByRole("button", { name: /confirmar desativação/i }));

    expect(onToggleActive).toHaveBeenLastCalledWith("loc-1", false, true);
  });
});
