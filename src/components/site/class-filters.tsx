"use client";

import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

import { ClassCard } from "@/components/site/class-card";
import type { PublicClass, Weekday } from "@/types/domain";
import { WEEKDAY_LABELS } from "@/types/domain";

interface ClassFiltersProps {
  classes: PublicClass[];
}

export function ClassFilters({ classes }: ClassFiltersProps) {
  const [weekday, setWeekday] = useState("all");
  const [modality, setModality] = useState("all");

  const modalities = useMemo(
    () => Array.from(new Set(classes.map((item) => item.modality))).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [classes],
  );

  const filteredClasses = useMemo(
    () =>
      classes.filter((item) => {
        const weekdayMatches = weekday === "all" || String(item.weekday) === weekday;
        const modalityMatches = modality === "all" || item.modality === modality;
        return weekdayMatches && modalityMatches;
      }),
    [classes, modality, weekday],
  );

  const hasFilters = weekday !== "all" || modality !== "all";

  function clearFilters() {
    setWeekday("all");
    setModality("all");
  }

  return (
    <div>
      <div className="grid gap-3 rounded-[1.5rem] border border-[var(--sand-200)] bg-[var(--offwhite-100)] p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
        <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">
          Dia da semana
          <select
            value={weekday}
            onChange={(event) => setWeekday(event.target.value)}
            className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-[var(--warm-white)] px-4 text-sm text-[var(--brown-900)] outline-none transition focus:border-[var(--brown-700)] focus:ring-2 focus:ring-[var(--beige-400)]/45"
          >
            <option value="all">Todos os dias</option>
            {Object.entries(WEEKDAY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">
          Modalidade
          <select
            value={modality}
            onChange={(event) => setModality(event.target.value)}
            className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-[var(--warm-white)] px-4 text-sm text-[var(--brown-900)] outline-none transition focus:border-[var(--brown-700)] focus:ring-2 focus:ring-[var(--beige-400)]/45"
          >
            <option value="all">Todas as modalidades</option>
            {modalities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={clearFilters}
          disabled={!hasFilters}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold text-[var(--brown-900)] transition hover:bg-[var(--sand-200)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)] disabled:cursor-not-allowed disabled:opacity-45 sm:col-span-2 lg:col-span-1"
        >
          <RotateCcw className="size-4" aria-hidden="true" /> Limpar filtros
        </button>
      </div>

      <p className="mt-5 text-sm text-[var(--brown-700)]" aria-live="polite">
        {filteredClasses.length} {filteredClasses.length === 1 ? "aula encontrada" : "aulas encontradas"}
      </p>

      {filteredClasses.length ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredClasses.map((item) => (
            <ClassCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-[1.75rem] border border-dashed border-[var(--beige-400)] bg-[var(--offwhite-100)] p-8 text-center">
          <p className="font-serif text-2xl font-semibold text-[var(--brown-900)]">Nenhuma aula com esses filtros.</p>
          <button type="button" onClick={clearFilters} className="mt-3 text-sm font-bold text-[var(--brown-700)] underline underline-offset-4">
            Mostrar todas
          </button>
        </div>
      )}
    </div>
  );
}
