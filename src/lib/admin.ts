import type { UsuarioComDados } from "./banco"
import type { Jornada, SessaoDeEstudo } from "./types"

/**
 * As contas do painel /admin, num lugar só, como manda a regra da casa pra
 * conta derivada (a mesma de `jornada.ts`).
 *
 * O painel segue o HEART (Happiness, Engagement, Adoption, Retention, Task
 * success) com uma honestidade: só medimos o que os dados de hoje sustentam.
 * Não existe evento de clique nem pesquisa de satisfação, então:
 *
 * - Happiness é PROXY (opt-in de ranking e consentimento de case): dizer que
 *   isso é satisfação medida seria mentira, e o painel declara.
 * - Task success usa os carimbos de tempo que existem (cadastro, criação da
 *   jornada, data do resultado, sessões, evidências). Onde o instante exato
 *   não existe, a conta diz que é aproximação.
 *
 * As TAREFAS-CHAVE vêm do documento de requisitos, na ordem da jornada:
 * escolher a profissão (CAR-04), concluir o nivelamento (DIA-07), aprovar a
 * primeira validação (APR-05, a única coisa que sobe nível pela RB-02),
 * enviar a primeira evidência (PRA-03) e entrar no ranking (RNK-05).
 */

// --- vocabulário -----------------------------------------------------------

export type StatusDePessoa = "ativo" | "risco" | "inativo"

export type PessoaNoPainel = {
  id: string
  nome: string
  email: string
  foto: string | null
  criadoEm: string
  ultimoAcesso: string
  diasDeCasa: number
  diasSemEntrar: number
  status: StatusDePessoa
  /** As razões que sustentam o status, em palavras. Vazia pra quem está bem. */
  razoes: string[]
  profissaoId: string | null
  etapa: string
  nivel: number | null
  competenciasConcluidas: number
  sessoes7d: number
  minutos7d: number
  sequencia: number
  evidencias: number
  cases: number
  participaRanking: boolean
}

export type TarefaChave = {
  codigo: string
  nome: string
  /** Quantas pessoas concluíram, entre as que chegaram a tentar. */
  concluiram: number
  tentaram: number
  /** Mediana de horas até o sucesso, ou null sem amostra. */
  horasMedianas: number | null
  /** Mediana de passos dados, ou null quando a tarefa não tem passo contável. */
  passosMedianos: number | null
  aproximada: boolean
}

export type Painel = {
  pessoas: PessoaNoPainel[]
  tarefas: TarefaChave[]
  heart: {
    happiness: { optInRanking: number; consentimentoCase: number; total: number }
    engagement: { sessoes7d: number; minutos7d: number; mediaMinutosPorAtivo: number }
    adoption: { total: number; novos7d: number; escolheramProfissao: number; concluiramNivelamento: number }
    retention: { ativos: number; emRisco: number; inativos: number }
    taskSuccess: { conclusaoNivelamento: number | null }
  }
  /** Minutos de estudo por dia, últimos 14 dias, pro gráfico. */
  porDia: Array<{ dia: string; minutos: number; sessoes: number }>
}

// --- ferramentas de tempo --------------------------------------------------

const DIA_MS = 24 * 60 * 60 * 1000

function dias(deISO: string, ate: Date): number {
  return Math.max(0, Math.floor((ate.getTime() - new Date(deISO).getTime()) / DIA_MS))
}

function horasEntre(inicioISO: string, fimISO: string): number | null {
  // Carimbo só de dia (os resultados antigos guardaram "AAAA-MM-DD"): a
  // precisão possível é o dia. Mesmo dia conta como zero horas, e o painel
  // mostra "no mesmo dia" em vez de inventar minutos.
  if (fimISO.length === 10) {
    const diasDeDiferenca = Math.round(
      (new Date(fimISO + "T12:00:00Z").getTime() - new Date(inicioISO.slice(0, 10) + "T12:00:00Z").getTime()) / DIA_MS
    )
    return diasDeDiferenca < 0 ? null : diasDeDiferenca * 24
  }
  const inicio = new Date(inicioISO).getTime()
  const fim = new Date(fimISO).getTime()
  if (!Number.isFinite(inicio) || !Number.isFinite(fim) || fim < inicio) return null
  return (fim - inicio) / (60 * 60 * 1000)
}

function mediana(valores: number[]): number | null {
  if (valores.length === 0) return null
  const ordem = [...valores].sort((a, b) => a - b)
  const meio = Math.floor(ordem.length / 2)
  return ordem.length % 2 ? ordem[meio] : (ordem[meio - 1] + ordem[meio]) / 2
}

function sessoesNoPeriodo(sessoes: SessaoDeEstudo[], ate: Date, diasAtras: number) {
  const corte = ate.getTime() - diasAtras * DIA_MS
  return sessoes.filter((s) => new Date(s.criadoEm).getTime() >= corte)
}

