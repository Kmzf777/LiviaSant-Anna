"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent } from "react";

import { enviarContato } from "@/app/actions/contato";
import type { GrupoDeAssuntos } from "@/lib/assuntos";
import {
  CAMPO_ARMADILHA,
  ESTADO_INICIAL,
  LIMITE_MENSAGEM,
  ROTULOS,
  dadosDoFormulario,
  errosDe,
  esquemaContato,
  primeiroCampoInvalido,
  type CampoContato,
  type ErrosContato,
} from "@/lib/schema";
import { Botao } from "@/components/ui/Botao";
import { Nota } from "@/components/ui/Nota";
import { CampoConsentimento } from "./CampoConsentimento";
import { CampoTexto } from "./CampoTexto";

/**
 * FormularioContato — o único caminho de conversão do site que não é telefone.
 *
 * ---------------------------------------------------------------------------
 * DUAS VALIDAÇÕES, UMA AUTORIDADE
 * ---------------------------------------------------------------------------
 *
 * O mesmo esquema Zod roda aqui e na Server Action, mas os papéis são
 * diferentes. Aqui ele existe para não fazer a pessoa esperar uma ida ao
 * servidor para descobrir que faltou o e-mail. Lá ele existe porque é lá que a
 * decisão é tomada — quem desliga o JavaScript, ou posta direto na action,
 * encontra exatamente as mesmas regras, mais a lista de assuntos e o limite
 * por IP.
 *
 * Se as duas divergirem, a do servidor vence, e a pessoa vê o erro do
 * servidor. É por isso que `errosCliente` é zerado assim que uma resposta
 * chega: nunca há dois conjuntos de erro na tela ao mesmo tempo.
 *
 * ---------------------------------------------------------------------------
 * O QUE ACONTECE QUANDO O ENVIO FALHA
 * ---------------------------------------------------------------------------
 *
 *   1. O resumo aparece dentro de uma live region (`role="status"`), que já
 *      estava no DOM vazia — região inserida junto com o texto costuma não ser
 *      anunciada, e o anúncio é metade do recurso.
 *   2. O foco vai para o primeiro campo inválido **na ordem da tela**, não na
 *      ordem em que o Zod reclamou.
 *   3. Quando o erro não é de campo (limite por IP, falha de envio), o foco vai
 *      para o próprio resumo, que é `tabIndex={-1}` justamente para isso.
 *   4. Cada erro do resumo é um link para o campo correspondente.
 *
 * Corrigir um campo apaga o erro dele na hora. Manter um erro na tela depois
 * de resolvido treina a pessoa a ignorar o que está escrito ali.
 */

type Props = {
  readonly assuntos: readonly GrupoDeAssuntos[];
  /** Preenche o assunto quando a pessoa chega de uma página de procedimento. */
  readonly assuntoInicial?: string;
};

const PREFIXO = "contato";

function idDoCampo(campo: CampoContato): string {
  return `${PREFIXO}-${campo}`;
}

function resumoDe(quantos: number): string {
  return quantos === 1
    ? "Falta um campo para enviar."
    : `Faltam ${quantos} campos para enviar.`;
}

function semOsCorrigidos(
  erros: ErrosContato,
  corrigidos: readonly CampoContato[],
): ErrosContato {
  if (corrigidos.length === 0) return erros;

  const restantes: ErrosContato = {};
  for (const [campo, mensagem] of Object.entries(erros)) {
    if (corrigidos.includes(campo as CampoContato)) continue;
    restantes[campo as CampoContato] = mensagem;
  }
  return restantes;
}

