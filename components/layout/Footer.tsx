import Link from "next/link";
import type { ReactNode } from "react";

import {
  AVISOS_RODAPE,
  CTA_AGENDAR,
  NAV_LEGAL,
  NAV_RODAPE,
} from "@/content/nav";
import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { Filete } from "@/components/ui/Filete";
import { Nota } from "@/components/ui/Nota";
import { PlaceholderImagem } from "@/components/ui/PlaceholderImagem";

/**
 * Footer — o fecho do site.
 *
 * Superfície `wine-900`: mais fundo que o vinho das seções de imersão, para o
 * rodapé encerrar em vez de parecer só mais um bloco. Continua declarando
 * `data-superficie="vinho"`, porque é isso que o Traço lê e o que troca a cor
 * do foco para blush.
 *
 * ## O bloco do CFM
 *
 * Entra por `identificacao`, e não por import direto. O componente
 * `<IdentificacaoCFM />` é do subagent D, e a razão de a injeção existir não é
 * ordem de trabalho: é que o bloco precisa aparecer em **todas** as páginas
 * (§ 3.1), então quem monta o layout é que deve garantir isso — não um rodapé
 * que poderia, em tese, ser trocado por outro.
 *
 * TODO(fase 2, subagent D): no `app/layout.tsx`, montar como
 *   import { IdentificacaoCFM } from "@/components/medical/IdentificacaoCFM";
 *   <Footer identificacao={<IdentificacaoCFM />} />
 * Enquanto não vier, o rodapé renderiza um aviso visível de pendência em vez
 * de silêncio — um bloco obrigatório que falta precisa doer.
 *
 * ## O selo
 *
 * Aparece uma única vez no site inteiro, aqui (§ 5.5). Como o SVG oficial
 * ainda não chegou (PENDENCIAS.md, item 5), o lugar dele é ocupado pelo
 * PlaceholderImagem — que é honesto sobre a ausência em vez de exibir uma
 * versão inventada do logo como se fosse a marca dela.
 */

type Props = {
  /** `<IdentificacaoCFM />`. Obrigatório em produção; ver o TODO acima. */
  readonly identificacao?: ReactNode;
};

export function Footer({ identificacao }: Props) {
  const ano = new Date().getFullYear();

  return (
    <footer
      data-superficie="vinho"
      className="bg-wine-900 pt-[calc(var(--secao-y)/1.6)] pb-12"
    >
      <Container>
        {/* Chamada de fecho. Assimétrica: texto à esquerda, ação à direita. */}
        <div className="flex flex-col gap-8 pb-14 md:flex-row md:items-end md:justify-between">
          <p className="font-display text-h2 text-blush-200 max-w-[26ch] font-normal">
            Uma consulta antes de qualquer decisão.
          </p>
          <Botao href={CTA_AGENDAR.href}>{CTA_AGENDAR.texto}</Botao>
        </div>

        <Filete />

        <div className="grid gap-12 py-14 md:grid-cols-[auto_1fr] md:gap-16">
          <div className="flex flex-col gap-6">
            <PlaceholderImagem
              descricao="Logo, selo circular em vinho"
              aspecto="1/1"
              className="w-24"
            />
            <p className="font-display text-blush-200 text-[1.5rem] leading-none font-normal tracking-[-0.02em]">
              Lívia Sant&apos;Anna
            </p>
          </div>

          <nav
            aria-label="Navegação do rodapé"
            className="grid gap-10 sm:grid-cols-2 xl:grid-cols-4"
          >
            {NAV_RODAPE.map((grupo) => (
              <div key={grupo.href} className="flex flex-col gap-4">
                <Link
                  href={grupo.href}
                  className="link-filete text-micro text-wine-300 self-start font-mono tracking-[0.14em] uppercase"
                >
                  {grupo.texto}
                </Link>

                <ul className="flex list-none flex-col gap-2">
                  {(grupo.filhos ?? []).map((filho) => (
                    <li key={filho.href}>
                      <Link
                        href={filho.href}
                        className="link-filete text-small text-sand-50"
                      >
                        {filho.texto}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <Filete />

        {/* Bloco de identificação — § 3.1. Local visível, todas as páginas. */}
        <div className="py-10">
          {identificacao ?? (
            <Nota tom="atencao">
              Bloco de identificação profissional pendente de montagem no
              layout. Ver PENDENCIAS.md e docs/COMPLIANCE-CFM.md.
            </Nota>
          )}
        </div>

        <Filete />

        <div className="flex flex-col gap-8 pt-10">
          <div className="flex flex-col gap-2">
            {AVISOS_RODAPE.map((aviso) => (
              <Nota key={aviso}>{aviso}</Nota>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <ul className="flex list-none flex-wrap items-center gap-6">
              {NAV_LEGAL.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-filete text-micro text-wine-300 font-mono tracking-[0.14em] uppercase"
                  >
                    {item.texto}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="text-micro text-wine-300 font-mono tracking-[0.12em]">
              {ano}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
