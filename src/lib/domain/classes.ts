type SortableClass = {
  id: string;
  weekday: number;
  start_time: string;
};

export function sortClasses<T extends SortableClass>(classes: readonly T[]): T[] {
  return [...classes].sort((left, right) => {
    const weekdayDifference = left.weekday - right.weekday;
    if (weekdayDifference !== 0) return weekdayDifference;

    const timeDifference = left.start_time.localeCompare(right.start_time);
    if (timeDifference !== 0) return timeDifference;

    return left.id.localeCompare(right.id);
  });
}
