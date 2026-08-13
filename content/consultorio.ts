import type { Consultorio } from "./tipos";

/**
 * Consultório.
 *
 * ATENÇÃO: quase tudo aqui está pendente de confirmação. Estes valores
 * alimentam o JSON-LD MedicalBusiness, o mapa e o botão de WhatsApp — um
 * telefone errado publicado é pior do que nenhum telefone.
 *
 * Todos os campos marcados abaixo estão em PENDENCIAS.md. O teste
 * tests/unit/pendencias.spec.ts falha se algum `[CONFIRMAR]` sobreviver a
 * um build de produção.
 */
export const CONSULTORIO: Consultorio = {
  nome: "Consultório Dra. Lívia Sant'Anna",

  logradouro: "[CONFIRMAR: logradouro, número e sala]",
  bairro: "[CONFIRMAR: bairro]",
  cidade: "Belo Horizonte",
  uf: "MG",
  cep: "[CONFIRMAR: CEP]",

  telefone: "[CONFIRMAR: telefone do consultório]",
  whatsapp: "[CONFIRMAR: WhatsApp com DDI e DDD, ex. 5531999999999]",
  email: "[CONFIRMAR: e-mail de contato]",

  horarios: [
    { dias: "[CONFIRMAR: dias de atendimento]", horas: "[CONFIRMAR: horário]" },
  ],

  estacionamento: "[CONFIRMAR: estacionamento no prédio, conveniado, valor]",
  acessibilidade:
    "[CONFIRMAR: acessibilidade do prédio — elevador, rampa, banheiro adaptado]",

  // Coordenadas do centro de Belo Horizonte como marcador de pendência.
  // NÃO publicar: o JSON-LD sairia apontando para o lugar errado.
  geo: { latitude: -19.9227, longitude: -43.9451 },

  mapaUrl: "[CONFIRMAR: link do Google Maps do consultório]",
};
