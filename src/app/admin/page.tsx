import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Logo } from "@/components/app/logo"
import { Badge, Card, CardConteudo, EstadoVazio } from "@/components/ui"
import { Icone } from "@/components/app/icone"
import { admin } from "@/content/admin"
import { marca } from "@/content/site"
import { montarPainel, type PessoaNoPainel, type StatusDePessoa } from "@/lib/admin"
import { bancoConfigurado, idDoUsuario, lerTodosParaAdmin } from "@/lib/banco"
import { acharProfissao } from "@/lib/catalogo"
import { cn } from "@/lib/cn"
import { formatarHoras } from "@/lib/jornada"
import { COOKIE_SESSAO, lerCookieDeSessao } from "@/lib/sessao-servidor"

export const metadata: Metadata = {
  title: `${admin.titulo} · ${marca.nome}`,
  // O painel é interno: fora do índice de busca por educação básica.
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

/** Quem pode abrir: os e-mails de ADMIN_EMAILS, comparados em minúsculas. */
function ehAdmin(email: string | undefined): boolean {
  if (!email) return false
  const lista = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return lista.includes(email.trim().toLowerCase())
}

/**
 * O painel de métricas do produto, seguindo o HEART.
 *
 * Servidor puro: lê o banco, monta as contas em `src/lib/admin.ts` e desenha.
 * Quem não está em ADMIN_EMAILS recebe 404, e não 403, de propósito: página
 * restrita que se anuncia é convite pra insistência.
 */
export default async function PaginaAdmin() {
  const pote = await cookies()
  const sessao = lerCookieDeSessao(pote.get(COOKIE_SESSAO)?.value)
  if (!ehAdmin(sessao ? idDoUsuario(sessao) : undefined)) notFound()

  if (!bancoConfigurado()) {
    return (
      <Casca>
        <div className="superficie rounded-ds-surface border border-hairline">
          <EstadoVazio
            icone={<Icone nome="dados" />}
            titulo={admin.semBanco.titulo}
            texto={admin.semBanco.texto}
          />
        </div>
      </Casca>
    )
  }

  const usuarios = (await lerTodosParaAdmin()) ?? []
  const painel = montarPainel(usuarios, new Date())

  return (
    <Casca>
      <Heart painel={painel} />
      <Tarefas painel={painel} />
      <Dedicacao painel={painel} />
      <Pessoas pessoas={painel.pessoas} />
    </Casca>
  )
}

function Casca({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="cabecalho-condensa sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center rounded-ds transition-opacity hover:opacity-80 pointer-coarse:min-h-11"
          >
            <Logo />
          </Link>
          <div className="ml-auto flex items-center gap-1">
            <Link
              href="/banco"
              className="flex items-center rounded-ds px-3 py-2 text-sm text-muted transition-colors hover:bg-elevated hover:text-ink pointer-coarse:min-h-11"
            >
              /banco
            </Link>
            <Link
              href="/app"
              className="flex items-center rounded-ds px-3 py-2 text-sm text-muted transition-colors hover:bg-elevated hover:text-ink pointer-coarse:min-h-11"
            >
              /app
            </Link>
          </div>
        </div>
      </header>

      <main id="conteudo" tabIndex={-1} className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="font-display text-2xl text-ink sm:text-3xl">{admin.titulo}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{admin.subtitulo}</p>
          <p className="mt-1 text-[12px] text-muted">{admin.atualizado}</p>
        </div>
        <div className="mt-8 flex flex-col gap-8">{children}</div>
      </main>
    </div>
  )
}

function Numero({ valor, rotulo }: { valor: React.ReactNode; rotulo: string }) {
  return (
    <div>
      <dt className="order-2 text-[12px] leading-snug text-muted">{rotulo}</dt>
      <dd className="font-display text-2xl text-ink tabular-nums">{valor}</dd>
    </div>
  )
}

function Heart({ painel }: { painel: ReturnType<typeof montarPainel> }) {
  const h = painel.heart
  const copy = admin.heart
  return (
    <section aria-labelledby="heart-titulo">
      <h2 id="heart-titulo" className="font-display text-lg text-ink">
        {copy.titulo}
      </h2>
      <div className="mt-4 grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
        <Card>
          <CardConteudo>
            <p className="text-[11px] font-medium tracking-wide text-primary-accent uppercase">{copy.happiness.rotulo}</p>
            <dl className="mt-3 flex flex-col gap-3">
              <Numero valor={`${h.happiness.optInRanking} de ${h.happiness.total}`} rotulo={copy.happiness.optIn} />
              <Numero valor={`${h.happiness.consentimentoCase} de ${h.happiness.total}`} rotulo={copy.happiness.consentimento} />
            </dl>
            <p className="mt-3 border-t border-hairline pt-2 text-[11px] leading-snug text-muted">{copy.happiness.nota}</p>
          </CardConteudo>
        </Card>
        <Card>
          <CardConteudo>
            <p className="text-[11px] font-medium tracking-wide text-primary-accent uppercase">{copy.engagement.rotulo}</p>
            <dl className="mt-3 flex flex-col gap-3">
              <Numero valor={h.engagement.sessoes7d} rotulo={copy.engagement.sessoes} />
              <Numero valor={formatarHoras(h.engagement.minutos7d)} rotulo={copy.engagement.minutos} />
              <Numero valor={h.engagement.mediaMinutosPorAtivo} rotulo={copy.engagement.media} />
            </dl>
          </CardConteudo>
        </Card>
        <Card>
          <CardConteudo>
            <p className="text-[11px] font-medium tracking-wide text-primary-accent uppercase">{copy.adoption.rotulo}</p>
            <dl className="mt-3 flex flex-col gap-3">
              <Numero valor={h.adoption.total} rotulo={copy.adoption.total} />
              <Numero valor={h.adoption.novos7d} rotulo={copy.adoption.novos} />
              <Numero valor={`${h.adoption.escolheramProfissao} de ${h.adoption.total}`} rotulo={copy.adoption.escolheram} />
            </dl>
          </CardConteudo>
        </Card>
        <Card>
          <CardConteudo>
            <p className="text-[11px] font-medium tracking-wide text-primary-accent uppercase">{copy.retention.rotulo}</p>
            <dl className="mt-3 flex flex-col gap-3">
              <Numero valor={h.retention.ativos} rotulo={copy.retention.ativos} />
              <Numero valor={h.retention.emRisco} rotulo={copy.retention.risco} />
              <Numero valor={h.retention.inativos} rotulo={copy.retention.inativos} />
            </dl>
          </CardConteudo>
        </Card>
        <Card>
          <CardConteudo>
            <p className="text-[11px] font-medium tracking-wide text-primary-accent uppercase">{copy.task.rotulo}</p>
            <dl className="mt-3 flex flex-col gap-3">
              <Numero
                valor={h.taskSuccess.conclusaoNivelamento !== null ? `${h.taskSuccess.conclusaoNivelamento}%` : copy.task.semAmostra}
                rotulo={copy.task.conclusao}
              />
            </dl>
          </CardConteudo>
        </Card>
      </div>
    </section>
  )
}

function tempoLegivel(horas: number | null): string {
  if (horas === null) return admin.tarefas.semDado
  if (horas === 0) return admin.tarefas.mesmoDia
  if (horas < 1) return `${Math.max(1, Math.round(horas * 60))} ${admin.tarefas.minutos}`
  if (horas < 48) return `${Math.round(horas * 10) / 10} ${admin.tarefas.horas}`
  return `${Math.round(horas / 24)} d`
}

function Tarefas({ painel }: { painel: ReturnType<typeof montarPainel> }) {
  const copy = admin.tarefas
  return (
    <section aria-labelledby="tarefas-titulo">
      <h2 id="tarefas-titulo" className="font-display text-lg text-ink">{copy.titulo}</h2>
      <p className="mt-1 max-w-3xl text-sm text-muted">{copy.subtitulo}</p>
      <Card className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-hairline text-[11px] font-medium tracking-wide text-muted uppercase">
              <th scope="col" className="px-5 py-3">{copy.colunas.tarefa}</th>
              <th scope="col" className="px-5 py-3">{copy.colunas.conclusao}</th>
              <th scope="col" className="px-5 py-3">{copy.colunas.tempo}</th>
              <th scope="col" className="px-5 py-3">{copy.colunas.passos}</th>
            </tr>
          </thead>
          <tbody>
            {painel.tarefas.map((tarefa) => {
              const taxa = tarefa.tentaram > 0 ? Math.round((tarefa.concluiram / tarefa.tentaram) * 100) : null
              return (
                <tr key={tarefa.codigo} className="border-b border-hairline last:border-0">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-ink">{tarefa.nome}</p>
                    <p className="text-[11px] text-muted">{tarefa.codigo}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-ink tabular-nums">
                      {tarefa.concluiram} {copy.de} {tarefa.tentaram}
                      {taxa !== null && <span className="text-muted"> ({taxa}%)</span>}
                    </p>
                    <div aria-hidden="true" className="mt-1.5 h-1 w-28 overflow-hidden rounded-full bg-elevated">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${taxa ?? 0}%` }} />
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-ink tabular-nums">{tempoLegivel(tarefa.horasMedianas)}</p>
                    {tarefa.aproximada && <p className="text-[11px] text-muted">{copy.aproximada}</p>}
                  </td>
                  <td className="px-5 py-3.5 text-ink tabular-nums">
                    {tarefa.passosMedianos !== null ? Math.round(tarefa.passosMedianos) : copy.naoSeAplica}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </section>
  )
}

function Dedicacao({ painel }: { painel: ReturnType<typeof montarPainel> }) {
  const copy = admin.dedicacao
  const maximo = Math.max(1, ...painel.porDia.map((d) => d.minutos))
  const totalSessoes = painel.porDia.reduce((soma, d) => soma + d.sessoes, 0)
  const totalMinutos = painel.porDia.reduce((soma, d) => soma + d.minutos, 0)
  const resumo =
    totalSessoes === 0
      ? copy.resumoVazio
      : copy.legenda.replace("{sessoes}", String(totalSessoes)).replace("{minutos}", String(totalMinutos))

  return (
    <section aria-labelledby="dedicacao-titulo">
      <h2 id="dedicacao-titulo" className="font-display text-lg text-ink">{copy.titulo}</h2>
      <p className="mt-1 text-sm text-muted">{copy.subtitulo}</p>
      <Card className="mt-4">
        <CardConteudo>
          {/* O gráfico é decorativo; o resumo em texto carrega a informação. */}
          <div aria-hidden="true" className="flex h-28 items-end gap-1.5">
            {painel.porDia.map((dia) => (
              <div key={dia.dia} className="group relative flex-1">
                <div
                  className={cn("w-full rounded-t-sm", dia.minutos > 0 ? "bg-primary" : "bg-elevated")}
                  style={{ height: `${Math.max(4, (dia.minutos / maximo) * 104)}px` }}
                  title={`${dia.dia}: ${dia.minutos} min`}
                />
              </div>
            ))}
          </div>
          <div aria-hidden="true" className="mt-1.5 flex justify-between text-[10px] text-muted tabular-nums">
            <span>{painel.porDia[0]?.dia.slice(5)}</span>
            <span>{painel.porDia[painel.porDia.length - 1]?.dia.slice(5)}</span>
          </div>
          <p className="mt-3 border-t border-hairline pt-3 text-[13px] text-muted">{resumo}</p>
        </CardConteudo>
      </Card>
    </section>
  )
}

const VARIANTE_DO_STATUS: Record<StatusDePessoa, "sucesso" | "aviso" | "perigo"> = {
  ativo: "sucesso",
  risco: "aviso",
  inativo: "perigo",
}

function ultimoAcessoLegivel(diasSemEntrar: number): string {
  if (diasSemEntrar === 0) return admin.pessoas.hoje
  if (diasSemEntrar === 1) return admin.pessoas.ontem
  return admin.pessoas.haDias.replace("{dias}", String(diasSemEntrar))
}

function Avatar({ pessoa }: { pessoa: PessoaNoPainel }) {
  const iniciais = pessoa.nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("")
  if (pessoa.foto) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- foto externa do
      // Google, com dimensão fixa: o next/image pediria liberar o domínio
      // inteiro por uma miniatura de 40px.
      <img
        src={pessoa.foto}
        alt=""
        referrerPolicy="no-referrer"
        className="size-10 shrink-0 rounded-full border border-hairline object-cover"
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/12 text-[13px] font-semibold text-primary-accent"
    >
      {iniciais}
    </span>
  )
}

function Pessoas({ pessoas }: { pessoas: PessoaNoPainel[] }) {
  const copy = admin.pessoas
  if (pessoas.length === 0) {
    return (
      <section aria-labelledby="pessoas-titulo">
        <h2 id="pessoas-titulo" className="font-display text-lg text-ink">{copy.titulo}</h2>
        <div className="superficie mt-4 rounded-ds-surface border border-hairline">
          <EstadoVazio icone={<Icone nome="users" />} titulo={copy.vazio.titulo} texto={copy.vazio.texto} />
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="pessoas-titulo">
      <h2 id="pessoas-titulo" className="font-display text-lg text-ink">{copy.titulo}</h2>
      <p className="mt-1 max-w-3xl text-sm text-muted">{copy.subtitulo}</p>
      <Card className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead>
            <tr className="border-b border-hairline text-[11px] font-medium tracking-wide text-muted uppercase">
              <th scope="col" className="px-5 py-3">{copy.colunas.pessoa}</th>
              <th scope="col" className="px-5 py-3">{copy.colunas.casa}</th>
              <th scope="col" className="px-5 py-3">{copy.colunas.ultimo}</th>
              <th scope="col" className="px-5 py-3">{copy.colunas.jornada}</th>
              <th scope="col" className="px-5 py-3">{copy.colunas.engajamento}</th>
              <th scope="col" className="px-5 py-3">{copy.colunas.status}</th>
            </tr>
          </thead>
          <tbody>
            {pessoas.map((pessoa) => {
              const profissao = acharProfissao(pessoa.profissaoId ?? undefined)
              return (
                <tr key={pessoa.id} className="border-b border-hairline align-top last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar pessoa={pessoa} />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">{pessoa.nome}</p>
                        <p className="truncate text-[12px] text-muted">{pessoa.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-ink tabular-nums">
                    {pessoa.diasDeCasa}{" "}
                    {pessoa.diasDeCasa === 1 ? copy.dias.singular : copy.dias.plural}
                  </td>
                  <td className="px-5 py-4 text-ink">{ultimoAcessoLegivel(pessoa.diasSemEntrar)}</td>
                  <td className="px-5 py-4">
                    <p className="text-ink">{profissao?.nome ?? copy.semProfissao}</p>
                    <p className="text-[12px] text-muted">
                      {copy.etapas[pessoa.etapa] ?? pessoa.etapa}
                      {pessoa.nivel !== null && ` · ${copy.nivel} ${pessoa.nivel}`}
                      {pessoa.competenciasConcluidas > 0 &&
                        ` · ${pessoa.competenciasConcluidas} ${copy.competencias}`}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-ink tabular-nums">
                      {pessoa.sessoes7d}{" "}
                      {pessoa.sessoes7d === 1 ? copy.sessao.singular : copy.sessao.plural} ·{" "}
                      {formatarHoras(pessoa.minutos7d)}
                    </p>
                    <p className="text-[12px] text-muted">
                      {copy.sequencia.replace("{dias}", String(pessoa.sequencia))}
                      {pessoa.participaRanking && ` · ${copy.ranking}`}
                    </p>
                  </td>
                  <td className="max-w-[260px] px-5 py-4">
                    <Badge variante={VARIANTE_DO_STATUS[pessoa.status]} ponto>
                      {copy.status[pessoa.status]}
                    </Badge>
                    <ul className="mt-1.5 flex flex-col gap-0.5 text-[12px] leading-snug text-muted">
                      {pessoa.razoes.length === 0 ? (
                        <li>{copy.semRazao}</li>
                      ) : (
                        pessoa.razoes.map((razao) => <li key={razao}>{razao}</li>)
                      )}
                    </ul>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </section>
  )
}
