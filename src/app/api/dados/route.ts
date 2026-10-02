import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  atualizar,
  bancoConfigurado,
  ehColecao,
  idDoUsuario,
  inserir,
  lerTudo,
  registrarUsuario,
  remover,
  substituirTudo,
} from "@/lib/banco"
import { COOKIE_SESSAO, lerCookieDeSessao } from "@/lib/sessao-servidor"
import type { Dados } from "@/lib/types"

/**
 * A porta do banco.
 *
 * Só o `store` fala com esta rota, e ele só fala quando o GET responde que o
 * banco está ligado. Enquanto não estiver, tudo isto responde `ligado: false` e
 * o app segue guardando no navegador, sem erro na tela e sem código apagado.
 *
 * COM O BANCO LIGADO, A ROTA PERGUNTA QUEM ESTÁ CHAMANDO. O dono de cada
 * registro é a sessão assinada do cookie (`src/lib/sessao-servidor.ts`), que o
 * navegador não consegue forjar. Sem sessão, nenhum verbo entrega nem grava
 * nada: responde 401 e o app manda a pessoa entrar. O dono NUNCA vem do corpo
 * da requisição, porque o corpo qualquer pessoa escreve.
 *
 * Cada verbo faz uma coisa: GET lê tudo da pessoa, POST cria, PATCH altera um
 * campo, DELETE apaga, PUT troca o conteúdo inteiro (é o "restaurar exemplos"
 * e o "limpar tudo" da tela de configurações).
 */

// Dados de gente não têm o que cachear: a resposta é sempre a de agora.
export const dynamic = "force-dynamic"

function desligado() {
  return NextResponse.json({ ligado: false, dados: null })
}

function semSessao() {
  return NextResponse.json({ ligado: true, autenticado: false, dados: null }, { status: 401 })
}

/** O dono desta requisição, ou `null` se não tem sessão assinada válida. */
async function dono(): Promise<string | null> {
  const pote = await cookies()
  const sessao = lerCookieDeSessao(pote.get(COOKIE_SESSAO)?.value)
  return sessao ? idDoUsuario(sessao) : null
}

/**
 * O dono, garantido na tabela `usuarios` antes de gravar.
 *
 * O login já registra a pessoa, mas se o banco estava dormindo naquele
 * momento, a linha pode não existir, e o registro dela apontaria pra ninguém.
 * Um upsert a mais por gravação é barato; uma gravação recusada não é.
 */
async function donoParaGravar(): Promise<string | null> {
  const pote = await cookies()
  const sessao = lerCookieDeSessao(pote.get(COOKIE_SESSAO)?.value)
  if (!sessao) return null
  await registrarUsuario(sessao)
  return idDoUsuario(sessao)
}

export async function GET() {
  if (!bancoConfigurado()) return desligado()
  const usuario = await dono()
  if (!usuario) return semSessao()
  try {
    return NextResponse.json({ ligado: true, autenticado: true, dados: await lerTudo(usuario) })
  } catch (erro) {
    // O banco existe mas não respondeu (projeto dormindo, rede caída). Não
    // cai pro navegador: a pessoa está logada e mostrar dado de exemplo no
    // lugar do dela seria mentir. A tela recebe o vazio e o erro fica no log.
    console.error("[dados] leitura falhou", erro)
    return NextResponse.json(
      { ligado: true, autenticado: true, dados: null, erro: "banco-indisponivel" },
      { status: 503 }
    )
  }
}

export async function POST(requisicao: Request) {
  if (!bancoConfigurado()) return desligado()
  const usuario = await donoParaGravar()
  if (!usuario) return semSessao()
  const corpo = (await requisicao.json()) as { colecao?: unknown; item?: { id?: string } }
  if (!ehColecao(corpo.colecao) || !corpo.item?.id) {
    return NextResponse.json({ erro: "requisição inválida" }, { status: 400 })
  }
  await inserir(usuario, corpo.colecao, corpo.item as { id: string })
  return NextResponse.json({ ok: true })
}

export async function PATCH(requisicao: Request) {
  if (!bancoConfigurado()) return desligado()
  const usuario = await donoParaGravar()
  if (!usuario) return semSessao()
  const corpo = (await requisicao.json()) as {
    colecao?: unknown
    id?: unknown
    patch?: Record<string, unknown>
  }
  if (!ehColecao(corpo.colecao) || typeof corpo.id !== "string" || !corpo.patch) {
    return NextResponse.json({ erro: "requisição inválida" }, { status: 400 })
  }
  await atualizar(usuario, corpo.colecao, corpo.id, corpo.patch)
  return NextResponse.json({ ok: true })
}

export async function DELETE(requisicao: Request) {
  if (!bancoConfigurado()) return desligado()
  const usuario = await donoParaGravar()
  if (!usuario) return semSessao()
  const corpo = (await requisicao.json()) as { colecao?: unknown; id?: unknown }
  if (!ehColecao(corpo.colecao) || typeof corpo.id !== "string") {
    return NextResponse.json({ erro: "requisição inválida" }, { status: 400 })
  }
  await remover(usuario, corpo.colecao, corpo.id)
  return NextResponse.json({ ok: true })
}

export async function PUT(requisicao: Request) {
  if (!bancoConfigurado()) return desligado()
  const usuario = await donoParaGravar()
  if (!usuario) return semSessao()
  const corpo = (await requisicao.json()) as { dados?: Dados }
  const dados = corpo.dados
  if (
    !dados ||
    !Array.isArray(dados.jornadas) ||
    !Array.isArray(dados.evidencias) ||
    !Array.isArray(dados.sessoes)
  ) {
    return NextResponse.json({ erro: "requisição inválida" }, { status: 400 })
  }
  await substituirTudo(usuario, dados)
  return NextResponse.json({ ok: true })
}
