"use client"

import { useCallback, useSyncExternalStore } from "react"
import { SEED } from "./seed"
import type { Dados, Evidencia, Jornada, Sessao, SessaoDeEstudo } from "./types"
import { novoId as gerarId } from "./ids"

/**
 * A ÚNICA porta de dados do app. Nenhuma tela lê ou grava por fora daqui.
 *
 * Ela tem dois lados, e escolhe sozinha qual usar:
 *
 *   NAVEGADOR, o padrão. Sem configurar nada, tudo mora no localStorage. É o
 *   que faz `npm install && npm run dev` bastar: sem banco, sem conta em
 *   serviço nenhum, sem variável de ambiente.
 *
 *   BANCO. Quando a `DATABASE_URL` do Neon está no `.env.local`, a mesma porta
 *   passa a falar com o Postgres pela rota `/api/dados`. Os dados sobrevivem a
 *   trocar de computador e ficam iguais em todo lugar que abrir o app.
 *
 * Quem decide é o servidor, não um interruptor no código: na primeira carga o
 * app pergunta pra `/api/dados` se tem banco ligado e segue por ali. Ligar o
 * banco é colar uma linha no `.env.local`, e mais nada.
 *
 * O QUE AS TELAS VEEM disso tudo: nada. `useDados()` devolve os mesmos dados e
 * as mesmas funções nos dois modos. É por isso que a regra de nunca ler ou
 * gravar fora deste arquivo vale tanto: ela é o que transforma "ligar o banco"
 * numa linha de configuração em vez de uma reforma em vinte telas.
 *
 * O QUE MORA AQUI é o estado do usuário: a jornada, as evidências e as sessões
 * de estudo. O catálogo de profissões é conteúdo e mora em `catalogo.ts`.
 */

const CHAVE_DADOS = "colo-o-conteudo-que-preciso:dados:v2"
const CHAVE_SESSAO = "colo-o-conteudo-que-preciso:sessao:v1"

const VAZIO: Dados = { jornadas: [], evidencias: [], sessoes: [] }

type Modo = "descobrindo" | "navegador" | "banco"

/** O que as telas recebem. Um objeto só, com identidade estável. */
export type EstadoDosDados = { dados: Dados; carregando: boolean }

// --- núcleo reativo -------------------------------------------------------

type Ouvinte = () => void
const ouvintes = new Set<Ouvinte>()

let modo: Modo = "descobrindo"

/**
 * O instantâneo atual. `useSyncExternalStore` compara por identidade, então
 * este objeto só pode ser trocado quando alguma coisa realmente mudou: montar
 * um novo a cada leitura faria o React re-renderizar em laço infinito.
 */
let instantaneo: EstadoDosDados = { dados: VAZIO, carregando: true }

/** Resposta do servidor durante a renderização. Constante, pelo mesmo motivo. */
const NO_SERVIDOR: EstadoDosDados = { dados: VAZIO, carregando: true }

function publicar(dados: Dados, carregando = false) {
  instantaneo = { dados, carregando }
  for (const o of ouvintes) o()
}

function lerInstantaneo(): EstadoDosDados {
  return instantaneo
}

// --- lado do navegador ----------------------------------------------------

function lerDoNavegador(): Dados {
  try {
    const bruto = window.localStorage.getItem(CHAVE_DADOS)
    if (!bruto) return SEED
    const salvo = JSON.parse(bruto) as Partial<Dados>
    // Tolerante a dados antigos ou corrompidos: cada coleção cai no seed.
    return {
      jornadas: Array.isArray(salvo.jornadas) ? salvo.jornadas : SEED.jornadas,
      evidencias: Array.isArray(salvo.evidencias) ? salvo.evidencias : SEED.evidencias,
      sessoes: Array.isArray(salvo.sessoes) ? salvo.sessoes : SEED.sessoes,
    }
  } catch {
    return SEED
  }
}

function gravarNoNavegador(dados: Dados) {
  try {
    window.localStorage.setItem(CHAVE_DADOS, JSON.stringify(dados))
  } catch {
    // Cota estourada ou modo privado: seguimos com o estado em memória.
  }
}

