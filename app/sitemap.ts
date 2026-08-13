import type { MetadataRoute } from "next";

import { listarRotas } from "@/content";
import { urlAbsoluta } from "@/lib/site";

/**
 * Sitemap gerado a partir de listarRotas().
 *
 * A mesma função alimenta os testes de axe-core e o teste do bloco CFM, então
 * uma rota nova entra em cobertura de acessibilidade e de compliance sozinha.
 * Não escreva rotas à mão aqui.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return listarRotas().map((rota) => ({
    url: urlAbsoluta(rota),
    changeFrequency: "monthly",
    priority: rota === "/" ? 1 : 0.7,
  }));
}
