/**
 * JSON-LD — dados estruturados do site.
 *
 * Helpers puros: recebem conteúdo, devolvem objeto. Nenhum deles renderiza
 * nada, e nenhum conhece a rota em que está. Cada página monta o próprio grafo
 * com `grafoJsonLd(...)` e o serializa com `serializarJsonLd(...)`.
 *
 * Briefing § 10: `Physician` + `MedicalBusiness` na home e no consultório,
 * `MedicalProcedure` nas páginas de procedimento, `FAQPage` onde houver FAQ,
 * `BreadcrumbList` em todas.
 *
 * ---------------------------------------------------------------------------
 * A REGRA QUE GOVERNA ESTE ARQUIVO
 * ---------------------------------------------------------------------------
 *
 * **Placeholder nunca vira dado estruturado.**
 *
 * `content/consultorio.ts` está quase inteiro em `[CONFIRMAR]`: logradouro,
 * CEP, telefone, e-mail, horários, e até as coordenadas, que hoje apontam para
 * o centro de Belo Horizonte como marcador de pendência. Emitir isso em
 * JSON-LD publicaria um endereço falso em formato legível por máquina — o
 * Google, o Maps e qualquer agregador leriam como verdade, e o erro se
 * espalharia para fora do controle de quem o cometeu.
 *
 * Um endereço errado em dado estruturado é pior que endereço nenhum. Então:
 * campo pendente é omitido, e quando o que sobra não sustenta o bloco, o bloco
 * inteiro devolve `null` e a página não o emite. `grafoJsonLd` descarta nulos
 * justamente para que isso seja o caminho fácil.
 */

import { getConsultorio, getMedica } from "@/content";
import type {
  Medica,
  PerguntaResposta,
  Procedimento,
  HubSlug,
} from "@/content/tipos";
// `export ... from` reexporta mas não traz ao escopo local — este arquivo usa
// os três, então precisa importá-los também.
import { confirmado, ehPendente, textosConfirmados } from "./pendencias";
import { SITE, urlAbsoluta } from "./site";

/** Um nó do grafo. Objeto simples, serializável, sem classe nem instância. */
export type BlocoJsonLd = Record<string, unknown>;

export type ItemTrilha = {
  readonly nome: string;
  readonly href: string;
};

/** Âncora estável da médica no grafo. Outros blocos referenciam por `@id`. */
export const ID_MEDICA = urlAbsoluta("/#medica");
/** Âncora estável do consultório. */
export const ID_CONSULTORIO = urlAbsoluta("/consultorio#local");

// -----------------------------------------------------------------------------
// Pendências
// -----------------------------------------------------------------------------

/** Marcador usado por `/content` para o que ainda não foi confirmado. */
export const MARCADOR_PENDENTE = "[CONFIRMAR";

/**
 * A regra mora em `lib/pendencias.ts`, com os helpers de array que as páginas
 * usam. Reexportado aqui porque vários módulos já importavam daqui — e porque
 * duas definições da mesma regra, em dois arquivos, é como um marcador escapa.
 */
export { confirmado, ehPendente } from "./pendencias";

/**
 * Remove chaves `undefined` antes de serializar.
 *
 * `JSON.stringify` já as descartaria, mas os testes leem o objeto direto e um
 * `{ address: undefined }` presente é fácil de confundir com "tem endereço".
 */
function semVazios(objeto: BlocoJsonLd): BlocoJsonLd {
  return Object.fromEntries(
    Object.entries(objeto).filter(([, valor]) => valor !== undefined),
  );
}

// -----------------------------------------------------------------------------
// Physician
// -----------------------------------------------------------------------------

/**
 * A médica.
 *
 * `Physician` é, no schema.org, subtipo de `MedicalBusiness` — então este bloco
 * já cobre os dois tipos que o § 10 pede na home, mesmo enquanto
 * `medicalBusinessJsonLd()` devolve `null` por falta de endereço.
 *
 * O CRM e o RQE vão como `identifier`, não como texto solto na descrição: são
 * os dois números que identificam a profissional perante o CFM, e em dado
 * estruturado eles precisam ser legíveis como identificadores.
 *
 * `medicalSpecialty` é `Otolaryngologic`, e apenas ele. Ela realiza cirurgia
 * plástica da face dentro do escopo da especialidade — declarar
 * `PlasticSurgery` aqui seria afirmar, em dado estruturado, uma especialidade
 * que o RQE dela não registra (briefing § 3.2).
 */
