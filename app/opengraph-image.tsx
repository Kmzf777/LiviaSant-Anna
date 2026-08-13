import { ImageResponse } from "next/og";

import { getHome, getMedica } from "@/content";

/**
 * OG image da home — vinho, Bodoni, selo (§ 10).
 *
 * É a única peça da marca que aparece fora do site: no WhatsApp, no Instagram,
 * na prévia de um link colado num grupo de mães. Então segue as mesmas três
 * regras do resto — superfície vinho inteira, display para a tese, mono para o
 * fato — e **não leva foto**. Não há foto autorizada, e uma imagem de banco
 * numa prévia destruiria a credibilidade que as fotos reais constroem antes de
 * alguém abrir a página (§ 12.2).
 *
 * ## A fonte
 *
 * O satori não lê `woff2` nem enxerga o `next/font`, então a Bodoni precisa
 * chegar como arquivo. Ela é buscada no Google Fonts em tempo de build, dentro
 * de um `try`: sem rede, a peça sai na fonte padrão do `next/og` em vez de o
 * build inteiro cair. Uma prévia com a serifa errada é um defeito; um deploy
 * que não acontece é outro problema.
 *
 * ## O selo
 *
 * Desenhado com dois anéis e um "L" em vez de importar `<Selo />`: o satori
 * suporta um subconjunto pequeno de SVG e o componente usa `<text>` e
 * `vector-effect`, que ele não resolve. A geometria aqui é a leitura mínima da
 * mesma marca — dois círculos de 1px e o monograma —, e é a única vez que o
 * selo aparece, como manda o § 5.5.
 */

export const alt =
  "Lívia Sant'Anna — otorrinolaringologia e cirurgia da face em Belo Horizonte";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Tokens de styles/theme.css. Não há CSS aqui: o satori só lê estilo inline. */
const VINHO = "#6D1F3A";
const BLUSH = "#FBD8C9";
const AREIA = "#F6F1EC";
const ROSA = "#CF98AB";

/**
 * Busca uma fonte no Google Fonts. `null` em qualquer falha — rede
 * indisponível, formato inesperado, resposta que não seja 200.
 */
async function fonteGoogle(consulta: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${consulta}&display=swap`,
      {
        headers: {
          // Sem um UA antigo o Google devolve woff2, que o satori não lê.
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; rv:10.0) Gecko/20100101 Firefox/10.0",
        },
      },
    );
    if (!css.ok) return null;

    // O satori lê ttf, otf e woff — nunca woff2. Hoje o UA acima recebe woff;
    // o padrão aceita os três para não depender da escolha do Google amanhã.
    const url = /src:\s*url\((https:[^)]+\.(?:ttf|otf|woff))\)/.exec(
      await css.text(),
    );
    if (!url?.[1]) return null;

    const fonte = await fetch(url[1]);
    if (!fonte.ok) return null;

    return await fonte.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const home = getHome();
  const { identificacao } = getMedica();

  // As duas famílias, e as duas importam. Com só a display carregada o satori
  // a aplica a tudo — inclusive ao bloco do CFM, cujo travessão não existe no
  // subconjunto da Bodoni e sumia sem deixar rastro. Um bloco normativo com
  // caractere faltando não é um detalhe tipográfico.
  const [arquivoDisplay, arquivoMono] = await Promise.all([
    fonteGoogle("Bodoni+Moda:opsz,wght@96,400"),
    fonteGoogle("IBM+Plex+Mono:wght@400"),
  ]);

  const display = arquivoDisplay ? "Bodoni Moda" : "serif";
  const mono = arquivoMono ? "IBM Plex Mono" : "monospace";

  const fontes = [
    ...(arquivoDisplay
      ? [
          {
            name: "Bodoni Moda",
            data: arquivoDisplay,
            weight: 400 as const,
            style: "normal" as const,
          },
        ]
      : []),
    ...(arquivoMono
      ? [
          {
            name: "IBM Plex Mono",
            data: arquivoMono,
            weight: 400 as const,
            style: "normal" as const,
          },
        ]
      : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: VINHO,
          padding: 72,
        }}
      >
        {/* Eyebrow em mono. Caixa alta no texto, não em CSS. */}
        <div
          style={{
            display: "flex",
            fontFamily: mono,
            fontSize: 20,
            letterSpacing: 3,
            color: ROSA,
          }}
        >
          {home.hero.eyebrow.toLocaleUpperCase("pt-BR")}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: display,
              fontSize: 88,
              lineHeight: 1.02,
              letterSpacing: -2,
              color: BLUSH,
            }}
          >
            {home.hero.h1.map((linha) => (
              <div key={linha} style={{ display: "flex" }}>
                {linha}
              </div>
            ))}
          </div>

          {/* Selo: dois anéis de 1px e o monograma. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 168,
              height: 168,
              flexShrink: 0,
              borderRadius: "50%",
              border: `1px solid ${BLUSH}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 148,
                height: 148,
                borderRadius: "50%",
                border: `1px solid ${BLUSH}`,
                fontFamily: display,
                fontSize: 68,
                color: BLUSH,
              }}
            >
              L
            </div>
          </div>
        </div>

        {/* Bloco de identificação: fonte, tamanho e cor uniformes (§ 3.1). */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", height: 1, backgroundColor: ROSA }} />
          <div
            style={{
              display: "flex",
              fontFamily: mono,
              fontSize: 20,
              letterSpacing: 0.5,
              color: AREIA,
            }}
          >
            {`${identificacao.nome} — Médica — ${identificacao.crm} · ${identificacao.especialidade} — ${identificacao.rqe}`}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      // A chave `fonts` é omitida quando nenhuma das duas chegou: o satori
      // exige ao menos uma fonte, e é o `next/og` que injeta a padrão quando
      // ninguém declara nenhuma. Passar `[]` seria pedir para ele falhar.
      ...(fontes.length > 0 ? { fonts: fontes } : {}),
    },
  );
}
