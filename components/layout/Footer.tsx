import Image from "next/image";
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
 * Aparece uma única vez no site inteiro, aqui (§ 5.5) — e é o logo real, na
 * variante clara, com transparência, sobre o vinho do rodapé.
 *
 * Ainda é PNG. O SVG continua valendo a pena por dois motivos: nitidez em tela
 * de alta densidade, e a curva do perfil de rosto, que é de onde `lib/traco.ts`
 * deveria extrair a geometria da assinatura do site. Ver PENDENCIAS.md.
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
      className="bg-wine-900 pt-[calc(clamp(3.5rem,2.25rem_+_5vw,var(--secao-y))/1.4)] pb-12"
    >
      <Container>
        {/* Chamada de fecho. Assimétrica: texto à esquerda, ação à direita. */}
        <div className="flex flex-col gap-8 pb-10 md:flex-row md:items-end md:justify-between md:pb-14">
          <p className="font-display text-h2 text-blush-200 max-w-[26ch] font-normal">
            Uma consulta antes de qualquer decisão.
          </p>
          <Botao href={CTA_AGENDAR.href}>{CTA_AGENDAR.texto}</Botao>
        </div>

        <Filete />

        <div className="grid gap-10 py-10 md:grid-cols-[auto_1fr] md:gap-16 md:py-14">
          <div className="flex flex-col items-start gap-6">
            {/*
              A largura vai no invólucro, não no `className` do placeholder.
              Passada a ele não tinha efeito: a base traz `w-full`, e o
              Tailwind emite essa regra depois de `w-24` — o selo do rodapé
              ocupava a coluna inteira (350×350 em 390px) em vez dos 96px
              pedidos, e o quadrado vazio virava o maior bloco sem conteúdo de
              todas as 21 rotas. Mesma armadilha do CTA do header; ver o
              comentário em components/ui/cn.ts.
            */}
            {/*
              `alt=""` de propósito: o selo é decorativo AQUI.

              Ele traz o nome dela desenhado, e o nome aparece como texto logo
              abaixo. Descrever a imagem faria o leitor de tela anunciar
              "Lívia Sant'Anna" duas vezes seguidas — ruído que só quem depende
              do leitor percebe.

              O arquivo é a variante clara do logo, com transparência, e por
              isso vive sobre o vinho do rodapé sem caixa branca em volta.
              Proporção natural 571×437: o selo é circular, mas o PNG tem
              respiro lateral, e forçar 1/1 apertaria o desenho.
            */}
            <Image
              src="/fotos/logo-selo.png"
              alt=""
              width={571}
              height={437}
              sizes="160px"
              className="h-auto w-40"
            />
            {/* Aqui o nome completo cabe em qualquer largura: no celular esta
                coluna é a única da grade e ocupa o container inteiro, sem
                botão dividindo a linha — ao contrário do Header e do
                MenuMobile, onde o "Dra." só entra a partir de `sm`. */}
            <p className="font-display text-blush-200 text-[1.5rem] leading-none font-normal tracking-[-0.02em]">
              Dra. Lívia Sant&apos;Anna
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
