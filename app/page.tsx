import type { Metadata } from "next";

import { AMedica } from "@/components/sections/AMedica";
import { ComoEaConsulta } from "@/components/sections/ComoEaConsulta";
import { DuasFrentes } from "@/components/sections/DuasFrentes";
import { FaixaCredenciais } from "@/components/sections/FaixaCredenciais";
import { HeroHome } from "@/components/sections/HeroHome";
import { Manifesto } from "@/components/sections/Manifesto";
import { PerguntasEContato } from "@/components/sections/PerguntasEContato";
import { RespiroTraco } from "@/components/sections/RespiroTraco";
import { Resultados } from "@/components/sections/Resultados";
import { RinoplastiaDestaque } from "@/components/sections/RinoplastiaDestaque";
import { getHome, getMedica } from "@/content";
import {
  ehPendente,
  faqPageJsonLd,
  grafoJsonLd,
  medicalBusinessJsonLd,
  physicianJsonLd,
  serializarJsonLd,
} from "@/lib/jsonld";

/**
 * Home.
 *
 * As nove seções do briefing § 8, na ordem, alternando superfície. A alternância
 * não é ritmo decorativo: vinho é superfície e não detalhe (§ 5.2), e a troca de
 * bloco inteiro é o único recurso de destaque que este design system tem — não
 * existe cor de acento para chamar atenção.
 *
 *   § 8.1  hero                       vinho
 *   § 8.2  faixa de identificação     areia
 *   § 8.3  manifesto                  areia
 *   § 8.4  as duas frentes            areia-100
 *   —      respiro do Traço           areia      (sem texto, ver RespiroTraco)
 *   § 8.5  rinoplastia em destaque    vinho
 *   § 8.6  a médica                   areia
 *   § 8.7  como é a consulta          areia-100
 *   § 8.8  resultados                 areia
 *   § 8.9  FAQ e contato              areia
 *
 * ## O respiro entre o manifesto e a rinoplastia
 *
 * A faixa vazia antes do bloco de rinoplastia não é sobra de layout: o Traço
 * resolve no perfil de rosto do logo exatamente ali, e a resolução dura ~1,5
 * tela. Ver `components/sections/RespiroTraco.tsx` e o cabeçalho de
 * `components/layout/Traco.tsx`.
 *
 * ## Um `<h1>`, e o resto em `<h2>`
 *
 * O único H1 é o do hero. Os títulos de seção são H2, inclusive o da
 * rinoplastia — que é maior que os outros por composição (`tamanho="h1"`), não
 * por semântica. Os únicos H3 da página são os quatro passos da consulta, e
 * eles vivem dentro do H2 da seção. Nenhum salto de nível.
 *
 * ## Perguntas pendentes
 *
 * A FAQ visível e o `FAQPage` do JSON-LD são filtrados pelo mesmo predicado:
 * pergunta com resposta ainda em `[CONFIRMAR]` não aparece em nenhum dos dois.
 * O que o paciente lê e o que o Google lê são a mesma coisa, sempre.
 */

const home = getHome();

export const metadata: Metadata = {
  // `absolute` porque o layout raiz aplica o template "%s | Lívia Sant'Anna",
  // e o título da home já tem 51 caracteres — com o sufixo estouraria os 60.
  title: { absolute: home.seo.titulo },
  description: home.seo.descricao,
  alternates: { canonical: "/" },
  openGraph: {
    title: home.seo.titulo,
    description: home.seo.descricao,
    url: "/",
    type: "website",
  },
};

export default function Home() {
  const medica = getMedica();

  const perguntas = home.faq.filter((item) => !ehPendente(item.resposta));

  const grafo = grafoJsonLd(
    physicianJsonLd(medica),
    medicalBusinessJsonLd(),
    faqPageJsonLd(perguntas),
  );

  return (
    <>
      <script
        type="application/ld+json"
        // Conteúdo próprio, serializado por `serializarJsonLd`, que escapa `<`.
        dangerouslySetInnerHTML={{ __html: serializarJsonLd(grafo) }}
      />

      <HeroHome hero={home.hero} />
      <FaixaCredenciais credenciais={home.credenciais} />
      <Manifesto manifesto={home.manifesto} />
      <DuasFrentes duasFrentes={home.duasFrentes} />
      <RespiroTraco />
      <RinoplastiaDestaque rinoplastia={home.rinoplastia} />
      <AMedica bloco={home.medica} medica={medica} />
      <ComoEaConsulta consulta={home.consulta} />
      <Resultados resultados={home.resultados} />
      <PerguntasEContato perguntas={perguntas} medica={medica} />
    </>
  );
}
