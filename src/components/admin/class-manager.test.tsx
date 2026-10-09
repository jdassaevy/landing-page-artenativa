import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ClassManager } from "./class-manager";

const periods = [
  { id: "period-1", name: "1º trimestre 2027", starts_at: "2027-01-10", ends_at: "2027-03-31", is_current: true },
];

const locations = [
  { id: "loc-1", name: "Matriz", is_active: true },
];

const classes = [
  { id: "sun", period_id: "period-1", location_id: "loc-1", modality: "Danças Gaúchas", weekday: 7, start_time: "17:00:00", end_time: "18:00:00", is_active: true },
  { id: "mon-late", period_id: "period-1", location_id: "loc-1", modality: "Dança de Salão", weekday: 1, start_time: "20:00:00", end_time: "21:00:00", is_active: false },
  { id: "mon-early", period_id: "period-1", location_id: "loc-1", modality: "Danças Gaúchas", weekday: 1, start_time: "18:00:00", end_time: "19:00:00", is_active: true },
];

describe("ClassManager", () => {
  it("orders classes Monday to Sunday and by time", () => {
    render(
      <ClassManager
        classes={classes}
        periods={periods}
        locations={locations}
        onCreate={vi.fn()}
        onDuplicate={vi.fn()}
        onToggleActive={vi.fn()}
      />,
    );

    expect(screen.getAllByTestId("admin-class-row").map((node) => node.getAttribute("data-class-id"))).toEqual([
      "mon-early",
      "mon-late",
      "sun",
    ]);
  });

  it("shows modality, period, status and no professor or level fields", () => {
    render(
      <ClassManager
        classes={classes}
        periods={periods}
        locations={locations}
        onCreate={vi.fn()}
        onDuplicate={vi.fn()}
        onToggleActive={vi.fn()}
      />,
    );

    const first = screen.getAllByTestId("admin-class-row")[0];
    expect(within(first).getByText("Danças Gaúchas")).toBeInTheDocument();
    expect(within(first).getByText(/1º trimestre 2027/)).toBeInTheDocument();
    expect(within(first).getByText("Ativa")).toBeInTheDocument();
    expect(screen.queryByText(/professor/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/nível/i)).not.toBeInTheDocument();
  });

  it("opens a create form with only the approved class fields", () => {
    render(
      <ClassManager
        classes={classes}
        periods={periods}
        locations={locations}
        onCreate={vi.fn()}
        onDuplicate={vi.fn()}
        onToggleActive={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /nova aula/i }));

    expect(screen.getByLabelText(/modalidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dia da semana/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/horário inicial/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/horário final/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/período/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/local/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/professor/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/nível/i)).not.toBeInTheDocument();
  });
});
