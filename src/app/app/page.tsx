"use client"

import Link from "next/link"
import { useMemo } from "react"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { Icone } from "@/components/app/icone"
import { BotaoLink } from "@/components/marketing/botao-link"
import { BarraProgresso, Card, CardConteudo, EstadoVazio } from "@/components/ui"
import { palavras, sistema } from "@/content/site"
import { PROFISSOES, acharProfissao } from "@/lib/catalogo"
import { contar } from "@/lib/formato"
import {
  formatarHoras,
  minutosNoPeriodo,
  percentualDoNivel,
  proximaAcao,
  scoreDaPessoa,
  sequenciaDeDias,
  ultimaData,
} from "@/lib/jornada"
import { COMUNIDADE_RANKING } from "@/lib/catalogo"
import { useDados } from "@/lib/store"
import { useSessao } from "@/lib/store"

const textos = sistema.inicio

/**
 * A primeira tela depois de entrar (ONB-01): descoberta e retomada juntas.
 *
 * Ela não é um catálogo de módulos: a peça central é "continuar de onde parou",
 * com a única próxima ação recomendada, e os indicadores em volta levam cada um
 * pro seu detalhamento (ONB-02). Quando a pessoa é nova, a mesma tela vira o
 * convite pra escolher a carreira (ONB-03): o estado muda, a tela é uma só.
 */
export default function PaginaInicio() {
  const { dados, jornada } = useDados()
  const sessaoDeLogin = useSessao()

  const profissao = acharProfissao(jornada?.profissaoId)
  const acao = proximaAcao(jornada)

  const indicadores = useMemo(() => {
    if (!jornada?.resultado || !profissao) return null

    const percentual = percentualDoNivel(
      jornada.resultado.nivel,
      profissao.competencias,
      jornada.competenciasConcluidas
    )
    const score = scoreDaPessoa(dados)
    const posicao = jornada.publico.participaRanking
      ? COMUNIDADE_RANKING.filter((linha) => linha.score > score).length + 1
      : null

    return {
      nivel: jornada.resultado.nivel,
      percentual,
      concluidas: jornada.competenciasConcluidas.length,
      totais: profissao.competencias.length,
      minutosSemana: minutosNoPeriodo(dados.sessoes, 7),
      sequencia: sequenciaDeDias(dados.sessoes),
      cases: dados.evidencias.filter((evidencia) => evidencia.estado === "case").length,
      posicao,
      ultimaAtividade: ultimaData(dados.sessoes),
    }
  }, [dados, jornada, profissao])

  const saudacao = saudacaoDaHora()
  const nome = sessaoDeLogin?.nome?.split(" ")[0]

  // O estado de quem acabou de chegar: a escolha de carreira é a tela (ONB-03).
  if (!jornada || !jornada.profissaoId) {
    return (
      <>
        <CabecalhoPagina
          titulo={textos.titulo}
          descricao={nome ? `${saudacao}, ${nome}.` : `${saudacao}.`}
        />

        <div className="superficie rounded-ds-surface border border-hairline" data-tour="continuar">
          <EstadoVazio
            icone={<Icone nome="carreiras" />}
            titulo={sistema.vazios.inicioNovo.titulo}
            texto={sistema.vazios.inicioNovo.texto}
            acao={
              <BotaoLink href="/app/carreiras" comChip iconeDireita={<Icone nome="seta-direita" />}>
                {sistema.vazios.inicioNovo.acao}
              </BotaoLink>
            }
          />
        </div>

        <AlternativasDeCarreira excetoId={null} />
      </>
    )
  }

  return (
    <>
      <CabecalhoPagina
        titulo={textos.titulo}
        descricao={nome ? `${saudacao}, ${nome}.` : `${saudacao}.`}
      />

      {/* A peça central: retomar de onde parou, com UMA ação recomendada. */}
      <Card className="faixa-topo overflow-hidden" data-tour="continuar">
        <CardConteudo className="flex flex-col gap-4 p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-muted">
            <span className="flex items-center gap-1.5">
              <Icone nome="carreiras" className="size-4 text-primary-accent" />
              {textos.objetivoRotulo}: <strong className="font-medium text-ink">{profissao?.nome}</strong>
            </span>
            {indicadores && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  {textos.nivelRotulo} {indicadores.nivel} {textos.de5}
                </span>
              </>
            )}
          </div>

          <div>
            <p className="text-[11px] font-medium tracking-wide text-muted uppercase">
              {textos.continuar.titulo}
            </p>
            <h2 className="mt-1 font-display text-xl leading-snug text-balance text-ink sm:text-2xl">
              {acao.rotulo}
            </h2>
            <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted">{acao.descricao}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <BotaoLink href={acao.href} tamanho="lg" comChip iconeDireita={<Icone nome="seta-direita" />}>
              {textos.continuar.rotulo}
            </BotaoLink>

            {indicadores && (
              <div className="min-w-[180px] flex-1 sm:max-w-[260px]">
                <BarraProgresso
                  valor={indicadores.percentual}
                  rotulo={`${indicadores.percentual}% ${textos.ateProximoNivel}`}
                  mostrarValor
                />
                <p className="mt-1 text-[12px] text-muted">{textos.ateProximoNivel}</p>
              </div>
            )}
          </div>
        </CardConteudo>
      </Card>

      {/* Os indicadores consolidados (ONB-02), cada um levando ao detalhe. */}
      {indicadores && (
        <section aria-label={textos.indicadores.titulo} className="mt-6">
          <h2 className="sr-only">{textos.indicadores.titulo}</h2>
          <dl
            className="grid gap-3"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}
          >
            <Indicador
              icone="nivel"
              rotulo={textos.indicadores.nivel}
              valor={`${indicadores.nivel} ${textos.de5}`}
              href="/app/mapa"
            />
            <Indicador
              icone="acertei"
              rotulo={textos.indicadores.competencias}
              valor={`${indicadores.concluidas} de ${indicadores.totais}`}
              href="/app/progresso"
            />
            <Indicador
              icone="tempo"
              rotulo={textos.indicadores.horasSemana}
              valor={formatarHoras(indicadores.minutosSemana)}
              href="/app/progresso"
            />
            <Indicador
              icone="sequencia"
              rotulo={textos.indicadores.sequencia}
              valor={contar(indicadores.sequencia, palavras.dia.singular, palavras.dia.plural)}
              href="/app/progresso"
            />
            <Indicador
              icone="evidencia"
              rotulo={textos.indicadores.cases}
              valor={String(indicadores.cases)}
              href="/app/perfil"
            />
            {indicadores.posicao !== null && (
              <Indicador
                icone="ranking"
                rotulo={textos.indicadores.ranking}
                valor={`#${indicadores.posicao}`}
                href="/app/ranking"
              />
            )}
          </dl>
        </section>
      )}

      <AlternativasDeCarreira excetoId={jornada.profissaoId} />
    </>
  )
}

