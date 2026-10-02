"use client"

import { useState } from "react"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { PainelVideo } from "@/components/app/aprender/painel-video"
import { Icone } from "@/components/app/icone"
import { EstadoDaJornada, faltaNaJornada } from "@/components/app/estado-da-jornada"
import { BotaoLink } from "@/components/marketing/botao-link"
import {
  Badge,
  Button,
  Card,
  CardConteudo,
  CardTitulo,
  EstadoVazio,
  Input,
  Textarea,
} from "@/components/ui"
import { sistema } from "@/content/site"
import { acharProfissao, desafiosDaProfissao } from "@/lib/catalogo"
import { useDados } from "@/lib/store"
import type { Desafio, Evidencia } from "@/lib/types"

const textos = sistema.praticar

/**
 * A prática (PRA-01): desafios contextualizados com cenário, objetivo,
 * restrições, entrega e rubrica à vista ANTES de começar. A evidência aceita
 * rascunho e envio final (PRA-03), o feedback vem por critério com a fonte
 * declarada (PRA-04), e virar case pede consentimento explícito (PRA-05).
 */
export default function PaginaPraticar() {
  const { jornada } = useDados()
  const profissao = acharProfissao(jornada?.profissaoId)
  const desafios = jornada?.profissaoId ? desafiosDaProfissao(jornada.profissaoId) : []

  const [desafioAbertoId, setDesafioAbertoId] = useState<string | null>(null)

  // Praticar precisa de profissão E de nível: os desafios vêm priorizados
  // pelas lacunas do diagnóstico. O vazio diz a primeira coisa que falta.
  const falta = faltaNaJornada(jornada, profissao, "nivel")
  if (falta || !jornada || !profissao) {
    return (
      <>
        <CabecalhoPagina titulo={textos.titulo} descricao={textos.descricao} />
        <EstadoDaJornada
          falta={falta ?? "nivel"}
          icone="praticar"
          profissao={profissao}
          tour="praticar"
        />
      </>
    )
  }

  if (desafios.length === 0) {
    return (
      <>
        <CabecalhoPagina titulo={textos.titulo} descricao={textos.descricao} />
        <div className="superficie rounded-ds-surface border border-hairline" data-tour="praticar">
          <EstadoVazio
            icone={<Icone nome="praticar" />}
            titulo={textos.emPreparacao.titulo}
            texto={textos.emPreparacao.texto}
            acao={
              <BotaoLink href="/app/carreiras/ux-ui-designer" variante="secundaria">
                {textos.emPreparacao.acao}
              </BotaoLink>
            }
          />
        </div>
      </>
    )
  }

  const desafioAberto = desafios.find((desafio) => desafio.id === desafioAbertoId) ?? null

  if (desafioAberto) {
    return (
      <DetalheDoDesafio desafio={desafioAberto} aoVoltar={() => setDesafioAbertoId(null)} />
    )
  }

  return (
    <div data-tour="praticar">
      <CabecalhoPagina titulo={textos.titulo} descricao={textos.descricao} />
      <ListaDeDesafios desafios={desafios} aoAbrir={setDesafioAbertoId} />
    </div>
  )
}

