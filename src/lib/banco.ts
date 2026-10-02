import { neon } from "@neondatabase/serverless"
import type { Dados, Evidencia, Jornada, Sessao, SessaoDeEstudo } from "./types"

/**
 * O banco no Neon.
 *
 * O app inteiro funciona sem ele: o `store` guarda tudo no navegador e ninguém
 * precisa criar conta em lugar nenhum pra rodar `npm run dev`. Quando a
 * `DATABASE_URL` aparece no `.env.local`, este arquivo acorda, cria as tabelas
 * sozinho na primeira chamada e o `store` passa a falar com o Postgres em vez
 * do navegador.
 *
 * CADA REGISTRO TEM DONO. A tabela `registros` carrega a coluna `usuario`, que
 * aponta pra `usuarios`, e toda função deste arquivo recebe o dono como
 * primeiro argumento. Não existe "ler tudo": existe ler tudo DE ALGUÉM. É o
 * que faz duas pessoas logadas no mesmo app verem cada uma só a própria
 * jornada. Quem decide o dono é a sessão assinada lida pela rota
 * (`src/lib/sessao-servidor.ts`), nunca um campo vindo do navegador.
 *
 * SOBRE O FORMATO. Uma tabela de registros com a coleção, o id e o registro em
 * `jsonb`. É a escolha que sobrevive ao produto mudar de ideia: trocar os
 * campos de uma coleção ou inventar coleção nova não pede migração. Trocar
 * isso por uma tabela por coleção, com colunas tipadas, está desenhado em
 * `banco/schema.sql`.
 *
 * Este arquivo só é importado pelas rotas de `src/app/api`. A `DATABASE_URL`
 * traz a senha do banco dentro dela e nunca chega no navegador.
 */

/** As coleções que o app guarda hoje. Serve de porteiro do que vem da rede. */
export const COLECOES = ["jornadas", "evidencias", "sessoes"] as const
export type Colecao = (typeof COLECOES)[number]

export function ehColecao(valor: unknown): valor is Colecao {
  return typeof valor === "string" && (COLECOES as readonly string[]).includes(valor)
}

function conexao() {
  const url = process.env.DATABASE_URL?.trim()
  return url ? neon(url) : null
}

export function bancoConfigurado(): boolean {
  return conexao() !== null
}

/**
 * Cria as tabelas na primeira chamada e nunca mais.
 *
 * A promessa fica guardada de propósito: sem isso, duas requisições ao mesmo
 * tempo no primeiro acesso rodariam o `CREATE TABLE` em paralelo. O `IF NOT
 * EXISTS` já protege do erro, mas a corrida gastaria duas idas ao banco em toda
 * inicialização.
 */
let preparacao: Promise<void> | null = null

async function preparar(sql: NonNullable<ReturnType<typeof conexao>>) {
  if (!preparacao) {
    preparacao = (async () => {
      // O mesmo desenho de banco/schema.sql. Mudou lá, muda aqui.
      await sql`
        CREATE TABLE IF NOT EXISTS usuarios (
          id             text        PRIMARY KEY,
          email          text        NOT NULL,
          nome           text        NOT NULL,
          foto           text,
          criado_em      timestamptz NOT NULL DEFAULT now(),
          ultimo_acesso  timestamptz NOT NULL DEFAULT now()
        )
      `
      // O banco criado antes da coluna existe por aí: o IF NOT EXISTS iguala.
      await sql`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS foto text`
      await sql`
        CREATE TABLE IF NOT EXISTS registros (
          usuario    text        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
          colecao    text        NOT NULL,
          id         text        NOT NULL,
          dados      jsonb       NOT NULL,
          criado_em  timestamptz NOT NULL DEFAULT now(),
          PRIMARY KEY (usuario, colecao, id)
        )
      `
      // A ordem das telas é sempre "mais novo primeiro", e sempre de uma pessoa
      // só. Sem este índice, cada listagem varreria a tabela inteira.
      await sql`
        CREATE INDEX IF NOT EXISTS registros_usuario_colecao_criado_em
        ON registros (usuario, colecao, criado_em DESC)
      `
    })().catch((erro) => {
      // Falhou a preparação, esquece a promessa: a próxima requisição tenta de
      // novo em vez de herdar o erro pra sempre.
      preparacao = null
      throw erro
    })
  }
  return preparacao
}

