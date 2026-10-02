"use client"

import { useMemo } from "react"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { Icone } from "@/components/app/icone"
import { EstadoDaJornada, faltaNaJornada } from "@/components/app/estado-da-jornada"
import { BarraProgresso, Card, CardConteudo } from "@/components/ui"
import { palavras, sistema } from "@/content/site"
import { acharProfissao } from "@/lib/catalogo"
import { contar } from "@/lib/formato"
import {
  dominioDaCompetencia,
  formatarHoras,
  minutosPorDia,
  origemDoDominio,
  percentualDoNivel,
  sequenciaDeDias,
} from "@/lib/jornada"
import { useDados } from "@/lib/store"

const textos = sistema.progresso

/**
 * O progresso (PRO-01): os indicadores principais, a dedicação medida com
 * transparência (PRO-02), o domínio por competência COM A ORIGEM de cada
 * número (PRO-03) e a linha do tempo (PRO-04). A pessoa sai daqui sabendo por
 * que cada número é o que é.
 */
export default function PaginaProgresso() {
  const { dados, jornada } = useDados()
  const profissao = acharProfissao(jornada?.profissaoId)

  const dedicacao = useMemo(() => minutosPorDia(dados.sessoes), [dados.sessoes])
  const totalMinutos = dados.sessoes.reduce((total, sessao) => total + sessao.minutos, 0)

  // Progresso só existe depois da primeira ação: profissão, nível e a
  // primeira aula. O vazio diz a primeira coisa que falta (RB-10).
  const falta = faltaNaJornada(jornada, profissao, "curso", dados)
  if (falta || !jornada || !profissao || !jornada.resultado) {
    return (
      <>
        <CabecalhoPagina titulo={textos.titulo} descricao={textos.descricao} />
        <EstadoDaJornada
          falta={falta ?? "curso"}
          icone="progresso"
          profissao={profissao}
          tour="progresso"
        />
      </>
    )
  }

  const nivel = jornada.resultado.nivel
  const percentual = percentualDoNivel(nivel, profissao.competencias, jornada.competenciasConcluidas)
  const restantes = profissao.competencias.filter(
    (c) => c.nivel === nivel && !jornada.competenciasConcluidas.includes(c.id)
  ).length
  const enviadas = dados.evidencias.filter((e) => e.estado !== "rascunho").length
  const cases = dados.evidencias.filter((e) => e.estado === "case").length
  const maiorDia = Math.max(...dedicacao.map((dia) => dia.minutos), 1)

  return (
    <div data-tour="progresso">
      <CabecalhoPagina titulo={textos.titulo} descricao={textos.descricao} />

      <dl className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        <Indicador rotulo={textos.indicadores.objetivo} valor={profissao.nome} icone="carreiras" />
        <Indicador rotulo={textos.indicadores.nivel} valor={`${nivel} de 5`} icone="nivel" />
        <Indicador rotulo={textos.indicadores.proximoNivel} valor={`${percentual}%`} icone="progresso" />
        <Indicador
          rotulo={textos.indicadores.competencias}
          valor={String(restantes)}
          icone="pendente"
        />
        <Indicador rotulo={textos.indicadores.horas} valor={formatarHoras(totalMinutos)} icone="tempo" />
        <Indicador rotulo={textos.indicadores.desafios} valor={String(enviadas)} icone="praticar" />
        <Indicador rotulo={textos.indicadores.cases} valor={String(cases)} icone="evidencia" />
        <Indicador
          rotulo={textos.indicadores.sequencia}
          valor={contar(sequenciaDeDias(dados.sessoes), palavras.dia.singular, palavras.dia.plural)}
          icone="sequencia"
        />
      </dl>

      <div className="mt-6 grid gap-5 lg:grid-cols-2 lg:items-start">
        {/* A dedicação dos últimos 7 dias, em SVG à mão: os tokens pintam e o
            texto ao lado conta a mesma história pra quem não vê o gráfico. */}
        <Card>
          <CardConteudo className="p-5">
            <h2 className="font-display text-sm text-ink">{textos.dedicacao.titulo}</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">{textos.dedicacao.descricao}</p>

            <div aria-hidden="true" className="mt-4 flex h-28 items-end gap-1.5 border-b border-hairline pb-px">
              {dedicacao.map((dia) => (
                <div key={dia.data} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                  <span
                    className={
                      dia.minutos > 0 ? "w-full rounded-t-[3px] bg-primary" : "w-full rounded-t-[3px] bg-elevated"
                    }
                    style={{ height: `${Math.max((dia.minutos / maiorDia) * 100, 4)}%` }}
                  />
                </div>
              ))}
            </div>
            <div aria-hidden="true" className="mt-1.5 flex gap-1.5">
              {dedicacao.map((dia) => (
                <span key={dia.data} className="min-w-0 flex-1 text-center text-[10px] tabular-nums text-muted">
                  {dia.data.slice(8)}
                </span>
              ))}
            </div>

            {/* A mesma informação em texto, pro leitor de tela (dl/dt/dd). */}
            <dl className="sr-only">
              {dedicacao.map((dia) => (
                <div key={dia.data}>
                  <dt>{dia.data}</dt>
                  <dd>{formatarHoras(dia.minutos)}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-3 text-[13px] text-muted">
              <strong className="font-medium text-ink">
                {formatarHoras(dedicacao.reduce((total, dia) => total + dia.minutos, 0))}
              </strong>{" "}
              {textos.dedicacao.total}
            </p>
          </CardConteudo>
        </Card>

        {/* Domínio por competência, com a origem de cada número (PRO-03). */}
        <Card>
          <CardConteudo className="p-5">
            <h2 className="font-display text-sm text-ink">{textos.porCompetencia.titulo}</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">
              {textos.porCompetencia.descricao}
            </p>

            <dl className="mt-4 flex flex-col gap-3.5">
              {profissao.competencias.slice(0, 6).map((competencia) => {
                const valor = dominioDaCompetencia(competencia, jornada)
                const origem = origemDoDominio(competencia, jornada)
                return (
                  <div key={competencia.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="min-w-0 truncate text-sm text-ink">{competencia.nome}</dt>
                      <dd className="m-0 shrink-0 text-[12px] tabular-nums text-muted">
                        {valor}% · {origem}
                      </dd>
                    </div>
                    <BarraProgresso valor={valor} rotulo={competencia.nome} tamanho="sm" className="mt-1.5" />
                  </div>
                )
              })}
            </dl>
          </CardConteudo>
        </Card>
      </div>

      <LinhaDoTempo />
    </div>
  )
}

function Indicador({ rotulo, valor, icone }: { rotulo: string; valor: string; icone: string }) {
  return (
    <div className="superficie rounded-ds-surface border border-hairline p-4">
      <dt className="flex items-center gap-1.5 text-[11px] tracking-wide text-muted uppercase">
        <Icone nome={icone} className="size-3.5 text-primary-accent" />
        {rotulo}
      </dt>
      <dd className="mt-1.5 truncate font-display text-lg text-ink tabular-nums">{valor}</dd>
    </div>
  )
}

/** A linha do tempo (PRO-04): diagnóstico, sessões, evidências e cases. */
function LinhaDoTempo() {
  const { dados, jornada } = useDados()

  const eventos = useMemo(() => {
    const lista: Array<{ data: string; icone: string; texto: string }> = []

    if (jornada?.resultado) {
      lista.push({
        // Resultados antigos guardaram só o dia; os novos, o instante. O
        // corte deixa os dois no mesmo formato de dia da linha do tempo.
        data: jornada.resultado.data.slice(0, 10),
        icone: "nivel",
        texto: textos.historico.diagnostico.replace("{nivel}", String(jornada.resultado.nivel)),
      })
    }
    for (const evidencia of dados.evidencias) {
      lista.push({
        data: evidencia.criadoEm.slice(0, 10),
        icone: evidencia.estado === "case" ? "conquista" : "evidencia",
        texto:
          evidencia.estado === "case"
            ? `${textos.historico.caseFeito}: ${evidencia.habilidade}`
            : `${textos.historico.evidencia}: ${evidencia.habilidade}`,
      })
    }
    // Sessões agrupadas por dia e tipo, senão a linha vira um extrato bancário.
    const porDia = new Map<string, number>()
    for (const sessao of dados.sessoes) {
      porDia.set(sessao.data, (porDia.get(sessao.data) ?? 0) + sessao.minutos)
    }
    for (const [data, minutos] of porDia) {
      lista.push({
        data,
        icone: "tempo",
        texto: `${textos.historico.sessao.video}: ${formatarHoras(minutos)}`,
      })
    }

    return lista.sort((a, b) => b.data.localeCompare(a.data)).slice(0, 10)
  }, [dados, jornada])

  if (eventos.length === 0) return null

  return (
    <section aria-labelledby="historico-titulo" className="mt-6">
      <h2 id="historico-titulo" className="mb-3 font-display text-sm text-ink">
        {textos.historico.titulo}
      </h2>
      <ol className="flex flex-col">
        {eventos.map((evento, indice) => (
          <li key={`${evento.data}-${indice}`} className="flex gap-3">
            <span aria-hidden="true" className="flex flex-col items-center">
              <span className="superficie-elevada grid size-8 shrink-0 place-items-center rounded-full border border-hairline text-primary-accent">
                <Icone nome={evento.icone} className="size-3.5" />
              </span>
              {indice < eventos.length - 1 && (
                <span className="min-h-3 w-px flex-1 border-l border-dashed border-hairline" />
              )}
            </span>
            <div className="min-w-0 pb-4">
              <p className="text-[12px] tabular-nums text-muted">{formatarDataCurta(evento.data)}</p>
              <p className="text-sm text-ink">{evento.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** "23/08", montada por componente pra não cair de fuso. */
function formatarDataCurta(iso: string) {
  const [, mes, dia] = iso.split("-")
  return `${dia}/${mes}`
}
