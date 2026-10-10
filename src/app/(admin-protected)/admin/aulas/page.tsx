import type { Metadata } from "next";
import { connection } from "next/server";

import { ClassManager } from "@/components/admin/class-manager";
import { PeriodManager } from "@/components/admin/period-manager";
import { createClass, duplicateClass, setClassActive, updateClass } from "@/lib/actions/admin/classes";
import { createPeriod, duplicatePeriod, setCurrentPeriod } from "@/lib/actions/admin/periods";
import { getAdminClassManagementData } from "@/lib/queries/admin/classes";

export const metadata: Metadata = {
  title: "Aulas",
};

export const instant = false;

export default async function AdminClassesPage() {
  await connection();
  const { classes, periods, locations } = await getAdminClassManagementData();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brown-700)]">Gestão de aulas</p>
        <h1 className="mt-2 font-serif text-5xl font-semibold tracking-[-0.035em] sm:text-6xl">Aulas e períodos</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--brown-700)]">
          Organize as turmas por modalidade, período, local, dia da semana e horário. A exibição segue automaticamente de segunda a domingo.
        </p>
      </div>

      <section className="mt-10" aria-labelledby="periodos-admin-title">
        <div className="mb-6 border-b border-[var(--sand-200)] pb-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brown-700)]">Calendário letivo</p>
          <h2 id="periodos-admin-title" className="mt-2 font-serif text-4xl font-semibold tracking-[-0.03em] text-[var(--brown-900)]">Períodos</h2>
        </div>
        <PeriodManager
          periods={periods}
          onCreate={createPeriod}
          onDuplicate={duplicatePeriod}
          onSetCurrent={setCurrentPeriod}
        />
      </section>

      <section className="mt-14" aria-labelledby="aulas-admin-title">
        <div className="mb-6 border-b border-[var(--sand-200)] pb-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brown-700)]">Programação</p>
          <h2 id="aulas-admin-title" className="mt-2 font-serif text-4xl font-semibold tracking-[-0.03em] text-[var(--brown-900)]">Aulas</h2>
        </div>
        <ClassManager
          classes={classes}
          periods={periods}
          locations={locations}
          onCreate={createClass}
          onUpdate={updateClass}
          onDuplicate={duplicateClass}
          onToggleActive={setClassActive}
        />
      </section>
    </main>
  );
}
