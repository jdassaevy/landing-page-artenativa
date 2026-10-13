import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LazyMap } from "./lazy-map";

const location = {
  address: "Rua Exemplo, 123",
  city: "Santo Amaro da Imperatriz",
  state: "SC",
  latitude: null,
  longitude: null,
};

describe("LazyMap", () => {
  it("keeps the iframe unloaded until explicit interaction", () => {
    render(<LazyMap location={location} title="Sede Arte Nativa" apiKey="browser-key" />);

    expect(screen.queryByTitle("Mapa de Sede Arte Nativa")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /traçar rota/i })).toHaveAttribute(
      "href",
      expect.stringContaining("google.com/maps/dir"),
    );
  });

  it("loads the iframe when the visitor asks to view the map", () => {
    render(<LazyMap location={location} title="Sede Arte Nativa" apiKey="browser-key" />);

    fireEvent.click(screen.getByRole("button", { name: /carregar mapa/i }));

    expect(screen.getByTitle("Mapa de Sede Arte Nativa")).toHaveAttribute(
      "src",
      expect.stringContaining("maps/embed/v1/place"),
    );
  });

  it("keeps route navigation usable when no embed API key is configured", () => {
    render(<LazyMap location={location} title="Sede Arte Nativa" apiKey="" />);

    expect(screen.getByRole("link", { name: /traçar rota/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /carregar mapa/i })).not.toBeInTheDocument();
    expect(screen.getByText(/mapa indisponível/i)).toBeInTheDocument();
  });
});
