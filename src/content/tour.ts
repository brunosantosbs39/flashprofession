/**
 * O texto do onboarding guiado.
 *
 * Ele roda uma vez, na primeira visita, e ATRAVESSA PÁGINAS: começa no site,
 * entra no app e percorre a jornada inteira NA ORDEM do documento de
 * requisitos: início → carreiras → profissão → nivelamento → mapa → aprender →
 * praticar → progresso → ranking. Cada parada diz onde clicar pra chegar na
 * próxima, então o tour é também o roteiro de navegação de quem está testando.
 *
 * `pagina` é o endereço onde a parada acontece, e ele vale também pras telas
 * de dentro dele: "/app/carreiras" acontece na ficha de uma profissão também.
 * `alvo` é um seletor de CSS. Parada sem alvo aparece no centro da tela. Se o
 * alvo não existir na página, a parada é PULADA em vez de quebrar o tour.
 */

export const tour = {
  /** Nome dos controles do próprio tour. */
  proximo: "Próximo",
  anterior: "Voltar",
  fechar: "Fechar",
  concluir: "Entendi",

  /** Botão que existe na tela de configurações pra rodar o tour de novo. */
  rever: {
    titulo: "Rever as boas-vindas",
    texto: "Roda de novo o passo a passo que apareceu na primeira vez que você entrou.",
    acao: "Ver de novo",
  },

  paradas: [
    {
      pagina: "/",
      alvo: "[data-tour='entrar']",
      titulo: "Essa é a sua página",
      texto: "Quer ver o sistema por dentro? Clica em entrar, que eu continuo lá.",
    },
    {
      pagina: "/app",
      alvo: "[data-tour='continuar']",
      titulo: "O início sempre sabe onde você parou",
      texto:
        "Este painel mostra o seu objetivo, o progresso e UMA próxima ação recomendada. É a etapa final da jornada, e a gente volta nele. Antes, o caminho todo, na ordem.",
    },
    {
      pagina: "/app",
      alvo: "[data-tour='menu-carreiras']",
      titulo: "Etapa 1: escolher a carreira",
      texto: "Tudo começa aqui. Clica em Carreiras no menu, que eu te encontro lá.",
    },
    {
      pagina: "/app/carreiras",
      alvo: "[data-tour='profissoes']",
      titulo: "Primeiro a área, depois a profissão",
      texto:
        "Filtre por área, busque pelo nome e abra uma profissão pra ver rotina, entregas e os cinco níveis. Abra a de UX/UI Designer: é a trilha completa de demonstração.",
    },
    {
      pagina: "/app/carreiras",
      alvo: "[data-tour='iniciar-nivelamento']",
      titulo: "Etapa 2: entrar no nivelamento",
      texto:
        "Leu a ficha e fez sentido? Este botão começa o diagnóstico específico desta profissão. Se ela já é o seu objetivo, ele continua de onde você parou.",
    },
    {
      pagina: "/app/diagnostico",
      alvo: "[data-tour='diagnostico']",
      titulo: "Etapa 3: descobrir de onde você parte",
      texto:
        "Primeiro você declara o que acha que sabe, depois um teste curto confirma. Dá pra sair e voltar sem perder nada. Quando terminar, clica em Mapa no menu.",
    },
    {
      pagina: "/app/mapa",
      alvo: "[data-tour='mapa']",
      titulo: "Etapa 4: o caminho completo",
      texto:
        "Os cinco níveis da profissão, com estados, dependências e o nível atual aberto. O botão de lista mostra a mesma coisa em versão acessível. Depois, clica em Aprender.",
    },
    {
      pagina: "/app/aprender",
      alvo: "[data-tour='aprender']",
      titulo: "Etapa 5: aprender com prova no fim",
      texto:
        "Vídeos curtos, tarefas de verdade e a validação que conclui a competência. Assistir não basta, e é assim de propósito. Em seguida, clica em Praticar.",
    },
    {
      pagina: "/app/praticar",
      alvo: "[data-tour='praticar']",
      titulo: "Etapa 6: provar em desafio real",
      texto:
        "Cada desafio tem cenário, restrições e rubrica à vista. Sua entrega vira evidência, e evidência aprovada vira case no perfil. Agora clica em Progresso.",
    },
    {
      pagina: "/app/progresso",
      alvo: "[data-tour='progresso']",
      titulo: "Etapa 7: ver o que você construiu",
      texto:
        "Horas, sequência, domínio por competência com a origem de cada número e a linha do tempo. Falta uma parada: clica em Ranking.",
    },
    {
      pagina: "/app/ranking",
      alvo: "[data-tour='ranking']",
      titulo: "Etapa 8: a comunidade, com consentimento",
      texto:
        "O ranking compara dedicação com fórmula aberta, e só entra quem autorizar. É a última etapa da jornada de quem usa.",
    },
    {
      pagina: "/app/ranking",
      alvo: null,
      titulo: "E este passo a passo também é seu",
      texto:
        "No fim do menu tem o Desafio de UX, o guia pra refinar este app. Você pode pedir o que quiser pro seu assistente, inclusive remover este onboarding, e o sistema fica mais limpo.",
    },
  ],
}