// --- lado do banco --------------------------------------------------------

async function pedir(metodo: string, corpo: unknown) {
  const resposta = await fetch("/api/dados", {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  })
  if (!resposta.ok) throw new Error(`/api/dados respondeu ${resposta.status}`)
}

/**
 * Manda a mudança pro banco depois de a tela já ter mudado.
 *
 * A tela não espera a rede: quem concluiu uma tarefa vê o progresso na hora.
 * Se o banco recusar, a gente recarrega de lá e a tela volta pra verdade,
 * em vez de ficar mostrando uma mudança que não aconteceu.
 */
function enviar(metodo: string, corpo: unknown) {
  pedir(metodo, corpo).catch((erro) => {
    console.error("[dados] gravação falhou, recarregando do banco", erro)
    void recarregarDoBanco()
  })
}

async function recarregarDoBanco() {
  try {
    const resposta = await fetch("/api/dados", { cache: "no-store" })
    const corpo = (await resposta.json()) as { ligado: boolean; dados: Dados | null }
    if (corpo.ligado && corpo.dados) publicar(corpo.dados)
    // 401 no meio do uso: a sessão do servidor expirou. Derruba a local pra
    // casca mandar entrar de novo, em vez de deixar a pessoa gravando no vazio.
    if (resposta.status === 401) gravarSessaoLocal(null)
  } catch (erro) {
    console.error("[dados] leitura falhou", erro)
  }
}

// --- descoberta do modo ---------------------------------------------------

let descoberta: Promise<void> | null = null

/**
 * Pergunta uma vez, no primeiro componente que monta, se existe banco ligado.
 *
 * Enquanto a resposta não chega, `carregando` fica ligado e a casca do app
 * mostra o esqueleto. É de propósito: mostrar os dados de exemplo primeiro e
 * trocar depois pelos de verdade seria piscar conteúdo falso na cara de quem
 * está usando.
 */
function descobrirModo() {
  if (descoberta) return descoberta

  descoberta = (async () => {
    try {
      const resposta = await fetch("/api/dados", { cache: "no-store" })
      const corpo = (await resposta.json()) as {
        ligado: boolean
        autenticado?: boolean
        dados: Dados | null
      }
      if (corpo.ligado) {
        // Banco ligado é banco, mesmo quando ele não entregou nada: sem sessão
        // (a casca vai mandar entrar) ou banco fora do ar. Cair pro navegador
        // aqui mostraria os dados de exemplo pra quem está logado, que é a
        // mentira que este app não conta. Quem chegou agora recebe o vazio, e
        // o vazio é o começo da jornada (ONB-03).
        modo = "banco"
        publicar(corpo.dados ?? VAZIO)
        return
      }
    } catch {
      // Rota fora do ar ou resposta estranha: o navegador dá conta sozinho.
    }
    modo = "navegador"
    publicar(lerDoNavegador())
  })()

  return descoberta
}

function inscrever(o: Ouvinte) {
  ouvintes.add(o)
  void descobrirModo()
  return () => {
    ouvintes.delete(o)
  }
}

/**
 * Aplica a mudança nos dois lados: primeiro na tela, depois onde ela mora.
 *
 * Cada operação escreve as duas versões da mesma intenção, lado a lado, porque
 * a alternativa (traduzir uma na outra) é onde os dois lados começam a
 * divergir sem ninguém perceber.
 */
function aplicar(proximo: (atual: Dados) => Dados, remoto: () => void) {
  const dados = proximo(instantaneo.dados)
  publicar(dados)
  if (modo === "banco") remoto()
  else gravarNoNavegador(dados)
}

export function novoId(prefixo: string) {
  return gerarId(prefixo)
}

/** O dia local de hoje, AAAA-MM-DD, montado por componente pra não cair de fuso. */
function hojeISO() {
  const agora = new Date()
  const dois = (n: number) => String(n).padStart(2, "0")
  return `${agora.getFullYear()}-${dois(agora.getMonth() + 1)}-${dois(agora.getDate())}`
}

