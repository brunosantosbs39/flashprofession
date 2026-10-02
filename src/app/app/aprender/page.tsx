"use client"

import { useMemo, useState } from "react"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { PainelVideo } from "@/components/app/aprender/painel-video"
import { Icone } from "@/components/app/icone"
import { SeloEstado } from "@/components/app/selo-estado"
import { EstadoDaJornada, faltaNaJornada } from "@/components/app/estado-da-jornada"
import { BotaoLink } from "@/components/marketing/botao-link"
import {
  BarraProgresso,
  Button,
  Card,
  CardConteudo,
  EstadoVazio,
  Input,
  Modal,
} from "@/components/ui"
import { sistema } from "@/content/site"
import { acharProfissao, modulosDaProfissao } from "@/lib/catalogo"
import { avaliacaoAprovada, estadoDaCompetencia, progressoDoModulo } from "@/lib/jornada"
import { NOTA_DE_CORTE } from "@/lib/modelo"
import { cn } from "@/lib/cn"
import { useDados } from "@/lib/store"
import type { Modulo } from "@/lib/types"

const textos = sistema.aprender

/**
 * O aprendizado guiado (APR-01): navegação de módulos à esquerda, a aula no
 * centro, as tarefas embaixo e a validação no fim. Cada unidade liga
 * competência → objetivo → conteúdo → tarefa → validação, e concluir vídeo
 * NUNCA conclui a competência sozinho (regra RB-02): quem conclui é a
 * validação aprovada.
 */
