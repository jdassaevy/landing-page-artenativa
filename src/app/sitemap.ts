import type { MetadataRoute } from "next";
import { connection } from "next/server";

import { getPublishedEventSlugs } from "@/lib/queries/events";
import { buildSitemapEntries } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const eventSlugs = await getPublishedEventSlugs();
  return buildSitemapEntries(eventSlugs);
}
