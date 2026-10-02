/**
 * TODA a copy do produto mora aqui.
 *
 * Nenhum texto visível fica solto dentro de componente. Trocar uma palavra do
 * app inteiro é editar este arquivo, e não varrer quarenta arquivos atrás de
 * uma string. Junto com o `design-system.json`, é aqui que o app muda de cara
 * sem ninguém mexer em lógica.
 */

export const marca = {
  nome: "FlashProfession",
  tagline: "Da dúvida de carreira ao próximo passo certo",
  descricaoCurta:
    "Escolha a profissão, descubra em que nível você está e siga um caminho claro até chegar lá.",
}

/**
 * O nome de cada coisa contável com o artigo junto: é o que faz a frase montada
 * em tempo de execução sair em português correto ("3 competências", "1 case").
 */
export const palavras = {
  competencia: { singular: "competência", plural: "competências", artigo: "a" },
  profissao: { singular: "profissão", plural: "profissões", artigo: "a" },
  desafio: { singular: "desafio", plural: "desafios", artigo: "o" },
  evidencia: { singular: "evidência", plural: "evidências", artigo: "a" },
  caseDePortfolio: { singular: "case", plural: "cases", artigo: "o" },
  dia: { singular: "dia", plural: "dias", artigo: "o" },
  pergunta: { singular: "pergunta", plural: "perguntas", artigo: "a" },
  modulo: { singular: "módulo", plural: "módulos", artigo: "o" },
  jornada: { singular: "jornada", plural: "jornadas", artigo: "a" },
  sessao: { singular: "sessão de estudo", plural: "sessões de estudo", artigo: "a" },
} as const

/** Os estados de um nó do mapa, com rótulo e ícone (MAP-04: nunca só cor). */
export const estadosDeNo = {
  "nao-iniciado": { rotulo: "Não iniciado", icone: "pendente" },
  disponivel: { rotulo: "Disponível", icone: "disponivel" },
  "em-andamento": { rotulo: "Em andamento", icone: "comecar" },
  "aguardando-validacao": { rotulo: "Aguardando validação", icone: "aguardando" },
  concluido: { rotulo: "Concluído", icone: "acertei" },
  bloqueado: { rotulo: "Bloqueado", icone: "bloqueado" },
} as const

/** Os três degraus da autodeclaração, na ordem (DIA-02). */
export const rotulosAutopercepcao = {
  "nunca-vi": "Nunca vi",
  conheco: "Conheço",
  domino: "Domino",
} as const

export const landing = {
  cabecalho: {
    navegacao: "Navegação da página",
    irParaInicio: "Ir para o início",
    entrar: "Entrar",
    comoUsar: "Como usar",
    links: [
      { rotulo: "Como funciona", href: "#como-funciona" },
      { rotulo: "O caminho", href: "#caminho" },
      { rotulo: "O que muda", href: "#beneficios" },
    ],
  },

  /** Dobra 1: a promessa. */
  hero: {
    eyebrow: "Preparação para uma nova carreira",
    titulo: "Da dúvida de carreira ao próximo passo certo",
    subtitulo:
      "Você escolhe a profissão, descobre em que nível está de verdade e recebe o caminho completo até chegar lá: o que aprender, o que praticar e como provar.",
    ctaPrimario: "Descobrir meu nível",
  },

  /**
   * A "foto do produto" do topo: o mapa de cinco níveis com a próxima ação.
   * É um app falso montado em HTML e CSS, sem arquivo de imagem, pintado pelos
   * mesmos tokens do produto.
   */
  mockup: {
    descricao:
      "Prévia do app: o caminho de evolução de UX Designer em cinco níveis, com o nível 2 em andamento e a próxima ação recomendada.",
    endereco: "flashprofession.app",
    titulo: "Seu caminho em UX Design",
    selo: "Nível 2 de 5",
    proximaAcao: "Próxima ação",
    proximaAcaoTexto: "Continuar: Conduzindo sem contaminar",
    continuar: "Continuar",
  },

  /** Dobra 2: os três passos do uso. */
  comoFunciona: {
    titulo: "Do primeiro clique ao nível seguinte",
    subtitulo: "Três passos, e o primeiro leva menos de quinze minutos.",
    passos: [
      {
        numero: "01",
        titulo: "Escolha a profissão de olhos abertos",
        texto:
          "Explore as áreas, veja a rotina real de cada profissão, as entregas e o esforço estimado, antes de decidir.",
      },
      {
        numero: "02",
        titulo: "Descubra em que nível você está",
        texto:
          "Declare o que acha que sabe e confirme num teste rápido. O resultado mostra suas lacunas, seus pontos fortes e o primeiro passo.",
      },
      {
        numero: "03",
        titulo: "Siga o caminho, com prova no fim",
        texto:
          "Aprenda com vídeos curtos, execute tarefas, valide o domínio e pratique em desafios reais que viram cases no seu perfil.",
      },
    ],
    cta: "Quero comprar agora",
  },

  /** Dobra 3: a dobra viva, com os cinco níveis de verdade do catálogo. */
  caminho: {
    titulo: "Cinco níveis, sempre à vista",
    subtitulo:
      "Este é o caminho real de UX/UI Designer dentro do app: do primeiro contato à liderança, com critérios claros para avançar em cada nível.",
    nivelRotulo: "Nível",
  },

  /** Dobra 4: o que a pessoa ganha. */
  beneficios: {
    titulo: "O que muda quando o caminho fica visível",
    itens: [
      {
        icone: "nivel",
        titulo: "Você sabe onde está, com evidência",
        texto:
          "O diagnóstico combina o que você declara com o que o teste confirma, e explica o resultado: nível, lacunas e confiança.",
      },
      {
        icone: "mapa",
        titulo: "O caminho inteiro, sem mistério",
        texto:
          "Os cinco níveis da profissão ficam sempre visíveis, com o que destrava cada um. Chega de estudar sem saber pra onde.",
      },
      {
        icone: "evidencia",
        titulo: "Prova, não só certificado",
        texto:
          "Assistir aula não sobe seu nível aqui. O que conta é validar o domínio e praticar em desafios que viram cases de verdade.",
      },
    ],
  },

  /**
   * DOBRA GUARDADA. Este produto não anuncia preço nesta fase: o bloco fica no
   * projeto, vazio, esperando o dia em que houver plano pra contar. Vazio aqui
   * é reserva, não é peça faltando.
   */
  precos: {
    titulo: "",
    subtitulo: "",
    selo: "",
    planos: [] as Array<{
      nome: string
      preco: string
      periodo: string
      descricao: string
      recursos: string[]
      cta: string
      destaque: boolean
    }>,
  },

  /** DOBRA GUARDADA, pelo mesmo motivo do bloco acima. */
  time: {
    titulo: "",
    subtitulo: "",
    pessoas: [] as Array<{ nome: string; cargo: string; bio: string; iniciais: string }>,
  },

  rodape: {
    texto: "Feito pra quem quer trocar de carreira sabendo exatamente onde pisa.",
    navegacao: "Links do rodapé",
    links: [
      { rotulo: "Como usar", href: "/como-usar" },
      { rotulo: "Entrar", href: "/entrar" },
    ],
  },
}

