import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ClassFilters } from "./class-filters";

const classes = [
  {
    id: "mon-18",
    modality: "Danças Gaúchas",
    weekday: 1,
    start_time: "18:00:00",
    end_time: "19:00:00",
    location_id: "loc-1",
    period_id: "period-1",
    location: { id: "loc-1", name: "Matriz", address: "Rua A", city: "Santo Amaro", state: "SC", maps_url: null, latitude: null, longitude: null, image_path: null },
  },
  {
    id: "wed-19",
    modality: "Dança de Salão",
    weekday: 3,
    start_time: "19:00:00",
    end_time: "20:00:00",
    location_id: "loc-2",
    period_id: "period-1",
    location: { id: "loc-2", name: "Centro", address: "Rua B", city: "Santo Amaro", state: "SC", maps_url: null, latitude: null, longitude: null, image_path: null },
  },
  {
    id: "sun-17",
    modality: "Danças Gaúchas",
    weekday: 7,
    start_time: "17:00:00",
    end_time: "18:00:00",
    location_id: "loc-1",
    period_id: "period-1",
    location: { id: "loc-1", name: "Matriz", address: "Rua A", city: "Santo Amaro", state: "SC", maps_url: null, latitude: null, longitude: null, image_path: null },
  },
] as const;

describe("ClassFilters", () => {
  it("renders classes in their provided chronological order", () => {
    render(<ClassFilters classes={[...classes]} />);

    expect(screen.getAllByTestId("class-card").map((node) => node.getAttribute("data-class-id"))).toEqual([
      "mon-18",
      "wed-19",
      "sun-17",
    ]);
  });

  it("filters by weekday without reordering the remaining classes", () => {
    render(<ClassFilters classes={[...classes]} />);

    fireEvent.change(screen.getByLabelText(/dia da semana/i), { target: { value: "7" } });

    expect(screen.getAllByTestId("class-card").map((node) => node.getAttribute("data-class-id"))).toEqual(["sun-17"]);
  });

  it("filters by modality and can clear the filters", () => {
    render(<ClassFilters classes={[...classes]} />);

    fireEvent.change(screen.getByLabelText(/modalidade/i), { target: { value: "Danças Gaúchas" } });
    expect(screen.getAllByTestId("class-card")).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: /limpar filtros/i }));
    expect(screen.getAllByTestId("class-card")).toHaveLength(3);
  });
});
