import type { Metadata } from "next";

import { RespiroTraco } from "@/components/sections/RespiroTraco";
import { AMedicaEFormacao } from "@/components/sections/home/AMedicaEFormacao";
import { Chamada } from "@/components/sections/home/Chamada";
import { ExperienciaHospitalar } from "@/components/sections/home/ExperienciaHospitalar";
import { ProcedimentosEAtendimentos } from "@/components/sections/home/ProcedimentosEAtendimentos";
import {
  getHome,
  getMedica,
  listarHospitais,
  listarProcedimentos,
} from "@/content";
import {
  grafoJsonLd,
  medicalBusinessJsonLd,
  physicianJsonLd,
  serializarJsonLd,
} from "@/lib/jsonld";

/**
 * Home — landing page de conversão.
 *
 * Era uma home editorial de nove seções e virou quatro, na ordem em que uma
 * pessoa decide: reconhece o problema, confia em quem resolve, vê onde ela
 * opera, encontra o próprio caso, agenda.
 *
 *   § 1  chamada + retrato          vinho
 *   § 2  a médica e a formação      areia
 *   § 3  experiência hospitalar     areia-100
 *   —    respiro do Traço           areia      (sem texto, ver RespiroTraco)
 *   § 4  procedimentos e queixas    areia
 *        fecho                      vinho
 *
 * O motivo da mudança está no próprio briefing. A § 2 define como métrica de
 * sucesso que *"um paciente que chega pela busca de 'amígdala' e um que chega
 * por 'rinoplastia' precisam, em 5 segundos, saber que estão no lugar certo"*,
 * e a abertura anterior — "Forma e função, nas mesmas mãos" — não dizia que
 * problema ela resolve. A tese não sumiu: desceu para a página de rinoplastia,
 * que é onde ela é argumento comercial em vez de manifesto. Ver PLANO-HOME.md.
 *
 * O que saiu da home (manifesto, duas frentes, rinoplastia em destaque,
 * resultados, FAQ) continua vivo nos hubs e nas páginas de procedimento, que é
 * onde converte melhor. A home passa a ter uma função só.
 *
 * ## O respiro entre a § 3 e a § 4
 *
 * A faixa vazia não é sobra de layout: o Traço resolve no perfil de rosto do
 * logo exatamente ali, e a resolução precisa de um trecho de página sem texto
 * para não se desenhar por cima da leitura. Ver
 * `components/sections/RespiroTraco.tsx`.
 *
 * ## Um `<h1>`, e o resto em `<h2>`
 *
 * O único H1 é o da chamada. Os três títulos de seção são H2; os dois títulos
 * de coluna da § 4 são H3, e os rótulos de grupo dentro deles, H4. Nenhum
 * salto de nível.
 *
 * ## JSON-LD
 *
 * Sem `FAQPage`: a FAQ deixou a home e vive nas páginas de procedimento, onde
 * as perguntas são específicas. O que o paciente lê e o que o Google lê
 * continuam sendo a mesma coisa. `medicalBusinessJsonLd()` devolve `null`
 * enquanto o endereço for `[CONFIRMAR]`, e `grafoJsonLd` descarta nulos — um
 * endereço de mentira em dado estruturado é lido como verdade por buscador,
 * mapa e agregador.
 */

const home = getHome();

export const metadata: Metadata = {
  // `absolute` porque o layout raiz aplica o template "%s | Lívia Sant'Anna",
  // e o título da home já tem 45 caracteres — com o sufixo estouraria os 60.
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

  const grafo = grafoJsonLd(physicianJsonLd(medica), medicalBusinessJsonLd());

  return (
    <>
      <script
        type="application/ld+json"
        // Conteúdo próprio, serializado por `serializarJsonLd`, que escapa `<`.
        dangerouslySetInnerHTML={{ __html: serializarJsonLd(grafo) }}
      />

      <Chamada hero={home.hero} />
      <AMedicaEFormacao bloco={home.medica} medica={medica} />
      <ExperienciaHospitalar
        experiencia={home.experiencia}
        hospitais={listarHospitais()}
      />
      <RespiroTraco />
      <ProcedimentosEAtendimentos
        bloco={home.procedimentos}
        procedimentos={listarProcedimentos()}
      />
    </>
  );
}
