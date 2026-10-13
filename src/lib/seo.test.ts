import { describe, expect, it } from "vitest";

import {
  buildCanonicalUrl,
  buildSitemapEntries,
  normalizeSiteUrl,
} from "./seo";

describe("SEO URL helpers", () => {
  it("normalizes the configured production origin without trailing slash", () => {
    expect(normalizeSiteUrl("https://artenativadancas.com.br/")).toBe(
      "https://artenativadancas.com.br",
    );
  });

  it("builds canonical URLs from the configured site origin", () => {
    expect(
      buildCanonicalUrl("/eventos/baile-arte-nativa", "https://artenativadancas.com.br/"),
    ).toBe("https://artenativadancas.com.br/eventos/baile-arte-nativa");
  });
});

describe("buildSitemapEntries", () => {
  it("includes public routes and published event slugs but never admin routes", () => {
    const entries = buildSitemapEntries(
      ["baile-arte-nativa", "fandango-de-primavera"],
      "https://artenativadancas.com.br",
    );

    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://artenativadancas.com.br/");
    expect(urls).toContain("https://artenativadancas.com.br/aulas");
    expect(urls).toContain("https://artenativadancas.com.br/locais");
    expect(urls).toContain("https://artenativadancas.com.br/eventos");
    expect(urls).toContain("https://artenativadancas.com.br/sobre");
    expect(urls).toContain(
      "https://artenativadancas.com.br/eventos/baile-arte-nativa",
    );
    expect(urls.some((url) => url.includes("/admin"))).toBe(false);
  });
});
