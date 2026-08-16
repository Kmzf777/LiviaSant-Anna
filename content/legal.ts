import type { PaginaInstitucional } from "./tipos";

/**
 * Páginas legais.
 *
 *   politica-de-privacidade  (LGPD: dados coletados no formulário, base legal,
 *                             retenção, direitos do titular, encarregado)
 *   aviso-legal              (natureza informativa do conteúdo, não substitui
 *                             consulta, identificação profissional, CFM)
 *
 * Ambas entram em listarRotas(), então passam automaticamente pelos testes de
 * axe-core e pelo teste do bloco CFM.
 *
 * ATENÇÃO: estes textos foram escritos para descrever com precisão o que o
 * site efetivamente faz — o formulário de contato coleta nome, WhatsApp,
 * e-mail, assunto e mensagem, e o envio é feito por e-mail transacional. Todo
 * ponto que depende de uma decisão dela (prazo de retenção, encarregado,
 * ferramenta de análise, operadores contratados) está marcado com [CONFIRMAR]
 * e registrado em PENDENCIAS.md. Preencher esses campos com suposição seria
 * publicar uma declaração de tratamento de dados que não corresponde à
 * realidade — que é exatamente o que a LGPD pune.
 *
 * Nenhum dos dois textos é parecer jurídico. Antes de publicar, submeta a
 * revisão de advogado.
 */
