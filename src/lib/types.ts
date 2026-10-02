/**
 * O modelo de dados do FlashProfession.
 *
 * Ele segue o documento de requisitos da plataforma de preparação de carreira,
 * e se divide em duas metades que não se misturam:
 *
 *   O CATÁLOGO é a estrutura de cada profissão: áreas, níveis, competências,
 *   habilidades, conteúdos, questões e desafios. Ele é conteúdo, não dado da
 *   pessoa, e mora em `src/lib/catalogo.ts` como constante. Hoje é material de
 *   demonstração, marcado como tal (regra RB-08 do documento).
 *
 *   O ESTADO DO USUÁRIO é o que a pessoa produz usando o app: a jornada (qual
 *   profissão, em que etapa, o que respondeu, o que concluiu), as evidências e
 *   as sessões de estudo. É isso que o store guarda e que um dia vai pro banco.
 *
 * A SESSÃO de login é a única coisa aqui que não é do assunto do app: ela
 * existe porque a tela de entrada e o botão de sair existem em qualquer produto.
 */

// --- vocabulário compartilhado ---------------------------------------------

/** O que a pessoa declara saber de um tópico, antes do teste (DIA-02). */
export type Autopercepcao = "nunca-vi" | "conheco" | "domino"

/** Os estados que um nó do mapa pode ter (MAP-04). */
export type EstadoNo =
  | "nao-iniciado"
  | "disponivel"
  | "em-andamento"
  | "aguardando-validacao"
  | "concluido"
  | "bloqueado"

/** De onde veio uma prova de domínio (regra RB-03: toda mudança tem fonte). */
export type OrigemEvidencia = "autodeclaracao" | "teste" | "tarefa" | "revisao-humana"

// --- catálogo: a árvore configurável por profissão -------------------------

export type Area = {
  id: string
  nome: string
  descricao: string
  icone: string
  /** Quantas profissões estão modeladas nela. Vem calculado no catálogo. */
}

export type Nivel = {
  /** De 1 a 5, sempre. A regra dos cinco níveis vale pra toda profissão. */
  ordem: number
  nome: string
  descricao: string
  criterios: string[]
}

export type Habilidade = {
  id: string
  nome: string
}

export type Competencia = {
  id: string
  /** A qual dos cinco níveis ela pertence. */
  nivel: number
  nome: string
  obrigatoria: boolean
  habilidades: Habilidade[]
  /** O que satisfaz ela (critério de domínio, em uma frase). */
  criterio: string
  esforco: string
}

export type Profissao = {
  id: string
  areaId: string
  nome: string
  resumo: string
  /** Conteúdo de demonstração até validação especializada (RB-08). */
  demo: boolean
  rotina: string[]
  responsabilidades: string[]
  entregas: string[]
  oportunidades: string
  esforco: string
  tipoTrabalho: string
  niveis: Nivel[]
  competencias: Competencia[]
}

/** Uma pergunta do nivelamento (DIA-03). */
export type Questao = {
  id: string
  habilidadeId: string
  formato: "multipla" | "cenario" | "curta"
  dificuldade: "iniciante" | "intermediaria" | "avancada"
  enunciado: string
  /** O cenário que contextualiza, quando o formato pede. */
  cenario?: string
  opcoes?: string[]
  /** Índice da certa. Ausente em resposta curta, que é avaliada depois. */
  certa?: number
  /** Por que esta pergunta existe: vai no painel lateral (DIA-04). */
  porque: string
}

/** Um vídeo curto de uma unidade de aprendizagem (APR-02). */
export type Conteudo = {
  id: string
  titulo: string
  duracaoMin: number
  objetivo: string
  resultadoEsperado: string
  transcricao: string
}

/** Uma tarefa acionável de unidade (APR-04). */
export type Tarefa = {
  id: string
  titulo: string
  oQueFazer: string
  oQueEntregar: string
  comoSaberQueFicouBom: string
}

export type QuestaoDeTema = {
  enunciado: string
  opcoes: string[]
  certa: number
  /** O que revisar quando erra: aponta o conteúdo exato (APR-05). */
  revisar: string
}

