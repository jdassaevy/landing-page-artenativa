import { connection } from "next/server";

import { ClassesSection } from "@/components/site/classes-section";
import { Hero } from "@/components/site/hero";
import { LocationsSection } from "@/components/site/locations-section";
import { getCurrentClasses } from "@/lib/queries/classes";
import { getActiveLocations } from "@/lib/queries/locations";

export default async function HomePage() {
  await connection();

  const [classes, locations] = await Promise.all([
    getCurrentClasses(),
    getActiveLocations(),
  ]);

  return (
    <main id="conteudo" className="overflow-hidden">
      <Hero />
      <ClassesSection classes={classes} compact />
      <LocationsSection locations={locations} compact />
    </main>
  );
}
