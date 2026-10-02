import type { Dados } from "./types"

/**
 * O estado de exemplo carregado no primeiro acesso.
 *
 * Ele coloca a pessoa NO MEIO da jornada de propósito: profissão escolhida
 * (UX/UI Designer), diagnóstico concluído no nível 2, trilha começada, uma
 * evidência em rascunho e um case aprovado. É esse estado que deixa toda tela
 * do app cheia e navegável no primeiro minuto.
 *
 * O botão "Limpar tudo" em Configurações zera isso e mostra o outro extremo:
 * o estado de quem acabou de chegar, com a escolha de carreira na frente.
 * Os dois estados que o documento de requisitos pede (ONB-03) ficam testáveis
 * sem mexer em código.
 */
export const SEED: Dados = {
  jornadas: [
    {
      id: "jor-1",
      profissaoId: "ux-ui-designer",
      etapa: "trilha",
      autopercepcao: {
        "hab-processo": "domino",
        "hab-heuristicas": "conheco",
        "hab-entrevista": "conheco",
        "hab-sintese": "nunca-vi",
        "hab-fluxo": "conheco",
        "hab-wireframe": "conheco",
        "hab-figma": "domino",
        "hab-prototipagem": "conheco",
        "hab-plano-teste": "nunca-vi",
        "hab-conducao": "nunca-vi",
        "hab-storytelling": "conheco",
        "hab-especificacao": "nunca-vi",
        "hab-metricas": "nunca-vi",
        "hab-experimentos": "nunca-vi",
        "hab-discovery": "nunca-vi",
        "hab-priorizacao": "nunca-vi",
        "hab-mentoria": "nunca-vi",
        "hab-visao": "nunca-vi",
      },
      respostasDoTeste: {
        "q-ux-1": "1",
        "q-ux-2": "1",
        "q-ux-3": "1",
        "q-ux-4": "0",
        "q-ux-5":
          "Agruparia as anotações por tema, separando o que a pessoa disse do que eu interpretei, e escreveria cada padrão como um achado com a fala que o comprova.",
      },
      questaoAtual: 5,
      resultado: {
        nivel: 2,
        confianca: "média",
        dominioPorCompetencia: {
          "ux-processo": 82,
          "ux-pesquisa": 45,
          "ux-wireframe": 58,
          "ux-prototipo": 70,
          "ux-teste": 15,
          "ux-comunicacao": 40,
          "ux-metricas": 10,
          "ux-discovery": 5,
          "ux-lideranca": 0,
        },
        pontosFortes: ["Processo de UX", "Prototipação"],
        lacunasCriticas: ["Pesquisa com usuários", "Testes de usabilidade"],
        aproveitadas: ["Comunicação com times, da sua experiência anterior"],
        primeiroPasso:
          "Comece pelo módulo Pesquisa com usuários: é a lacuna que mais segura o seu avanço para o nível 3.",
        data: "2026-08-16",
      },
      competenciasConcluidas: ["ux-processo"],
      conteudosVistos: ["vid-pesquisa-1", "vid-pesquisa-2"],
      tarefasFeitas: ["tar-roteiro"],
      avaliacoes: {},
      retomada: { moduloId: "mod-pesquisa", conteudoId: "vid-pesquisa-3" },
      publico: {
        participaRanking: true,
        nomePublico: "Ana P.",
        mostrarEvidencias: true,
        disponibilidade: "Disponível a partir de outubro",
      },
      criadoEm: "2026-08-14T09:10:00.000Z",
    },
  ],

  evidencias: [
    {
      id: "evi-1",
      desafioId: "des-onboarding",
      habilidade: "Pesquisa com usuários",
      origem: "tarefa",
      estado: "case",
      texto:
        "Investiguei o abandono do onboarding de um app de estudos com 5 entrevistas. O achado central: as pessoas não entendiam o que fazer primeiro. Recomendei reduzir o primeiro formulário e destacar a primeira ação de valor.",
      link: "https://exemplo.com/case-onboarding",
      feedback: [
        { criterio: "Método", nota: "Ótimo", comentario: "Escolha de entrevistas bem justificada pelo tipo de pergunta." },
        { criterio: "Condução", nota: "Bom", comentario: "Roteiro sólido. Numa próxima, grave as sessões pra citar falas exatas." },
        { criterio: "Síntese", nota: "Ótimo", comentario: "Achados com evidência e implicação clara." },
        { criterio: "Recomendações", nota: "Bom", comentario: "Acionáveis. Faltou estimar o esforço de cada uma." },
      ],
      fonteFeedback: "especialista",
      consentimentoCase: true,
      criadoEm: "2026-08-19T15:30:00.000Z",
    },
    {
      id: "evi-2",
      desafioId: "des-cadastro",
      habilidade: "Testes de usabilidade",
      origem: "tarefa",
      estado: "rascunho",
      texto:
        "Comecei analisando o fluxo atual: 9 campos na primeira tela, sem indicação de progresso. Hipóteses levantadas, falta rodar o teste com os 5 usuários.",
      link: "",
      feedback: null,
      fonteFeedback: null,
      consentimentoCase: false,
      criadoEm: "2026-08-22T10:05:00.000Z",
    },
  ],

  sessoes: [
    { id: "ses-1", tipo: "video", minutos: 25, data: "2026-08-16", criadoEm: "2026-08-16T20:10:00.000Z" },
    { id: "ses-2", tipo: "avaliacao", minutos: 20, data: "2026-08-16", criadoEm: "2026-08-16T20:40:00.000Z" },
    { id: "ses-3", tipo: "video", minutos: 30, data: "2026-08-17", criadoEm: "2026-08-17T19:30:00.000Z" },
    { id: "ses-4", tipo: "pratica", minutos: 45, data: "2026-08-18", criadoEm: "2026-08-18T21:00:00.000Z" },
    { id: "ses-5", tipo: "video", minutos: 20, data: "2026-08-19", criadoEm: "2026-08-19T20:15:00.000Z" },
    { id: "ses-6", tipo: "pratica", minutos: 50, data: "2026-08-19", criadoEm: "2026-08-19T21:00:00.000Z" },
    { id: "ses-7", tipo: "video", minutos: 15, data: "2026-08-20", criadoEm: "2026-08-20T19:45:00.000Z" },
    { id: "ses-8", tipo: "pratica", minutos: 40, data: "2026-08-21", criadoEm: "2026-08-21T20:30:00.000Z" },
    { id: "ses-9", tipo: "video", minutos: 25, data: "2026-08-22", criadoEm: "2026-08-22T09:20:00.000Z" },
    { id: "ses-10", tipo: "avaliacao", minutos: 15, data: "2026-08-22", criadoEm: "2026-08-22T10:00:00.000Z" },
    { id: "ses-11", tipo: "video", minutos: 20, data: "2026-08-23", criadoEm: "2026-08-23T08:30:00.000Z" },
  ],
}
