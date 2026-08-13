"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import type { Imagem } from "@/content";

/**
 * Comparação antes e depois — Resolução CFM nº 2.336/2023.
 * Briefing § 3.3, spec § 3.2.
 *
 * A norma permite antes e depois sob condições CUMULATIVAS. Se qualquer uma
 * faltar, a imagem não pode ser publicada:
 *
 *   1. autorização formal e documentada do paciente
 *   2. paciente não identificável
 *   3. imagem sem manipulação (mesma luz, mesmo ângulo, mesma distância focal)
 *   4. contexto educativo junto à imagem
 *   5. aviso explícito de que resultados variam entre pacientes
 *
 * O que este componente impõe tecnicamente:
 *
 *   (1) `autorizacaoId` é prop obrigatória. Sem ela não compila. String vazia
 *       lança em tempo de execução — o tipo `string` não impede `""`, o
 *       invariante impede.
 *   (3) as duas imagens precisam ter a mesma proporção. Enquadramento
 *       diferente entre antes e depois é a manipulação mais comum e a mais
 *       fácil de medir. Divergiu, lança.
 *   (4) `textoEducativo` é prop obrigatória, com mínimo de conteúdo, e é
 *       renderizado sempre visível ao lado da imagem — nunca em tooltip,
 *       nunca em accordion fechado.
 *   (5) o aviso de variação é renderizado por construção, com texto padrão.
 *
 * O que este componente NÃO consegue impor, e por isso está em
 * docs/COMPLIANCE-CFM.md como conferência humana obrigatória:
 *
 *   (2) que o paciente não seja identificável;
 *   (3) que não houve retoque, filtro ou troca de iluminação;
 *   e que a autorização referenciada por `autorizacaoId` de fato exista.
 *
 * Na v1 não há imagens autorizadas. O componente fica pronto e testado; a home
 * renderiza a seção da § 8.8, que explica a ausência em vez de inventar
 * galeria.
 *
 * Sobre a ausência de `motion`: o arraste aqui é manipulação direta, 1:1 com o
 * ponteiro — não há mola, não há gesto a interromper. Uma transição CSS cobre
 * o único caso animado (o passo de teclado) e desliga sozinha sob
 * `prefers-reduced-motion`, que já está tratado em app/globals.css. Adicionar
 * uma biblioteca de animação ao componente mais sensível do site custaria
 * bundle sem devolver nada ao paciente.
 */

/**
 * Piso de conteúdo do texto educativo. Um campo obrigatório preenchido com
 * "ok" satisfaz o compilador e não satisfaz a norma: a exigência é indicação,
 * possíveis evoluções satisfatórias e insatisfatórias, riscos e complicações.
 */
export const MINIMO_TEXTO_EDUCATIVO = 120;

/** Tolerância de proporção entre as duas fotos. 1% cobre arredondamento. */
const TOLERANCIA_PROPORCAO = 0.01;

const AVISO_VARIACAO_PADRAO =
  "Resultados variam entre pacientes, conforme anatomia, cicatrização e " +
  "histórico de cada pessoa. Nenhuma imagem aqui prevê o seu resultado.";

const PASSO_TECLADO = 2;
const PASSO_TECLADO_LARGO = 10;
const POSICAO_INICIAL = 50;

type Props = {
  readonly antes: Imagem;
  readonly depois: Imagem;
  /**
   * Indicação, possíveis evoluções satisfatórias e insatisfatórias, riscos e
   * complicações. Obrigatório: sem ele o componente não compila.
   */
  readonly textoEducativo: string;
  /**
   * Referência ao termo de autorização arquivado. Obrigatório: sem ele o
   * componente não compila.
   *
   * Use um código opaco de arquivo. NUNCA nome, iniciais, CPF, data de
   * nascimento ou qualquer dado que reidentifique o paciente — este valor é
   * renderizado na página.
   */
  readonly autorizacaoId: string;
  /** "6 meses após a cirurgia", "12 meses"… Contextualiza a comparação. */
  readonly intervaloEntreFotos: string;
  /** Sobrescreve o aviso padrão de variação. Não o remove. */
  readonly avisoVariacao?: string;
};

