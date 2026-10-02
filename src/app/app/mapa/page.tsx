"use client"

import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { Icone } from "@/components/app/icone"
import { SeloEstado } from "@/components/app/selo-estado"
import type { NoDeNivel } from "@/components/app/mapa/fluxo"
import { EstadoDaJornada, faltaNaJornada } from "@/components/app/estado-da-jornada"
import { BotaoLink } from "@/components/marketing/botao-link"
import { BarraProgresso, Button, Card, CardConteudo } from "@/components/ui"
import { estadosDeNo, sistema } from "@/content/site"
import { acharProfissao, modulosDaProfissao } from "@/lib/catalogo"
import {
  dominioDaCompetencia,
  estadoDaCompetencia,
  estadoDoNivel,
  percentualDoNivel,
  proximaAcao,
} from "@/lib/jornada"
import { cn } from "@/lib/cn"
import { useDados } from "@/lib/store"

const textos = sistema.mapa

/**
 * O React Flow chega por import adiado, com o esqueleto no lugar enquanto vem:
 * a lista acessível abaixo já está de pé antes de a biblioteca carregar, então
 * o conteúdo nunca espera o peso dela.
 */
const FluxoDoMapa = dynamic(
  () => import("@/components/app/mapa/fluxo").then((modulo) => modulo.FluxoDoMapa),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="h-[560px] w-full animate-pulse rounded-ds-surface border border-hairline bg-surface"
      />
    ),
  }
)

/**
 * O mapa de evolução (MAP-01): os cinco níveis sempre visíveis, o atual
 * expandido de saída (MAP-03), estados com texto e ícone (MAP-04) e UMA
 * próxima ação recomendada, sem impedir a exploração (MAP-06).
 *
 * A alternância mapa/lista cumpre o requisito de alternativa acessível: a
 * lista tem exatamente o mesmo conteúdo, navegável só com teclado.
 */
export default function PaginaMapa() {
  const { jornada } = useDados()
  const profissao = acharProfissao(jornada?.profissaoId)

  const [visao, setVisao] = useState<"mapa" | "lista">("mapa")
  const [selecionado, setSelecionado] = useState<number | null>(null)

  const nos: NoDeNivel[] = useMemo(() => {
    if (!profissao) return []
    return profissao.niveis.map((nivel) => ({
      nivel,
      estado: estadoDoNivel(nivel.ordem, jornada, profissao.competencias),
      percentual: percentualDoNivel(nivel.ordem, profissao.competencias, jornada?.competenciasConcluidas ?? []),
      atual: jornada?.resultado?.nivel === nivel.ordem,
    }))
  }, [profissao, jornada])

  // O mapa precisa de profissão E de nível. O vazio diz a primeira coisa que
  // falta, e só ela (RB-10).
  const falta = faltaNaJornada(jornada, profissao, "nivel")
  if (falta || !jornada || !profissao || !jornada.resultado) {
    return (
      <>
        <CabecalhoPagina titulo={textos.titulo} descricao={textos.descricao} />
        <EstadoDaJornada falta={falta ?? "nivel"} icone="mapa" profissao={profissao} tour="mapa" />
      </>
    )
  }

  // O bloco atual inicia expandido (MAP-03).
  const ordemSelecionada = selecionado ?? jornada.resultado.nivel
  const noSelecionado = nos.find((no) => no.nivel.ordem === ordemSelecionada) ?? nos[0]
  const acao = proximaAcao(jornada)

  return (
    <div data-tour="mapa">
      <CabecalhoPagina
        titulo={`${textos.titulo}: ${profissao.nome}`}
        descricao={textos.descricao}
        acoes={
          <div role="group" aria-label={textos.visao.rotulo} className="flex gap-1">
            <Button
              variante={visao === "mapa" ? "primaria" : "secundaria"}
              tamanho="sm"
              aria-pressed={visao === "mapa"}
              onClick={() => setVisao("mapa")}
              iconeEsquerda={<Icone nome="mapa2" />}
            >
              {textos.visao.mapa}
            </Button>
            <Button
              variante={visao === "lista" ? "primaria" : "secundaria"}
              tamanho="sm"
              aria-pressed={visao === "lista"}
              onClick={() => setVisao("lista")}
              iconeEsquerda={<Icone nome="lista" />}
            >
              {textos.visao.lista}
            </Button>
          </div>
        }
      />

      {/* A próxima ação recomendada, acima do mapa (MAP-06). */}
      <div className="superficie mb-5 flex flex-wrap items-center gap-3 rounded-ds-surface border border-hairline p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/12 text-primary-accent">
          <Icone nome="comecar" className="size-4" />
        </span>
        <div className="min-w-[200px] flex-1">
          <p className="text-[11px] font-medium tracking-wide text-muted uppercase">
            {textos.proximaAcao}
          </p>
          <p className="text-sm font-medium text-ink">{acao.rotulo}</p>
        </div>
        <BotaoLink href={acao.href} tamanho="sm">
          {sistema.inicio.continuar.rotulo}
        </BotaoLink>
      </div>

      {visao === "mapa" ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="min-w-0">
            <FluxoDoMapa
              niveis={nos}
              selecionado={ordemSelecionada}
              aoSelecionar={setSelecionado}
            />
            <p className="mt-2 text-[12px] text-muted">{textos.ajudaTeclado}</p>

            {/* A legenda dos estados: texto e ícone, nunca só cor (MAP-04). */}
            <dl aria-label={textos.legenda} className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {Object.entries(estadosDeNo).map(([chave, definicao]) => (
                <div key={chave} className="flex items-center gap-1.5 text-[12px] text-muted">
                  <dt className="sr-only">{definicao.rotulo}</dt>
                  <Icone nome={definicao.icone} className="size-3.5" />
                  <dd className="m-0">{definicao.rotulo}</dd>
                </div>
              ))}
            </dl>
          </div>

          <PainelDoNivel no={noSelecionado} aoFechar={() => setSelecionado(null)} />
        </div>
      ) : (
        <ListaDoMapa nos={nos} ordemInicial={ordemSelecionada} />
      )}
    </div>
  )
}