/** Dias seguidos com sessão, contando de ontem/hoje pra trás. */
function sequenciaDeDias(sessoes: SessaoDeEstudo[], ate: Date): number {
  const diasComSessao = new Set(sessoes.map((s) => s.data))
  let conta = 0
  for (let i = 0; i < 365; i++) {
    const dia = new Date(ate.getTime() - i * DIA_MS)
    const chave = `${dia.getFullYear()}-${String(dia.getMonth() + 1).padStart(2, "0")}-${String(dia.getDate()).padStart(2, "0")}`
    if (diasComSessao.has(chave)) conta++
    else if (i > 0) break
  }
  return conta
}

// --- o estado de cada pessoa ----------------------------------------------

function razoesDeRisco(u: UsuarioComDados, jornada: Jornada | null, agora: Date): string[] {
  const razoes: string[] = []
  const sumida = dias(u.ultimoAcesso, agora)

  if (sumida >= 3) razoes.push(`sem entrar há ${sumida} dias`)
  if (!jornada || !jornada.profissaoId) {
    razoes.push("não escolheu profissão: nada prende ela ao produto ainda")
    return razoes
  }
  if (jornada.etapa === "autopercepcao") razoes.push("parou na autoavaliação do nivelamento")
  if (jornada.etapa === "teste")
    razoes.push(`parou no teste, na pergunta ${jornada.questaoAtual + 1}`)
  if (jornada.etapa === "resultado") razoes.push("viu o resultado e não começou a trilha")

  const reprovadas = Object.values(jornada.avaliacoes ?? {}).filter(
    (a) => !a.aprovado && a.tentativas >= 2
  ).length
  if (reprovadas > 0) razoes.push("reprovou a mesma validação 2 vezes: risco de frustração")

  const sessoes = u.dados.sessoes
  if (sessoes.length > 0) {
    const ultima = dias(sessoes[0].criadoEm, agora)
    if (ultima >= 3 && sumida < 3)
      razoes.push(`entra mas não estuda: última sessão há ${ultima} dias`)
  } else if (jornada.etapa === "trilha") {
    razoes.push("está na trilha e nunca registrou uma sessão de estudo")
  }
  return razoes
}

function statusDaPessoa(diasSemEntrar: number, razoes: string[]): StatusDePessoa {
  if (diasSemEntrar > 14) return "inativo"
  if (diasSemEntrar >= 3 || razoes.length > 0) return "risco"
  return "ativo"
}

// --- o painel inteiro ------------------------------------------------------

