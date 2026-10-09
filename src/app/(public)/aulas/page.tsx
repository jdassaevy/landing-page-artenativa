import type { Metadata } from "next";
import { connection } from "next/server";

import { ClassesSection } from "@/components/site/classes-section";
import { getCurrentClasses } from "@/lib/queries/classes";

export const metadata: Metadata = {
  title: "Aulas e horários",
  description: "Confira as aulas e horários atuais da Arte Nativa, organizados de segunda a domingo.",
};

export default async function ClassesPage() {
  await connection();
  const classes = await getCurrentClasses();

  return (
    <main id="conteudo">
      <div className="border-b border-[var(--sand-200)] bg-[var(--brown-900)] px-4 py-16 text-[var(--warm-white)] sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--sand-200)]">Programação atual</p>
          <h1 className="mt-3 max-w-4xl font-serif text-6xl font-semibold leading-[0.9] tracking-[-0.04em] sm:text-7xl">Aulas para viver a dança durante toda a semana.</h1>
        </div>
      </div>
      <ClassesSection classes={classes} />
    </main>
  );
}
