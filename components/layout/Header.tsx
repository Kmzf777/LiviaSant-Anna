"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { Superficie } from "@/content/tipos";
import { CTA_AGENDAR, NAV_PRINCIPAL } from "@/content/nav";
import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { cn } from "@/components/ui/cn";
import { MenuMobile } from "./MenuMobile";

/**
 * Header — sticky, transparente sobre o hero, sólido depois.
 *
 * ## Como ele sabe de que cor ser
 *
 * O hero da home é vinho; o de uma página de procedimento é areia. Um header
 * de cor fixa erraria metade das páginas, e passar a cor por prop obrigaria
 * cada rota a lembrar de fazer isso — o tipo de acoplamento que a Fase 3 vai
 * esquecer em pelo menos uma página.
 *
 * Então ele lê: encontra a primeira seção dentro de `#conteudo` e usa o
 * `data-superficie` dela. O mesmo atributo que pinta a seção, alimenta o Traço
 * e troca a cor do foco. Uma fonte de verdade, três consumidores.
 *
 * ## Por que ele também mede o overlap
 *
 * Ler a superfície não basta. O header é `sticky`, então ocupa espaço no fluxo
 * e a primeira seção começa ABAIXO dele — a menos que ela peça o contrário com
 * `-mt-[var(--header-h)]`. Sem esse puxão, o header transparente flutua sobre o
 * fundo do body (areia), e não sobre o vinho que ele leu. O resultado é
 * tipografia blush sobre areia: 1.2:1, ilegível, e uma reprovação de WCAG que
 * nenhum script de contraste pega, porque os dois tokens nunca foram declarados
 * como par.
 *
 * Então a condição não é "a primeira seção é vinho", é "a primeira seção é
 * vinho E está de fato debaixo de mim". Se a Fase 3 esquecer o puxão em alguma
 * página, o header cai para tinta — menos bonito, sempre legível. Falhar para
 * o lado seguro.
 *
 * ## Estados
 *
 *   topo + hero vinho sob o header   transparente, tipografia blush
 *   topo + hero areia                transparente, tipografia tinta
 *   topo sem overlap                 transparente, tipografia tinta
 *   rolado                           fundo sand-50 e o filete de 1px do § 5.6
 *
 * A "sombra" do estado rolado é `--sombra-header`, que é `0 1px 0` em
 * `sand-200`: a única box-shadow autorizada no site, e ela é um filete.
 */

/** Alguns pixels de folga para o estado não piscar no micro-scroll do trackpad. */
const LIMIAR_SCROLL = 12;