export const PAGINAS_INSTITUCIONAIS: readonly PaginaInstitucional[] = [
  // ---------------------------------------------------------------------------
  // Política de privacidade
  // ---------------------------------------------------------------------------
  {
    slug: "politica-de-privacidade",
    seo: {
      titulo: "Política de privacidade",
      descricao:
        "Quais dados este site coleta, por que, por quanto tempo, com quem são compartilhados e como exercer seus direitos como titular, conforme a LGPD.",
    },

    eyebrow: "Institucional",
    h1: "Política de privacidade",
    lead: "Esta página explica quais dados este site coleta, para que servem, por quanto tempo ficam guardados e o que você pode exigir a respeito deles.",

    blocos: [
      {
        titulo: "Quem trata os seus dados",
        paragrafos: [
          "O responsável pelo tratamento dos dados pessoais coletados neste site é Lívia Sant'Anna, médica inscrita no CRM-MG 83.288, com consultório em Belo Horizonte, Minas Gerais.",
          "[CONFIRMAR: razão social, CNPJ e endereço completo que devem constar como controlador — pessoa física ou clínica.]",
          "Esta política se aplica ao site e ao formulário de contato dele. Não se aplica ao prontuário médico, que é regido pelas normas do Conselho Federal de Medicina e pela legislação de saúde, com regras próprias de sigilo e de guarda.",
        ],
      },
      {
        titulo: "Quais dados são coletados",
        paragrafos: [
          "Pelo formulário de contato, apenas o que você digita: nome, número de WhatsApp, endereço de e-mail, o assunto escolhido na lista de procedimentos e o texto da mensagem que você escreve.",
          "O campo de assunto merece atenção. Ao escolher um procedimento, você pode revelar um interesse relacionado à sua saúde, e esse é um dado pessoal sensível na definição da LGPD. O mesmo vale para qualquer informação clínica que você escreva no campo de mensagem. Por isso, a recomendação é objetiva: não descreva sintomas, diagnósticos, exames ou histórico médico no formulário. Esse é o assunto da consulta, onde existe sigilo médico e um ambiente adequado para tratá-lo.",
          "Ao enviar o formulário, o sistema registra também dados técnicos do envio, como data, hora e endereço IP, usados exclusivamente para segurança — identificar envios automatizados e limitar abuso do formulário.",
          "Se você entrar em contato pelo botão de WhatsApp, a conversa acontece dentro do aplicativo e passa a ser regida também pela política de privacidade do WhatsApp, que não está sob controle deste site.",
          "[CONFIRMAR: se o site usará ferramenta de análise de audiência, como Google Analytics ou similar, ou pixel de rede social. Se sim, esta seção precisa listar os cookies utilizados, e o site precisa de um banner de consentimento. Se não, este parágrafo passa a afirmar que o site não usa cookies de análise nem de publicidade.]",
        ],
      },
      {
        titulo: "Para que os dados são usados",
        paragrafos: [
          "Para responder você. Os dados enviados pelo formulário servem para retornar o seu contato, esclarecer a sua dúvida e, quando for o caso, agendar uma consulta.",
          "Para segurança do próprio formulário: identificar envios automatizados e prevenir abuso.",
          "Os dados não são usados para envio de comunicações de marketing, não alimentam lista de disparo e não são usados para publicidade direcionada.",
          "Os seus dados não são vendidos, alugados nem cedidos a terceiros para finalidade comercial, em nenhuma hipótese.",
        ],
      },
      {
        titulo: "Com que base legal",
        paragrafos: [
          "O tratamento dos dados de contato se apoia no artigo 7º, inciso V, da LGPD: execução de procedimentos preliminares a pedido do titular. Quem preenche um formulário pedindo retorno está iniciando uma relação, e o tratamento existe para atender a esse pedido.",
          "Quando você marca a caixa de consentimento antes de enviar o formulário, esse consentimento é a base legal para o tratamento das informações relacionadas à sua saúde que porventura apareçam no assunto ou na mensagem, conforme o artigo 11, inciso I, da LGPD. A caixa nunca vem pré-marcada, e não enviar o formulário é sempre uma opção — o telefone e o WhatsApp do consultório estão disponíveis para quem preferir.",
          "Os registros técnicos de segurança se apoiam no legítimo interesse de proteger o site e os seus sistemas contra uso abusivo, nos termos do artigo 7º, inciso IX.",
        ],
      },
      {
        titulo: "Com quem os dados são compartilhados",
        paragrafos: [
          "Com a plataforma de hospedagem do site, que processa a requisição do formulário na infraestrutura em que o site é executado.",
          "Com o serviço de envio de e-mail transacional, que entrega a mensagem do formulário na caixa de entrada do consultório.",
          "Com a equipe do consultório que atende os contatos e faz o agendamento, dentro do necessário para responder você.",
          "Com autoridades públicas, quando houver requisição legal ou ordem judicial.",
          "Esses fornecedores atuam como operadores: tratam os dados por conta do controlador e apenas para a finalidade descrita aqui. Parte deles pode processar dados em servidores fora do Brasil, hipótese de transferência internacional prevista na LGPD.",
          "[CONFIRMAR: nomes dos fornecedores efetivamente contratados — hospedagem, serviço de e-mail, sistema de agendamento — para que sejam citados nominalmente nesta seção.]",
        ],
      },
      {
        titulo: "Por quanto tempo ficam guardados",
        paragrafos: [
          "As mensagens recebidas pelo formulário são mantidas pelo tempo necessário para responder o contato e para registrar o histórico do atendimento.",
          "[CONFIRMAR: prazo de retenção adotado para as mensagens do formulário, por exemplo 12 ou 24 meses após o último contato, e rotina de exclusão.]",
          "Quando você se torna paciente, as informações clínicas passam a compor o prontuário médico, cuja guarda segue as normas do Conselho Federal de Medicina e a legislação aplicável, com prazo próprio e independente desta política.",
          "Registros técnicos de segurança são mantidos pelo prazo previsto no Marco Civil da Internet para registros de acesso a aplicações.",
        ],
      },
      {
        titulo: "Seus direitos como titular",
        paragrafos: [
          "A LGPD garante a você, entre outros direitos: confirmar se existe tratamento de dados seus; acessar esses dados; corrigir dados incompletos, inexatos ou desatualizados; solicitar anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a lei; solicitar a portabilidade; obter informação sobre com quem os dados foram compartilhados; ser informado sobre a possibilidade de não consentir e sobre as consequências disso; e revogar o consentimento a qualquer momento.",
          "A revogação do consentimento não desfaz o tratamento já realizado com base nele até aquele momento, e pode impedir o retorno do contato solicitado.",
          "Alguns dados não podem ser eliminados a pedido, porque a guarda é obrigação legal — é o caso do prontuário médico e dos registros de acesso previstos no Marco Civil da Internet. Quando esse for o motivo da recusa, ele é informado por escrito.",
        ],
      },
      {
        titulo: "Como exercer esses direitos",
        paragrafos: [
          "Envie um pedido por escrito, indicando qual direito pretende exercer e informações suficientes para identificar você como titular.",
          "[CONFIRMAR: e-mail de contato para pedidos de titular — recomendável um endereço específico, por exemplo privacidade no domínio do site.]",
          "[CONFIRMAR: nome e contato do encarregado pelo tratamento de dados pessoais, conforme o artigo 41 da LGPD.]",
          "O pedido é respondido no menor prazo possível. Se você entender que a resposta foi insuficiente, pode apresentar reclamação à Autoridade Nacional de Proteção de Dados.",
        ],
      },
      {
        titulo: "Segurança",
        paragrafos: [
          "O site é servido exclusivamente por conexão criptografada. O formulário tem proteção contra envio automatizado e limite de frequência de envios.",
          "O acesso às mensagens recebidas é restrito a quem precisa delas para atender você.",
          "Nenhuma medida de segurança elimina por completo o risco de incidente. Caso ocorra um incidente com risco relevante aos titulares, a comunicação à Autoridade Nacional de Proteção de Dados e aos titulares afetados é feita nos termos do artigo 48 da LGPD.",
        ],
      },
      {
        titulo: "Crianças e adolescentes",
        paragrafos: [
          "Boa parte do atendimento em otorrinolaringologia é pediátrica, mas o formulário deste site deve ser preenchido por quem tem a responsabilidade legal pela criança ou pelo adolescente, e não por ele.",
          "Dados de menores são tratados no melhor interesse deles, com o consentimento específico e destacado de pelo menos um dos pais ou do responsável legal, conforme o artigo 14 da LGPD.",
        ],
      },
      {
        titulo: "Mudanças nesta política",
        paragrafos: [
          "Esta política pode ser atualizada quando houver mudança na forma como o site trata dados. A versão publicada nesta página é sempre a que vale.",
          "[CONFIRMAR: data da última atualização, a ser preenchida na publicação e revisada a cada alteração.]",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Aviso legal
  // ---------------------------------------------------------------------------
  {
    slug: "aviso-legal",
    seo: {
      titulo: "Aviso legal",
      descricao:
        "Natureza informativa do conteúdo deste site, identificação profissional e as regras de publicidade médica da Resolução CFM 2.336/2023.",
    },

    eyebrow: "Institucional",
    h1: "Aviso legal",
    lead: "O que você lê aqui é informação, não consulta. Esta página explica o que este site é, o que ele não é, e sob quais regras foi escrito.",

    blocos: [
      {
        titulo: "Identificação profissional",
        paragrafos: [
          "Lívia Sant'Anna — Médica — CRM-MG 83.288 — Otorrinolaringologia — RQE 70735.",
          "O registro de qualificação de especialista é em Otorrinolaringologia. A cirurgia plástica da face é realizada dentro do escopo dessa especialidade, e nenhum conteúdo deste site deve ser lido como divulgação de título de especialista que não conste do registro acima.",
          "A veracidade do registro pode ser conferida na consulta pública de profissionais do Conselho Federal de Medicina e do Conselho Regional de Medicina de Minas Gerais.",
        ],
      },
      {
        titulo: "O conteúdo deste site é informativo",
        paragrafos: [
          "Os textos publicados aqui descrevem procedimentos em termos gerais, com a finalidade de esclarecer e de ajudar você a chegar mais bem informada à consulta.",
          "Eles não constituem consulta médica, diagnóstico, prescrição, nem recomendação de tratamento para o seu caso. Nenhum texto substitui o exame presencial.",
          "Medicina não é uma ciência exata e não trabalha com resultados uniformes. Indicação, técnica, tempo de recuperação e desfecho variam conforme a anatomia, a cicatrização, o histórico e as condições clínicas de cada paciente. Duas pessoas com o mesmo diagnóstico podem ter condutas diferentes, e é por isso que este site não oferece nem sugere conduta a distância.",
          "Não interrompa nem inicie nenhum tratamento com base no que leu aqui. Se você tem uma queixa, procure avaliação. Em situação de urgência, procure um serviço de emergência.",
        ],
      },
      {
        titulo: "Riscos, e por que eles estão escritos",
        paragrafos: [
          "Toda página de procedimento deste site tem uma seção de riscos e limites, escrita para ser lida. Não existe cirurgia sem riscos, e omiti-los para tornar o texto mais atraente seria, além de antiético, contrário à norma que rege a publicidade médica.",
          "As faixas de duração, de internação e de recuperação apresentadas nas fichas técnicas são valores habituais, não compromissos. Os percentuais eventualmente citados vêm de literatura médica geral, servem para dar ordem de grandeza e não descrevem a experiência individual desta médica nem a de nenhum paciente específico.",
          "Os riscos que valem para você são explicados individualmente na consulta e formalizados no termo de consentimento informado, antes de qualquer procedimento.",
        ],
      },
      {
        titulo: "Publicidade médica e a Resolução CFM 2.336/2023",
        paragrafos: [
          "Este site é peça de publicidade médica e foi construído sob a Resolução CFM nº 2.336/2023, que disciplina a divulgação de assuntos médicos, e sob o Código de Ética Médica.",
          "Em observância a essas normas, este site não utiliza expressões superlativas ou autopromocionais, não promete nem garante resultados, não anuncia técnica como exclusiva, não cria nome comercial para procedimento, não divulga preços de procedimentos cirúrgicos e não utiliza recursos de sensacionalismo ou de escassez artificial.",
          "O bloco de identificação com nome, registro profissional e qualificação de especialista aparece em todas as páginas, em fonte, tamanho e cor uniformes, conforme a norma.",
          "Informações sobre publicidade médica estão disponíveis no portal do Conselho Federal de Medicina, em publicidademedica.cfm.org.br.",
        ],
      },
      {
        titulo: "Imagens de antes e depois",
        paragrafos: [
          "A Resolução CFM 2.336/2023 permite a divulgação de imagens de antes e depois apenas quando cumpridas, de forma cumulativa, condições estritas: autorização formal e documentada do paciente, impossibilidade de identificá-lo, ausência de qualquer manipulação da imagem, contexto educativo junto à imagem com indicação, possíveis evoluções satisfatórias e insatisfatórias e riscos, além do aviso de que resultados variam entre pacientes.",
          "Enquanto essa curadoria não estiver completa, este site não publica imagens de resultado. Nenhuma imagem de paciente publicada aqui será gerada ou editada por qualquer meio.",
        ],
      },
      {
        titulo: "Links para outros sites",
        paragrafos: [
          "Links eventualmente presentes para páginas de terceiros, como mapas, órgãos públicos ou hospitais, existem por conveniência. O conteúdo, a disponibilidade e as práticas de privacidade dessas páginas são responsabilidade de quem as mantém.",
        ],
      },
      {
        titulo: "Propriedade do conteúdo",
        paragrafos: [
          "Os textos, as fotografias, as ilustrações, a marca e a identidade visual deste site são protegidos por direito autoral e por legislação de propriedade industrial. A reprodução total ou parcial depende de autorização prévia por escrito.",
        ],
      },
      {
        titulo: "Contato e canal de dúvidas",
        paragrafos: [
          "Dúvidas sobre este aviso, sobre o conteúdo publicado ou sobre a conformidade do site podem ser encaminhadas pelos canais de contato do consultório.",
          "[CONFIRMAR: e-mail e telefone que devem constar como canal oficial de contato nesta página.]",
          "[CONFIRMAR: data da última atualização deste aviso legal, a ser preenchida na publicação.]",
        ],
      },
    ],
  },
];