function limitar(valor: number): number {
  return Math.min(100, Math.max(0, Math.round(valor)));
}

function proporcao({ largura, altura }: Imagem): number {
  return largura / altura;
}

export function AntesDepois({
  antes,
  depois,
  textoEducativo,
  autorizacaoId,
  intervaloEntreFotos,
  avisoVariacao = AVISO_VARIACAO_PADRAO,
}: Props) {
  // ---------------------------------------------------------------------------
  // Invariantes. O tipo garante que as props existem; estes garantem que elas
  // dizem alguma coisa. Falhar alto é a resposta certa: uma seção quebrada é
  // um incidente de desenvolvimento, uma imagem publicada sem os requisitos da
  // norma é um processo ético.
  // ---------------------------------------------------------------------------

  if (autorizacaoId.trim() === "") {
    throw new Error(
      "AntesDepois: autorizacaoId vazio. A Resolução CFM 2.336/2023 exige " +
        "autorização formal e documentada do paciente. Sem a referência do " +
        "termo arquivado, a imagem não pode ser publicada.",
    );
  }

  if (textoEducativo.trim().length < MINIMO_TEXTO_EDUCATIVO) {
    throw new Error(
      `AntesDepois: textoEducativo com menos de ${MINIMO_TEXTO_EDUCATIVO} ` +
        "caracteres. A norma exige contexto educativo junto à imagem: " +
        "indicação, possíveis evoluções satisfatórias e insatisfatórias, " +
        "riscos e complicações.",
    );
  }

  const proporcaoAntes = proporcao(antes);
  const proporcaoDepois = proporcao(depois);
  const divergencia =
    Math.abs(proporcaoAntes - proporcaoDepois) /
    Math.max(proporcaoAntes, proporcaoDepois);

  if (divergencia > TOLERANCIA_PROPORCAO) {
    throw new Error(
      "AntesDepois: as duas imagens têm proporções diferentes " +
        `(${antes.largura}x${antes.altura} e ${depois.largura}x${depois.altura}). ` +
        "A norma exige mesma iluminação, mesmo ângulo e mesma distância " +
        "focal. Enquadramento diferente entre as fotos altera a comparação.",
    );
  }

  const [posicao, setPosicao] = useState(POSICAO_INICIAL);
  const [arrastando, setArrastando] = useState(false);
  const trilho = useRef<HTMLDivElement>(null);
  const punho = useRef<HTMLButtonElement>(null);

  function posicionarPorPonteiro(clientX: number): void {
    const elemento = trilho.current;
    if (!elemento) return;

    const caixa = elemento.getBoundingClientRect();
    if (caixa.width === 0) return;

    setPosicao(limitar(((clientX - caixa.left) / caixa.width) * 100));
  }

  function aoPressionar(evento: React.PointerEvent<HTMLDivElement>): void {
    // Só botão principal / toque. Botão do meio e direito não arrastam.
    if (evento.button !== 0) return;

    setArrastando(true);
    posicionarPorPonteiro(evento.clientX);
    punho.current?.focus();

    // jsdom não implementa captura de ponteiro; o guarda mantém o componente
    // testável sem um mock.
    if (typeof evento.currentTarget.setPointerCapture === "function") {
      evento.currentTarget.setPointerCapture(evento.pointerId);
    }
  }

  function aoMover(evento: React.PointerEvent<HTMLDivElement>): void {
    if (!arrastando) return;
    posicionarPorPonteiro(evento.clientX);
  }

  function aoSoltar(evento: React.PointerEvent<HTMLDivElement>): void {
    setArrastando(false);
    if (typeof evento.currentTarget.releasePointerCapture === "function") {
      evento.currentTarget.releasePointerCapture(evento.pointerId);
    }
  }

  function aoTeclar(evento: React.KeyboardEvent<HTMLButtonElement>): void {
    const passo = evento.shiftKey ? PASSO_TECLADO_LARGO : PASSO_TECLADO;
    let destino: number;

    switch (evento.key) {
      case "ArrowLeft":
      case "ArrowDown":
        destino = posicao - passo;
        break;
      case "ArrowRight":
      case "ArrowUp":
        destino = posicao + passo;
        break;
      case "PageDown":
        destino = posicao - PASSO_TECLADO_LARGO;
        break;
      case "PageUp":
        destino = posicao + PASSO_TECLADO_LARGO;
        break;
      case "Home":
        destino = 0;
        break;
      case "End":
        destino = 100;
        break;
      default:
        return;
    }

    evento.preventDefault();
    setPosicao(limitar(destino));
  }

  const proporcaoCss = `${antes.largura} / ${antes.altura}`;

  return (
    <figure className="m-0">
      {/* ---------------------------------------------------------------
          Comparador. `touch-none` porque o arraste horizontal é nosso; sem
          isso o navegador rouba o gesto para rolar a página.
          --------------------------------------------------------------- */}
      <div
        ref={trilho}
        onPointerDown={aoPressionar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        style={{ aspectRatio: proporcaoCss }}
        className="rounded-filete border-sand-200 bg-sand-200 relative isolate w-full touch-none overflow-hidden border select-none"
      >
        <Image
          src={depois.src}
          alt={depois.alt}
          fill
          sizes="(min-width: 1024px) 46rem, 100vw"
          className="object-cover"
        />

        <div
          data-arrastando={arrastando ? "true" : "false"}
          style={{ clipPath: `inset(0 ${100 - posicao}% 0 0)` }}
          className="absolute inset-0 transition-[clip-path] duration-[var(--duration-fast)] ease-out data-[arrastando=true]:duration-0"
        >
          <Image
            src={antes.src}
            alt={antes.alt}
            fill
            sizes="(min-width: 1024px) 46rem, 100vw"
            className="object-cover"
          />
        </div>

        {/* Rótulos em chip sólido: a foto por baixo é imprevisível, e o
            briefing § 5.2 proíbe glassmorphism. */}
        <p className="bg-wine-700 text-micro text-sand-50 absolute top-0 left-0 z-10 px-3 py-1.5 font-mono uppercase">
          Antes
        </p>
        <p className="bg-wine-700 text-micro text-sand-50 absolute top-0 right-0 z-10 px-3 py-1.5 font-mono uppercase">
          Depois
        </p>

        <button
          ref={punho}
          type="button"
          role="slider"
          aria-label="Comparar antes e depois"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={posicao}
          aria-valuetext={`${posicao}% da imagem de antes visível`}
          onKeyDown={aoTeclar}
          style={{ left: `${posicao}%` }}
          className="absolute inset-y-0 z-20 -ml-6 w-12 cursor-ew-resize border-0 bg-transparent p-0"
        >
          <span
            aria-hidden="true"
            className="bg-sand-50 absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
          />
          <span
            aria-hidden="true"
            className="rounded-filete border-sand-50 bg-wine-700 absolute top-1/2 left-1/2 h-12 w-7 -translate-x-1/2 -translate-y-1/2 border"
          />
        </button>
      </div>

      {/* ---------------------------------------------------------------
          Contexto obrigatório. Sempre visível, sempre junto da imagem,
          sempre no mesmo corpo do texto corrido do site. Esconder isto em
          um <details> ou em cinza apagado descumpre a norma tanto quanto
          omitir.
          --------------------------------------------------------------- */}
      <figcaption className="medida mt-8">
        <p className="text-body text-ink-900">{textoEducativo}</p>

        <p className="border-sand-200 text-small text-ink-900 mt-6 border-t pt-6 font-mono">
          {avisoVariacao}
        </p>

        <p className="text-micro text-ink-400 mt-4 font-mono uppercase">
          {`Intervalo entre as fotos: ${intervaloEntreFotos} · ` +
            `Imagem publicada sem edição, com autorização documentada do ` +
            `paciente sob a referência ${autorizacaoId}`}
        </p>
      </figcaption>
    </figure>
  );
}