/** Devolve a conexão já com as tabelas garantidas, ou `null` se não tem banco. */
async function pronto() {
  const sql = conexao()
  if (!sql) return null
  await preparar(sql)
  return sql
}

/**
 * O id de uma pessoa é o e-mail em minúsculas.
 *
 * O Google garante que o e-mail é dela, e minúsculas porque `Ana@x.com` e
 * `ana@x.com` são a mesma caixa de entrada: tratar como duas pessoas faria a
 * jornada "sumir" na segunda vez que ela entrasse com a letra diferente.
 */
export function idDoUsuario(sessao: Pick<Sessao, "email">): string {
  return sessao.email.trim().toLowerCase()
}

/**
 * Garante que a pessoa existe na tabela e marca o acesso.
 *
 * Chamada na volta do login. É um `upsert`: na primeira vez cria, nas outras
 * só atualiza o nome (a pessoa pode ter trocado no Google) e a hora.
 */
export async function registrarUsuario(sessao: Sessao): Promise<void> {
  const sql = await pronto()
  if (!sql) return
  await sql`
    INSERT INTO usuarios (id, email, nome, foto)
    VALUES (${idDoUsuario(sessao)}, ${sessao.email}, ${sessao.nome}, ${sessao.foto ?? null})
    ON CONFLICT (id) DO UPDATE
      SET nome = EXCLUDED.nome,
          foto = COALESCE(EXCLUDED.foto, usuarios.foto),
          ultimo_acesso = now()
  `
}

type Linha = { colecao: string; id: string; dados: unknown }

function montar(linhas: Linha[]): Dados {
  const dados: Dados = { jornadas: [], evidencias: [], sessoes: [] }
  for (const linha of linhas) {
    if (linha.colecao === "jornadas") dados.jornadas.push(linha.dados as Jornada)
    else if (linha.colecao === "evidencias") dados.evidencias.push(linha.dados as Evidencia)
    else if (linha.colecao === "sessoes") dados.sessoes.push(linha.dados as SessaoDeEstudo)
  }
  return dados
}

/** Tudo que é de uma pessoa. Quem acabou de chegar recebe as três coleções vazias. */
export async function lerTudo(usuario: string): Promise<Dados | null> {
  const sql = await pronto()
  if (!sql) return null
  const linhas = (await sql`
    SELECT colecao, id, dados FROM registros
    WHERE usuario = ${usuario}
    ORDER BY criado_em DESC
  `) as Linha[]
  return montar(linhas)
}

export async function inserir(
  usuario: string,
  colecao: Colecao,
  item: { id: string }
): Promise<void> {
  const sql = await pronto()
  if (!sql) return
  await sql`
    INSERT INTO registros (usuario, colecao, id, dados)
    VALUES (${usuario}, ${colecao}, ${item.id}, ${JSON.stringify(item)}::jsonb)
    ON CONFLICT (usuario, colecao, id) DO UPDATE SET dados = EXCLUDED.dados
  `
}

/**
 * Aplica um patch parcial sem trazer o registro pra cá primeiro.
 *
 * O `||` do jsonb funde os dois objetos dentro do banco, numa ida só. Ler,
 * mesclar em JavaScript e gravar de volta seriam duas idas com uma janela no
 * meio onde outra aba poderia gravar por cima. O `WHERE usuario` é o que
 * impede alguém de alterar registro alheio adivinhando o id.
 */
export async function atualizar(
  usuario: string,
  colecao: Colecao,
  id: string,
  patch: Record<string, unknown>
): Promise<void> {
  const sql = await pronto()
  if (!sql) return
  await sql`
    UPDATE registros
    SET dados = dados || ${JSON.stringify(patch)}::jsonb
    WHERE usuario = ${usuario} AND colecao = ${colecao} AND id = ${id}
  `
}