export function FormularioContato({ assuntos, assuntoInicial }: Props) {
  const [estado, enviar, pendente] = useActionState(
    enviarContato,
    ESTADO_INICIAL,
  );

  const [errosCliente, setErrosCliente] = useState<{
    erros: ErrosContato;
    carimbo: number;
  } | null>(null);
  const [corrigidos, setCorrigidos] = useState<readonly CampoContato[]>([]);

  const formulario = useRef<HTMLFormElement>(null);
  const resumo = useRef<HTMLDivElement>(null);
  const confirmacao = useRef<HTMLDivElement>(null);

  const errosBase = errosCliente?.erros ?? estado.erros;
  const erros = semOsCorrigidos(errosBase, corrigidos);
  const quantosErros = Object.keys(erros).length;

  const mensagemResumo =
    errosCliente !== null
      ? resumoDe(Object.keys(errosCliente.erros).length)
      : estado.mensagem;

  // Uma resposta do servidor substitui qualquer erro local.
  useEffect(() => {
    if (estado.carimbo === 0) return;
    setErrosCliente(null);
    setCorrigidos([]);
  }, [estado]);

  // Foco: primeiro campo inválido; resumo quando o erro não é de campo;
  // confirmação quando deu certo.
  useEffect(() => {
    if (estado.carimbo === 0 && errosCliente === null) return;

    const atuais = errosCliente?.erros ?? estado.erros;
    const alvo = primeiroCampoInvalido(atuais);

    if (alvo) {
      document.getElementById(idDoCampo(alvo))?.focus();
      return;
    }

    if (estado.status === "erro") {
      resumo.current?.focus();
      return;
    }

    if (estado.status === "sucesso") {
      formulario.current?.reset();
      confirmacao.current?.focus();
    }
  }, [estado, errosCliente]);

  function marcarCorrigido(campo: CampoContato) {
    return () => {
      setCorrigidos((anteriores) =>
        anteriores.includes(campo) ? anteriores : [...anteriores, campo],
      );
    };
  }

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    const resultado = esquemaContato.safeParse(
      dadosDoFormulario(new FormData(evento.currentTarget)),
    );

    if (resultado.success) {
      setErrosCliente(null);
      setCorrigidos([]);
      return;
    }

    // A Server Action não roda: o erro já é conhecido aqui.
    evento.preventDefault();
    setCorrigidos([]);
    setErrosCliente({ erros: errosDe(resultado.error), carimbo: Date.now() });
  }

  const irParaCampo = (campo: CampoContato) => (evento: MouseEvent) => {
    evento.preventDefault();
    document.getElementById(idDoCampo(campo))?.focus();
  };

  return (
    <div className="flex flex-col gap-10">
      {/*
        A região existe desde a primeira pintura, vazia. Leitor de tela só
        anuncia com confiança o que muda dentro de uma live region que já
        estava lá.
      */}
      <div role="status" aria-live="polite" className="empty:hidden">
        {estado.status === "sucesso" && quantosErros === 0 ? (
          <div
            ref={confirmacao}
            tabIndex={-1}
            className="border-wine-700 flex flex-col gap-3 border-l-2 pl-5"
          >
            {/*
              Sem título fixo do tipo "Enviado!": o texto vem inteiro do
              servidor, porque só ele sabe o que de fato aconteceu. Em
              desenvolvimento, sem chave de envio, esta mesma linha diz que
              nada saiu — e é assim que tem de ser.
            */}
            <p className="text-lead max-w-[46ch]">{estado.mensagem}</p>
          </div>
        ) : null}

        {quantosErros > 0 || (estado.status === "erro" && quantosErros === 0) ? (
          <div
            ref={resumo}
            tabIndex={-1}
            className="border-wine-700 flex flex-col gap-4 border-l-2 pl-5"
          >
            <p className="text-small text-wine-700 font-mono tracking-[0.12em]">
              {mensagemResumo}
            </p>

            {quantosErros > 0 ? (
              <ul className="flex list-none flex-col gap-2">
                {(Object.keys(erros) as CampoContato[]).map((campo) => (
                  <li key={campo} className="text-small text-ink-600">
                    <a
                      href={`#${idDoCampo(campo)}`}
                      onClick={irParaCampo(campo)}
                      className="link-filete text-wine-700"
                    >
                      {ROTULOS[campo]}
                    </a>
                    {`: ${erros[campo] ?? ""}`}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>

      <form
        ref={formulario}
        action={enviar}
        onSubmit={aoEnviar}
        noValidate
        aria-busy={pendente || undefined}
        className="relative flex flex-col gap-8"
      >
        {/*
          Armadilha. Fora da tela, fora da ordem de tabulação, escondida do
          leitor de tela e sem preenchimento automático — ninguém tropeça nela
          por acidente. Quem preenche é robô, e recebe uma resposta de sucesso
          idêntica à de quem enviou de verdade.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label htmlFor={`${PREFIXO}-${CAMPO_ARMADILHA}`}>
            Sobrenome
            <input
              id={`${PREFIXO}-${CAMPO_ARMADILHA}`}
              name={CAMPO_ARMADILHA}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-label="Sobrenome"
            />
          </label>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <CampoTexto
            tipo="texto"
            id={idDoCampo("nome")}
            nome="nome"
            rotulo={ROTULOS.nome}
            autoComplete="name"
            erro={erros.nome}
            aoAlterar={marcarCorrigido("nome")}
          />

          <CampoTexto
            tipo="tel"
            id={idDoCampo("whatsapp")}
            nome="whatsapp"
            rotulo={ROTULOS.whatsapp}
            dica="Com DDD. Exemplo: (31) 99999-9999"
            autoComplete="tel-national"
            erro={erros.whatsapp}
            aoAlterar={marcarCorrigido("whatsapp")}
          />
        </div>

        <CampoTexto
          tipo="email"
          id={idDoCampo("email")}
          nome="email"
          rotulo={ROTULOS.email}
          autoComplete="email"
          erro={erros.email}
          aoAlterar={marcarCorrigido("email")}
        />

        <CampoTexto
          tipo="selecao"
          id={idDoCampo("assunto")}
          nome="assunto"
          rotulo={ROTULOS.assunto}
          grupos={assuntos}
          opcaoVazia="Escolha um assunto"
          valorInicial={assuntoInicial}
          erro={erros.assunto}
          aoAlterar={marcarCorrigido("assunto")}
        />

        <CampoTexto
          tipo="area"
          id={idDoCampo("mensagem")}
          nome="mensagem"
          rotulo={ROTULOS.mensagem}
          dica="O que te trouxe até aqui, em poucas linhas. Sintomas, exames e histórico ficam para a consulta, onde existe sigilo médico."
          maximo={LIMITE_MENSAGEM}
          linhas={7}
          erro={erros.mensagem}
          aoAlterar={marcarCorrigido("mensagem")}
        />

        <CampoConsentimento
          id={idDoCampo("consentimento")}
          nome="consentimento"
          erro={erros.consentimento}
          aoAlterar={marcarCorrigido("consentimento")}
        />

        <div className="flex flex-col gap-6 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <Botao type="submit" disabled={pendente}>
            {pendente ? "Enviando…" : "Enviar mensagem"}
          </Botao>

          <Nota className="sm:text-right">
            Todos os campos são obrigatórios.
          </Nota>
        </div>
      </form>
    </div>
  );
}
