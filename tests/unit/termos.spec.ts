import { describe, expect, it } from "vitest";

import { encontrarTermosProibidos } from "@/lib/termos-proibidos";

/**
 * Testa o verificador de termos nas duas direções.
 *
 * Falso NEGATIVO deixa passar publicidade irregular — processo ético no CRM.
 * Falso POSITIVO reprova texto legítimo, empurra quem escreve para o eufemismo
 * e faz alguém acabar desligando o gate. Um verificador em que ninguém confia
 * não protege ninguém.
 *
 * Os casos de falso positivo aqui não são hipotéticos: cada um veio de texto
 * real que o script reprovou durante a escrita do conteúdo do site.
 */

const reprova = (texto: string): boolean =>
  encontrarTermosProibidos(texto).length > 0;

describe("reprova o que a Resolução CFM 2.336/2023 proíbe", () => {
  const proibidos: readonly [string, string][] = [
    ["superlativo", "A melhor otorrino de Belo Horizonte."],
    ["superlativo plural", "Entre os melhores resultados da cidade."],
    ["autopromoção", "É referência em rinoplastia no estado."],
    ["prêmio", "Médica premiada e renomada no meio."],
    ["liderança", "Líder em cirurgia da face na região."],
    ["exclusividade", "Pioneira na técnica em Minas Gerais."],
    ["promessa", "Resultado garantido em todos os casos."],
    ["promessa implícita", "O nariz dos seus sonhos em uma única cirurgia."],
    ["negação de risco", "Um procedimento sem riscos e indolor."],
    ["quantificação", "100% de satisfação entre as pacientes."],
    ["escassez", "Últimas vagas para este mês, aproveite agora."],
    ["propaganda agressiva", "Promoção imperdível, não perca."],
    ["título indevido", "Lívia Sant'Anna, cirurgiã plástica em Belo Horizonte."],
    ["título masculino", "Atendimento com cirurgião plástico."],
    ["título sem acento", "Atendimento com cirurgiao plastico."],
    ["especialidade indevida", "Especialista em cirurgia plástica há dez anos."],
    ["CTA vago", "Saiba mais sobre o procedimento."],
    ["CTA vago 2", "Clique aqui para agendar."],
  ];

  for (const [rotulo, amostra] of proibidos) {
    it(`reprova ${rotulo}`, () => {
      expect(reprova(amostra), amostra).toBe(true);
    });
  }
});

describe("aprova texto clínico legítimo", () => {
  const permitidos: readonly [string, string][] = [
    // Comparativo, não superlativo. Vem do briefing § 8.4, textual.
    ["comparativo", "Respirar, ouvir, dormir melhor."],
    // Expressão de quantidade. O script reprovava isto por casar "a maior".
    ["quantidade", "A maior parte das pessoas não vai precisar de cirurgia."],
    ["quantidade 2", "Na maior parcela dos casos, a alta sai no mesmo dia."],
    ["quantidade 3", "A maior frequência de sangramento é nos primeiros dias."],
    // O campo de atuação, permitido e esperado.
    [
      "campo de atuação",
      "Otorrinolaringologista, com atuação em cirurgia plástica da face.",
    ],
    [
      "campo de atuação 2",
      "Fellowship em cirurgia plástica da face no Hospital UMC.",
    ],
    // Honestidade sobre risco. Bloquear isto empurraria o texto ao eufemismo,
    // que é o oposto do que a norma quer.
    ["risco negado", "Não existe cirurgia sem riscos."],
    ["risco negado 2", "Nenhum procedimento é indolor por completo."],
    // Descrição de desfecho, sem promessa.
    ["desfecho", "A respiração costuma melhorar ao longo do primeiro mês."],
    ["limite honesto", "A obstrução pode não resolver por completo."],
    ["CTA específico", "Ver procedimentos de otorrino."],
    ["CTA específico 2", "Entender a rinoplastia."],
  ];

  for (const [rotulo, amostra] of permitidos) {
    it(`aprova ${rotulo}`, () => {
      const achados = encontrarTermosProibidos(amostra);
      expect(
        achados.length,
        `${amostra}\n→ ${achados.map((a) => `"${a.termo}"`).join(", ")}`,
      ).toBe(0);
    });
  }
});

describe("emoji", () => {
  it("reprova emoji na interface", () => {
    expect(reprova("Agendar consulta ✨")).toBe(true);
    expect(reprova("Nariz e respiração 👃")).toBe(true);
  });

  it("não confunde pontuação tipográfica com emoji", () => {
    // O bloco CFM usa travessão e as citações usam aspas curvas. Se o padrão
    // de emoji pegasse pontuação, metade do site reprovaria.
    expect(reprova("Lívia Sant'Anna — Médica — CRM-MG 83.288")).toBe(false);
    expect(reprova("“Forma e função, nas mesmas mãos.”")).toBe(false);
    expect(reprova("Resultados variam · anatomia · cicatrização")).toBe(false);
  });
});

describe("o motivo é acionável", () => {
  it("diz o que fazer, não só o que está errado", () => {
    const [achado] = encontrarTermosProibidos("Dra. Lívia, cirurgiã plástica.");
    expect(achado?.motivo).toMatch(/otorrinolaringologista/i);
  });
});