export function physicianJsonLd(medica: Medica = getMedica()): BlocoJsonLd {
  const { identificacao } = medica;

  return semVazios({
    "@type": "Physician",
    "@id": ID_MEDICA,
    name: identificacao.nome,
    url: SITE.url,
    description: medica.descricaoAtuacao,
    medicalSpecialty: "Otolaryngologic",
    knowsLanguage: "pt-BR",
    areaServed: {
      "@type": "City",
      name: "Belo Horizonte",
      containedInPlace: { "@type": "State", name: "Minas Gerais" },
    },
    identifier: [
      {
        "@type": "PropertyValue",
        name: "CRM",
        value: identificacao.crm,
      },
      {
        "@type": "PropertyValue",
        name: "RQE",
        value: identificacao.rqe,
      },
    ],
    alumniOf: medica.formacao.map((item) => ({
      "@type": "EducationalOrganization",
      name: item.descricao,
    })),
  });
}

// -----------------------------------------------------------------------------
// MedicalBusiness
// -----------------------------------------------------------------------------

/**
 * O consultório.
 *
 * Devolve `null` enquanto o endereço não estiver confirmado — que é o estado
 * de hoje. Um `MedicalBusiness` sem `address` não é um erro de validação, mas
 * é um bloco que não informa nada e ainda assim declara um local; com o
 * endereço de mentira, é desinformação publicada. As duas alternativas são
 * piores que não emitir.
 *
 * Quando `content/consultorio.ts` for preenchido, este bloco passa a existir
 * sozinho, sem tocar em nenhuma página.
 */
export function medicalBusinessJsonLd(
  consultorio = getConsultorio(),
  medica: Medica = getMedica(),
): BlocoJsonLd | null {
  const logradouro = confirmado(consultorio.logradouro);
  if (logradouro === undefined) return null;

  const telefone = confirmado(consultorio.telefone);
  const email = confirmado(consultorio.email);
  const cep = confirmado(consultorio.cep);
  const bairro = confirmado(consultorio.bairro);
  const mapa = confirmado(consultorio.mapaUrl);

  const horarios = consultorio.horarios.filter(
    (horario) => !ehPendente(horario.dias) && !ehPendente(horario.horas),
  );

  return semVazios({
    "@type": "MedicalBusiness",
    "@id": ID_CONSULTORIO,
    name: consultorio.nome,
    url: urlAbsoluta("/consultorio"),
    medicalSpecialty: "Otolaryngologic",
    employee: { "@id": ID_MEDICA },
    telephone: telefone,
    email,
    hasMap: mapa,
    address: semVazios({
      "@type": "PostalAddress",
      // O bairro não tem campo próprio em PostalAddress e, no endereçamento
      // brasileiro, faz parte do logradouro. `addressLocality` é a cidade.
      streetAddress:
        bairro === undefined ? logradouro : `${logradouro} — ${bairro}`,
      addressLocality: consultorio.cidade,
      addressRegion: consultorio.uf,
      postalCode: cep,
      addressCountry: "BR",
    }),
    openingHours:
      horarios.length > 0
        ? horarios.map((horario) => `${horario.dias} ${horario.horas}`)
        : undefined,
    // `geo` só entra junto com o endereço: as coordenadas de hoje são o centro
    // de BH, deixadas como marcador. Ver content/consultorio.ts.
    geo: {
      "@type": "GeoCoordinates",
      latitude: consultorio.geo.latitude,
      longitude: consultorio.geo.longitude,
    },
    description: medica.descricaoAtuacao,
  });
}

// -----------------------------------------------------------------------------
// FAQPage
// -----------------------------------------------------------------------------

/**
 * FAQ.
 *
 * Perguntas cuja resposta ainda é placeholder ficam de fora — a mesma regra
 * que a página aplica ao renderizar a FAQ visível. Publicar
 * "[CONFIRMAR: convênios atendidos]" como resposta em dado estruturado a
 * ofereceria ao Google como resposta de verdade.
 *
 * Sem nenhuma pergunta publicável, devolve `null`.
 */