/** Uma unidade de aprendizagem: competência → conteúdo → tarefa → validação. */
export type Modulo = {
  id: string
  competenciaId: string
  nome: string
  objetivo: string
  conteudos: Conteudo[]
  tarefas: Tarefa[]
  avaliacao: QuestaoDeTema[]
  /** Variação da avaliação pra segunda tentativa (APR-05). */
  avaliacaoVariacao: QuestaoDeTema[]
}

/** Um desafio prático contextualizado (PRA-01). */
export type Desafio = {
  id: string
  competenciaId: string
  nome: string
  cenario: string
  objetivo: string
  restricoes: string[]
  entrega: string
  rubrica: Array<{ criterio: string; descricao: string }>
  etapas: string[]
  videoTitulo: string
  videoDuracaoMin: number
}

// --- estado do usuário ------------------------------------------------------

/** A etapa macro em que a pessoa está (ONB-03). */
export type EtapaDaJornada =
  | "novo"
  | "autopercepcao"
  | "teste"
  | "resultado"
  | "trilha"

export type ResultadoDiagnostico = {
  nivel: number
  /** Ex.: "alta" ou "média". Resultado sem confiança inventa precisão. */
  confianca: string
  /** Percentual de domínio por competência, de 0 a 100. */
  dominioPorCompetencia: Record<string, number>
  pontosFortes: string[]
  lacunasCriticas: string[]
  aproveitadas: string[]
  primeiroPasso: string
  data: string
}

/**
 * A jornada da pessoa: um registro só, vivo, que toda tela lê e atualiza.
 *
 * Ela guarda POSIÇÃO e RESPOSTA, nunca o catálogo: trocar o currículo de uma
 * profissão não pode apagar o que a pessoa já fez (regra RB-07).
 */
export type Jornada = {
  id: string
  profissaoId: string | null
  etapa: EtapaDaJornada
  /** hipótese declarada por habilidade. Ajusta o teste, não conclui (RB-01). */
  autopercepcao: Record<string, Autopercepcao>
  /** resposta dada por questão do nivelamento (índice da opção ou texto). */
  respostasDoTeste: Record<string, string>
  /** onde o teste parou, pra retomar sem repetir trabalho válido (ONB-04). */
  questaoAtual: number
  resultado: ResultadoDiagnostico | null
  /** ids de competência com critérios obrigatórios satisfeitos. */
  competenciasConcluidas: string[]
  conteudosVistos: string[]
  tarefasFeitas: string[]
  /** resultado da validação de cada módulo. */
  avaliacoes: Record<string, { acertos: number; total: number; aprovado: boolean; tentativas: number }>
  /** onde o aprendizado parou: o "Continuar" abre aqui (APR-07). */
  retomada: { moduloId: string; conteudoId: string } | null
  publico: {
    /** ranking e busca de recrutadores são opt-in (RNK-05). */
    participaRanking: boolean
    nomePublico: string
    mostrarEvidencias: boolean
    disponibilidade: string
  }
  criadoEm: string
}

/** Uma prova produzida num desafio (PRA-03) ou registrada de fora (APR-06). */
export type Evidencia = {
  id: string
  desafioId: string | null
  habilidade: string
  origem: OrigemEvidencia
  estado: "rascunho" | "enviada" | "avaliada" | "case"
  texto: string
  link: string
  /** Feedback por critério, quando avaliada (PRA-04). */
  feedback: Array<{ criterio: string; nota: string; comentario: string }> | null
  fonteFeedback: "automatico" | "pares" | "especialista" | null
  consentimentoCase: boolean
  criadoEm: string
}

/** Um bloco de tempo ativo de estudo (PRO-02). Alimenta horas e sequência. */
export type SessaoDeEstudo = {
  id: string
  tipo: "video" | "avaliacao" | "pratica"
  minutos: number
  /** Dia local, AAAA-MM-DD. */
  data: string
  criadoEm: string
}

export type Dados = {
  jornadas: Jornada[]
  evidencias: Evidencia[]
  sessoes: SessaoDeEstudo[]
}

/**
 * A sessão de LOGIN, que não é a sessão de estudo: esta é quem está logado, e
 * o nome fica sem sufixo porque é ela que a fiação de entrada e saída importa.
 */
export type Sessao = {
  nome: string
  email: string
  /** URL da foto da conta Google, se veio. Só endereço, nunca o arquivo. */
  foto?: string
  entrouEm: string
}