function ListaDeDesafios({
  desafios,
  aoAbrir,
}: {
  desafios: Desafio[]
  aoAbrir: (id: string) => void
}) {
  const { dados } = useDados()

  return (
    <ul className="grid gap-3 lg:grid-cols-2">
      {desafios.map((desafio) => {
        const evidencia = dados.evidencias.find((e) => e.desafioId === desafio.id) ?? null
        return (
          <li key={desafio.id}>
            <Card
              interativo
              className="relative flex h-full flex-col gap-3 p-5 has-[:focus-visible]:border-primary/40"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 text-[12px] text-muted">
                  <Icone nome="tempo" className="size-3.5 text-primary-accent" />
                  {desafio.etapas.length} etapas
                </span>
                {evidencia && (
                  <Badge
                    variante={evidencia.estado === "case" ? "sucesso" : evidencia.estado === "rascunho" ? "neutra" : "destaque"}
                    ponto
                  >
                    {textos.estados[evidencia.estado]}
                  </Badge>
                )}
              </div>

              <CardTitulo como="h2" className="text-[15px] leading-snug">
                <button
                  type="button"
                  onClick={() => aoAbrir(desafio.id)}
                  aria-label={`${textos.abrir}: ${desafio.nome}`}
                  className="text-left after:absolute after:inset-0"
                >
                  {desafio.nome}
                </button>
              </CardTitulo>

              <p className="line-clamp-3 text-[13px] leading-relaxed text-muted">{desafio.cenario}</p>

              <p className="mt-auto flex items-center gap-1.5 border-t border-hairline pt-3 text-[12px] text-muted">
                <Icone nome="evidencia" className="size-3.5" />
                {desafio.rubrica.length} critérios de avaliação
              </p>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}

function DetalheDoDesafio({ desafio, aoVoltar }: { desafio: Desafio; aoVoltar: () => void }) {
  const { dados, jornada, criarEvidencia, atualizarEvidencia, registrarSessao } = useDados()

  const evidencia = dados.evidencias.find((e) => e.desafioId === desafio.id) ?? null
  const [texto, setTexto] = useState(evidencia?.texto ?? "")
  const [link, setLink] = useState(evidencia?.link ?? "")
  const [erro, setErro] = useState("")
  const [aviso, setAviso] = useState("")

  const competencia = acharProfissao(jornada?.profissaoId)?.competencias.find(
    (c) => c.id === desafio.competenciaId
  )

  function salvar(estado: Evidencia["estado"]) {
    if (estado !== "rascunho" && !texto.trim()) {
      setErro(textos.envio.textoObrigatorio)
      return
    }
    setErro("")

    const base = {
      desafioId: desafio.id,
      habilidade: competencia?.nome ?? desafio.nome,
      origem: "tarefa" as const,
      estado,
      texto: texto.trim(),
      link: link.trim(),
      feedback: null,
      fonteFeedback: null,
      consentimentoCase: false,
    }

    if (evidencia) atualizarEvidencia(evidencia.id, { estado, texto: texto.trim(), link: link.trim() })
    else criarEvidencia(base)

    if (estado === "enviada") registrarSessao("pratica", 30)
    setAviso(estado === "rascunho" ? textos.envio.rascunhoSalvo : textos.envio.enviada)
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-2 border-b border-hairline pb-5">
        <button
          type="button"
          onClick={aoVoltar}
          className="-mx-2 inline-flex w-fit items-center gap-1.5 rounded-ds px-2 py-1.5 text-[13px] text-muted transition-colors hover:text-ink pointer-coarse:min-h-11"
        >
          <Icone nome="seta-esquerda" className="size-4" />
          {textos.voltar}
        </button>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h1 className="text-xl text-ink sm:text-2xl">{desafio.nome}</h1>
          {evidencia && (
            <Badge variante={evidencia.estado === "case" ? "sucesso" : "destaque"} ponto>
              {textos.estados[evidencia.estado]}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
        {/* A navegação lateral com as etapas do desafio (PRA-02). */}
        <nav aria-label={textos.etapasRotulo} className="lg:sticky lg:top-4">
          <h2 className="mb-2 text-[11px] font-medium tracking-wide text-muted uppercase">
            {textos.etapasRotulo}
          </h2>
          <ol className="flex flex-col gap-1.5">
            {desafio.etapas.map((etapa, indice) => (
              <li
                key={etapa}
                className="superficie flex items-start gap-2.5 rounded-ds-fine border border-hairline px-3 py-2.5 text-[13px] leading-relaxed text-ink"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/12 text-[11px] font-semibold text-primary-accent"
                >
                  {indice + 1}
                </span>
                <span className="min-w-0">{etapa}</span>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex min-w-0 flex-col gap-5">
          <PainelVideo
            titulo={desafio.videoTitulo}
            duracaoMin={desafio.videoDuracaoMin}
            transcricao={desafio.cenario}
            concluido={false}
            aoConcluir={() => registrarSessao("video", desafio.videoDuracaoMin)}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <BlocoDeTexto rotulo={textos.cenarioRotulo} texto={desafio.cenario} />
            <BlocoDeTexto rotulo={textos.objetivoRotulo} texto={desafio.objetivo} />
          </div>

          <div className="superficie rounded-ds-surface border border-hairline p-4">
            <h3 className="text-[11px] font-medium tracking-wide text-muted uppercase">
              {textos.restricoesRotulo}
            </h3>
            <ul className="mt-2 flex flex-col gap-1.5">
              {desafio.restricoes.map((restricao) => (
                <li key={restricao} className="flex gap-2 text-[13px] leading-relaxed text-muted">
                  <Icone nome="alerta" className="mt-0.5 size-3.5 shrink-0 text-warning" />
                  <span className="min-w-0">{restricao}</span>
                </li>
              ))}
            </ul>
          </div>

          <BlocoDeTexto rotulo={textos.entregaRotulo} texto={desafio.entrega} />

          {/* A rubrica: como a avaliação acontece, sabida antes de começar. */}
          <section aria-label={textos.rubricaRotulo}>
            <h3 className="mb-2 flex items-center gap-2 font-display text-sm text-ink">
              <Icone nome="evidencia" className="size-4 text-primary-accent" />
              {textos.rubricaRotulo}
            </h3>
            <dl className="flex flex-col gap-1.5">
              {desafio.rubrica.map((item) => (
                <div
                  key={item.criterio}
                  className="superficie-elevada flex flex-wrap gap-x-3 gap-y-1 rounded-ds-fine border border-hairline px-3.5 py-2.5 text-[13px]"
                >
                  <dt className="min-w-[110px] font-medium text-ink">{item.criterio}</dt>
                  <dd className="min-w-0 flex-1 leading-relaxed text-muted">{item.descricao}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* O feedback por critério, com a fonte declarada (PRA-04). */}
          {evidencia?.feedback && (
            <Card>
              <CardConteudo className="flex flex-col gap-3 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 font-display text-sm text-ink">
                    <Icone nome="acertei" className="size-4 text-success" />
                    {textos.feedback.titulo}
                  </h3>
                  {evidencia.fonteFeedback && (
                    <Badge variante="neutra">{textos.feedback.fonte[evidencia.fonteFeedback]}</Badge>
                  )}
                </div>
                <dl className="flex flex-col gap-1.5">
                  {evidencia.feedback.map((item) => (
                    <div
                      key={item.criterio}
                      className="superficie-elevada rounded-ds-fine border border-hairline px-3.5 py-2.5 text-[13px]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <dt className="font-medium text-ink">{item.criterio}</dt>
                        <Badge variante={item.nota === "Ótimo" ? "sucesso" : "destaque"}>{item.nota}</Badge>
                      </div>
                      <dd className="mt-1 leading-relaxed text-muted">{item.comentario}</dd>
                    </div>
                  ))}
                </dl>

                {evidencia.estado === "case" ? (
                  <p className="flex gap-2 rounded-ds-fine border border-success/25 bg-success/12 p-3 text-[13px] text-success">
                    <Icone nome="conquista" className="mt-0.5 size-4 shrink-0" />
                    {textos.feedback.viraouCase}
                  </p>
                ) : (
                  <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-relaxed text-ink">
                    <input
                      type="checkbox"
                      checked={evidencia.consentimentoCase}
                      onChange={(evento) => {
                        // Case só com consentimento explícito (PRA-05 e RNK-05).
                        atualizarEvidencia(evidencia.id, {
                          consentimentoCase: evento.target.checked,
                          estado: evento.target.checked ? "case" : "avaliada",
                        })
                      }}
                      className="mt-0.5 size-4 shrink-0 accent-[var(--ds-primary)]"
                    />
                    {textos.feedback.consentimento}
                  </label>
                )}
              </CardConteudo>
            </Card>
          )}

          {/* O envio de evidência: rascunho e final (PRA-03). */}
          <Card>
            <CardConteudo className="flex flex-col gap-4 p-5">
              <h3 className="flex items-center gap-2 font-display text-sm text-ink">
                <Icone nome="enviar" className="size-4 text-primary-accent" />
                {textos.envio.titulo}
              </h3>

              <Textarea
                rotulo={textos.envio.campoTexto}
                placeholder={textos.envio.exemploTexto}
                erro={erro || undefined}
                value={texto}
                onChange={(evento) => {
                  setTexto(evento.target.value)
                  if (erro) setErro("")
                }}
                rows={5}
              />

              <Input
                rotulo={textos.envio.campoLink}
                placeholder={textos.envio.exemploLink}
                value={link}
                onChange={(evento) => setLink(evento.target.value)}
                type="url"
                inputMode="url"
              />

              <div className="flex flex-wrap gap-2">
                <Button
                  iconeDireita={<Icone nome="enviar" />}
                  onClick={() => salvar("enviada")}
                >
                  {textos.envio.enviarFinal}
                </Button>
                <Button variante="secundaria" onClick={() => salvar("rascunho")}>
                  {textos.envio.salvarRascunho}
                </Button>
              </div>

              <p role="status" aria-live="polite" className="text-[13px] text-muted">
                {aviso}
              </p>
            </CardConteudo>
          </Card>
        </div>
      </div>
    </>
  )
}

function BlocoDeTexto({ rotulo, texto }: { rotulo: string; texto: string }) {
  return (
    <div className="superficie rounded-ds-surface border border-hairline p-4">
      <h3 className="text-[11px] font-medium tracking-wide text-muted uppercase">{rotulo}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink">{texto}</p>
    </div>
  )
}
