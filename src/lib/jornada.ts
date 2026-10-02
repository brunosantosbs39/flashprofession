import {
  acharProfissao,
  desafiosDaProfissao,
  modulosDaProfissao,
  questoesDaProfissao,
} from "./catalogo"
import { NOTA_DE_CORTE, calcularScore, nivelDesbloqueado } from "./modelo"
import type {
  Competencia,
  Dados,
  EstadoNo,
  Jornada,
  Modulo,
  SessaoDeEstudo,
} from "./types"

/**
 * As contas derivadas da jornada, num lugar só.
 *
 * Toda tela mostra um pedaço destas respostas: quantas horas, qual sequência,
 * que estado cada nó tem, qual é a próxima ação. Se cada tela fizesse a própria
 * conta, dois números diferentes para a mesma pergunta seria questão de tempo,
 * e o requisito PRO-03 é justamente a pessoa entender por que um número mudou.
 */

// --- tempo e constância -----------------------------------------------------

/** Soma de minutos das sessões dos últimos `dias` dias, contando do último dia ativo. */
export function minutosNoPeriodo(sessoes: SessaoDeEstudo[], dias: number) {
  if (sessoes.length === 0) return 0
  const referencia = ultimaData(sessoes)
  const corte = somarDias(referencia, -(dias - 1))
  return sessoes
    .filter((sessao) => sessao.data >= corte)
    .reduce((total, sessao) => total + sessao.minutos, 0)
}

export function formatarHoras(minutos: number) {
  const horas = Math.floor(minutos / 60)
  const resto = minutos % 60
  if (horas === 0) return `${resto} min`
  if (resto === 0) return `${horas} h`
  return `${horas} h ${resto} min`
}

/**
 * A sequência de dias com atividade, contada a partir do dia mais recente.
 *
 * Ela é ancorada no último dia ativo, e não no relógio de hoje: dado de
 * demonstração não pode "quebrar a sequência" sozinho só porque o tempo passou.
 */
export function sequenciaDeDias(sessoes: SessaoDeEstudo[]) {
  if (sessoes.length === 0) return 0
  const dias = [...new Set(sessoes.map((sessao) => sessao.data))].sort().reverse()
  let sequencia = 1
  for (let i = 1; i < dias.length; i++) {
    if (dias[i] === somarDias(dias[i - 1], -1)) sequencia++
    else break
  }
  return sequencia
}

export function ultimaData(sessoes: SessaoDeEstudo[]) {
  return sessoes.map((sessao) => sessao.data).sort().reverse()[0] ?? ""
}

/** Minutos por dia dos últimos sete dias ativos, pro gráfico de dedicação. */
export function minutosPorDia(sessoes: SessaoDeEstudo[]): Array<{ data: string; minutos: number }> {
  if (sessoes.length === 0) return []
  const referencia = ultimaData(sessoes)
  const dias: Array<{ data: string; minutos: number }> = []
  for (let i = 6; i >= 0; i--) {
    const data = somarDias(referencia, -i)
    const minutos = sessoes
      .filter((sessao) => sessao.data === data)
      .reduce((total, sessao) => total + sessao.minutos, 0)
    dias.push({ data, minutos })
  }
  return dias
}

function somarDias(iso: string, dias: number) {
  const [ano, mes, dia] = iso.split("-").map(Number)
  const data = new Date(ano, mes - 1, dia)
  data.setDate(data.getDate() + dias)
  const dois = (n: number) => String(n).padStart(2, "0")
  return `${data.getFullYear()}-${dois(data.getMonth() + 1)}-${dois(data.getDate())}`
}

// --- domínio e progresso ----------------------------------------------------

/**
 * O domínio de uma competência, de 0 a 100, com a origem visível.
 *
 * Conclusão validada vale 100. Sem conclusão, vale o que o diagnóstico mediu.
 * Conteúdo assistido não entra na conta de propósito: é a regra RB-02, assistir
 * não comprova domínio.
 */
