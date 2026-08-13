import type { Procedimento } from "../tipos";

import { PROCEDIMENTOS_OTORRINO } from "./otorrino";
import { PROCEDIMENTOS_CIRURGIA_FACE } from "./cirurgia-face";
import { PROCEDIMENTOS_ESTETICA } from "./estetica";

/**
 * Os 11 procedimentos, em ordem de exibição dentro de cada hub.
 *
 * A coleção pode estar vazia sem quebrar o build — o que NÃO pode é um
 * procedimento incompleto. Cada objeto precisa de ficha técnica com
 * disclaimer, no mínimo 3 riscos e no mínimo 5 perguntas de FAQ, garantidos
 * em tempo de compilação pelos tipos em content/tipos.ts.
 */
export const PROCEDIMENTOS: readonly Procedimento[] = [
  ...PROCEDIMENTOS_OTORRINO,
  ...PROCEDIMENTOS_CIRURGIA_FACE,
  ...PROCEDIMENTOS_ESTETICA,
];
