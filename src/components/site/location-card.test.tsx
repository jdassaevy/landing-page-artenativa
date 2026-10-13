import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LocationCard } from "./location-card";

const location = {
  id: "loc-1",
  name: "Sede Arte Nativa",
  address: "Rua Exemplo, 123",
  city: "Santo Amaro da Imperatriz",
  state: "SC",
  maps_url: null,
  latitude: null,
  longitude: null,
  image_path: null,
};

describe("LocationCard", () => {
  it("keeps the physical address visible before the map loads", () => {
    render(<LocationCard location={location} mapApiKey="browser-key" />);

    expect(screen.getByText("Rua Exemplo, 123")).toBeInTheDocument();
    expect(screen.getByText(/Santo Amaro da Imperatriz/)).toBeInTheDocument();
    expect(screen.queryByTitle("Mapa de Sede Arte Nativa")).not.toBeInTheDocument();
  });

  it("always exposes a route action", () => {
    render(<LocationCard location={location} mapApiKey="" />);

    expect(screen.getByRole("link", { name: /traçar rota/i })).toBeInTheDocument();
  });
});
