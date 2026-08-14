"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { JSX } from "react";

/**
 * VideoSobClique — o vídeo do centro cirúrgico, § 9 do briefing.
 *
 * ## Antes do clique não existe vídeo
 *
 * Não é `preload="none"` num `<video>` que já está no DOM: **o elemento
 * `<video>` não é renderizado**. Antes do clique a página tem uma imagem
 * estática e um botão, e mais nada — nenhuma requisição, nenhum
 * `readyState`, nenhum byte dos 3,5 MB do arquivo. `preload="none"` continua
 * declarado no elemento que nasce depois, porque o briefing pede e porque um
 * dia alguém pode montar este componente já aberto.
 *
 * O motivo é medido, não estético: 3,5 MB entrando em paralelo com o retrato
 * do hero disputa a mesma banda que decide o LCP, e a meta é abaixo de 2,0s em
 * 4G lento. Um vídeo que ninguém pediu não pode custar o primeiro paint de
 * quem só queria ler.
 *
 * ## Movimento
 *
 * Nenhum, até o usuário pedir. O pôster é imagem estática, sem `transition` e
 * sem `animation` — nada para `prefers-reduced-motion` desligar, porque nada
 * se move. A única coisa que reage ao ponteiro é o filete do rótulo crescendo
 * da esquerda, que é o item 3 do orçamento do § 5.7 e já morre sozinho em
 * `prefers-reduced-motion` pela regra global.
 *
 * Sem autoplay, sem loop, sem vídeo de fundo. O § 15 proíbe um segundo
 * elemento disputando o papel de assinatura com o Traço, e vídeo em movimento
 * atrás de texto é exatamente isso.
 *
 * ## A proporção
 *
 * A caixa é 9/16 porque o arquivo é 9/16 (720×1280) e o pôster é entregue no
 * mesmo enquadramento (630×1120). Pôster e vídeo dividem a mesma caixa, então
 * a troca no clique não move um pixel do que está em volta — e não há barra
 * preta, que seria o preço de encaixar um vídeo em pé numa moldura deitada.
 * Trocar o arquivo por um de outra proporção pede trocar esta linha junto.
 */

type Props = {
  readonly src: string;
  /** Imagem estática, na mesma proporção do vídeo. */
  readonly poster: string;
  /** Descreve a cena. Vira `<figcaption>` e entra no rótulo do botão. */
  readonly legenda: string;
};

export function VideoSobClique({ src, poster, legenda }: Props): JSX.Element {
  const [tocando, setTocando] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const no = video.current;
    if (no === null) return;

    /*
      O foco vai para o vídeo assim que ele entra: quem clicou com o teclado
      estava no botão, e o botão acabou de deixar de existir. Sem isso o foco
      cai no `<body>` e a pessoa volta ao topo da página na próxima tabulação.
    */
    no.focus();

    /*
      `play()` rejeita quando a política de mídia do navegador não deixa. Aqui
      ela deixa — é `muted` e veio de um gesto do usuário — mas a promessa
      rejeitada não tratada vira erro no console, e o pior caso já é aceitável:
      o vídeo fica parado, com os controles nativos à mão.

      O `Promise.resolve` em volta é para ambiente sem pilha de mídia (o jsdom
      dos testes devolve `undefined` em vez de promessa) não derrubar o efeito.
    */
    void Promise.resolve(no.play()).catch(() => undefined);
  }, [tocando]);

  return (
    <figure className="flex flex-col gap-3">
      <div className="rounded-filete bg-wine-900 relative aspect-[9/16] w-full overflow-hidden">
        {tocando ? (
          /*
            Sem `<track>` de legendas porque não há fala: é ruído de sala
            cirúrgica, e o vídeo entra sempre `muted` — que é a exceção que o
            próprio `jsx-a11y/media-has-caption` reconhece. Uma faixa vazia
            satisfaria o lint e mentiria para quem depende dela. O que a cena
            mostra está no `<figcaption>`, em texto.
          */
          <video
            ref={video}
            src={src}
            poster={poster}
            preload="none"
            controls
            muted
            playsInline
            // Os controles nativos são um grupo de comandos e precisam de nome
            // próprio: sem isso o leitor de tela anuncia "reprodutor de vídeo"
            // e a pessoa não sabe de qual vídeo se trata.
            aria-label={legenda}
            className="h-full w-full object-cover"
          />
        ) : (
          <button
            type="button"
            onClick={() => setTocando(true)}
            aria-label={`Assistir ao vídeo: ${legenda}`}
            className="relative block h-full w-full cursor-pointer text-left"
          >
            {/* `alt=""`: o botão já tem nome acessível, e descrever a imagem
                faria o leitor de tela anunciar a cena duas vezes. */}
            <Image
              src={poster}
              alt=""
              fill
              sizes="(min-width: 1024px) 30vw, 60vw"
              className="object-cover"
            />

            {/*
              A barra vinho existe para o rótulo ter contraste medido. Texto
              solto sobre fotografia não tem par de cor que se possa validar —
              muda com a foto, muda com o recorte — e o § 5.2 fecha a questão:
              destaque vem de troca de superfície. `blush-200` sobre
              `wine-700` e `wine-900` sobre `blush-200` estão os dois em
              scripts/verificar-contraste.ts.

              A barra pinta o vinho por classe e NÃO declara
              `data-superficie="vinho"`. O atributo não é decoração: o Traço
              varre `[data-superficie]` para medir os retângulos das seções e
              decidir a cor de cada segmento da fita. Uma tarja de 60px
              declarando-se superfície entraria nessa conta.
            */}
            <span className="bg-wine-700 absolute inset-x-0 bottom-0 flex items-center gap-4 p-3">
              {/* 44px cheios (WCAG 2.5.5) no elemento que a pessoa mira. */}
              <span className="rounded-filete bg-blush-200 text-wine-900 flex size-11 shrink-0 items-center justify-center">
                <svg
                  viewBox="0 0 12 14"
                  aria-hidden="true"
                  focusable="false"
                  className="h-3.5 w-3"
                >
                  <path d="M0 0 L12 7 L0 14 Z" fill="currentColor" />
                </svg>
              </span>

              <span className="link-filete link-filete-sem-alvo text-micro text-blush-200 font-mono tracking-[0.12em] uppercase">
                Assistir ao vídeo
              </span>
            </span>
          </button>
        )}
      </div>

      <figcaption className="text-micro text-ink-400 [[data-superficie=vinho]_&]:text-wine-300 max-w-[38ch] font-mono tracking-[0.08em]">
        {legenda}
      </figcaption>
    </figure>
  );
}