export function dominioDaCompetencia(competencia: Competencia, jornada: Jornada | null) {
  if (!jornada) return 0
  if (jornada.competenciasConcluidas.includes(competencia.id)) return 100
  return jornada.resultado?.dominioPorCompetencia[competencia.id] ?? 0
}

export function origemDoDominio(competencia: Competencia, jornada: Jornada | null): string {
  if (!jornada) return "sem evidência"
  if (jornada.competenciasConcluidas.includes(competencia.id)) return "validação concluída"
  if (jornada.resultado?.dominioPorCompetencia[competencia.id] !== undefined) return "teste de nivelamento"
  return "sem evidência"
}

/** Percentual de conclusão de um nível: competências concluídas sobre o total. */
export function percentualDoNivel(nivel: number, competencias: Competencia[], concluidas: string[]) {
  const doNivel = competencias.filter((competencia) => competencia.nivel === nivel)
  if (doNivel.length === 0) return 0
  const feitas = doNivel.filter((competencia) => concluidas.includes(competencia.id)).length
  return Math.round((feitas / doNivel.length) * 100)
}

/** O estado de um NÍVEL no mapa (MAP-04), derivado das competências dele. */
export function estadoDoNivel(nivel: number, jornada: Jornada | null, competencias: Competencia[]): EstadoNo {
  if (!jornada || !jornada.resultado) return nivel === 1 ? "disponivel" : "bloqueado"

  const concluidas = jornada.competenciasConcluidas
  const doNivel = competencias.filter((competencia) => competencia.nivel === nivel)
  const todasConcluidas =
    doNivel.length > 0 && doNivel.every((competencia) => concluidas.includes(competencia.id))

  if (todasConcluidas) return "concluido"
  if (!nivelDesbloqueado(nivel, competencias, concluidas)) return "bloqueado"
  if (nivel === jornada.resultado.nivel) return "em-andamento"
  if (doNivel.some((competencia) => concluidas.includes(competencia.id))) return "em-andamento"
  return "disponivel"
}

/** O estado de uma COMPETÊNCIA, olhando módulos, avaliações e conclusões. */
export function estadoDaCompetencia(
  competencia: Competencia,
  jornada: Jornada | null,
  modulos: Modulo[]
): EstadoNo {
  if (!jornada) return "nao-iniciado"
  if (jornada.competenciasConcluidas.includes(competencia.id)) return "concluido"

  const modulo = modulos.find((m) => m.competenciaId === competencia.id)
  if (modulo) {
    const avaliacao = jornada.avaliacoes[modulo.id]
    if (avaliacao && !avaliacao.aprovado) return "aguardando-validacao"
    const comecou =
      modulo.conteudos.some((conteudo) => jornada.conteudosVistos.includes(conteudo.id)) ||
      modulo.tarefas.some((tarefa) => jornada.tarefasFeitas.includes(tarefa.id))
    if (comecou) return "em-andamento"
  }

  return "nao-iniciado"
}

/** Progresso de um módulo de aprendizado, de 0 a 100, contando vídeo, tarefa e validação. */
export function progressoDoModulo(modulo: Modulo, jornada: Jornada | null) {
  if (!jornada) return 0
  const total = modulo.conteudos.length + modulo.tarefas.length + 1
  const vistos = modulo.conteudos.filter((c) => jornada.conteudosVistos.includes(c.id)).length
  const feitas = modulo.tarefas.filter((t) => jornada.tarefasFeitas.includes(t.id)).length
  const validado = jornada.avaliacoes[modulo.id]?.aprovado ? 1 : 0
  return Math.round(((vistos + feitas + validado) / total) * 100)
}

export function avaliacaoAprovada(acertos: number, total: number) {
  return total > 0 && acertos / total >= NOTA_DE_CORTE
}

// --- a próxima ação ---------------------------------------------------------

export type ProximaAcao = {
  rotulo: string
  descricao: string
  href: string
}

