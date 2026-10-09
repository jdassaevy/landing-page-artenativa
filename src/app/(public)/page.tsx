import { connection } from "next/server";

import { ClassesSection } from "@/components/site/classes-section";
import { EventPopup } from "@/components/site/event-popup";
import { EventsSection } from "@/components/site/events-section";
import { Hero } from "@/components/site/hero";
import { LocationsSection } from "@/components/site/locations-section";
import { getCurrentClasses } from "@/lib/queries/classes";
import { getPopupEvent, getUpcomingEvents } from "@/lib/queries/events";
import { getActiveLocations } from "@/lib/queries/locations";

export default async function HomePage() {
  await connection();

  const [classes, locations, events, popupEvent] = await Promise.all([
    getCurrentClasses(),
    getActiveLocations(),
    getUpcomingEvents(),
    getPopupEvent(),
  ]);

  return (
    <main id="conteudo" className="overflow-hidden">
      <Hero />
      <ClassesSection classes={classes} compact />
      <EventsSection events={events} compact />
      <LocationsSection locations={locations} compact />
      {popupEvent ? <EventPopup event={popupEvent} /> : null}
    </main>
  );
}
