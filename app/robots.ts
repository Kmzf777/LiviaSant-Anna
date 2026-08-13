import type { MetadataRoute } from "next";

import { urlAbsoluta } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Galeria de componentes: útil no desenvolvimento, ruído na busca.
      disallow: ["/_dev/"],
    },
    sitemap: urlAbsoluta("/sitemap.xml"),
  };
}