/** A jornada em branco de quem acabou de escolher (ou ainda não escolheu). */
export function jornadaEmBranco(profissaoId: string | null): Jornada {
  return {
    id: gerarId("jor"),
    profissaoId,
    etapa: profissaoId ? "autopercepcao" : "novo",
    autopercepcao: {},
    respostasDoTeste: {},
    questaoAtual: 0,
    resultado: null,
    competenciasConcluidas: [],
    conteudosVistos: [],
    tarefasFeitas: [],
    avaliacoes: {},
    retomada: null,
    publico: {
      participaRanking: false,
      nomePublico: "",
      mostrarEvidencias: false,
      disponibilidade: "",
    },
    criadoEm: new Date().toISOString(),
  }
}

// --- hook público ---------------------------------------------------------

export function useDados() {
  const { dados, carregando } = useSyncExternalStore(
    inscrever,
    lerInstantaneo,
    () => NO_SERVIDOR
  )

  /** A jornada ativa. Nula é o estado de quem acabou de chegar (ONB-03). */
  const jornada = dados.jornadas[0] ?? null

  /**
   * Atualiza a jornada ativa com um pedaço novo, criando ela se não existir.
   *
   * Toda tela grava por aqui: é o que faz sair no meio do diagnóstico e voltar
   * amanhã sem repetir trabalho válido (ONB-04).
   */
  const atualizarJornada = useCallback((patch: Partial<Jornada>) => {
    const atual = instantaneo.dados.jornadas[0]
    if (atual) {
      aplicar(
        (d) => ({
          ...d,
          jornadas: d.jornadas.map((j) => (j.id === atual.id ? { ...j, ...patch } : j)),
        }),
        () => enviar("PATCH", { colecao: "jornadas", id: atual.id, patch })
      )
      return
    }

    const nova: Jornada = { ...jornadaEmBranco(null), ...patch }
    aplicar(
      (d) => ({ ...d, jornadas: [nova] }),
      () => enviar("POST", { colecao: "jornadas", item: nova })
    )
  }, [])

  /**
   * Troca de profissão sem apagar nada (CAR-05 e RB-07): evidências e sessões
   * ficam, e o que se zera é só a posição do diagnóstico na profissão nova.
   */
  const trocarProfissao = useCallback((profissaoId: string) => {
    const atual = instantaneo.dados.jornadas[0]
    const patch: Partial<Jornada> = {
      profissaoId,
      etapa: "autopercepcao" as const,
      autopercepcao: {},
      respostasDoTeste: {},
      questaoAtual: 0,
      resultado: null,
      retomada: null,
    }
    if (atual) {
      aplicar(
        (d) => ({
          ...d,
          jornadas: d.jornadas.map((j) => (j.id === atual.id ? { ...j, ...patch } : j)),
        }),
        () => enviar("PATCH", { colecao: "jornadas", id: atual.id, patch })
      )
      return
    }
    const nova: Jornada = { ...jornadaEmBranco(profissaoId) }
    aplicar(
      (d) => ({ ...d, jornadas: [nova] }),
      () => enviar("POST", { colecao: "jornadas", item: nova })
    )
  }, [])

  const criarEvidencia = useCallback((e: Omit<Evidencia, "id" | "criadoEm">) => {
    const nova: Evidencia = { ...e, id: gerarId("evi"), criadoEm: new Date().toISOString() }
    aplicar(
      (d) => ({ ...d, evidencias: [nova, ...d.evidencias] }),
      () => enviar("POST", { colecao: "evidencias", item: nova })
    )
    return nova
  }, [])

  const atualizarEvidencia = useCallback((id: string, patch: Partial<Evidencia>) => {
    aplicar(
      (d) => ({
        ...d,
        evidencias: d.evidencias.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      }),
      () => enviar("PATCH", { colecao: "evidencias", id, patch })
    )
  }, [])

  const removerEvidencia = useCallback((id: string) => {
    aplicar(
      (d) => ({ ...d, evidencias: d.evidencias.filter((e) => e.id !== id) }),
      () => enviar("DELETE", { colecao: "evidencias", id })
    )
  }, [])

  /**
   * Registra um bloco de tempo ativo (PRO-02). Quem chama são as ações que
   * comprovam atividade (concluir vídeo, enviar avaliação, enviar evidência),
   * nunca um relógio rodando sozinho: tempo de aba aberta não é dedicação.
   */
  const registrarSessao = useCallback((tipo: SessaoDeEstudo["tipo"], minutos: number) => {
    const nova: SessaoDeEstudo = {
      id: gerarId("ses"),
      tipo,
      minutos,
      data: hojeISO(),
      criadoEm: new Date().toISOString(),
    }
    aplicar(
      (d) => ({ ...d, sessoes: [nova, ...d.sessoes] }),
      () => enviar("POST", { colecao: "sessoes", item: nova })
    )
  }, [])

  const trocarTudo = useCallback((novos: Dados) => {
    aplicar(
      () => novos,
      () => enviar("PUT", { dados: novos })
    )
  }, [])

  const restaurarExemplos = useCallback(() => trocarTudo(SEED), [trocarTudo])
  const limparTudo = useCallback(() => trocarTudo(VAZIO), [trocarTudo])

  return {
    dados,
    jornada,
    /** Ligado até saber onde os dados moram. A casca do app espera nele. */
    carregando,
    atualizarJornada,
    trocarProfissao,
    criarEvidencia,
    atualizarEvidencia,
    removerEvidencia,
    registrarSessao,
    restaurarExemplos,
    limparTudo,
  }
}

