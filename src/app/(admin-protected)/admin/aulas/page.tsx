import type { Metadata } from "next";

import { ClassManager } from "@/components/admin/class-manager";
import { createClass, duplicateClass, setClassActive } from "@/lib/actions/admin/classes";
import { getAdminClassManagementData } from "@/lib/queries/admin/classes";

export const metadata: Metadata = {
  title: "Aulas",
};

export default async function AdminClassesPage() {
  const { classes, periods, locations } = await getAdminClassManagementData();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brown-700)]">Gestão de aulas</p>
        <h1 className="mt-2 font-serif text-5xl font-semibold tracking-[-0.035em] sm:text-6xl">Aulas e horários</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--brown-700)]">
          Organize as turmas por modalidade, período, local, dia da semana e horário. A exibição segue automaticamente de segunda a domingo.
        </p>
      </div>

      <div className="mt-10">
        <ClassManager
          classes={classes}
          periods={periods}
          locations={locations}
          onCreate={createClass}
          onDuplicate={duplicateClass}
          onToggleActive={setClassActive}
        />
      </div>
    </main>
  );
}
