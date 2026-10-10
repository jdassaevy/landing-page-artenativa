import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";

import { LocationsSection } from "@/components/site/locations-section";
import { getActiveLocations } from "@/lib/queries/locations";

export const metadata: Metadata = {
  title: "Locais",
  description: "Veja os locais ativos da Arte Nativa, com endereço e rota para chegar com facilidade.",
  alternates: { canonical: "/locais" },
  openGraph: {
    title: "Locais | Arte Nativa",
    description: "Veja os locais ativos da Arte Nativa, com endereço e rota para chegar com facilidade.",
    url: "/locais",
  },
};

async function LocationsContent() {
  await connection();
  const locations = await getActiveLocations();
  return <LocationsSection locations={locations} />;
}

function LocationsFallback() {
  return (
    <section className="mx-auto max-w-7xl animate-pulse px-4 py-20 sm:px-6 lg:px-8" aria-busy="true" aria-label="Carregando locais">
      <div className="h-3 w-36 rounded-full bg-[var(--sand-200)]" />
      <div className="mt-4 h-12 max-w-xl rounded-2xl bg-[var(--sand-200)]" />
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="h-96 rounded-[1.75rem] bg-[var(--sand-200)]/45" />
        ))}
      </div>
    </section>
  );
}

export default function LocationsPage() {
  return (
    <main id="conteudo">
      <div className="border-b border-[var(--sand-200)] bg-[var(--brown-900)] px-4 py-16 text-[var(--warm-white)] sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--sand-200)]">Nossos espaços</p>
          <h1 className="mt-3 max-w-4xl font-serif text-6xl font-semibold leading-[0.9] tracking-[-0.04em] sm:text-7xl">Onde a comunidade se encontra para dançar.</h1>
        </div>
      </div>
      <Suspense fallback={<LocationsFallback />}>
        <LocationsContent />
      </Suspense>
    </main>
  );
}
