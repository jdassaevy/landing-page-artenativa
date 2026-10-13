import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Arte Nativa",
    short_name: "Arte Nativa",
    description: "Aulas, horários, locais e eventos da Arte Nativa.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f2ea",
    theme_color: "#3a2418",
  };
}
