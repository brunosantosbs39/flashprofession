/**
 * A copy do painel /admin. Texto visível mora aqui, não no componente.
 */

export const admin = {
  titulo: "Métricas do produto",
  subtitulo:
    "O HEART do FlashProfession, medido só com o que o banco sustenta: sem evento de clique e sem pesquisa de satisfação, o que é proxy ou aproximação está dito na tela.",
  atualizado: "Lido do banco agora",

  negado: {
    titulo: "Página restrita",
    texto: "Este painel abre só pra quem está em ADMIN_EMAILS. Entre com a conta certa.",
    acao: "Ir para a entrada",
  },
  semBanco: {
    titulo: "Sem banco ligado",
    texto: "O painel lê o Neon. Preencha a DATABASE_URL no ambiente e recarregue.",
  },

  heart: {
    titulo: "HEART, num olhar",
    happiness: {
      rotulo: "Happiness",
      nota: "Proxy: sem pesquisa de satisfação ainda, o que temos é adesão voluntária.",
      optIn: "entraram no ranking por escolha",
      consentimento: "consentiram case público",
    },
    engagement: {
      rotulo: "Engagement",
      sessoes: "sessões de estudo em 7 dias",
      minutos: "minutos estudados em 7 dias",
      media: "min por pessoa ativa",
    },
    adoption: {
      rotulo: "Adoption",
      total: "pessoas na base",
      novos: "chegaram nos últimos 7 dias",
      escolheram: "escolheram profissão",
    },
    retention: {
      rotulo: "Retention",
      ativos: "ativos",
      risco: "em risco",
      inativos: "inativos",
    },
    task: {
      rotulo: "Task success",
      conclusao: "de quem escolhe profissão conclui o nivelamento",
      semAmostra: "sem amostra ainda",
    },
  },

  tarefas: {
    titulo: "As tarefas-chave do documento de requisitos",
    subtitulo:
      "Na ordem da jornada. Tempo é a mediana entre quem concluiu; passos são os contáveis pelos dados (respostas dadas, tentativas usadas).",
    colunas: {
      tarefa: "Tarefa",
      conclusao: "Conclusão",
      tempo: "Tempo até o sucesso",
      passos: "Passos",
    },
    de: "de",
    horas: "h",
    minutos: "min",
    semDado: "sem dado ainda",
    mesmoDia: "no mesmo dia",
    naoSeAplica: "não se aplica",
    aproximada: "aproximação: o carimbo exato ainda não existe no dado",
  },

  dedicacao: {
    titulo: "Dedicação por dia",
    subtitulo: "Minutos de estudo de todo mundo, últimos 14 dias.",
    resumoVazio: "Nenhuma sessão registrada no período.",
    legenda: "{sessoes} sessões, {minutos} minutos no total",
  },

  pessoas: {
    titulo: "Quem está aqui, e como está",
    subtitulo:
      "Ordem de último acesso. O status junta acesso, posição na jornada e sinais de frustração; as razões estão por extenso.",
    colunas: {
      pessoa: "Pessoa",
      casa: "Tempo de casa",
      ultimo: "Último acesso",
      jornada: "Jornada",
      engajamento: "Últimos 7 dias",
      status: "Status e razões",
    },
    dias: { singular: "dia", plural: "dias" },
    hoje: "hoje",
    ontem: "ontem",
    haDias: "há {dias} dias",
    status: {
      ativo: "Ativo",
      risco: "Pode dar churn",
      inativo: "Inativo",
    },
    semRazao: "Em dia: entrou há pouco e tem sessão recente.",
    semProfissao: "sem profissão",
    nivel: "Nível",
    competencias: "competências",
    sessao: { singular: "sessão", plural: "sessões" },
    sequencia: "sequência de {dias} d",
    ranking: "no ranking",
    etapas: {
      novo: "começando",
      autopercepcao: "autoavaliação",
      teste: "no teste",
      resultado: "viu o resultado",
      trilha: "na trilha",
    } as Record<string, string>,
    vazio: {
      titulo: "Ninguém entrou ainda",
      texto: "Quando a primeira pessoa fizer login com o Google, ela aparece aqui.",
    },
  },
} as const
