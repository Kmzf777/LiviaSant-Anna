import { getHome } from "@/content";

/**
 * Home — provisória.
 *
 * A home definitiva é construída na Fase 3 pelo subagent E, com as nove
 * seções do briefing § 8. Esta versão existe para a fundação ter uma rota
 * que compila, renderiza e passa pelos scripts de verificação.
 */
export default function Home() {
  const home = getHome();

  return (
    <div data-superficie="vinho" className="min-h-dvh px-[--gutter] py-24">
      <p className="font-mono text-micro uppercase tracking-[0.14em] text-blush-200">
        {home.hero.eyebrow}
      </p>

      <h1 className="mt-8 max-w-[14ch] font-display text-hero text-blush-200">
        {home.hero.h1.map((linha) => (
          <span key={linha} className="block">
            {linha}
          </span>
        ))}
      </h1>

      <p className="medida mt-8 text-lead text-sand-50">{home.hero.lead}</p>
    </div>
  );
}