/** Rótulos do sistema. Renomeie aqui e o menu, os títulos e os vazios acompanham. */
export const sistema = {
  nav: [
    { rotulo: "Início", href: "/app", icone: "inicio" },
    { rotulo: "Carreiras", href: "/app/carreiras", icone: "carreiras", tour: "menu-carreiras" },
    { rotulo: "Mapa", href: "/app/mapa", icone: "mapa" },
    { rotulo: "Aprender", href: "/app/aprender", icone: "aprender" },
    { rotulo: "Praticar", href: "/app/praticar", icone: "praticar" },
    { rotulo: "Progresso", href: "/app/progresso", icone: "progresso" },
    { rotulo: "Ranking", href: "/app/ranking", icone: "ranking" },
    { rotulo: "Perfil", href: "/app/perfil", icone: "perfil" },
    { rotulo: "Configurações", href: "/app/configuracoes", icone: "settings" },
    // O último item é o convite do desafio de refinamento deste app.
    { rotulo: "Desafio de UX", href: "/app/desafio", icone: "desafio", tour: "desafio" },
  ] as Array<{ rotulo: string; href: string; icone: string; tour?: string }>,

  casca: {
    navegacao: "Navegação principal",
    abrirMenu: "Abrir menu",
    fecharMenu: "Fechar menu",
    pularParaConteudo: "Pular para o conteúdo",
    carregando: "Carregando o app",
    sair: "Sair",
  },

  /** Selo que marca conteúdo de demonstração (regra RB-08). */
  demonstracao: "Conteúdo de demonstração",

  // --- Início (ONB-01, ONB-02, ONB-03) -------------------------------------

  inicio: {
    titulo: "Início",
    saudacao: { manha: "Bom dia", tarde: "Boa tarde", noite: "Boa noite" },
    objetivoRotulo: "Seu objetivo",
    nivelRotulo: "Nível",
    de5: "de 5",
    continuar: {
      rotulo: "Continuar de onde parou",
      titulo: "Sua próxima ação",
    },
    ateProximoNivel: "até o nível seguinte",
    indicadores: {
      titulo: "Seu progresso, num olhar",
      // Uma palavra por indicador: o valor ao lado ("2 de 5", "8 dias", "#9")
      // carrega a metade do sentido que o rótulo longo repetia.
      nivel: "Nível",
      competencias: "Competências",
      horasSemana: "Semana",
      sequencia: "Sequência",
      cases: "Cases",
      ranking: "Ranking",
      ultimaAtividade: "Última atividade",
      verDetalhe: "Ver detalhe",
    },
    novo: {
      titulo: "Bem-vindo ao FlashProfession. Comece escolhendo o seu destino",
      texto:
        "Explore as áreas, veja a rotina real de cada profissão e escolha o seu objetivo. Depois, um nivelamento rápido mostra de onde você parte.",
      acao: "Explorar as carreiras",
    },
    alternativas: {
      titulo: "Outras carreiras que você pode explorar",
      texto: "Trocar de objetivo não apaga nada do que você já fez.",
      ver: "Ver",
    },
  },

  // --- Carreiras (CAR-01..05) ----------------------------------------------

  carreiras: {
    titulo: "Carreiras",
    descricao: "Primeiro a área, depois a profissão. Uma decisão de cada vez.",
    areasRotulo: "Escolha uma área",
    todasAsAreas: "Todas as áreas",
    buscar: "Buscar profissão por nome",
    filtroTrabalho: "Tipo de trabalho",
    filtroTodos: "Todos os tipos",
    profissoesRotulo: "Profissões",
    abrir: "Conhecer a profissão",
    objetivoAtual: "Seu objetivo atual",
    semResultado: {
      titulo: "Nenhuma profissão nesse recorte",
      texto: "Nenhuma profissão combina com a busca e os filtros de agora.",
      acao: "Limpar filtros",
    },
  },

  profissao: {
    voltar: "Voltar para as carreiras",
    rotina: "Como é o dia a dia",
    responsabilidades: "O que se espera de você",
    entregas: "Exemplos de entregas",
    competencias: "Competências centrais",
    niveis: "Os cinco níveis do caminho",
    esforco: "Esforço estimado",
    oportunidades: "Oportunidades típicas",
    tipoTrabalho: "Tipo de trabalho",
    // Uma palavra cada: o botão mora num cartão estreito e não pode quebrar
    // linha. A ficha inteira em volta já diz "esta profissão", e o próximo
    // passo (o nivelamento) é a tela seguinte, não precisa caber no rótulo.
    escolher: "Escolher",
    continuarNivelamento: "Continuar",
    jaEscolhida: "Esta já é a sua profissão objetivo",
    trocar: {
      titulo: "Trocar o seu objetivo para esta profissão?",
      texto:
        "Nada do que você fez é apagado: evidências, sessões e histórico ficam. O nivelamento recomeça na profissão nova, e competências equivalentes são reaproveitadas.",
      confirmar: "Trocar objetivo",
    },
  },

  // --- Diagnóstico (DIA-01..09) --------------------------------------------

  diagnostico: {
    titulo: "Nivelamento",
    semProfissao: {
      titulo: "Escolha uma profissão primeiro",
      texto: "O nivelamento é específico de cada profissão: as perguntas mudam conforme o objetivo.",
      acao: "Explorar as carreiras",
    },
    etapas: ["Contexto", "Autoavaliação", "Teste", "Resultado"],
    etapaRotulo: "Etapa",

    contexto: {
      titulo: "Vamos descobrir de onde você parte",
      texto:
        "São duas partes: primeiro você declara o que acredita saber em cada habilidade, depois um teste curto confirma. O resultado posiciona você em um dos cinco níveis e mostra o primeiro passo.",
      pontos: [
        "Leva cerca de 15 minutos, e você pode sair e voltar sem perder nada",
        "A autoavaliação é hipótese, não prova: o teste é quem confirma",
        "Não existe reprovar: o resultado só diz de onde você parte",
      ],
      comecar: "Começar a autoavaliação",
    },

    autopercepcao: {
      titulo: "O que você já sabe de cada habilidade?",
      texto: "Responda com sinceridade: isso ajusta a dificuldade do teste, e o teste confere.",
      legenda: "Como você se avalia em",
      continuar: "Ir para o teste",
      responderTudo: "Responda todas as habilidades antes de seguir.",
    },

    teste: {
      titulo: "Teste de nivelamento",
      progresso: "Pergunta {atual} de {total}",
      cenarioRotulo: "Cenário",
      respostaCurtaRotulo: "Sua resposta",
      respostaCurtaAjuda: "Duas ou três frases bastam. Ela é avaliada depois, junto com uma revisão.",
      porqueTitulo: "Por que esta pergunta",
      dificuldadeRotulo: "Dificuldade",
      dificuldades: { iniciante: "Iniciante", intermediaria: "Intermediária", avancada: "Avançada" },
      pular: "Pular esta pergunta",
      salvarESair: "Salvar e sair",
      proxima: "Confirmar resposta",
      verResultado: "Ver o meu resultado",
      responda: "Escolha uma alternativa ou pule a pergunta.",
      sairTitulo: "Sair do teste?",
      sairTexto: "Suas respostas ficam salvas e você continua exatamente desta pergunta.",
      sairConfirmar: "Salvar e sair",
      semQuestoes: {
        titulo: "Esta profissão ainda não tem teste próprio",
        texto:
          "O banco de questões dela está em preparação. Seu resultado sai só da autoavaliação, com confiança baixa e dito com todas as letras: sem inventar precisão.",
        acao: "Gerar o resultado provisório",
      },
    },

    resultado: {
      titulo: "Seu resultado",
      nivelRotulo: "Seu nível atual",
      confiancaRotulo: "Confiança do resultado",
      confiancaTexto: {
        baixa: "Baseado só na sua autoavaliação. Faça o teste quando ele chegar pra confirmar.",
        media: "Autoavaliação confirmada por um teste curto. Evidências práticas vão refinar isso.",
        alta: "Confirmado por teste e por evidências práticas.",
      },
      dominioTitulo: "Domínio por competência",
      fortesTitulo: "Pontos fortes",
      lacunasTitulo: "Lacunas críticas",
      aproveitadasTitulo: "O que você já traz",
      nadaAproveitado: "O diagnóstico ainda não identificou competências transferíveis.",
      primeiroPassoTitulo: "Prioridade agora",
      verMapa: "Ver o meu caminho completo",
      comecarTrilha: "Começar a aprender",
      refazer: "Refazer o nivelamento",
      refazerConfirmar: {
        titulo: "Refazer o nivelamento?",
        texto: "O resultado atual fica no histórico pra comparação, e um novo diagnóstico começa do zero.",
        confirmar: "Refazer",
      },
    },
  },

  // --- Mapa (MAP-01..06) -----------------------------------------------------

  mapa: {
    titulo: "Mapa",
    descricao: "Os cinco níveis da sua profissão, com o que destrava cada um.",
    visao: { rotulo: "Modo de exibição", mapa: "Mapa", lista: "Lista" },
    proximaAcao: "Próxima ação recomendada",
    legenda: "Legenda dos estados",
    painelDoNivel: {
      objetivo: "Objetivo do nível",
      criterios: "Critérios para avançar",
      competencias: "Competências",
      progresso: "Progresso",
      esforco: "Esforço estimado",
      bloqueadoTexto: "Este nível abre quando as competências obrigatórias do anterior forem concluídas.",
      irAprender: "Abrir no Aprender",
      fechar: "Recolher detalhes",
    },
    ajudaTeclado: "Use as setas ou o Tab para navegar entre os níveis, e Enter para expandir.",
  },

  // --- Aprender (APR-01..07) -------------------------------------------------

  aprender: {
    titulo: "Aprender",
    descricao: "Vídeos curtos, tarefas de verdade e validação no fim. Assistir não basta.",
    navegacaoRotulo: "Módulos da trilha",
    conteudosRotulo: "Aulas",
    tarefasRotulo: "Tarefas",
    avaliacaoRotulo: "Validação",
    videoDuracao: "min",
    objetivoRotulo: "Objetivo desta aula",
    resultadoRotulo: "Você sai capaz de",
    transcricao: "Transcrição",
    velocidade: "Velocidade",
    marcarVisto: "Concluir esta aula",
    visto: "Aula concluída",
    tarefa: {
      oQueFazer: "O que fazer",
      oQueEntregar: "O que entregar",
      comoSaber: "Como saber se ficou bom",
      concluir: "Marcar como feita",
      feita: "Tarefa feita",
    },
    porqueImporta: "Por que isso importa",
    validacao: {
      titulo: "Validar o aprendizado",
      texto: "Acerte {corte} para concluir a competência. Errar mostra exatamente o que revisar.",
      enviar: "Enviar respostas",
      resultadoAprovado: "Validação concluída. Competência registrada como dominada.",
      resultadoReprovado: "Quase lá. Revise os pontos abaixo e tente de novo com questões novas.",
      revisarTitulo: "O que revisar",
      tentarDeNovo: "Tentar de novo",
      acertos: "Você acertou {acertos} de {total}.",
      responda: "Responda todas as perguntas antes de enviar.",
      tentativa: "Tentativa",
    },
    externo: {
      abrir: "Registrar aprendizado feito fora",
      titulo: "Aprendeu isso em outro lugar?",
      texto:
        "Cursos, trabalho ou estudo por conta contam. Registre e valide por teste ou evidência: ninguém deveria repetir conteúdo que já domina.",
      campoOnde: "Onde você aprendeu",
      exemploOnde: "Ex.: curso na empresa, projeto no trabalho, estudo por conta",
      acao: "Registrar e ir para a validação",
    },
    emPreparacao: {
      titulo: "A trilha desta profissão está em preparação",
      texto:
        "Os módulos completos de demonstração existem para UX/UI Designer. Troque o objetivo para ela se quiser navegar a experiência inteira.",
      acao: "Ver UX/UI Designer",
    },
  },

  // --- Praticar (PRA-01..05) -------------------------------------------------

  praticar: {
    titulo: "Praticar",
    descricao: "Desafios próximos do trabalho real. O resultado vira evidência, e evidência vira case.",
    abrir: "Abrir o desafio",
    cenarioRotulo: "Cenário",
    objetivoRotulo: "Objetivo",
    restricoesRotulo: "Restrições",
    entregaRotulo: "O que entregar",
    rubricaRotulo: "Como você será avaliado",
    etapasRotulo: "Etapas do desafio",
    voltar: "Voltar para os desafios",
    envio: {
      titulo: "Sua evidência",
      campoTexto: "Descreva o que você fez e o que encontrou",
      exemploTexto: "O problema, o método, as decisões e o resultado. Direto ao ponto.",
      campoLink: "Link do material (opcional)",
      exemploLink: "https://…",
      salvarRascunho: "Salvar rascunho",
      rascunhoSalvo: "Rascunho salvo",
      enviarFinal: "Enviar para avaliação",
      enviada: "Evidência enviada. A avaliação aparece aqui.",
      textoObrigatorio: "Descreva a sua entrega antes de enviar.",
    },
    feedback: {
      titulo: "Avaliação por critério",
      fonte: { automatico: "Avaliação automática", pares: "Avaliação por pares", especialista: "Avaliação de especialista" },
      pontosFortes: "Pontos fortes",
      virarCase: "Publicar como case no meu perfil",
      viraouCase: "Este desafio virou um case no seu perfil",
      consentimento: "Autorizo exibir este case no meu perfil público",
    },
    estados: {
      rascunho: "Rascunho",
      enviada: "Enviada",
      avaliada: "Avaliada",
      case: "Case publicado",
    },
    emPreparacao: {
      titulo: "Os desafios desta profissão estão em preparação",
      texto: "Os desafios completos de demonstração existem para UX/UI Designer.",
      acao: "Ver UX/UI Designer",
    },
  },

  // --- Progresso (PRO-01..05) ------------------------------------------------

  progresso: {
    titulo: "Progresso",
    descricao: "O que você já construiu, com a origem de cada número à vista.",
    indicadores: {
      objetivo: "Objetivo",
      nivel: "Nível atual",
      proximoNivel: "Até o nível seguinte",
      competencias: "Competências restantes no nível",
      horas: "Horas totais de estudo",
      desafios: "Desafios enviados",
      cases: "Cases publicados",
      sequencia: "Sequência de dias",
    },
    dedicacao: {
      titulo: "Dedicação nos últimos 7 dias",
      descricao: "Tempo ativo registrado ao concluir aula, validação ou prática. Aba aberta não conta.",
      total: "no período",
    },
    porCompetencia: {
      titulo: "Domínio por competência",
      descricao: "De onde veio cada número: nivelamento, validação ou prática.",
      origemRotulo: "Origem",
    },
    historico: {
      titulo: "Linha do tempo",
      diagnostico: "Nivelamento concluído no nível {nivel}",
      sessao: { video: "Sessão de aulas", avaliacao: "Sessão de validação", pratica: "Sessão de prática" },
      evidencia: "Evidência registrada",
      caseFeito: "Case publicado no perfil",
    },
  },

  // --- Ranking (RNK-01..05) --------------------------------------------------

  ranking: {
    titulo: "Ranking",
    descricao: "A comunidade da sua profissão, comparada por dedicação e domínio validado.",
    periodoRotulo: "Período",
    periodo: "Últimos 30 dias",
    colunas: { posicao: "Posição", nome: "Nome", score: "Pontos", sequencia: "Sequência", horas: "Horas no mês", cases: "Cases" },
    voce: "você",
    comoFunciona: {
      titulo: "Como a pontuação é calculada",
      texto:
        "A fórmula premia constância e domínio provado, não tempo de tela. Clique não vale ponto, e hora de estudo pesa pouco de propósito.",
      atualiza: "A pontuação atualiza ao concluir competências, validações, cases e dias de sequência.",
      itens: [
        "Competência concluída: 220 pontos",
        "Validação aprovada: 120 pontos",
        "Case aprovado: 320 pontos",
        "Dia de sequência: 35 pontos",
        "Hora de estudo: 12 pontos",
      ],
      naoConta: "Não contam: cliques, tempo de aba aberta e conteúdo assistido sem validação.",
    },
    recrutadores: {
      titulo: "O que recrutadores veem",
      texto:
        "Quem participa aparece na busca de talentos por profissão, nível, evidências e disponibilidade. Só com o seu consentimento, e só o que você escolher mostrar.",
      verPerfil: "Ajustar meu perfil público",
    },
    optIn: {
      titulo: "Você está fora do ranking",
      texto:
        "Participar é uma escolha sua: seu nome, seus dados e suas evidências só aparecem se você autorizar. Sair depois não apaga nenhum progresso.",
      entrar: "Participar do ranking",
    },
    sair: "Sair do ranking",
    sairConfirmar: {
      titulo: "Sair do ranking?",
      texto: "Você some da lista e da busca de recrutadores na hora. Seu progresso continua intacto.",
      confirmar: "Sair do ranking",
    },
  },

  // --- Perfil ---------------------------------------------------------------

  perfil: {
    titulo: "Perfil",
    descricao: "Seu objetivo, sua visibilidade pública e suas evidências, sob seu controle.",
    objetivo: {
      titulo: "Objetivo profissional",
      nivelAlvo: "Nível alvo: 5 de 5",
      trocar: "Trocar de profissão",
      semObjetivo: "Você ainda não escolheu uma profissão.",
    },
    publico: {
      titulo: "Perfil público",
      texto: "O que aparece no ranking e na busca de recrutadores. Tudo aqui é opt-in.",
      participar: "Aparecer no ranking e na busca de recrutadores",
      nomePublico: "Nome público",
      exemploNome: "Ex.: Ana P.",
      ajudaNome: "É o nome exibido no ranking. Pode ser só o primeiro nome.",
      mostrarEvidencias: "Exibir meus cases e evidências no perfil público",
      disponibilidade: "Disponibilidade",
      exemploDisponibilidade: "Ex.: disponível a partir de outubro",
      ajudaDisponibilidade: "Recrutadores veem isso na busca de talentos. Deixe em branco pra não exibir.",
      salvar: "Salvar visibilidade",
      salvo: "Visibilidade atualizada.",
    },
    evidencias: {
      titulo: "Suas evidências e cases",
      texto: "O que você produziu nos desafios. Cases só ficam públicos com o seu consentimento.",
      nenhuma: "Nenhuma evidência ainda. Elas nascem na área de Praticar.",
      irPraticar: "Ir para Praticar",
    },
  },

  // --- vazios compartilhados -------------------------------------------------

  vazios: {
    /**
     * Os três vazios do onboarding, na ordem em que a jornada se monta: sem
     * profissão, sem nível, sem curso começado. Toda tela que depende dessas
     * coisas mostra o mesmo estado, pela mesma palavra, pelo componente
     * `EstadoDaJornada`. O {profissao} é trocado pelo nome da profissão.
     */
    jornada: {
      profissao: {
        titulo: "Comece escolhendo a sua profissão",
        texto:
          "Tudo aqui se monta em volta de um objetivo: a área, a profissão e o que ela pede no dia a dia. Escolha de olhos abertos, e troque quando quiser sem perder nada.",
        acao: "Escolher a profissão",
        href: "/app/carreiras",
      },
      nivel: {
        titulo: "Descubra de onde você parte",
        texto:
          "Um nivelamento rápido, em duas partes, diz o seu nível em {profissao} e monta o mapa dos cinco níveis. Leva uns 15 minutos, e você pode sair e voltar sem perder nada.",
        acao: "Fazer o nivelamento",
        href: "/app/diagnostico",
      },
      curso: {
        titulo: "Sua primeira aula está esperando",
        texto:
          "Os números desta tela nascem do que você faz em Aprender: conclua a primeira aula e valide a competência. Tudo aparece aqui com a origem de cada número.",
        acao: "Ir para Aprender",
        href: "/app/aprender",
      },
    },
    inicioNovo: {
      titulo: "Sua jornada começa pela escolha",
      texto: "Escolha uma área e uma profissão: o resto do app se monta em volta desse objetivo.",
      acao: "Explorar as carreiras",
    },
  },

  acoes: {
    fechar: "Fechar",
    cancelar: "Cancelar",
    confirmar: "Confirmar",
    limpar: "Limpar",
    buscar: "Buscar",
    selecione: "Selecione…",
  },

  // --- Configurações ---------------------------------------------------------

  configuracoes: {
    titulo: "Configurações",
    descricao:
      "O visual, os dados e o seu perfil de acesso. Tudo o que muda o app sem você escrever uma linha de código.",

    tema: {
      titulo: "Design system",
      descricao:
        "71 identidades prontas, tiradas de produtos reais. Clique em uma e o app inteiro se repinta na hora.",
      rotuloBusca: "Buscar design system",
      placeholderBusca: "Buscar por nome…",
      sufixoContagem: "sistemas",
      rotuloGrade: "Design systems disponíveis",
      selo: { claro: "Claro", escuro: "Escuro" },
      emUso: "Em uso",
      previaAtual: "Prévia aplicada:",
      previaPadrao: "Você está vendo o visual padrão do projeto.",
      voltarPadrao: "Voltar ao padrão",
      vazio: {
        titulo: "Nenhum sistema com esse nome",
        texto: "Tente só um pedaço: “stri” acha o Stripe, “ver” acha o Vercel e o The Verge.",
      },
      aviso: {
        titulo: "Isto aqui é uma prévia",
        texto:
          "A troca vale só neste navegador e some se você limpar os dados do site. Pra ele valer no projeto inteiro (site, sistema e Storybook), cole o JSON abaixo no design-system.json da raiz.",
      },
      json: {
        titulo: "O JSON deste sistema",
        texto:
          "Substitua o conteúdo do design-system.json na raiz do projeto por este. As cores que faltavam no catálogo já vêm calculadas.",
        rotuloBloco: "Conteúdo do design-system.json",
        copiar: "Copiar JSON",
        copiado: "Copiado!",
        erro: "Não deu para copiar. Selecione o texto e use Ctrl+C.",
      },
    },

    dados: {
      titulo: "Dados de exemplo",
      descricao:
        "O app guarda tudo no seu navegador, sem servidor. Estes dois botões mexem em tudo de uma vez.",
      restaurar: "Restaurar exemplos",
      limpar: "Limpar tudo",
      dicaVazios:
        "Restaurar traz a jornada de exemplo no meio do caminho. Limpar zera tudo e mostra a experiência de quem acabou de chegar: os dois estados que valem testar.",
      confirmarRestaurar: {
        titulo: "Restaurar os dados de exemplo?",
        texto: "A jornada, as evidências e as sessões que você criou somem, e o exemplo volta.",
        confirmar: "Restaurar",
      },
      confirmarLimpar: {
        titulo: "Apagar todos os dados?",
        texto:
          "A jornada volta ao zero e o app mostra a experiência de quem acabou de chegar. Dá para trazer os exemplos de volta depois.",
        confirmar: "Apagar tudo",
      },
    },

    perfil: {
      titulo: "Perfil de acesso",
      descricao:
        "O nome que aparece no topo do app. Não existe conta nem servidor por trás disso: é uma sessão guardada no seu navegador.",
      nome: "Nome",
      email: "E-mail",
      ajudaEmail: "Fica só no seu navegador. Nada é enviado para lugar nenhum.",
      /** Com o Google ligado, nome e e-mail vêm da conta e não se editam aqui. */
      descricaoLigado:
        "Nome e e-mail vêm da sua conta Google. É o e-mail que diz de quem é a jornada guardada no banco.",
      ajudaEmailLigado: "Pra trocar, troque na conta Google e entre de novo.",
      salvar: "Salvar alterações",
      salvo: "Perfil atualizado.",
      sair: "Sair da sessão",
      erros: {
        nome: "Escreva pelo menos duas letras.",
        email: "Escreva um e-mail válido, como voce@exemplo.com.",
      },
    },
  },
}