// --- sessão ---------------------------------------------------------------

/**
 * A sessão também tem dois lados, pelo mesmo motivo dos dados.
 *
 * SEM GOOGLE CONFIGURADO, o `entrar()` aqui embaixo só guarda um nome no
 * navegador. Isso NÃO é autenticação: não protege nada, e some quando a pessoa
 * limpa os dados do site. É simulação, pras telas terem estado de logado.
 *
 * COM GOOGLE CONFIGURADO (as duas chaves e o AUTH_SECRET no `.env.local`), quem
 * manda é o cookie assinado que o servidor gravou depois do login de verdade.
 * Na primeira carga o app pergunta pro servidor quem está logado, e a resposta
 * ganha da simulação. Ver `src/lib/google.ts` e `src/lib/sessao-servidor.ts`.
 */

const ouvintesDaSessao = new Set<Ouvinte>()

/** Cache do valor cru do localStorage: o snapshot precisa de identidade estável. */
let sessaoCrua: string | null = null
let sessaoLida = false

/**
 * O que o servidor disse sobre login, numa identidade estável.
 *
 * `conferida` vira verdadeira quando a resposta chegou (ou falhou de vez). Até
 * lá a casca do app não decide nada: depois de voltar do Google, o cookie
 * existe mas o localStorage ainda está vazio, e expulsar a pessoa nesse
 * instante seria mandar embora quem acabou de entrar. `loginReal` diz se este
 * ambiente tem Google e segredo ligados, e com isso a entrada simulada deixa
 * de existir.
 */
export type EstadoDaSessao = { conferida: boolean; loginReal: boolean }
let estadoDaSessao: EstadoDaSessao = { conferida: false, loginReal: false }
const SESSAO_NO_SERVIDOR: EstadoDaSessao = { conferida: false, loginReal: false }

function avisarSessao() {
  for (const o of ouvintesDaSessao) o()
}

function gravarSessaoLocal(sessao: Sessao | null) {
  try {
    if (sessao) window.localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao))
    else window.localStorage.removeItem(CHAVE_SESSAO)
  } catch {
    // Modo privado: a sessão vale só enquanto a aba estiver aberta.
  }
  sessaoCrua = sessao ? JSON.stringify(sessao) : null
  sessaoLida = true
  avisarSessao()
}

let perguntaDeSessao: Promise<void> | null = null

/**
 * Pergunta uma vez ao servidor se tem sessão assinada.
 *
 * Se tiver, ela substitui o que estiver guardado no navegador: o login de
 * verdade ganha da simulação, sempre.
 *
 * Se NÃO tiver e o login real está ligado neste ambiente, a sessão local cai:
 * ela só podia ter vindo da entrada simulada, que não existe mais quando o
 * Google está configurado, ou de um cookie que expirou. Sem login real (o
 * `npm run dev` sem chaves), a sessão local fica, porque é ela que sustenta
 * o app pra quem está só testando as telas.
 */
