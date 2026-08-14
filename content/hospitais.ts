import type { NaoVazio } from "./tipos";

/**
 * Onde ela atuou e onde atua.
 *
 * É a prova social do site, e é a única que um site médico pode fazer sem
 * pisar na Resolução CFM 2.336/2023: nome de hospital é fato verificável, não
 * elogio. Nada aqui diz que ela é melhor por causa disso — diz onde ela esteve,
 * e quem lê tira a própria conclusão.
 *
 * Sem logotipos. Marca de hospital é propriedade do hospital, e usá-la sugere
 * endosso institucional que ninguém deu. Texto em mono, que no design system é
 * onde mora o que é verificável.
 */

export type Hospital = {
  readonly nome: string;
  readonly cidade: string;
  /** O que ela faz ou fez ali. Curto — a seção é uma lista, não um currículo. */
  readonly vinculo: string;
  /** `true` quando é atuação corrente, e não histórico. */
  readonly atual: boolean;
};

export const HOSPITAIS: NaoVazio<Hospital> = [
  {
    nome: "Hospital Mater Dei",
    cidade: "Belo Horizonte",
    vinculo: "Cirurgias",
    atual: true,
  },
  {
    nome: "Hospital Vila da Serra",
    cidade: "Belo Horizonte",
    vinculo: "Equipe de otorrinolaringologia",
    atual: false,
  },
  {
    nome: "Hospital Madre Teresa",
    cidade: "Belo Horizonte",
    vinculo: "Residência em otorrinolaringologia",
    atual: false,
  },
  {
    nome: "Uberlândia Medical Center",
    cidade: "Uberlândia",
    vinculo: "Atuação cirúrgica",
    atual: true,
  },
];