export default function PaginaAprender() {
  const { jornada, atualizarJornada, registrarSessao } = useDados()
  const profissao = acharProfissao(jornada?.profissaoId)
  const modulos = useMemo(
    () => (jornada?.profissaoId ? modulosDaProfissao(jornada.profissaoId) : []),
    [jornada?.profissaoId]
  )

  // A retomada abre o ponto mais útil (APR-07), não a última URL visitada.
  const [moduloAberto, setModuloAberto] = useState<string | null>(null)
  const [conteudoAberto, setConteudoAberto] = useState<string | null>(null)
  const [modalExterno, setModalExterno] = useState(false)
  const [ondeAprendeu, setOndeAprendeu] = useState("")

  // A trilha precisa de profissão E de nível: o vazio diz só a primeira coisa
  // que falta (RB-10).
  const falta = faltaNaJornada(jornada, profissao, "nivel")
  if (falta || !jornada || !profissao || !jornada.resultado) {
    return (
      <>
        <CabecalhoPagina titulo={textos.titulo} descricao={textos.descricao} />
        <EstadoDaJornada
          falta={falta ?? "nivel"}
          icone="aprender"
          profissao={profissao}
          tour="aprender"
        />
      </>
    )
  }

  if (modulos.length === 0) {
    return (
      <>
        <CabecalhoPagina titulo={textos.titulo} descricao={textos.descricao} />
        <div className="superficie rounded-ds-surface border border-hairline" data-tour="aprender">
          <EstadoVazio
            icone={<Icone nome="aprender" />}
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

  const idModulo = moduloAberto ?? jornada.retomada?.moduloId ?? modulos[0].id
  const modulo = modulos.find((m) => m.id === idModulo) ?? modulos[0]
  const idConteudo =
    conteudoAberto ??
    (jornada.retomada?.moduloId === modulo.id ? jornada.retomada.conteudoId : null) ??
    modulo.conteudos[0].id
  const conteudo = modulo.conteudos.find((c) => c.id === idConteudo) ?? modulo.conteudos[0]

  const competencia = profissao.competencias.find((c) => c.id === modulo.competenciaId)

  return (
    <div data-tour="aprender">
      <CabecalhoPagina titulo={textos.titulo} descricao={textos.descricao} />

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        {/* A navegação lateral com módulos, aulas e estados (APR-03). */}
        <nav aria-label={textos.navegacaoRotulo} className="lg:sticky lg:top-4">
          <ul className="flex flex-col gap-3">
            {modulos.map((item) => {
              const aberto = item.id === modulo.id
              const percentual = progressoDoModulo(item, jornada)
              const comp = profissao.competencias.find((c) => c.id === item.competenciaId)
              const estado = comp ? estadoDaCompetencia(comp, jornada, modulos) : "nao-iniciado"

              return (
                <li key={item.id}>
                  <div
                    className={cn(
                      "superficie rounded-ds-surface border",
                      aberto ? "border-primary/40" : "border-hairline"
                    )}
                  >
                    <button
                      type="button"
                      aria-expanded={aberto}
                      onClick={() => {
                        setModuloAberto(item.id)
                        setConteudoAberto(item.conteudos[0].id)
                      }}
                      className="flex w-full flex-col gap-2 p-3.5 text-left pointer-coarse:min-h-11"
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="min-w-0 text-[13px] font-medium text-ink">{item.nome}</span>
                        <SeloEstado estado={estado} className="shrink-0" />
                      </div>
                      <BarraProgresso valor={percentual} rotulo={item.nome} tamanho="sm" />
                    </button>

                    {aberto && (
                      <ul className="border-t border-hairline p-2">
                        {item.conteudos.map((aula) => {
                          const vista = jornada.conteudosVistos.includes(aula.id)
                          const ativa = aula.id === conteudo.id
                          return (
                            <li key={aula.id}>
                              <button
                                type="button"
                                aria-current={ativa ? "true" : undefined}
                                onClick={() => setConteudoAberto(aula.id)}
                                className={cn(
                                  "flex w-full items-center gap-2 rounded-ds px-2.5 py-2 text-left text-[12.5px] transition-colors pointer-coarse:min-h-11",
                                  ativa
                                    ? "bg-elevated font-medium text-ink"
                                    : "text-muted hover:bg-elevated hover:text-ink"
                                )}
                              >
                                <Icone
                                  nome={vista ? "acertei" : "video"}
                                  className={cn("size-3.5 shrink-0", vista ? "text-success" : "text-muted")}
                                />
                                <span className="min-w-0 flex-1 truncate">{aula.titulo}</span>
                                <span className="shrink-0 text-[11px] tabular-nums text-muted">
                                  {aula.duracaoMin} {textos.videoDuracao}
                                </span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>

          <Button
            variante="fantasma"
            tamanho="sm"
            className="mt-3"
            iconeEsquerda={<Icone nome="evidencia" />}
            onClick={() => setModalExterno(true)}
          >
            {textos.externo.abrir}
          </Button>
        </nav>

        <div className="flex min-w-0 flex-col gap-5">
          {/* A instrução acionável (APR-04): objetivo antes do play. */}
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted uppercase">
              <Icone nome="ideia" className="size-3.5 text-primary-accent" />
              {textos.porqueImporta}
            </p>
            <h2 className="mt-1 font-display text-lg text-ink">{modulo.nome}</h2>
            <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted">{modulo.objetivo}</p>
          </div>

          <PainelVideo
            key={conteudo.id}
            titulo={conteudo.titulo}
            duracaoMin={conteudo.duracaoMin}
            transcricao={conteudo.transcricao}
            concluido={jornada.conteudosVistos.includes(conteudo.id)}
            aoConcluir={() => {
              const indice = modulo.conteudos.findIndex((c) => c.id === conteudo.id)
              const proxima = modulo.conteudos[indice + 1] ?? conteudo
              atualizarJornada({
                conteudosVistos: [...new Set([...jornada.conteudosVistos, conteudo.id])],
                retomada: { moduloId: modulo.id, conteudoId: proxima.id },
              })
              registrarSessao("video", conteudo.duracaoMin)
            }}
          />

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="superficie rounded-ds-surface border border-hairline p-4">
              <dt className="text-[11px] font-medium tracking-wide text-muted uppercase">
                {textos.objetivoRotulo}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink">{conteudo.objetivo}</dd>
            </div>
            <div className="superficie rounded-ds-surface border border-hairline p-4">
              <dt className="text-[11px] font-medium tracking-wide text-muted uppercase">
                {textos.resultadoRotulo}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink">{conteudo.resultadoEsperado}</dd>
            </div>
          </dl>

          {/* As tarefas da unidade, com o trio que o requisito pede. */}
          <section aria-label={textos.tarefasRotulo}>
            <h3 className="mb-3 flex items-center gap-2 font-display text-sm text-ink">
              <Icone nome="praticar" className="size-4 text-primary-accent" />
              {textos.tarefasRotulo}
            </h3>
            <ul className="flex flex-col gap-3">
              {modulo.tarefas.map((tarefa) => {
                const feita = jornada.tarefasFeitas.includes(tarefa.id)
                return (
                  <li key={tarefa.id} className="superficie rounded-ds-surface border border-hairline p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-ink">{tarefa.titulo}</p>
                      <Button
                        variante={feita ? "fantasma" : "secundaria"}
                        tamanho="sm"
                        disabled={feita}
                        iconeEsquerda={<Icone nome={feita ? "acertei" : "check"} />}
                        className={cn(feita && "text-success")}
                        onClick={() => {
                          atualizarJornada({
                            tarefasFeitas: [...new Set([...jornada.tarefasFeitas, tarefa.id])],
                          })
                          registrarSessao("pratica", 20)
                        }}
                      >
                        {feita ? textos.tarefa.feita : textos.tarefa.concluir}
                      </Button>
                    </div>
                    <dl className="mt-3 grid gap-2.5 text-[13px] sm:grid-cols-3">
                      <div>
                        <dt className="font-medium text-muted">{textos.tarefa.oQueFazer}</dt>
                        <dd className="mt-0.5 leading-relaxed text-ink">{tarefa.oQueFazer}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted">{textos.tarefa.oQueEntregar}</dt>
                        <dd className="mt-0.5 leading-relaxed text-ink">{tarefa.oQueEntregar}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted">{textos.tarefa.comoSaber}</dt>
                        <dd className="mt-0.5 leading-relaxed text-ink">{tarefa.comoSaberQueFicouBom}</dd>
                      </div>
                    </dl>
                  </li>
                )
              })}
            </ul>
          </section>

          <Validacao modulo={modulo} competenciaId={competencia?.id ?? ""} />
        </div>
      </div>

      {/* Registrar aprendizado externo (APR-06): valida, não repete. */}
      <Modal
        aberto={modalExterno}
        aoFechar={() => setModalExterno(false)}
        titulo={textos.externo.titulo}
        descricao={textos.externo.texto}
        rodape={
          <>
            <Button variante="secundaria" onClick={() => setModalExterno(false)}>
              {sistema.acoes.cancelar}
            </Button>
            <Button
              onClick={() => {
                setModalExterno(false)
                setOndeAprendeu("")
                const alvo = document.getElementById("validacao-do-modulo")
                alvo?.scrollIntoView({ block: "start" })
                alvo?.focus()
              }}
            >
              {textos.externo.acao}
            </Button>
          </>
        }
      >
        <Input
          rotulo={textos.externo.campoOnde}
          placeholder={textos.externo.exemploOnde}
          value={ondeAprendeu}
          onChange={(evento) => setOndeAprendeu(evento.target.value)}
        />
      </Modal>
    </div>
  )
}

/**
 * A validação do módulo (APR-05): nota de corte, revisão apontada por questão
 * errada e nova tentativa com VARIAÇÃO, nunca as mesmas perguntas.
 */
function Validacao({ modulo, competenciaId }: { modulo: Modulo; competenciaId: string }) {
  const { jornada, atualizarJornada, registrarSessao } = useDados()
  const [respostas, setRespostas] = useState<Record<number, number>>({})
  const [erro, setErro] = useState("")
  const [revisoes, setRevisoes] = useState<string[]>([])
  const [aviso, setAviso] = useState("")

  if (!jornada) return null

  const registro = jornada.avaliacoes[modulo.id]
  const tentativas = registro?.tentativas ?? 0
  const questoes = tentativas % 2 === 0 ? modulo.avaliacao : modulo.avaliacaoVariacao
  const corte = Math.ceil(questoes.length * NOTA_DE_CORTE)

  function enviar() {
    if (Object.keys(respostas).length < questoes.length) {
      setErro(textos.validacao.responda)
      return
    }
    const erradas = questoes.filter((questao, indice) => respostas[indice] !== questao.certa)
    const acertos = questoes.length - erradas.length
    const aprovado = avaliacaoAprovada(acertos, questoes.length)

    atualizarJornada({
      avaliacoes: {
        ...jornada!.avaliacoes,
        [modulo.id]: { acertos, total: questoes.length, aprovado, tentativas: tentativas + 1 },
      },
      // A competência só conclui com validação aprovada (RB-02).
      competenciasConcluidas: aprovado
        ? [...new Set([...jornada!.competenciasConcluidas, competenciaId])]
        : jornada!.competenciasConcluidas,
    })
    registrarSessao("avaliacao", 10)
    setRevisoes(erradas.map((questao) => questao.revisar))
    setAviso(
      `${textos.validacao.acertos
        .replace("{acertos}", String(acertos))
        .replace("{total}", String(questoes.length))} ${
        aprovado ? textos.validacao.resultadoAprovado : textos.validacao.resultadoReprovado
      }`
    )
    setErro("")
  }

  const aprovado = registro?.aprovado ?? false

  return (
    <Card id="validacao-do-modulo" tabIndex={-1} className="scroll-mt-4 focus:outline-none">
      <CardConteudo className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 font-display text-base text-ink">
            <Icone nome="evidencia" className="size-4 text-primary-accent" />
            {textos.validacao.titulo}
          </h3>
          {registro && (
            <SeloEstado estado={aprovado ? "concluido" : "aguardando-validacao"} />
          )}
        </div>
        <p className="text-[13px] leading-relaxed text-muted">
          {textos.validacao.texto.replace("{corte}", `${corte} de ${questoes.length}`)}
          {tentativas > 0 && ` ${textos.validacao.tentativa} ${tentativas + 1}.`}
        </p>

        {aprovado ? (
          <p className="flex gap-2 rounded-ds-fine border border-success/25 bg-success/12 p-3 text-[13px] leading-relaxed text-success">
            <Icone nome="acertei" className="mt-0.5 size-4 shrink-0" />
            {textos.validacao.resultadoAprovado}
          </p>
        ) : (
          <>
            <ol className="flex flex-col gap-4">
              {questoes.map((questao, indice) => (
                <li key={questao.enunciado}>
                  <fieldset className="border-0 p-0">
                    <legend className="text-sm font-medium text-ink">
                      {indice + 1}. {questao.enunciado}
                    </legend>
                    <div className="mt-2 flex flex-col gap-1.5">
                      {questao.opcoes.map((opcao, indiceOpcao) => {
                        const marcado = respostas[indice] === indiceOpcao
                        return (
                          <label
                            key={opcao}
                            className={cn(
                              "flex cursor-pointer items-start gap-2.5 rounded-ds-fine border px-3 py-2.5 text-[13px] leading-relaxed transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary",
                              marcado
                                ? "border-primary bg-primary/8 text-ink"
                                : "superficie-elevada border-hairline text-ink hover:border-primary/40"
                            )}
                          >
                            <input
                              type="radio"
                              name={`${modulo.id}-${tentativas}-${indice}`}
                              checked={marcado}
                              onChange={() => {
                                setErro("")
                                setRespostas((atuais) => ({ ...atuais, [indice]: indiceOpcao }))
                              }}
                              className="mt-0.5 size-4 shrink-0 accent-[var(--ds-primary)]"
                            />
                            <span className="min-w-0">{opcao}</span>
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>
                </li>
              ))}
            </ol>

            {erro && (
              <p role="alert" className="text-[13px] text-danger">
                {erro}
              </p>
            )}

            <Button
              className="self-start"
              iconeDireita={<Icone nome="enviar" />}
              onClick={enviar}
            >
              {registro ? textos.validacao.tentarDeNovo : textos.validacao.enviar}
            </Button>
          </>
        )}

        {/* O que revisar, apontado por questão errada (APR-05). */}
        {revisoes.length > 0 && !aprovado && (
          <div className="rounded-ds-fine border border-warning/25 bg-warning/12 p-3.5">
            <p className="flex items-center gap-1.5 text-[12px] font-medium text-warning">
              <Icone nome="alerta" className="size-3.5" />
              {textos.validacao.revisarTitulo}
            </p>
            <ul className="mt-1.5 flex flex-col gap-1 text-[13px] leading-relaxed text-ink">
              {[...new Set(revisoes)].map((revisao) => (
                <li key={revisao}>{revisao}</li>
              ))}
            </ul>
          </div>
        )}

        {/* O resultado é anunciado pra quem não está olhando a tela. */}
        <p role="status" className="sr-only">
          {aviso}
        </p>
      </CardConteudo>
    </Card>
  )
}