function perguntarSessaoAoServidor() {
  if (perguntaDeSessao) return perguntaDeSessao

  perguntaDeSessao = (async () => {
    let loginReal = false
    try {
      const resposta = await fetch("/api/auth/sessao", { cache: "no-store" })
      const corpo = (await resposta.json()) as { ligado: boolean; sessao: Sessao | null }
      loginReal = corpo.ligado
      if (corpo.sessao) gravarSessaoLocal(corpo.sessao)
      else if (corpo.ligado) gravarSessaoLocal(null)
    } catch {
      // Sem resposta do servidor, fica valendo o que o navegador tem.
    }
    estadoDaSessao = { conferida: true, loginReal }
    avisarSessao()
  })()

  return perguntaDeSessao
}

export function lerSessao(): Sessao | null {
  if (typeof window === "undefined") return null
  try {
    const bruto = window.localStorage.getItem(CHAVE_SESSAO)
    return bruto ? (JSON.parse(bruto) as Sessao) : null
  } catch {
    return null
  }
}

/**
 * A entrada sem senha, que continua existindo enquanto o Google não estiver
 * ligado.
 *
 * Repare no que NÃO entra aqui: a senha. Ela é digitada na tela de entrar e
 * morre lá, no estado do componente. Não chega nesta função, não vai pro
 * localStorage e não sai do navegador. Guardar senha em texto puro no
 * armazenamento do navegador seria ensinar errado dentro de um projeto que
 * existe pra ensinar, e a autenticação de verdade é o login do Google, que já
 * está escrito e só espera as chaves.
 */
export function entrar(nome = "Visitante", email = "voce@exemplo.com"): Sessao {
  const s: Sessao = { nome, email, entrouEm: new Date().toISOString() }
  if (typeof window !== "undefined") gravarSessaoLocal(s)
  return s
}

export function sair() {
  if (typeof window === "undefined") return
  gravarSessaoLocal(null)
  // Os dados de quem saiu não podem sobrar na memória pra próxima pessoa que
  // entrar nesta aba. Volta ao estado de "ainda não sei", e a próxima montagem
  // da casca pergunta de novo ao servidor.
  if (modo === "banco") {
    descoberta = null
    modo = "descobrindo"
    publicar(VAZIO, true)
  }
  // O cookie do servidor precisa cair junto: sem isso, a próxima carga
  // perguntaria ao servidor, ele responderia a sessão antiga, e a pessoa
  // voltaria logada depois de clicar em sair.
  void fetch("/api/auth/sessao", { method: "DELETE" }).catch(() => {})
}

function inscreverSessao(o: Ouvinte) {
  ouvintesDaSessao.add(o)
  // Outra aba do mesmo app fez login ou logout.
  window.addEventListener("storage", avisarSessao)
  void perguntarSessaoAoServidor()
  return () => {
    ouvintesDaSessao.delete(o)
    window.removeEventListener("storage", avisarSessao)
  }
}

function lerSessaoCrua() {
  if (!sessaoLida) {
    try {
      sessaoCrua = window.localStorage.getItem(CHAVE_SESSAO)
    } catch {
      sessaoCrua = null
    }
    sessaoLida = true
  }
  return sessaoCrua
}

/** Lê a sessão só depois da hidratação, evitando divergência com o SSR. */
export function useSessao() {
  const sessao = useSyncExternalStore(inscreverSessao, lerSessaoCrua, () => null)

  try {
    return sessao ? (JSON.parse(sessao) as Sessao) : null
  } catch {
    return null
  }
}

/**
 * O que o servidor já disse sobre a sessão. A casca do app só decide entre
 * "mostra o app" e "manda entrar" depois que `conferida` ficar verdadeira.
 */
export function useEstadoDaSessao(): EstadoDaSessao {
  return useSyncExternalStore(
    inscreverSessao,
    () => estadoDaSessao,
    () => SESSAO_NO_SERVIDOR
  )
}