/**
 * O modal que aparece uma vez por sessão quando o ponteiro sai da janela pela
 * borda de cima, no computador. No celular ele não existe.
 */
export const saida = {
  titulo: "Antes de fechar, uma pergunta sobre você",
  texto:
    "Você quer entender o que pode fazer pra crescer na carreira? Acabou de ver que dá pra criar um aplicativo inteiro. Agora tem um desafio de UX pronto pra você executar, resolvendo os problemas que existem neste produto que você acabou de ver.",
  primario: "Ver o desafio",
  secundario: "Agora não",
}

/**
 * A porta de entrada (`/entrar`).
 *
 * O passo a passo do Google mora aqui, e não dentro do modal, pelo mesmo motivo
 * do resto do arquivo: trocar de provedor (ou traduzir o tutorial) é editar
 * texto, não abrir componente.
 */
export const entrada = {
  voltar: "Voltar para o site",

  titulo: "Seu caminho continua de onde você parou",
  subtitulo:
    "Entre pra ver seu nível, seu mapa e a próxima ação recomendada. Enquanto o login não está ligado, a entrada rápida guarda tudo neste navegador.",
  /** O subtítulo de quando o Google está ligado: a conta guarda a jornada de verdade. */
  subtituloLigado:
    "Entre com a sua conta Google. Sua jornada fica guardada nela: feche o navegador, troque de computador, e o caminho continua de onde você parou.",
  avisoLigado:
    "Usamos só o seu nome e o seu e-mail, pra saber que a jornada é sua. Nada é publicado na sua conta Google.",

  google: {
    botao: "Continuar com Google",
    ajuda: "Ainda não está conectado. O botão mostra o passo a passo de configuração.",
    ajudaLigado: "Você vai para o Google escolher a conta e volta para cá já dentro do app.",
    avisos: {
      cancelado: "Você fechou a tela do Google antes de escolher a conta. Pode tentar de novo.",
      expirado: "A tentativa demorou demais e expirou por segurança. Clique de novo no botão.",
      incompleto: "O Google devolveu uma resposta incompleta. Tente mais uma vez.",
      falhou:
        "O Google recusou as credenciais deste app. Confira o Client ID, o Client Secret e o endereço de retorno cadastrado.",
      indisponivel:
        "O login com Google ainda não está configurado neste app. Use a entrada rápida por enquanto.",
    },
  },

  separador: "ou",

  campos: {
    usuario: {
      rotulo: "Seu nome ou e-mail",
      placeholder: "voce@exemplo.com",
      ajuda: "É o nome que aparece no topo do app.",
      erro: "Escreva o seu nome ou e-mail.",
    },
    senha: {
      rotulo: "Senha",
      placeholder: "Sua senha",
      ajuda: "Ela fica só neste navegador. Não é enviada para lugar nenhum.",
      erro: "Escreva a sua senha.",
    },
  },

  entrarDireto: "Entrar",
  aviso:
    "A senha não sai deste navegador e nada é enviado para servidor nenhum. Ligar o login de verdade é o próximo passo, e ele está explicado na página Como usar.",

  modalGoogle: {
    titulo: "Como conectar o Google de verdade",
    descricao:
      "São sete passos no Google Cloud Console. Você faz uma vez, guarda as duas chaves no projeto e o botão passa a funcionar.",

    passos: [
      {
        titulo: "Abra o Google Cloud Console",
        texto:
          "É o painel onde o Google guarda as credenciais dos seus projetos. Entre com a mesma conta que você já usa no dia a dia.",
        link: {
          rotulo: "Abrir o Console do Google",
          href: "https://console.cloud.google.com/apis/credentials",
        },
        codigo: "https://console.cloud.google.com/apis/credentials",
        codigoRotulo: "Endereço",
      },
      {
        titulo: "Crie um projeto",
        texto:
          "No seletor de projetos, no topo da página, escolha “Novo projeto”. O nome é só pra você se achar depois, então pode ser o nome do seu app.",
        codigo: "FlashProfession",
        codigoRotulo: "Nome sugerido",
      },
      {
        titulo: "Crie um ID do cliente OAuth",
        texto:
          "No menu lateral, siga o caminho abaixo. Se o Google pedir para configurar a tela de consentimento antes, escolha “Externo” e preencha só o nome do app e o seu e-mail de contato.",
        codigo: "Credenciais → Criar credenciais → ID do cliente OAuth",
        codigoRotulo: "Caminho no menu",
      },
      {
        titulo: "Escolha o tipo de aplicativo",
        texto:
          "No campo “Tipo de aplicativo”, selecione a opção abaixo. É ela que libera os dois campos dos próximos passos.",
        codigo: "Aplicativo da Web",
        codigoRotulo: "Tipo de aplicativo",
      },
      {
        titulo: "Autorize o endereço do seu app",
        texto:
          "Em “Origens JavaScript autorizadas”, clique em “Adicionar URI” e cole o endereço abaixo. É o endereço do app rodando na sua máquina.",
        codigo: "http://localhost:3000",
        codigoRotulo: "Origens JavaScript autorizadas",
      },
      {
        titulo: "Autorize o endereço de retorno",
        texto:
          "Em “URIs de redirecionamento autorizados”, clique em “Adicionar URI” e cole o endereço abaixo. É para onde o Google devolve a pessoa depois do login, e precisa bater caractere por caractere.",
        codigo: "http://localhost:3000/api/auth/callback/google",
        codigoRotulo: "URIs de redirecionamento autorizados",
      },
      {
        titulo: "Guarde as duas chaves no projeto",
        texto:
          "Ao salvar, o Google mostra o Client ID e o Client Secret. Crie um arquivo chamado .env.local na raiz do projeto e cole as três linhas abaixo, trocando o texto depois do “=” pelos valores que apareceram. A terceira é sua, e não vem do Google: é o segredo que assina a sua sessão, e pode ser qualquer texto embaralhado com 32 letras ou mais (no terminal, openssl rand -base64 32 gera um). Depois pare o servidor e rode npm run dev de novo.",
        codigo:
          "GOOGLE_CLIENT_ID=cole-aqui-o-seu-client-id\nGOOGLE_CLIENT_SECRET=cole-aqui-o-seu-client-secret\nAUTH_SECRET=cole-aqui-um-texto-aleatorio-longo",
        codigoRotulo: ".env.local",
      },
    ],

    nota: "O .env.local não vai para o Git, e não deve ir. O Client Secret é uma senha: se ele vazar, gere outro no mesmo lugar em que criou.",

    aviso:
      "Assim que as três linhas estiverem no .env.local, este botão passa a fazer login de verdade, sem você mexer em código nenhum. Enquanto isso, use os campos abaixo pra entrar.",

    fechar: "Entendi",
    copiar: "Copiar",
    copiado: "Copiado!",
    falhaCopia: "Não deu para copiar automaticamente. Selecione o texto acima e use Ctrl+C (ou Cmd+C).",
  },
}

