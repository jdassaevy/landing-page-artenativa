import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PeriodManager } from "./period-manager";

const periods = [
  { id: "period-2", name: "2º trimestre 2027", starts_at: "2027-04-01", ends_at: "2027-06-30", is_current: false },
  { id: "period-1", name: "1º trimestre 2027", starts_at: "2027-01-10", ends_at: "2027-03-31", is_current: true },
];

describe("PeriodManager", () => {
  it("marks the current period and exposes activation for another period", () => {
    render(
      <PeriodManager
        periods={periods}
        onCreate={vi.fn()}
        onDuplicate={vi.fn()}
        onSetCurrent={vi.fn()}
      />,
    );

    expect(screen.getByText("Atual")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /tornar atual 2º trimestre 2027/i })).toBeInTheDocument();
  });

  it("opens a new period form with name and date range", () => {
    render(
      <PeriodManager
        periods={periods}
        onCreate={vi.fn()}
        onDuplicate={vi.fn()}
        onSetCurrent={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /novo período/i }));

    expect(screen.getByLabelText(/^nome$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data inicial/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data final/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tornar este período atual/i)).toBeInTheDocument();
  });

  it("opens duplication with the source period and destination dates", () => {
    render(
      <PeriodManager
        periods={periods}
        onCreate={vi.fn()}
        onDuplicate={vi.fn()}
        onSetCurrent={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /duplicar 1º trimestre 2027/i }));

    expect(screen.getByText(/duplicar período e aulas/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("1º trimestre 2027")).toBeInTheDocument();
    expect(screen.getByLabelText(/novo nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nova data inicial/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nova data final/i)).toBeInTheDocument();
  });
});