/**
 * A ÚNICA próxima ação recomendada (ONB-01 e MAP-06).
 *
 * A ordem das regras é a ordem da jornada: sem profissão → escolher; sem
 * diagnóstico → nivelar; com resultado → a lacuna prioritária; com módulo
 * começado → retomar exatamente onde parou (APR-07).
 */
export function proximaAcao(jornada: Jornada | null): ProximaAcao {
  if (!jornada || !jornada.profissaoId) {
    return {
      rotulo: "Escolher a sua profissão",
      descricao: "Explore as áreas, compare profissões e escolha o seu objetivo.",
      href: "/app/carreiras",
    }
  }

  if (jornada.etapa === "autopercepcao" || jornada.etapa === "novo") {
    return {
      rotulo: "Fazer o nivelamento",
      descricao: "Declare o que você já sabe e confirme no teste. Leva uns 15 minutos.",
      href: "/app/diagnostico",
    }
  }

  if (jornada.etapa === "teste") {
    return {
      rotulo: "Continuar o nivelamento",
      descricao: `Você parou na pergunta ${jornada.questaoAtual + 1}. Continue de onde estava.`,
      href: "/app/diagnostico",
    }
  }

  if (jornada.etapa === "resultado") {
    return {
      rotulo: "Ver o seu resultado",
      descricao: "O diagnóstico está pronto: veja seu nível, suas lacunas e o primeiro passo.",
      href: "/app/diagnostico",
    }
  }

  const modulos = modulosDaProfissao(jornada.profissaoId)

  // Um módulo reprovado na validação vem antes de tudo: revisar é a prioridade.
  const reprovado = modulos.find((modulo) => {
    const avaliacao = jornada.avaliacoes[modulo.id]
    return avaliacao && !avaliacao.aprovado
  })
  if (reprovado) {
    return {
      rotulo: `Revisar e revalidar: ${reprovado.nome}`,
      descricao: "A validação apontou o que revisar. Reveja e tente de novo com questões novas.",
      href: "/app/aprender",
    }
  }

  if (jornada.retomada) {
    const modulo = modulos.find((m) => m.id === jornada.retomada?.moduloId)
    const conteudo = modulo?.conteudos.find((c) => c.id === jornada.retomada?.conteudoId)
    if (modulo && conteudo) {
      return {
        rotulo: `Continuar: ${conteudo.titulo}`,
        descricao: `Você parou no módulo ${modulo.nome}. Continue de onde estava.`,
        href: "/app/aprender",
      }
    }
  }

  const pendente = modulos.find((modulo) => !jornada.avaliacoes[modulo.id]?.aprovado)
  if (pendente) {
    return {
      rotulo: `Estudar: ${pendente.nome}`,
      descricao: "É a próxima competência do seu caminho até o nível seguinte.",
      href: "/app/aprender",
    }
  }

  const desafios = desafiosDaProfissao(jornada.profissaoId)
  if (desafios.length > 0) {
    return {
      rotulo: `Praticar: ${desafios[0].nome}`,
      descricao: "Os módulos estão validados. Hora de provar em um desafio real.",
      href: "/app/praticar",
    }
  }

  return {
    rotulo: "Explorar o seu mapa",
    descricao: "Veja o caminho completo até o nível 5 e escolha por onde seguir.",
    href: "/app/mapa",
  }
}

// --- score e resultado ------------------------------------------------------

export function scoreDaPessoa(dados: Dados) {
  const jornada = dados.jornadas[0] ?? null
  const avaliacoesAprovadas = jornada
    ? Object.values(jornada.avaliacoes).filter((avaliacao) => avaliacao.aprovado).length
    : 0
  return calcularScore({
    competencias: jornada?.competenciasConcluidas.length ?? 0,
    avaliacoes: avaliacoesAprovadas,
    cases: dados.evidencias.filter((evidencia) => evidencia.estado === "case").length,
    sequenciaDias: sequenciaDeDias(dados.sessoes),
    horas: Math.floor(dados.sessoes.reduce((total, sessao) => total + sessao.minutos, 0) / 60),
  })
}