export async function remover(usuario: string, colecao: Colecao, id: string): Promise<void> {
  const sql = await pronto()
  if (!sql) return
  await sql`
    DELETE FROM registros
    WHERE usuario = ${usuario} AND colecao = ${colecao} AND id = ${id}
  `
  // As três coleções são independentes entre si: apagar uma evidência ou uma
  // sessão não deixa órfão em lugar nenhum, e a jornada nunca é apagada por
  // aqui (trocar de profissão preserva histórico, regra RB-07).
}

/**
 * Troca todo o conteúdo de UMA pessoa de uma vez, numa transação.
 *
 * É o que está por trás de "restaurar exemplos" e "limpar tudo" na tela de
 * configurações. Apagar e inserir em duas idas soltas deixaria o banco vazio se
 * a segunda falhasse; dentro da transação, ou troca inteiro ou não troca.
 */
export async function substituirTudo(usuario: string, dados: Dados): Promise<void> {
  const sql = await pronto()
  if (!sql) return

  const linhas: Array<[Colecao, string, string]> = []
  for (const colecao of COLECOES) {
    for (const item of dados[colecao] as Array<{ id: string }>) {
      linhas.push([colecao, item.id, JSON.stringify(item)])
    }
  }

  await sql.transaction((tx) => [
    tx`DELETE FROM registros WHERE usuario = ${usuario}`,
    ...linhas.map(
      ([colecao, id, corpo]) => tx`
        INSERT INTO registros (usuario, colecao, id, dados)
        VALUES (${usuario}, ${colecao}, ${id}, ${corpo}::jsonb)
      `
    ),
  ])
}

/**
 * Quantas linhas existem, por tabela e por coleção, somando todo mundo.
 *
 * Serve só à página de estudo `/banco`: é agregado, sem nada de ninguém em
 * particular. Devolve `null` sem banco ou com o banco fora do ar, e a página
 * mostra o mapa sem os números.
 */
export async function contagens(): Promise<Record<string, number> | null> {
  const sql = await pronto()
  if (!sql) return null
  try {
    const usuarios = (await sql`SELECT count(*)::int AS total FROM usuarios`) as Array<{
      total: number
    }>
    const porColecao = (await sql`
      SELECT colecao, count(*)::int AS total FROM registros GROUP BY colecao
    `) as Array<{ colecao: string; total: number }>
    const resultado: Record<string, number> = { usuarios: usuarios[0]?.total ?? 0, registros: 0 }
    for (const linha of porColecao) {
      resultado[linha.colecao] = linha.total
      resultado.registros += linha.total
    }
    return resultado
  } catch (erro) {
    console.error("[banco] contagens falharam", erro)
    return null
  }
}

// --- o que o painel /admin lê ----------------------------------------------

export type UsuarioComDados = {
  id: string
  email: string
  nome: string
  foto: string | null
  criadoEm: string
  ultimoAcesso: string
  dados: Dados
}

/**
 * Todo mundo, com tudo que é de cada um. SÓ o /admin chama, e o /admin só
 * abre pra quem está em ADMIN_EMAILS: esta função entrega dado de todas as
 * pessoas de uma vez, e é exatamente por isso que ela não serve a nenhuma
 * outra rota.
 */
export async function lerTodosParaAdmin(): Promise<UsuarioComDados[] | null> {
  const sql = await pronto()
  if (!sql) return null
  const usuarios = (await sql`
    SELECT id, email, nome, foto, criado_em, ultimo_acesso FROM usuarios
    ORDER BY ultimo_acesso DESC
  `) as Array<{ id: string; email: string; nome: string; foto: string | null; criado_em: string; ultimo_acesso: string }>
  const linhas = (await sql`
    SELECT usuario, colecao, id, dados FROM registros ORDER BY criado_em DESC
  `) as Array<Linha & { usuario: string }>

  const porUsuario = new Map<string, Linha[]>()
  for (const linha of linhas) {
    const lista = porUsuario.get(linha.usuario) ?? []
    lista.push(linha)
    porUsuario.set(linha.usuario, lista)
  }

  return usuarios.map((u) => ({
    id: u.id,
    email: u.email,
    nome: u.nome,
    foto: u.foto,
    criadoEm: new Date(u.criado_em).toISOString(),
    ultimoAcesso: new Date(u.ultimo_acesso).toISOString(),
    dados: montar(porUsuario.get(u.id) ?? []),
  }))
}