/** O painel de detalhe do nível selecionado (MAP-03). */
function PainelDoNivel({ no, aoFechar }: { no: NoDeNivel; aoFechar: () => void }) {
  const { jornada } = useDados()
  const profissao = acharProfissao(jornada?.profissaoId)
  if (!profissao) return null

  const modulos = modulosDaProfissao(profissao.id)
  const competencias = profissao.competencias.filter((c) => c.nivel === no.nivel.ordem)

  return (
    <Card className="lg:sticky lg:top-4" aria-live="polite">
      <CardConteudo className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium tracking-wide text-muted uppercase">
              Nível {no.nivel.ordem} de 5
            </p>
            <h2 className="font-display text-lg text-ink">{no.nivel.nome}</h2>
          </div>
          <SeloEstado estado={no.estado} className="shrink-0" />
        </div>

        <div>
          <h3 className="text-[11px] font-medium tracking-wide text-muted uppercase">
            {textos.painelDoNivel.objetivo}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">{no.nivel.descricao}</p>
        </div>

        {no.estado === "bloqueado" && (
          <p className="flex gap-2 rounded-ds-fine border border-hairline bg-elevated p-3 text-[13px] leading-relaxed text-muted">
            <Icone nome="bloqueado" className="mt-0.5 size-4 shrink-0" />
            {textos.painelDoNivel.bloqueadoTexto}
          </p>
        )}

        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-[11px] font-medium tracking-wide text-muted uppercase">
              {textos.painelDoNivel.progresso}
            </h3>
            <span className="text-[12px] font-medium tabular-nums text-muted">{no.percentual}%</span>
          </div>
          <BarraProgresso valor={no.percentual} rotulo={textos.painelDoNivel.progresso} className="mt-1.5" />
        </div>

        {competencias.length > 0 && (
          <div>
            <h3 className="text-[11px] font-medium tracking-wide text-muted uppercase">
              {textos.painelDoNivel.competencias}
            </h3>
            <ul className="mt-2 flex flex-col gap-2">
              {competencias.map((competencia) => {
                const estado = estadoDaCompetencia(competencia, jornada, modulos)
                const dominio = dominioDaCompetencia(competencia, jornada)
                return (
                  <li
                    key={competencia.id}
                    className="superficie-elevada rounded-ds-fine border border-hairline px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="min-w-0 text-[13px] font-medium text-ink">{competencia.nome}</p>
                      <span className="shrink-0 text-[11px] tabular-nums text-muted">{dominio}%</span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <SeloEstado estado={estado} />
                      <span className="text-[11px] text-muted">{competencia.esforco}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <div>
          <h3 className="text-[11px] font-medium tracking-wide text-muted uppercase">
            {textos.painelDoNivel.criterios}
          </h3>
          <ul className="mt-2 flex flex-col gap-1.5">
            {no.nivel.criterios.map((criterio) => (
              <li key={criterio} className="flex gap-2 text-[13px] leading-relaxed text-muted">
                <Icone nome="check" className="mt-0.5 size-3.5 shrink-0 text-success" />
                <span className="min-w-0">{criterio}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-hairline pt-4">
          <BotaoLink href="/app/aprender" tamanho="sm">
            {textos.painelDoNivel.irAprender}
          </BotaoLink>
          <Button variante="fantasma" tamanho="sm" onClick={aoFechar}>
            {textos.painelDoNivel.fechar}
          </Button>
        </div>
      </CardConteudo>
    </Card>
  )
}

/**
 * A alternativa em lista: o mesmo conteúdo do mapa, linear e navegável só com
 * teclado. O nível atual nasce aberto, como no mapa.
 */
function ListaDoMapa({ nos, ordemInicial }: { nos: NoDeNivel[]; ordemInicial: number }) {
  const { jornada } = useDados()
  const profissao = acharProfissao(jornada?.profissaoId)
  const [aberto, setAberto] = useState<number>(ordemInicial)
  if (!profissao) return null

  const modulos = modulosDaProfissao(profissao.id)

  return (
    <ol className="flex flex-col gap-3">
      {nos.map((no) => {
        const expandido = aberto === no.nivel.ordem
        const competencias = profissao.competencias.filter((c) => c.nivel === no.nivel.ordem)
        return (
          <li key={no.nivel.ordem}>
            <div className={cn("superficie rounded-ds-surface border", expandido ? "border-primary/40" : "border-hairline")}>
              <button
                type="button"
                aria-expanded={expandido}
                onClick={() => setAberto(expandido ? 0 : no.nivel.ordem)}
                className="flex w-full items-center gap-3 p-4 text-left pointer-coarse:min-h-11"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full font-display text-[13px] font-semibold",
                    no.atual
                      ? "realce-interno bg-primary text-primary-ink"
                      : "superficie-elevada border border-hairline text-ink"
                  )}
                >
                  {no.nivel.ordem}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-ink">{no.nivel.nome}</span>
                  <span className="block text-[12px] text-muted">{no.percentual}% concluído</span>
                </span>
                <SeloEstado estado={no.estado} className="shrink-0" />
                <Icone
                  nome={expandido ? "esconder" : "virar"}
                  className="size-4 shrink-0 text-muted"
                />
              </button>

              {expandido && (
                <div className="border-t border-hairline p-4">
                  <p className="text-sm leading-relaxed text-muted">{no.nivel.descricao}</p>

                  {competencias.length > 0 && (
                    <ul className="mt-3 flex flex-col gap-2">
                      {competencias.map((competencia) => (
                        <li
                          key={competencia.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-ds-fine border border-hairline bg-elevated px-3 py-2 text-[13px]"
                        >
                          <span className="min-w-0 text-ink">{competencia.nome}</span>
                          <SeloEstado estado={estadoDaCompetencia(competencia, jornada, modulos)} />
                        </li>
                      ))}
                    </ul>
                  )}

                  <ul className="mt-3 flex flex-col gap-1.5">
                    {no.nivel.criterios.map((criterio) => (
                      <li key={criterio} className="flex gap-2 text-[13px] leading-relaxed text-muted">
                        <Icone nome="check" className="mt-0.5 size-3.5 shrink-0 text-success" />
                        <span className="min-w-0">{criterio}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