/**
 * A tela do Desafio de UX, dentro do app.
 *
 * Ela é o gabarito do treino: conta o que dá pra refinar neste produto, como
 * medir a melhora e onde isso vira carreira. Nada aqui é dado pessoal de
 * ninguém: o texto fala do APP, não de quem construiu ele.
 */
export const desafio = {
  titulo: "Desafio de UX",
  descricao: "Um guia de refinamento pra levar este app pra perto de um produto de verdade.",

  abertura: {
    texto:
      "Este aplicativo foi construído com inteligência artificial, a partir de um prompt do método do Design Engineer. Se você quiser o seu, é de graça e sai com app e desafio junto.",
    link: {
      rotulo: "Pegar o meu prompt",
      href: "https://guiadeinstalacao.vercel.app/acelerador",
    },
  },

  refinar: {
    titulo: "O que refinar neste app",
    intro:
      "Todo produto que nasce rápido nasce cru, e refinar é o trabalho de verdade de quem faz produto. Este é o guia pra levar o FlashProfession pra perto de um produto real, pronto pra uso. Começa por um ponto só, e ele está às claras aqui embaixo.",

    ponto: {
      titulo: "O ponto a refinar, do jeito que ele está hoje",
      texto:
        "A primeira tela depois de entrar é um painel genérico de módulos, todos com o mesmo peso, sem nenhuma indicação do que fazer primeiro e sem atalho pra primeira ação de valor: a informação de por onde começar simplesmente não existe. Quem explora encontra tudo e completa qualquer coisa. Nada disso impede a tarefa, só ninguém guia.",
    },

    solucao: {
      titulo: "O caminho da solução",
      itens: [
        "Definir qual é a primeira ação de valor e desenhar a tela inteira em volta dela",
        "Substituir a tela inicial vazia por um estado que já ensina o caminho",
        "Reduzir o primeiro formulário ao mínimo. O resto pode vir depois",
        "Mostrar progresso quando houver mais de um passo",
        "Deixar pular qualquer tour, e não repetir para quem já passou",
      ],
    },

    teste: {
      titulo: "Como testar",
      intro:
        "Chame 5 pessoas parecidas com quem usaria isso de verdade, peça a tarefa principal sem ajudar, e observe:",
      itens: [
        "O que a pessoa faz nos primeiros 30 segundos, e se ela hesita",
        "Se ela pergunta “e agora?” em voz alta",
        "Quanto tempo até a primeira ação que gera valor de verdade",
        "Se ela encontra sozinha a função principal do produto",
      ],
    },

    metrica: {
      titulo: "O número que prova",
      nome: "Adoção",
      definicao:
        "Adoção é a pessoa conseguir usar uma funcionalidade pela primeira vez: descobrir que ela existe, entender pra que serve e chegar até o fim sem ninguém explicar.",
      comoMedir:
        "Percentual de pessoas que chegam à primeira ação de valor sem ajuda, e em quanto tempo.",
      meta: "De 45% em 4 minutos para 80% em 90 segundos, medindo com 5 pessoas antes e outras 5 depois.",
      fecho:
        "O antes se mede com o ponto a refinar ainda no lugar, e o depois com o refinamento feito. Os dois números juntos, com os prints das duas versões, são o seu case.",
      rotulos: {
        metrica: "Métrica",
        comoMedir: "Como medir",
        meta: "A meta",
      },
    },

    armadilha: {
      titulo: "A armadilha a evitar",
      texto:
        "Resolver com um tour de 5 balõezinhos. Tour é curativo: a pessoa clica em “pular” e o problema continua. Melhor é a tela se explicar sozinha.",
    },
  },

  carreira: {
    titulo: "O que isso tem a ver com carreira",
    paragrafos: [
      "O que separa quem desenha tela de quem faz produto é resolver o problema certo, entender a jornada de quem usa e melhorar uma métrica de verdade.",
      "Um antes e depois medido com gente real vale mais num portfólio do que qualquer tela bonita.",
    ],
    fecho: {
      antes: "E é exatamente esse ciclo, achar o problema, corrigir, medir e contar, que se aprende nas formações do Design Engineer: o ",
      link1: { rotulo: "UX Unicórnio", href: "https://www.designengineer.com.br/matriculas" },
      meio: " e a ",
      link2: {
        rotulo: "Pós/MBA em Inovação orientada a IA e UX",
        href: "https://leandrorezende.unifast.com.br/mba-em-inovacao-orientada-a-ia-e-ux-vc/",
      },
      depois: ".",
    },
  },

  fecho: {
    primario: {
      rotulo: "Ver o meu desafio de design",
      href: "https://guiadeinstalacao.vercel.app/desafio/hMwsBomPC1vAPpj6AUCY05wXbeoBAjxdsNoFD4ToGNTc2mj2ArSg0_BGi7H5lWdAPBoXd4CF7marN0noqzG-xg",
    },
    secundario: {
      rotulo: "Garantir meu ingresso do workshop",
      href: "https://www.designengineer.com.br/primeiroapp",
    },
    linkedin: {
      rotulo: "Quer conversar? Vamos conversar no LinkedIn",
      href: "https://www.linkedin.com/in/lbrezende/",
    },
  },
}

