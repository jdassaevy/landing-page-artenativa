import { Clock3, MapPin } from "lucide-react";

import type { PublicClass, Weekday } from "@/types/domain";
import { WEEKDAY_LABELS } from "@/types/domain";

interface ClassCardProps {
  item: PublicClass;
}

function formatTime(value: string): string {
  return value.slice(0, 5);
}

export function ClassCard({ item }: ClassCardProps) {
  const weekday = item.weekday as Weekday;

  return (
    <article
      data-testid="class-card"
      data-class-id={item.id}
      className="group h-full rounded-[1.75rem] border border-[var(--sand-200)] bg-[var(--warm-white)] p-5 shadow-[0_12px_35px_rgba(58,36,24,0.05)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[var(--beige-400)] hover:shadow-[0_20px_45px_rgba(58,36,24,0.09)] sm:p-6"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brown-700)]">
        {WEEKDAY_LABELS[weekday] ?? "Dia a confirmar"}
      </p>
      <h3 className="mt-2 font-serif text-3xl font-semibold leading-tight tracking-[-0.025em] text-[var(--brown-900)]">
        {item.modality}
      </h3>

      <div className="mt-6 grid gap-3 text-sm text-[var(--brown-700)]">
        <p className="flex items-center gap-2">
          <Clock3 className="size-4 shrink-0" aria-hidden="true" />
          <span className="font-semibold text-[var(--brown-900)]">
            {formatTime(item.start_time)}–{formatTime(item.end_time)}
          </span>
        </p>
        {item.location ? (
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-semibold text-[var(--brown-900)]">{item.location.name}</p>
              <p className="mt-1 leading-6">
                {item.location.address}, {item.location.city} – {item.location.state}
              </p>
            </div>
          </div>
        ) : (
          <p className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden="true" /> Local a confirmar
          </p>
        )}
      </div>
    </article>
  );
}
