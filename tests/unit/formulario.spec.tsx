/**
 * Formulário de contato — o único caminho de conversão do site.
 *
 * O que é testado aqui é o que falha em silêncio e custa caro:
 *
 *   - o consentimento LGPD nunca nasce marcado, e o esquema recusa sem ele;
 *   - a armadilha existe, está fora do alcance de quem usa o site, e quem a
 *     preenche recebe SUCESSO (nunca um erro que ensine o robô);
 *   - o foco vai para o primeiro campo inválido na ordem da tela;
 *   - o erro é anunciado numa live region;
 *   - sem chave de envio, a resposta diz que nada foi enviado — nunca finge;
 *   - o limite por IP conta e desconta;
 *   - o botão de WhatsApp não renderiza enquanto o número não for confirmado.
 *
 * `next/headers` é a única coisa mockada. A Server Action roda de verdade: no
 * ambiente de teste ela é apenas uma função assíncrona, e testar o formulário
 * contra uma action de mentira testaria o mock.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

vi.mock("next/headers", () => ({
  headers: async () => new Headers(),
}));

import { enviarContato } from "@/app/actions/contato";
import { BotaoWhatsApp } from "@/components/form/BotaoWhatsApp";
import { FormularioContato } from "@/components/form/FormularioContato";
import {
  estaPendente,
  descricaoPendente,
} from "@/components/sections/DadoPendente";
import { urlDeEmbed } from "@/components/sections/Mapa";
import type { GrupoDeAssuntos } from "@/lib/assuntos";
import { limparLimites, verificarLimite } from "@/lib/rate-limit";
import {
  CAMPO_ARMADILHA,
  dadosDoFormulario,
  errosDe,
  esquemaContato,
  ESTADO_INICIAL,
  primeiroCampoInvalido,
} from "@/lib/schema";

// -----------------------------------------------------------------------------

const ASSUNTOS: readonly GrupoDeAssuntos[] = [
  {
    rotulo: "Cirurgia da face",
    opcoes: [{ valor: "rinoplastia", rotulo: "Rinoplastia" }],
  },
];

const VALIDO = {
  nome: "Maria de Souza",
  whatsapp: "(31) 99999-9999",
  email: "maria@exemplo.com",
  assunto: "rinoplastia",
  mensagem: "Gostaria de avaliar a respiração e marcar uma consulta.",
  consentimento: "on",
};

function formData(campos: Record<string, string>): FormData {
  const dados = new FormData();
  for (const [chave, valor] of Object.entries(campos)) {
    if (valor !== "") dados.set(chave, valor);
  }
  return dados;
}

function renderizarFormulario() {
  return render(<FormularioContato assuntos={ASSUNTOS} />);
}

function preencher(campos: Partial<typeof VALIDO>) {
  if (campos.nome !== undefined) {
    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: campos.nome },
    });
  }
  if (campos.whatsapp !== undefined) {
    fireEvent.change(screen.getByLabelText("WhatsApp"), {
      target: { value: campos.whatsapp },
    });
  }
  if (campos.email !== undefined) {
    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: campos.email },
    });
  }
  if (campos.assunto !== undefined) {
    fireEvent.change(screen.getByLabelText("Assunto"), {
      target: { value: campos.assunto },
    });
  }
  if (campos.mensagem !== undefined) {
    fireEvent.change(screen.getByLabelText("Mensagem"), {
      target: { value: campos.mensagem },
    });
  }
  if (campos.consentimento === "on") {
    fireEvent.click(screen.getByRole("checkbox"));
  }
}

function enviarFormulario() {
  fireEvent.click(screen.getByRole("button", { name: /enviar mensagem/i }));
}

beforeEach(() => {
  limparLimites();
  vi.spyOn(console, "info").mockImplementation(() => undefined);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

// -----------------------------------------------------------------------------
// Esquema
// -----------------------------------------------------------------------------

describe("esquema de contato", () => {
  it("aceita um envio completo", () => {
    expect(esquemaContato.safeParse(VALIDO).success).toBe(true);
  });

  it("recusa consentimento ausente — a caixa é obrigatória, não decorativa", () => {
    const resultado = esquemaContato.safeParse({ ...VALIDO, consentimento: "" });

    expect(resultado.success).toBe(false);
    if (resultado.success) return;
    expect(errosDe(resultado.error).consentimento).toBeTruthy();
  });

  it("recusa e-mail sem formato de e-mail", () => {
    const resultado = esquemaContato.safeParse({
      ...VALIDO,
      email: "maria arroba exemplo",
    });

    expect(resultado.success).toBe(false);
    if (resultado.success) return;
    expect(errosDe(resultado.error).email).toContain("nome@provedor.com");
  });

  it("recusa WhatsApp sem DDD e aceita com DDI", () => {
    expect(
      esquemaContato.safeParse({ ...VALIDO, whatsapp: "99999999" }).success,
    ).toBe(false);

    expect(
      esquemaContato.safeParse({ ...VALIDO, whatsapp: "+55 31 99999-9999" })
        .success,
    ).toBe(true);
  });

  it("normaliza FormData igual dos dois lados, inclusive campo ausente", () => {
    const valores = dadosDoFormulario(formData({ nome: "Maria" }));

    expect(valores["nome"]).toBe("Maria");
    expect(valores["consentimento"]).toBe("");
    expect(valores[CAMPO_ARMADILHA]).toBe("");
  });

  it("aponta o primeiro campo inválido na ordem da tela, não na do Zod", () => {
    expect(
      primeiroCampoInvalido({ mensagem: "erro", nome: "erro" }),
    ).toBe("nome");
  });

  it("estado inicial não é sucesso nem erro", () => {
    expect(ESTADO_INICIAL.status).toBe("inicial");
    expect(ESTADO_INICIAL.carimbo).toBe(0);
  });
});

// -----------------------------------------------------------------------------
// Server Action
// -----------------------------------------------------------------------------

describe("Server Action de contato", () => {
  it("descarta a armadilha em silêncio, com resposta de sucesso", async () => {
    const estado = await enviarContato(
      ESTADO_INICIAL,
      formData({ ...VALIDO, [CAMPO_ARMADILHA]: "robô" }),
    );

    expect(estado.status).toBe("sucesso");
    expect(estado.erros).toEqual({});
    // Nada foi registrado: o envio nem chegou perto do serviço de e-mail.
    expect(console.info).not.toHaveBeenCalled();
  });

  it("valida no servidor mesmo com o cliente contornado", async () => {
    const estado = await enviarContato(
      ESTADO_INICIAL,
      formData({ nome: "M", email: "nada" }),
    );

    expect(estado.status).toBe("erro");
    expect(estado.erros.nome).toBeTruthy();
    expect(estado.erros.email).toBeTruthy();
    expect(estado.erros.consentimento).toBeTruthy();
  });

  it("recusa assunto fora da lista de procedimentos", async () => {
    const estado = await enviarContato(
      ESTADO_INICIAL,
      formData({ ...VALIDO, assunto: "assunto-inventado" }),
    );

    expect(estado.status).toBe("erro");
    expect(estado.erros.assunto).toBeTruthy();
  });

  it("sem chave de envio, diz que nada foi enviado — nunca finge sucesso", async () => {
    const estado = await enviarContato(ESTADO_INICIAL, formData(VALIDO));

    expect(estado.status).toBe("sucesso");
    expect(estado.mensagem).toMatch(/desenvolvimento/i);
    expect(estado.mensagem).toMatch(/nada foi enviado/i);
    expect(console.info).toHaveBeenCalled();
  });

  it("barra o quarto envio do mesmo IP dentro da janela", async () => {
    for (let i = 0; i < 3; i += 1) {
      const ok = await enviarContato(ESTADO_INICIAL, formData(VALIDO));
      expect(ok.status).toBe("sucesso");
    }

    const barrado = await enviarContato(ESTADO_INICIAL, formData(VALIDO));

    expect(barrado.status).toBe("erro");
    expect(barrado.mensagem).toMatch(/espere/i);
    // Erro de limite não é erro de campo: nada fica marcado no formulário.
    expect(barrado.erros).toEqual({});
  });
});

// -----------------------------------------------------------------------------
// Limite por IP
// -----------------------------------------------------------------------------

describe("limite por IP", () => {
  it("desliza a janela em vez de zerar por período fixo", () => {
    const base = 1_000_000;

    for (let i = 0; i < 3; i += 1) {
      expect(
        verificarLimite("ip", { agora: base + i * 1000, limite: 3, janelaMs: 60_000 })
          .permitido,
      ).toBe(true);
    }

    expect(
      verificarLimite("ip", { agora: base + 4000, limite: 3, janelaMs: 60_000 })
        .permitido,
    ).toBe(false);

    // Passada a janela do envio mais antigo, volta a caber.
    expect(
      verificarLimite("ip", { agora: base + 61_000, limite: 3, janelaMs: 60_000 })
        .permitido,
    ).toBe(true);
  });

  it("conta por chave, não globalmente", () => {
    expect(verificarLimite("a", { limite: 1 }).permitido).toBe(true);
    expect(verificarLimite("a", { limite: 1 }).permitido).toBe(false);
    expect(verificarLimite("b", { limite: 1 }).permitido).toBe(true);
  });
});

// -----------------------------------------------------------------------------
// Formulário
// -----------------------------------------------------------------------------

describe("FormularioContato", () => {
  it("tem rótulo de verdade em todo campo — nenhum placeholder fazendo o papel", () => {
    renderizarFormulario();

    for (const rotulo of ["Nome", "WhatsApp", "E-mail", "Assunto", "Mensagem"]) {
      expect(screen.getByLabelText(rotulo)).toBeInTheDocument();
    }

    for (const campo of screen.getAllByRole("textbox")) {
      expect(campo).not.toHaveAttribute("placeholder");
    }
  });

  it("não nasce com o consentimento marcado", () => {
    renderizarFormulario();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("liga o consentimento à política de privacidade", () => {
    renderizarFormulario();

    expect(
      screen.getByRole("link", { name: /política de privacidade/i }),
    ).toHaveAttribute("href", "/politica-de-privacidade");
  });

  it("esconde a armadilha de quem usa o site", () => {
    const { container } = renderizarFormulario();

    const armadilha = container.querySelector<HTMLInputElement>(
      `input[name="${CAMPO_ARMADILHA}"]`,
    );

    expect(armadilha).not.toBeNull();
    expect(armadilha).toHaveAttribute("tabindex", "-1");
    expect(armadilha?.closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("anuncia o resumo em live region e leva o foco ao primeiro campo inválido", async () => {
    renderizarFormulario();
    enviarFormulario();

    const regiao = await screen.findByRole("status");
    expect(regiao).toHaveAttribute("aria-live", "polite");
    expect(regiao).toHaveTextContent(/faltam .* campos/i);

    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByLabelText("Nome")),
    );
  });

  it("com tudo preenchido menos o consentimento, o foco vai para a caixa", async () => {
    renderizarFormulario();
    preencher({ ...VALIDO, consentimento: "" });
    enviarFormulario();

    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole("checkbox")),
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      /marque a caixa de consentimento/i,
    );
  });

  it("com e-mail inválido, o foco vai para o e-mail e o erro é ligado ao campo", async () => {
    renderizarFormulario();
    preencher({ ...VALIDO, email: "maria arroba exemplo" });
    enviarFormulario();

    const campo = screen.getByLabelText("E-mail");

    await waitFor(() => expect(document.activeElement).toBe(campo));

    expect(campo).toHaveAttribute("aria-invalid", "true");
    const descritores = campo.getAttribute("aria-describedby") ?? "";
    expect(descritores).toContain("contato-email-erro");
    expect(document.getElementById("contato-email-erro")).toHaveTextContent(
      /nome@provedor\.com/,
    );
  });

  it("apaga o erro do campo assim que ele é corrigido", async () => {
    renderizarFormulario();
    enviarFormulario();

    await screen.findByRole("status");
    expect(screen.getByLabelText("Nome")).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    preencher({ nome: "Maria de Souza" });

    await waitFor(() =>
      expect(screen.getByLabelText("Nome")).not.toHaveAttribute("aria-invalid"),
    );
  });

  it("com tudo válido, chega à resposta do servidor", async () => {
    renderizarFormulario();
    preencher(VALIDO);
    enviarFormulario();

    const regiao = await screen.findByRole("status");
    await waitFor(() => expect(regiao).toHaveTextContent(/desenvolvimento/i));
  });
});

// -----------------------------------------------------------------------------
// WhatsApp, mapa e pendências
// -----------------------------------------------------------------------------

describe("BotaoWhatsApp", () => {
  it("não renderiza enquanto o número não for confirmado", () => {
    const { container } = render(<BotaoWhatsApp />);

    // Deliberado: link quebrado gasta mais confiança do que a ausência do
    // botão. Ver lib/whatsapp.ts e PENDENCIAS.md.
    expect(container).toBeEmptyDOMElement();
  });
});

describe("Mapa", () => {
  it("trata o placeholder de conteúdo como ausência de mapa", () => {
    expect(urlDeEmbed("[CONFIRMAR: link do Google Maps do consultório]")).toBe(
      null,
    );
  });

  it("recusa domínio que não seja do Google", () => {
    expect(urlDeEmbed("https://exemplo.com/mapa")).toBe(null);
  });

  it("transforma um link do Maps em embed", () => {
    const embed = urlDeEmbed("https://www.google.com/maps?q=-19.9,-43.9");

    expect(embed).toContain("output=embed");
  });
});

describe("pendências", () => {
  it("reconhece marcador de pendência e extrai o que falta", () => {
    expect(estaPendente("[CONFIRMAR: CEP]")).toBe(true);
    expect(estaPendente("Rua das Flores, 100")).toBe(false);
    expect(descricaoPendente("[CONFIRMAR: CEP]")).toBe("CEP");
  });
});
