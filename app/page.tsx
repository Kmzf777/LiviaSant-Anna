import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Secao } from "@/components/ui/Secao";
import { getHome } from "@/content";

/**
 * Home — provisória.
 *
 * A home definitiva é construída na Fase 3 pelo subagent E, com as nove seções
 * do briefing § 8. Esta versão existe para a fundação ter uma rota que compila,
 * renderiza e exercita o contrato do hero.
 *
 * O `-mt-[var(--header-h)]` é esse contrato: puxa a seção para debaixo do
 * header sticky, que é o que autoriza o header a ficar transparente com
 * tipografia blush. Sem isso ele cai para tinta sozinho — ver Header.tsx.
 */
export default function Home() {
  const home = getHome();

  return (
    <Secao
      superficie="vinho"
      espacamento="nenhum"
      className="-mt-[var(--header-h)] flex min-h-[90vh] items-center pt-[calc(var(--header-h)+var(--secao-y))] pb-[var(--secao-y)]"
      aria-label="Apresentação"
    >
      <Container>
        <Eyebrow>{home.hero.eyebrow}</Eyebrow>

        <h1 className="font-display text-hero text-blush-200 mt-8 font-normal">
          {home.hero.h1.map((linha) => (
            <span key={linha} className="block">
              {linha}
            </span>
          ))}
        </h1>

        <p className="medida text-lead text-sand-50 mt-8">{home.hero.lead}</p>
      </Container>
    </Secao>
  );
}