/**
 * Calcula o resultado do diagnóstico a partir das respostas dadas.
 *
 * A conta é simples e declarada: autodeclaração posiciona a hipótese, acertos
 * no teste confirmam ou derrubam. Quando a profissão ainda não tem banco de
 * questões, o resultado sai só da autodeclaração, com confiança BAIXA e dito
 * na tela: inventar precisão é pior que admitir o limite (seção 17 do
 * documento de requisitos).
 */
export function calcularResultado(jornada: Jornada) {
  const profissao = acharProfissao(jornada.profissaoId)
  if (!profissao) return null

  const questoes = questoesDaProfissao(profissao.id)
  const objetivas = questoes.filter((questao) => questao.certa !== undefined)
  const acertos = objetivas.filter(
    (questao) => jornada.respostasDoTeste[questao.id] === String(questao.certa)
  ).length
  const taxaDeAcerto = objetivas.length > 0 ? acertos / objetivas.length : 0

  const valorDeclarado = { "nunca-vi": 0, conheco: 45, domino: 80 } as const

  const dominioPorCompetencia: Record<string, number> = {}
  for (const competencia of profissao.competencias) {
    const declarados: number[] = competencia.habilidades.map(
      (habilidade) => valorDeclarado[jornada.autopercepcao[habilidade.id] ?? "nunca-vi"]
    )
    const media = declarados.length
      ? declarados.reduce((a, b) => a + b, 0) / declarados.length
      : 0
    // O teste puxa a hipótese pra cima ou pra baixo, sem nunca concluir sozinho.
    const ajuste = objetivas.length > 0 ? (taxaDeAcerto - 0.5) * 30 : 0
    dominioPorCompetencia[competencia.id] = Math.round(
      Math.max(0, Math.min(95, media + ajuste))
    )
  }

  // O nível é o mais alto cujas competências obrigatórias passam da metade.
  let nivel = 1
  for (let n = 1; n <= 5; n++) {
    const obrigatorias = profissao.competencias.filter(
      (competencia) => competencia.nivel === n && competencia.obrigatoria
    )
    if (obrigatorias.length === 0) break
    const media =
      obrigatorias.reduce((total, c) => total + dominioPorCompetencia[c.id], 0) /
      obrigatorias.length
    if (media >= 55) nivel = Math.min(5, n + 1)
    else break
  }

  const ordenadas = [...profissao.competencias].sort(
    (a, b) => dominioPorCompetencia[b.id] - dominioPorCompetencia[a.id]
  )
  const fortes = ordenadas.filter((c) => dominioPorCompetencia[c.id] >= 60).slice(0, 2)
  const lacunas = ordenadas
    .filter((c) => c.nivel <= nivel && dominioPorCompetencia[c.id] < 50)
    .slice(-2)
    .reverse()

  const primeiraLacuna = lacunas[0] ?? ordenadas[ordenadas.length - 1]

  return {
    nivel,
    confianca: objetivas.length > 0 ? "média" : "baixa",
    dominioPorCompetencia,
    pontosFortes: fortes.map((c) => c.nome),
    lacunasCriticas: lacunas.map((c) => c.nome),
    aproveitadas:
      taxaDeAcerto >= 0.5 && objetivas.length > 0
        ? ["Raciocínio de processo, confirmado no teste"]
        : [],
    primeiroPasso: primeiraLacuna
      ? `Comece por ${primeiraLacuna.nome}: é a lacuna que mais segura o seu avanço.`
      : "Comece pela primeira competência do seu nível no mapa.",
    // Instante completo, e não só o dia: é ele que deixa o painel /admin
    // medir "quanto tempo até concluir o nivelamento". Quem mostra o dia
    // (a linha do tempo do Progresso) corta os 10 primeiros caracteres.
    data: new Date().toISOString(),
  }
}
