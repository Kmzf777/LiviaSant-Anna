"use client";

import { useState } from "react";

import { cn } from "@/components/ui/cn";

/**
 * Mapa — carregado sob interação, nunca no caminho do LCP.
 *
 * Um embed do Google Maps traz algumas centenas de KB de JavaScript de
 * terceiro, abre conexões para domínios que a página não controla e instala
 * cookies antes de qualquer consentimento. Num site cuja meta é LCP < 2.0s em
 * 4G lento (§ 9), pagar isso na primeira pintura para uma coisa que a maioria
 * das visitas nem rola até ver é o pior negócio da página.
 *
 * Então o padrão é: bloco estático, com o endereço legível, e o iframe só
 * depois de um clique. Quem quer o mapa tem o mapa; quem não quer não paga
 * por ele. O botão diz o que acontece, como manda o § 6.
 *
 * ---------------------------------------------------------------------------
 * QUANDO NÃO HÁ MAPA
 * ---------------------------------------------------------------------------
 *
 * `mapaUrl` está `[CONFIRMAR]` em `content/consultorio.ts`, e as coordenadas
 * de lá apontam para o centro de Belo Horizonte como marcador de pendência —
 * **não** para o consultório. Cair nelas para "ao menos mostrar alguma coisa"
 * publicaria um endereço errado, que é o pior desfecho possível desta página.
 *
 * Sem URL válida, este componente diz que o mapa ainda não existe. É feio de
 * propósito, na medida certa: pendência que não incomoda ninguém não é
 * resolvida.
 */

type Props = {
  /** Link do Google Maps. Placeholder `[CONFIRMAR: …]` é tratado como ausente. */
  readonly url: string;
  /** Endereço em uma linha. Aparece no bloco estático e no rótulo do iframe. */
  readonly endereco: string | null;
  readonly className?: string;
};

/**
 * Converte o link em endereço de embed.
 *
 * Aceita o que já é embed e acrescenta `output=embed` ao que é um link comum
 * do Maps. Qualquer outra coisa — inclusive o placeholder — vira `null`, e
 * `null` é o caminho honesto, não um erro.
 */
export function urlDeEmbed(url: string): string | null {
  const limpo = url.trim();

  if (!/^https?:\/\//i.test(limpo)) return null;

  let alvo: URL;
  try {
    alvo = new URL(limpo);
  } catch {
    return null;
  }

  if (!/(^|\.)google\.[a-z.]+$/i.test(alvo.hostname)) return null;
  if (alvo.pathname.includes("/embed")) return limpo;

  alvo.searchParams.set("output", "embed");
  return alvo.toString();
}

const MOLDURA = "filete rounded-filete relative w-full overflow-hidden border";

export function Mapa({ url, endereco, className }: Props) {
  const [carregado, setCarregado] = useState(false);
  const embed = urlDeEmbed(url);

  if (!embed) {
    return (
      <div
        className={cn(
          MOLDURA,
          "bg-sand-200 flex flex-col justify-end",
          className,
        )}
        style={{ aspectRatio: "16/9" }}
      >
        <div className="flex flex-col gap-3 p-6">
          <p className="text-micro text-ink-600 font-mono tracking-[0.12em]">
            MAPA PENDENTE
          </p>
          {/*
            Aqui não entra o `Nota tom="atencao"`: sobre `sand-200` os únicos
            pares medidos para texto são os da tinta (ver
            scripts/verificar-contraste.ts), e o vinho do tom de atenção
            entraria sem medição. O filete vinho fica — ele é borda, não texto.
          */}
          <p className="text-micro border-wine-700 text-ink-900 max-w-[52ch] border-l-2 pl-4 font-mono leading-relaxed tracking-[0.06em]">
            O mapa entra nesta página junto com o endereço, assim que ele for
            confirmado. Publicar um ponto aproximado seria pior do que não
            publicar mapa nenhum.
          </p>
        </div>
      </div>
    );
  }

  const rotulo = endereco
    ? `Mapa do consultório — ${endereco}`
    : "Mapa do consultório";

  if (carregado) {
    return (
      <div className={cn(MOLDURA, className)} style={{ aspectRatio: "16/9" }}>
        <iframe
          src={embed}
          title={rotulo}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(MOLDURA, "bg-sand-200", className)}
      style={{ aspectRatio: "16/9" }}
    >
      <button
        type="button"
        onClick={() => setCarregado(true)}
        className="hover:bg-sand-100 flex h-full w-full cursor-pointer flex-col items-start justify-end gap-3 p-6 text-left transition-colors duration-200"
      >
        <span className="text-micro text-ink-600 font-mono tracking-[0.12em] uppercase">
          {endereco ?? "Consultório"}
        </span>
        <span className="text-h3 text-ink-900 font-body font-medium">
          Carregar o mapa
        </span>
        <span className="text-small text-ink-600 max-w-[46ch]">
          O mapa vem do Google e só é carregado quando você pede, para não pesar
          na abertura da página.
        </span>
      </button>
    </div>
  );
}