export function faqPageJsonLd(
  perguntas: readonly PerguntaResposta[],
): BlocoJsonLd | null {
  const publicaveis = perguntas.filter((item) => !ehPendente(item.resposta));
  if (publicaveis.length === 0) return null;

  return {
    "@type": "FAQPage",
    mainEntity: publicaveis.map((item) => ({
      "@type": "Question",
      name: item.pergunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.resposta,
      },
    })),
  };
}

// -----------------------------------------------------------------------------
// BreadcrumbList
// -----------------------------------------------------------------------------

/**
 * Trilha de navegação. `null` com menos de dois níveis: uma trilha de um item
 * só é a própria página, e não é trilha nenhuma.
 */
export function breadcrumbJsonLd(
  trilha: readonly ItemTrilha[],
): BlocoJsonLd | null {
  if (trilha.length < 2) return null;

  return {
    "@type": "BreadcrumbList",
    itemListElement: trilha.map((item, indice) => ({
      "@type": "ListItem",
      position: indice + 1,
      name: item.nome,
      item: urlAbsoluta(item.href),
    })),
  };
}

// -----------------------------------------------------------------------------
// MedicalProcedure
// -----------------------------------------------------------------------------

/**
 * Hubs cujos procedimentos são cirúrgicos.
 *
 * A estética facial não cirúrgica fica de fora: declarar toxina botulínica
 * como `SurgicalProcedure` seria descrever errado o que ela é.
 */
const HUBS_CIRURGICOS: readonly HubSlug[] = [
  "otorrinolaringologia",
  "cirurgia-da-face",
];

/**
 * Um procedimento.
 *
 * `howPerformed` sai de "Como é feito" e `preparation` da primeira etapa de
 * recuperação — os dois campos que o schema.org tem para o que o § 8.10 chama
 * de técnica e pós-operatório. Riscos não têm campo próprio no vocabulário e
 * NÃO são espremidos em `description`: eles vivem na página, com tratamento
 * tipográfico igual ao do resto, porque são a peça de maior conversão do site.
 */
export function medicalProcedureJsonLd(
  procedimento: Procedimento,
): BlocoJsonLd {
  const cirurgico = HUBS_CIRURGICOS.includes(procedimento.hub);

  return semVazios({
    "@type": "MedicalProcedure",
    "@id": urlAbsoluta(`/${procedimento.hub}/${procedimento.slug}#procedimento`),
    name: procedimento.nome,
    url: urlAbsoluta(`/${procedimento.hub}/${procedimento.slug}`),
    description: procedimento.lead,
    procedureType: cirurgico
      ? "https://schema.org/SurgicalProcedure"
      : undefined,
    // Filtrado aqui, e não no chamador: dado estruturado nunca pode carregar
    // marcador de pendência, independentemente de quem monte o bloco. O leitor
    // deste campo é o Google, e um "[CONFIRMAR: …]" indexado é pior do que um
    // campo ausente. Pego por scripts/verificar-html.ts na página da sinusite.
    howPerformed: textosConfirmados(procedimento.comoEFeito).join(" "),
    preparation: procedimento.recuperacao[0].descricao,
    relevantSpecialty: "Otolaryngologic",
    provider: { "@id": ID_MEDICA },
  });
}

// -----------------------------------------------------------------------------
// Montagem
// -----------------------------------------------------------------------------

/**
 * Costura os blocos em um único `@graph`, descartando os `null`.
 *
 * Um `<script>` por página, com todos os tipos dentro, em vez de um script por
 * tipo: é o formato que o Rich Results Test lê melhor e o único em que os
 * `@id` se resolvem entre blocos.
 */
export function grafoJsonLd(
  ...blocos: readonly (BlocoJsonLd | null | undefined)[]
): BlocoJsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": blocos.filter(
      (bloco): bloco is BlocoJsonLd => bloco !== null && bloco !== undefined,
    ),
  };
}

/**
 * Serializa para dentro de `<script type="application/ld+json">`.
 *
 * O `<` escapado é obrigatório: um conteúdo que contivesse `</script>` fecharia
 * a tag e o resto viraria markup executável. `<` é equivalente em JSON e
 * inerte em HTML.
 */
export function serializarJsonLd(grafo: BlocoJsonLd): string {
  return JSON.stringify(grafo).replace(/</g, "\\u003c");
}