/**
 * A página Como usar (`/como-usar`).
 *
 * Ela é escrita pra quem é dono deste app e pra quem for ver ele por cima do
 * ombro: o que já funciona, o que falta ligar e onde cada peça encaixa.
 */
export const comoUsar = {
  titulo: "Como usar o FlashProfession",
  subtitulo:
    "O que já está de pé, o que ainda falta conectar e onde cada coisa encaixa no projeto. Sem termo técnico solto: cada bloco diz o que você ganha.",
  voltar: "Voltar para o site",
  entrar: "Entrar no app",

  pronto: {
    titulo: "O que este app já faz hoje",
    subtitulo: "Tudo abaixo funciona agora, com dados de demonstração, sem configurar nada.",
    itens: [
      {
        icone: "inicio",
        titulo: "Início com retomada",
        texto:
          "A primeira tela mostra onde você parou, a próxima ação recomendada e o progresso consolidado, e se adapta a quem acabou de chegar.",
      },
      {
        icone: "carreiras",
        titulo: "Escolha de carreira",
        texto:
          "Seis áreas e doze profissões exploráveis, com rotina, entregas, esforço estimado e os cinco níveis de cada uma antes de decidir.",
      },
      {
        icone: "nivel",
        titulo: "Nivelamento em duas partes",
        texto:
          "Autoavaliação por habilidade e teste com formatos variados, com progresso salvo e resultado explicável: nível, lacunas e confiança.",
      },
      {
        icone: "mapa",
        titulo: "Mapa de cinco níveis",
        texto:
          "O caminho completo em React Flow, com estados por nó, o nível atual expandido e alternativa acessível em lista.",
      },
      {
        icone: "aprender",
        titulo: "Aprendizado verificável",
        texto:
          "Vídeos curtos com transcrição, tarefas acionáveis e validação com nota de corte: errar mostra exatamente o que revisar.",
      },
      {
        icone: "praticar",
        titulo: "Prática com evidências",
        texto:
          "Desafios com cenário, rubrica e envio de evidência. Feedback por critério, e o resultado vira case no perfil com consentimento.",
      },
      {
        icone: "progresso",
        titulo: "Progresso e ranking transparentes",
        texto:
          "Horas, sequência, domínio por competência com origem, linha do tempo e um ranking opt-in com fórmula aberta.",
      },
      {
        icone: "paleta",
        titulo: "Design system aplicado e celular resolvido",
        texto:
          "Cor, tipografia e raio saem de um arquivo só, e toda tela funciona em 375 pixels de largura, com alvo de toque de 44 pixels.",
      },
    ],
  },

  conectar: {
    titulo: "O que ainda falta conectar, e onde cada coisa encaixa",
    subtitulo:
      "Cada item diz o que é, o que muda no app quando ligar, e o arquivo do projeto onde ele já está esperando.",
    itens: [
      {
        icone: "email",
        titulo: "Envio de e-mail",
        texto:
          "Lembrete baseado em pendência real: a validação que ficou pra trás, o desafio sem envio. A chave já tem lugar reservado no modelo de variáveis.",
        onde: ".env.example → RESEND_API_KEY, e src/app/api",
      },
      {
        icone: "dados",
        titulo: "Backend e banco de dados",
        texto:
          "Hoje a jornada fica no navegador de quem usa. O caminho pro banco já nasceu escrito e testado: ligar o Neon é colar a string de conexão no .env.local, e a partir dali o mesmo app grava no Postgres. Zero linha de código, nenhuma tela mudando.",
        onde: "src/lib/banco.ts, src/app/api/dados e src/lib/store.ts",
      },
      {
        icone: "seguranca",
        titulo: "Login com Google",
        texto:
          "O caminho inteiro já está montado e desligado: o botão na tela de entrar, o passo a passo dentro dele e as rotas prontas. Colou GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env.local, ligou.",
        onde: "src/lib/google.ts, src/lib/sessao-servidor.ts e src/app/api/auth",
      },
      {
        icone: "gerar",
        titulo: "A API da OpenAI",
        texto:
          "É ela que torna o teste adaptativo de verdade, avalia as respostas curtas do nivelamento e gera feedback automático dos desafios. A chave tem grupo próprio no modelo de variáveis, e a rota nasce no servidor, nunca no navegador.",
        onde: ".env.example → OPENAI_API_KEY, e src/app/api",
      },
      {
        icone: "telefone",
        titulo: "WhatsApp",
        texto:
          "Avisar quem usa o app pelo canal que a pessoa realmente lê: a sequência prestes a quebrar, o feedback do desafio que chegou.",
        onde: ".env.example → WHATSAPP_TOKEN",
      },
      {
        icone: "restaurar",
        titulo: "Automações",
        texto:
          "O n8n já está no projeto, com o arquivo pronto pra subir e um guia com dois exemplos desenhados. É por ele que passam WhatsApp, e-mail, planilha e agendamento sem escrever código.",
        onde: "n8n/docker-compose.yml e n8n/README.md",
      },
      {
        icone: "paleta",
        titulo: "Storybook",
        texto:
          "O catálogo de componentes deste app, já configurado, com os tokens aplicados e auditoria de acessibilidade em cada componente. É o que transforma o projeto numa biblioteca que dá pra mostrar.",
        onde: ".storybook e os arquivos .stories.tsx ao lado de cada componente",
      },
    ],
    ondeRotulo: "Onde encaixa",
  },

  workshop: {
    titulo: "Onde tudo isso se aprende",
    texto:
      "Tudo o que está na lista acima é ensinado no workshop. Não é pesquisa solta na internet, não é tentativa e erro: é ao vivo, passo a passo, em cima deste projeto aqui, que já veio com todos os encaixes prontos justamente pra isso.",
    acao: "Garantir meu ingresso do workshop",
    href: "https://www.designengineer.com.br/primeiroapp",
  },

  caminhos: {
    titulo: "Os dois caminhos depois disso",
    itens: [
      {
        icone: "formacao",
        titulo: "Pós-graduação e MBA",
        paraQuem: "Pra quem já é designer e quer liderança com IA",
        texto:
          "Inteligência artificial em processos, em research ops e em design ops, com o repertório de quem vai conduzir o time.",
        acao: "Conhecer a Pós/MBA",
        href: "https://leandrorezende.unifast.com.br/mba-em-inovacao-orientada-a-ia-e-ux-vc/",
      },
      {
        icone: "ideia",
        titulo: "Formação IA/UX Designer",
        paraQuem: "Pra quem já é designer mas ainda não aplica IA no dia a dia",
        texto: "O caminho pra sair usando, do primeiro prompt ao produto entregue.",
        acao: "Conhecer a formação",
        href: "https://www.designengineer.com.br/matriculas",
      },
    ],
    paraQuemRotulo: "Pra quem é",
  },

  proximos: {
    titulo: "Os meus próximos passos",
    itens: [
      "Navegar a jornada inteira com os dados de exemplo e anotar o que incomodar",
      "Testar o fluxo de nivelamento com 5 pessoas de verdade",
      "Escrever o caso pro portfólio contando o problema e a decisão",
      "Entrar no workshop pra ligar backend, login e a avaliação com IA",
      "Publicar o caso na lista de portfólios do UX Unicórnio",
    ],
  },
}
