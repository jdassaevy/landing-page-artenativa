import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";

import { ClassesSection } from "@/components/site/classes-section";
import { getCurrentClasses } from "@/lib/queries/classes";

export const metadata: Metadata = {
  title: "Aulas e horários",
  description: "Confira as aulas e horários atuais da Arte Nativa, organizados de segunda a domingo.",
  alternates: { canonical: "/aulas" },
  openGraph: {
    title: "Aulas e horários | Arte Nativa",
    description: "Confira as aulas e horários atuais da Arte Nativa, organizados de segunda a domingo.",
    url: "/aulas",
  },
};

async function ClassesContent() {
  await connection();
  const classes = await getCurrentClasses();
  return <ClassesSection classes={classes} />;
}

function ClassesFallback() {
  return (
    <section className="mx-auto max-w-7xl animate-pulse px-4 py-20 sm:px-6 lg:px-8" aria-busy="true" aria-label="Carregando aulas">
      <div className="h-3 w-36 rounded-full bg-[var(--sand-200)]" />
      <div className="mt-4 h-12 max-w-xl rounded-2xl bg-[var(--sand-200)]" />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-56 rounded-[1.75rem] bg-[var(--sand-200)]/45" />
        ))}
      </div>
    </section>
  );
}

export default function ClassesPage() {
  return (
    <main id="conteudo">
      <div className="border-b border-[var(--sand-200)] bg-[var(--brown-900)] px-4 py-16 text-[var(--warm-white)] sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--sand-200)]">Programação atual</p>
          <h1 className="mt-3 max-w-4xl font-serif text-6xl font-semibold leading-[0.9] tracking-[-0.04em] sm:text-7xl">Aulas para viver a dança durante toda a semana.</h1>
        </div>
      </div>
      <Suspense fallback={<ClassesFallback />}>
        <ClassesContent />
      </Suspense>
    </main>
  );
}
