import type { Autopercepcao, EstadoNo, EtapaDaJornada } from "./types"

/**
 * O vocabulário do modelo, num lugar só.
 *
 * Nenhum componente escreve "em-andamento" ou "domino" na mão. Quando um estado
 * novo aparecer (ou um sumir), um nome solto dentro de um filtro não daria erro
 * nenhum: o app só passaria a contar errado, calado. Aqui ele dá erro de tipo
 * na hora.
 */

/** As coleções que o app guarda. A ordem é a ordem em que elas aparecem. */
export const COLECOES = ["jornadas", "evidencias", "sessoes"] as const
export type NomeDeColecao = (typeof COLECOES)[number]

/** As etapas macro da jornada (ONB-03). Lista aberta: uma nova entra aqui. */
export const ETAPAS_DA_JORNADA: EtapaDaJornada[] = [
  "novo",
  "autopercepcao",
  "teste",
  "resultado",
  "trilha",
]

/** Os três degraus da autodeclaração (DIA-02). */
export const AUTOPERCEPCOES: Autopercepcao[] = ["nunca-vi", "conheco", "domino"]

/** Os estados possíveis de um nó do mapa (MAP-04). */
export const ESTADOS_DE_NO: EstadoNo[] = [
  "nao-iniciado",
  "disponivel",
  "em-andamento",
  "aguardando-validacao",
  "concluido",
  "bloqueado",
]

/** Quantos acertos aprovam a validação de um módulo (APR-05). */
export const NOTA_DE_CORTE = 0.75

/**
 * A regra de desbloqueio de nível (MAP-05): um nível abre quando as
 * competências OBRIGATÓRIAS do anterior estão concluídas. A recomendada
 * orienta sem bloquear (RB-05).
 */
export function nivelDesbloqueado(
  nivel: number,
  competencias: Array<{ nivel: number; obrigatoria: boolean; id: string }>,
  concluidas: string[]
) {
  if (nivel <= 1) return true
  const obrigatoriasDoAnterior = competencias.filter(
    (competencia) => competencia.nivel === nivel - 1 && competencia.obrigatoria
  )
  return obrigatoriasDoAnterior.every((competencia) => concluidas.includes(competencia.id))
}

/**
 * A pontuação do ranking, transparente de propósito (RNK-02 e RNK-03).
 *
 * Ela premia constância, domínio validado e prática, e não horas conectadas:
 * hora de estudo pesa pouco de propósito, e clique não conta em nada.
 */
export const PESOS_DO_SCORE = {
  competenciaConcluida: 220,
  avaliacaoAprovada: 120,
  caseAprovado: 320,
  diaDeSequencia: 35,
  horaDeEstudo: 12,
} as const

export function calcularScore(entrada: {
  competencias: number
  avaliacoes: number
  cases: number
  sequenciaDias: number
  horas: number
}) {
  return Math.round(
    entrada.competencias * PESOS_DO_SCORE.competenciaConcluida +
      entrada.avaliacoes * PESOS_DO_SCORE.avaliacaoAprovada +
      entrada.cases * PESOS_DO_SCORE.caseAprovado +
      entrada.sequenciaDias * PESOS_DO_SCORE.diaDeSequencia +
      entrada.horas * PESOS_DO_SCORE.horaDeEstudo
  )
}
