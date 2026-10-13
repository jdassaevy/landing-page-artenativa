import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ClassFilters } from "@/components/site/class-filters";
import type { PublicClass } from "@/types/domain";

interface ClassesSectionProps {
  classes: PublicClass[];
  compact?: boolean;
}

export function ClassesSection({ classes, compact = false }: ClassesSectionProps) {
  return (
    <section id="aulas" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal>
        <div className="grid gap-6 border-b border-[var(--sand-200)] pb-10 md:grid-cols-[0.75fr_1.25fr] md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brown-700)]">Aulas e horários</p>
            <h2 className="mt-3 font-serif text-5xl font-semibold leading-none tracking-[-0.035em] sm:text-6xl">
              Sua semana começa aqui.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[var(--brown-700)] md:justify-self-end">
            As turmas são exibidas de segunda a domingo e, dentro de cada dia, por horário. Use os filtros para encontrar a modalidade que combina com você.
          </p>
        </div>
      </Reveal>

      <Reveal className="mt-8">
        {classes.length ? (
          <ClassFilters classes={compact ? classes.slice(0, 6) : classes} />
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-[var(--beige-400)] bg-[var(--offwhite-100)] p-8 text-center">
            <p className="font-serif text-3xl font-semibold text-[var(--brown-900)]">Novos horários em preparação.</p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--brown-700)]">
              A programação ativa aparecerá aqui assim que for publicada pelo painel da Arte Nativa.
            </p>
          </div>
        )}
      </Reveal>

      {compact && classes.length > 6 ? (
        <Reveal className="mt-8 flex justify-end">
          <Link href="/aulas" className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-[var(--brown-900)] transition hover:bg-[var(--offwhite-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)]">
            Ver todas as aulas <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      ) : null}
    </section>
  );
}