export function montarPainel(usuarios: UsuarioComDados[], agora: Date): Painel {
  const pessoas: PessoaNoPainel[] = usuarios.map((u) => {
    const jornada = u.dados.jornadas[0] ?? null
    const recentes = sessoesNoPeriodo(u.dados.sessoes, agora, 7)
    const razoes = razoesDeRisco(u, jornada, agora)
    const diasSemEntrar = dias(u.ultimoAcesso, agora)
    return {
      id: u.id,
      nome: u.nome,
      email: u.email,
      foto: u.foto,
      criadoEm: u.criadoEm,
      ultimoAcesso: u.ultimoAcesso,
      diasDeCasa: dias(u.criadoEm, agora),
      diasSemEntrar,
      status: statusDaPessoa(diasSemEntrar, razoes),
      razoes,
      profissaoId: jornada?.profissaoId ?? null,
      etapa: jornada?.etapa ?? "novo",
      nivel: jornada?.resultado?.nivel ?? null,
      competenciasConcluidas: jornada?.competenciasConcluidas.length ?? 0,
      sessoes7d: recentes.length,
      minutos7d: recentes.reduce((total, s) => total + s.minutos, 0),
      sequencia: sequenciaDeDias(u.dados.sessoes, agora),
      evidencias: u.dados.evidencias.length,
      cases: u.dados.evidencias.filter((e) => e.estado === "case").length,
      participaRanking: jornada?.publico.participaRanking ?? false,
    }
  })

  // As cinco tarefas-chave do documento, com tempo e passos por pessoa.
  const tEscolher: number[] = []
  const tNivelar: number[] = []
  const pNivelar: number[] = []
  const tValidar: number[] = []
  const pValidar: number[] = []
  const tEvidencia: number[] = []
  let escolheram = 0
  let nivelaram = 0
  let validaram = 0
  let evidenciaram = 0
  let ranquearam = 0

  for (const u of usuarios) {
    const jornada = u.dados.jornadas[0] ?? null
    if (!jornada) continue
    if (jornada.profissaoId) {
      escolheram++
      const h = horasEntre(u.criadoEm, jornada.criadoEm)
      if (h !== null) tEscolher.push(h)
    }
    if (jornada.resultado) {
      nivelaram++
      const h = horasEntre(jornada.criadoEm, jornada.resultado.data)
      if (h !== null) tNivelar.push(h)
      pNivelar.push(
        Object.keys(jornada.autopercepcao).length + Object.keys(jornada.respostasDoTeste).length
      )
    }
    const avaliacoes = Object.values(jornada.avaliacoes ?? {})
    const aprovou = avaliacoes.some((a) => a.aprovado)
    if (avaliacoes.length > 0 && jornada.resultado) {
      if (aprovou) {
        validaram++
        // Aproximação declarada: a primeira sessão de avaliação depois do
        // resultado é o melhor carimbo que existe hoje pro momento da aprovação.
        const primeira = [...u.dados.sessoes]
          .filter((s) => s.tipo === "avaliacao")
          .sort((a, b) => a.criadoEm.localeCompare(b.criadoEm))[0]
        if (primeira) {
          const h = horasEntre(jornada.resultado.data, primeira.criadoEm)
          if (h !== null) tValidar.push(h)
        }
        pValidar.push(avaliacoes.reduce((total, a) => total + a.tentativas, 0))
      }
    }
    const enviadas = u.dados.evidencias
      .filter((e) => e.estado !== "rascunho")
      .sort((a, b) => a.criadoEm.localeCompare(b.criadoEm))
    if (enviadas.length > 0) {
      evidenciaram++
      const marco = jornada.resultado?.data ?? jornada.criadoEm
      const h = horasEntre(marco, enviadas[0].criadoEm)
      if (h !== null) tEvidencia.push(h)
    }
    if (jornada.publico.participaRanking) ranquearam++
  }

  const total = usuarios.length
  const tarefas: TarefaChave[] = [
    { codigo: "CAR-04", nome: "Escolher a profissão", concluiram: escolheram, tentaram: total, horasMedianas: mediana(tEscolher), passosMedianos: null, aproximada: false },
    { codigo: "DIA-07", nome: "Concluir o nivelamento", concluiram: nivelaram, tentaram: escolheram, horasMedianas: mediana(tNivelar), passosMedianos: mediana(pNivelar), aproximada: false },
    { codigo: "APR-05", nome: "Aprovar a primeira validação", concluiram: validaram, tentaram: nivelaram, horasMedianas: mediana(tValidar), passosMedianos: mediana(pValidar), aproximada: true },
    { codigo: "PRA-03", nome: "Enviar a primeira evidência", concluiram: evidenciaram, tentaram: nivelaram, horasMedianas: mediana(tEvidencia), passosMedianos: null, aproximada: false },
    { codigo: "RNK-05", nome: "Entrar no ranking (opt-in)", concluiram: ranquearam, tentaram: nivelaram, horasMedianas: null, passosMedianos: null, aproximada: false },
  ]

  const ativos = pessoas.filter((p) => p.status === "ativo").length
  const emRisco = pessoas.filter((p) => p.status === "risco").length
  const inativos = pessoas.filter((p) => p.status === "inativo").length
  const sessoes7d = pessoas.reduce((soma, p) => soma + p.sessoes7d, 0)
  const minutos7d = pessoas.reduce((soma, p) => soma + p.minutos7d, 0)
  const comConsentimento = usuarios.filter((u) =>
    u.dados.evidencias.some((e) => e.consentimentoCase)
  ).length

  // Os últimos 14 dias, do mais antigo pro mais novo, pro gráfico de dedicação.
  const porDia: Painel["porDia"] = []
  for (let i = 13; i >= 0; i--) {
    const dia = new Date(agora.getTime() - i * DIA_MS)
    const chave = `${dia.getFullYear()}-${String(dia.getMonth() + 1).padStart(2, "0")}-${String(dia.getDate()).padStart(2, "0")}`
    let minutos = 0
    let quantas = 0
    for (const u of usuarios) {
      for (const s of u.dados.sessoes) {
        if (s.data === chave) {
          minutos += s.minutos
          quantas++
        }
      }
    }
    porDia.push({ dia: chave, minutos, sessoes: quantas })
  }

  return {
    pessoas,
    tarefas,
    heart: {
      happiness: { optInRanking: ranquearam, consentimentoCase: comConsentimento, total },
      engagement: {
        sessoes7d,
        minutos7d,
        mediaMinutosPorAtivo: ativos > 0 ? Math.round(minutos7d / ativos) : 0,
      },
      adoption: {
        total,
        novos7d: pessoas.filter((p) => p.diasDeCasa <= 7).length,
        escolheramProfissao: escolheram,
        concluiramNivelamento: nivelaram,
      },
      retention: { ativos, emRisco, inativos },
      taskSuccess: {
        conclusaoNivelamento: escolheram > 0 ? Math.round((nivelaram / escolheram) * 100) : null,
      },
    },
    porDia,
  }
}
