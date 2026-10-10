import type { Metadata } from "next";
import { connection } from "next/server";

import { LocationManager } from "@/components/admin/location-manager";
import {
  createLocation,
  setLocationActive,
  updateLocation,
} from "@/lib/actions/admin/locations";
import { getAdminLocations } from "@/lib/queries/admin/locations";

export const metadata: Metadata = {
  title: "Locais",
};

export default async function AdminLocationsPage() {
  await connection();
  const locations = await getAdminLocations();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brown-700)]">
          Gestão de locais
        </p>
        <h1 className="mt-2 font-serif text-5xl font-semibold tracking-[-0.035em] sm:text-6xl">
          Espaços e endereços
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--brown-700)]">
          Cadastre os locais das aulas, mantenha endereço e mapa atualizados e desative espaços sem apagar o histórico das turmas.
        </p>
      </div>

      <div className="mt-10">
        <LocationManager
          locations={locations}
          onCreate={createLocation}
          onUpdate={updateLocation}
          onToggleActive={setLocationActive}
        />
      </div>
    </main>
  );
}