/** Um indicador clicável: o número leva pro detalhamento dele (ONB-02). */
function Indicador({
  icone,
  rotulo,
  valor,
  href,
}: {
  icone: string
  rotulo: string
  valor: string
  href: string
}) {
  return (
    <div className="superficie relative rounded-ds-surface border border-hairline p-4 transition-colors hover:border-primary/40">
      <dt className="flex items-center gap-1.5 text-[11px] tracking-wide text-muted uppercase">
        <Icone nome={icone} className="size-3.5 text-primary-accent" />
        {rotulo}
      </dt>
      <dd className="mt-1.5 font-display text-lg text-ink tabular-nums">
        <Link href={href} className="after:absolute after:inset-0">
          {valor}
        </Link>
      </dd>
    </div>
  )
}

/**
 * Carreiras alternativas, sem competir com a ação principal (ONB-01): três
 * linhas discretas no pé da tela, e trocar não apaga nada.
 */
function AlternativasDeCarreira({ excetoId }: { excetoId: string | null }) {
  const alternativas = PROFISSOES.filter((profissao) => profissao.id !== excetoId).slice(0, 3)

  return (
    <section aria-labelledby="alternativas-titulo" className="mt-8 border-t border-hairline pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="alternativas-titulo" className="font-display text-sm text-ink">
          {textos.alternativas.titulo}
        </h2>
        <p className="text-[12px] text-muted">{textos.alternativas.texto}</p>
      </div>

      <ul className="mt-3 flex flex-wrap gap-2">
        {alternativas.map((profissao) => (
          <li key={profissao.id}>
            <Link
              href={`/app/carreiras/${profissao.id}`}
              className="superficie inline-flex items-center gap-2 rounded-ds border border-hairline px-3 py-2 text-[13px] text-ink transition-colors hover:border-primary/40 hover:bg-elevated pointer-coarse:min-h-11"
            >
              {profissao.nome}
              <Icone nome="seta-direita" className="size-3.5 text-muted" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function saudacaoDaHora() {
  const hora = new Date().getHours()
  if (hora < 12) return textos.saudacao.manha
  if (hora < 18) return textos.saudacao.tarde
  return textos.saudacao.noite
}
