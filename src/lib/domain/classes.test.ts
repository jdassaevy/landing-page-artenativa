import { describe, expect, it } from "vitest";

import { sortClasses } from "./classes";

describe("sortClasses", () => {
  it("sorts classes Monday through Sunday and by start time within each day", () => {
    const input = [
      { id: "sun-17", weekday: 7, start_time: "17:00:00" },
      { id: "mon-20", weekday: 1, start_time: "20:00:00" },
      { id: "wed-19", weekday: 3, start_time: "19:00:00" },
      { id: "mon-18", weekday: 1, start_time: "18:00:00" },
    ];

    expect(sortClasses(input).map((item) => item.id)).toEqual([
      "mon-18",
      "mon-20",
      "wed-19",
      "sun-17",
    ]);
  });

  it("does not mutate the input array", () => {
    const input = [
      { id: "late", weekday: 2, start_time: "20:00:00" },
      { id: "early", weekday: 2, start_time: "18:00:00" },
    ];
    const snapshot = structuredClone(input);

    sortClasses(input);

    expect(input).toEqual(snapshot);
  });

  it("uses id as a deterministic tiebreaker", () => {
    const input = [
      { id: "b", weekday: 4, start_time: "19:00:00" },
      { id: "a", weekday: 4, start_time: "19:00:00" },
    ];

    expect(sortClasses(input).map((item) => item.id)).toEqual(["a", "b"]);
  });
});
