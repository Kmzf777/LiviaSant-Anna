import type { PaginaInstitucional } from "./tipos";

/**
 * Páginas legais.
 *
 * PREENCHIDO NA FASE 2 (subagent C):
 *   politica-de-privacidade  (LGPD: dados coletados no formulário, base legal,
 *                             retenção, direitos do titular, encarregado)
 *   aviso-legal              (natureza informativa do conteúdo, não substitui
 *                             consulta, identificação profissional, CFM)
 *
 * Ambas entram em listarRotas(), então passam automaticamente pelos testes de
 * axe-core e pelo teste do bloco CFM.
 */
export const PAGINAS_INSTITUCIONAIS: readonly PaginaInstitucional[] = [];