export function Header() {
  const rota = usePathname();
  const [rolado, setRolado] = useState(false);
  const [superficieTopo, setSuperficieTopo] = useState<Superficie>("areia");
  /** A primeira seção está mesmo sob o header, ou começa abaixo dele? */
  const [sobreposto, setSobreposto] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolado(window.scrollY > LIMIAR_SCROLL);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    const cabecalho = document.querySelector<HTMLElement>("header");
    const primeira = document.querySelector<HTMLElement>(
      "#conteudo [data-superficie]",
    );

    const lida = primeira?.dataset["superficie"];
    setSuperficieTopo(
      lida === "vinho" || lida === "areia-100" ? lida : "areia",
    );

    // A seção só está sob o header se o topo dela, em coordenadas de documento,
    // cabe dentro da altura dele. Um pixel de folga para arredondamento.
    const alturaHeader = cabecalho?.offsetHeight ?? 0;
    const topoDaSecao = primeira
      ? primeira.getBoundingClientRect().top + window.scrollY
      : Number.POSITIVE_INFINITY;

    setSobreposto(topoDaSecao <= alturaHeader + 1);
    setMenuAberto(false);
  }, [rota]);

  // Tipografia clara só quando o header está de fato sobreposto a um hero vinho.
  const claro = !rolado && sobreposto && superficieTopo === "vinho";

  return (
    <>
      <header
        data-rolado={rolado ? "true" : "false"}
        data-superficie={claro ? "vinho" : "areia"}
        className={cn(
          "duration-fast sticky top-0 z-40 w-full transition-colors ease-out",
          claro ? "text-blush-200" : "text-ink-900",
          // Rolado: o fundo vem do próprio data-superficie="areia"; a única
          // coisa acrescentada é o filete de 1px em forma de box-shadow.
          rolado ? "shadow-[var(--sombra-header)]" : "bg-transparent",
        )}
      >
        {/*
          Altura fixa, não padding. O hero se encaixa embaixo do header com
          `-mt-[var(--header-h)]`, então o token precisa ser verdade — e com
          padding ele não era: o botão do menu esticava o header para 88px em
          390 e 768, contra os 80px declarados, deixando uma faixa errada no
          topo dessas larguras. Agora a altura É o token.
          Coberto por tests/e2e/header.spec.ts.
        */}
        <Container className="flex h-[var(--header-h)] items-center justify-between gap-8">
          <Link
            href="/"
            aria-label="Lívia Sant'Anna — página inicial"
            // `whitespace-nowrap`: em 390px o nome quebrava em duas linhas e
            // empurrava a altura do header de 80 para 86px, desalinhando o
            // `--header-h` que o hero usa para se encaixar embaixo dele.
            //
            // A área de toque vem de um pseudo-elemento, e não de altura no
            // próprio link. A caixa dele mede 164×24: crescer para 44px de
            // altura reprovaria `tests/e2e/header.spec.ts`, que divide a
            // altura real pelo font-size para provar que o nome não quebrou em
            // duas linhas — 44/24 arredonda para 2. O `::before` estende o
            // alvo em 10px para cada lado sem tocar na caixa medida, e o
            // desenho não muda um pixel.
            className="font-display relative text-[1.5rem] leading-none font-normal tracking-[-0.02em] whitespace-nowrap before:absolute before:inset-x-0 before:-inset-y-2.5 before:content-['']"
          >
            Lívia Sant&apos;Anna
          </Link>

          <nav
            aria-label="Navegação principal"
            className="hidden lg:block lg:flex-1"
          >
            <ul className="flex list-none items-center justify-center gap-8 xl:gap-10">
              {NAV_PRINCIPAL.map((item) => {
                const atual =
                  rota === item.href || rota.startsWith(`${item.href}/`);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={atual ? "page" : undefined}
                      // O filete da página atual fica permanentemente aberto.
                      // Vai inline porque `.link-filete` mora no fim da camada
                      // de utilitários e venceria qualquer classe de mesma
                      // especificidade que tentasse abrir o background-size.
                      style={atual ? { backgroundSize: "100% 1px" } : undefined}
                      className="link-filete text-small inline-block py-1"
                    >
                      {item.texto}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            {/*
              O `hidden` vai no invólucro, não no `className` do Botão.
              Passado ao Botão ele não teria efeito: `BASE` já traz
              `inline-flex`, e o Tailwind emite essa regra depois de `hidden`
              — o botão aparecia em 390px. Ver o comentário em ui/cn.ts.
            */}
            <span className="hidden md:inline-flex">
              <Botao href={CTA_AGENDAR.href} tamanho="compacto">
                {CTA_AGENDAR.texto}
              </Botao>
            </span>

            <button
              type="button"
              onClick={() => setMenuAberto(true)}
              aria-expanded={menuAberto}
              aria-haspopup="dialog"
              // 44px de altura mínima: no celular este botão é o ÚNICO acesso
              // à navegação, e ele media 33. Cabe folgado dentro dos 80px de
              // `--header-h`, que é altura fixa e continua sendo — o Container
              // é `items-center`, então um filho de 44px não estica nada e
              // `tests/e2e/header.spec.ts` segue passando.
              // `-mr-2 pr-2` empurra o alvo até a goteira sem mover o texto.
              className="text-micro -mr-2 flex min-h-11 items-center gap-3 pr-2 font-mono tracking-[0.14em] uppercase lg:hidden"
            >
              {/* Duas réguas de 1px: o mesmo filete que separa as seções. */}
              <span
                aria-hidden="true"
                className="flex w-6 flex-col gap-[5px] border-current"
              >
                <span className="block w-full border-t border-current" />
                <span className="block w-full border-t border-current" />
              </span>
              Menu
            </button>
          </div>
        </Container>
      </header>

      <MenuMobile
        aberto={menuAberto}
        aoFechar={() => setMenuAberto(false)}
        itens={NAV_PRINCIPAL}
        rotaAtual={rota}
      />
    </>
  );
}
