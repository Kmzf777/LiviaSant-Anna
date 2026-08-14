/**
 * Camada de acesso ao conteúdo.
 *
 * Páginas importam DAQUI, nunca dos arrays direto. Quando o conteúdo migrar
 * para um CMS, estas funções viram chamadas de fetch e nenhuma página muda.
 * Se uma página importar `PROCEDIMENTOS` diretamente, a migração vira
 * reescrita — por isso a regra existe.
 */

import type {
  Consultorio,
  ConteudoHome,
  Hub,
  HubSlug,
  Medica,
  PaginaInstitucional,
  PerguntaResposta,
  Procedimento,
} from "./tipos";
import type { Hospital } from "./hospitais";

import { CONSULTA } from "./consulta";
import { CONSULTORIO } from "./consultorio";
import { HOSPITAIS } from "./hospitais";
import { TESE } from "./tese";
import { MEDICA } from "./medica";
import { HOME } from "./home";
import { HUBS } from "./hubs";
import { PROCEDIMENTOS } from "./procedimentos";
import { FAQ_TRANSVERSAL } from "./faq";
import { PAGINAS_INSTITUCIONAIS } from "./legal";

// -----------------------------------------------------------------------------
// A médica e o consultório
// -----------------------------------------------------------------------------

export function getMedica(): Medica {
  return MEDICA;
}

export function getConsultorio(): Consultorio {
  return CONSULTORIO;
}

/**
 * Hospitais onde ela atuou e atua — a prova social da home.
 *
 * `atual: true` primeiro, porque é o que responde "onde ela opera hoje";
 * o histórico vem depois e explica como ela chegou lá.
 */
export function listarHospitais(): readonly Hospital[] {
  return [...HOSPITAIS].sort(
    (a, b) => Number(b.atual) - Number(a.atual),
  );
}

// -----------------------------------------------------------------------------
// Home
// -----------------------------------------------------------------------------

export function getHome(): ConteudoHome {
  return HOME;
}

/**
 * A tese "forma e função", que abria a home e hoje abre a rinoplastia.
 * Ver o comentário em `content/tese.ts` para o porquê da mudança de lugar.
 */
export function getTese(): typeof TESE {
  return TESE;
}

/** A jornada da consulta, em quatro passos. Consumida por `/consulta`. */
export function getConsulta(): typeof CONSULTA {
  return CONSULTA;
}

export function getFaqTransversal(): readonly PerguntaResposta[] {
  return FAQ_TRANSVERSAL;
}

// -----------------------------------------------------------------------------
// Hubs e procedimentos
// -----------------------------------------------------------------------------

export function listarHubs(): readonly Hub[] {
  return HUBS;
}

export function getHub(slug: string): Hub | undefined {
  return HUBS.find((hub) => hub.slug === slug);
}

export function listarProcedimentos(hub?: HubSlug): readonly Procedimento[] {
  return hub ? PROCEDIMENTOS.filter((p) => p.hub === hub) : PROCEDIMENTOS;
}

export function getProcedimento(
  hub: HubSlug,
  slug: string,
): Procedimento | undefined {
  return PROCEDIMENTOS.find((p) => p.hub === hub && p.slug === slug);
}

export function getProcedimentoPorSlug(slug: string): Procedimento | undefined {
  return PROCEDIMENTOS.find((p) => p.slug === slug);
}

/** Resolve `relacionados` (lista de slugs) nos procedimentos correspondentes. */
export function listarRelacionados(
  procedimento: Procedimento,
): readonly Procedimento[] {
  return procedimento.relacionados
    .map((slug) => getProcedimentoPorSlug(slug))
    .filter((p): p is Procedimento => p !== undefined);
}

// -----------------------------------------------------------------------------
// Institucional
// -----------------------------------------------------------------------------

export function listarPaginasInstitucionais(): readonly PaginaInstitucional[] {
  return PAGINAS_INSTITUCIONAIS;
}

export function getPaginaInstitucional(
  slug: string,
): PaginaInstitucional | undefined {
  return PAGINAS_INSTITUCIONAIS.find((p) => p.slug === slug);
}

// -----------------------------------------------------------------------------
// Rotas
//
// Fonte única para sitemap.ts, para os testes de a11y (que varrem toda rota)
// e para os testes de compliance do bloco CFM. Uma rota nova entra na
// cobertura de teste sozinha.
// -----------------------------------------------------------------------------

export function listarRotas(): readonly string[] {
  return [
    "/",
    "/dra-livia-santanna",
    "/consulta",
    "/consultorio",
    "/contato",
    ...HUBS.map((hub) => `/${hub.slug}`),
    ...PROCEDIMENTOS.map((p) => `/${p.hub}/${p.slug}`),
    ...PAGINAS_INSTITUCIONAIS.map((p) => `/${p.slug}`),
  ];
}

export * from "./tipos";
export type { Hospital } from "./hospitais";
