/**
 * Navegação do site.
 *
 * Rotas conforme briefing § 7. Este arquivo é a única fonte de verdade da
 * navegação: Header, MenuMobile e Footer leem daqui, e nenhum deles escreve
 * href à mão. Uma rota que muda de endereço muda em um lugar só.
 *
 * Não confundir com `listarRotas()` de `content/index.ts`, que existe para
 * sitemap e testes e enumera *todas* as rotas, inclusive as que não aparecem
 * na navegação (as páginas legais moram só no rodapé).
 */

import type { ItemNav, Link } from "./tipos";

// -----------------------------------------------------------------------------
// Ação principal
//
// Copy de botão diz o que acontece (briefing § 6). "Agendar consulta", nunca
// "Saiba mais". Sentence case, nunca Title Case.
// -----------------------------------------------------------------------------

export const CTA_AGENDAR: Link = {
  texto: "Agendar consulta",
  href: "/contato",
};

// -----------------------------------------------------------------------------
// Navegação principal — Header e menu mobile
//
// Os dois hubs clínicos aparecem lado a lado, com o mesmo peso. A tese do site
// é que forma e função estão nas mesmas mãos; um hub acima do outro na
// navegação já desmentiria isso antes da primeira seção.
// -----------------------------------------------------------------------------

export const NAV_PRINCIPAL: readonly ItemNav[] = [
  {
    texto: "A médica",
    href: "/dra-livia-santanna",
  },
  {
    texto: "Otorrinolaringologia",
    href: "/otorrinolaringologia",
    filhos: [
      {
        texto: "Desvio de septo",
        href: "/otorrinolaringologia/desvio-de-septo",
      },
      {
        texto: "Amígdalas e adenoides",
        href: "/otorrinolaringologia/amigdalas-e-adenoides",
      },
      { texto: "Sinusite", href: "/otorrinolaringologia/sinusite" },
      {
        texto: "Tubo de ventilação",
        href: "/otorrinolaringologia/tubo-de-ventilacao",
      },
      { texto: "Timpanoplastia", href: "/otorrinolaringologia/timpanoplastia" },
    ],
  },
  {
    texto: "Cirurgia da face",
    href: "/cirurgia-da-face",
    filhos: [
      { texto: "Rinoplastia", href: "/cirurgia-da-face/rinoplastia" },
      { texto: "Otoplastia", href: "/cirurgia-da-face/otoplastia" },
      { texto: "Blefaroplastia", href: "/cirurgia-da-face/blefaroplastia" },
      { texto: "Cantopexia", href: "/cirurgia-da-face/cantopexia" },
      { texto: "Frontoplastia", href: "/cirurgia-da-face/frontoplastia" },
    ],
  },
  {
    texto: "Estética facial",
    href: "/estetica-facial",
    filhos: [
      {
        texto: "Toxina botulínica",
        href: "/estetica-facial/toxina-botulinica",
      },
    ],
  },
  {
    texto: "A consulta",
    href: "/consulta",
  },
  {
    texto: "Consultório",
    href: "/consultorio",
  },
];

// -----------------------------------------------------------------------------
// Rodapé
//
// Mesma estrutura da navegação principal, mais a coluna institucional. O
// rodapé é o único lugar onde a árvore inteira fica visível de uma vez.
// -----------------------------------------------------------------------------

export const NAV_RODAPE: readonly ItemNav[] = [
  ...NAV_PRINCIPAL.filter((item) => item.filhos !== undefined),
  {
    texto: "A médica",
    href: "/dra-livia-santanna",
    filhos: [
      { texto: "A consulta", href: "/consulta" },
      { texto: "Consultório", href: "/consultorio" },
      { texto: "Contato", href: "/contato" },
    ],
  },
];

/** Páginas legais. Ficam só no rodapé, em linha, abaixo do bloco do CFM. */
export const NAV_LEGAL: readonly Link[] = [
  { texto: "Política de privacidade", href: "/politica-de-privacidade" },
  { texto: "Aviso legal", href: "/aviso-legal" },
];

/**
 * Avisos do rodapé.
 *
 * Em mono, como todo fato verificável. O primeiro é o que a Resolução CFM
 * 2.336/2023 espera de um site de publicidade médica: a informação não
 * substitui a consulta, e risco existe e é explicado individualmente.
 */
export const AVISOS_RODAPE: readonly string[] = [
  "As informações deste site têm caráter informativo e não substituem a consulta médica.",
  "Toda cirurgia envolve riscos, explicados individualmente na consulta e no termo de consentimento.",
  "Resultados variam conforme anatomia, cicatrização e histórico de cada paciente.",
];
