import type { Metadata } from "next";
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

export default async function LocationsPage() {
  await connection();
  const locations = await getActiveLocations();

  return (
    <main id="conteudo">
      <div className="border-b border-[var(--sand-200)] bg-[var(--brown-900)] px-4 py-16 text-[var(--warm-white)] sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--sand-200)]">Nossos espaços</p>
          <h1 className="mt-3 max-w-4xl font-serif text-6xl font-semibold leading-[0.9] tracking-[-0.04em] sm:text-7xl">Onde a comunidade se encontra para dançar.</h1>
        </div>
      </div>
      <LocationsSection locations={locations} />
    </main>
  );
}
