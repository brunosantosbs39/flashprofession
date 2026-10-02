"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { Icone } from "@/components/app/icone"
import { SeloEstado } from "@/components/app/selo-estado"
import { BotaoLink } from "@/components/marketing/botao-link"
import {
  BarraProgresso,
  Badge,
  Button,
  Card,
  CardConteudo,
  Confirmar,
  EstadoVazio,
  Textarea,
} from "@/components/ui"
import { rotulosAutopercepcao, sistema } from "@/content/site"
import { acharProfissao, habilidadesDaProfissao, questoesDaProfissao } from "@/lib/catalogo"
import { calcularResultado } from "@/lib/jornada"
import { AUTOPERCEPCOES } from "@/lib/modelo"
import { useDados } from "@/lib/store"
import type { Autopercepcao, Questao } from "@/lib/types"

const textos = sistema.diagnostico

/**
 * O nivelamento (DIA-01): contexto → autoavaliação → teste → resultado.
 *
 * Cada resposta é gravada na jornada no momento em que acontece (ONB-04):
 * sair no meio e voltar amanhã continua exatamente da mesma pergunta. Durante
 * o teste a resposta certa nunca aparece (DIA-06), e o resultado explica nível,
 * confiança e lacunas em vez de cuspir um número (DIA-07).
 */
export default function PaginaDiagnostico() {
  const { jornada } = useDados()
  const profissao = acharProfissao(jornada?.profissaoId)

  if (!jornada || !profissao) {
    return (
      <>
        <CabecalhoPagina titulo={textos.titulo} />
        <div className="superficie rounded-ds-surface border border-hairline" data-tour="diagnostico">
          <EstadoVazio
            icone={<Icone nome="nivel" />}
            titulo={textos.semProfissao.titulo}
            texto={textos.semProfissao.texto}
            acao={
              <BotaoLink href="/app/carreiras" iconeDireita={<Icone nome="seta-direita" />} comChip>
                {textos.semProfissao.acao}
              </BotaoLink>
            }
          />
        </div>
      </>
    )
  }

  const etapaVisivel =
    jornada.etapa === "trilha" || jornada.etapa === "resultado"
      ? 3
      : jornada.etapa === "teste"
        ? 2
        : jornada.etapa === "autopercepcao" && Object.keys(jornada.autopercepcao).length > 0
          ? 1
          : jornada.etapa === "autopercepcao"
            ? 0
            : 0

  return (
    <div data-tour="diagnostico">
      <CabecalhoPagina
        titulo={`${textos.titulo}: ${profissao.nome}`}
        descricao={profissao.demo ? sistema.demonstracao : undefined}
      />

      <Passos etapaAtual={etapaVisivel} />

      {jornada.etapa === "autopercepcao" && Object.keys(jornada.autopercepcao).length === 0 && (
        <EtapaContexto />
      )}
      {jornada.etapa === "autopercepcao" && Object.keys(jornada.autopercepcao).length > 0 && (
        <EtapaAutopercepcao />
      )}
      {jornada.etapa === "teste" && <EtapaTeste />}
      {(jornada.etapa === "resultado" || jornada.etapa === "trilha") && jornada.resultado && (
        <EtapaResultado />
      )}
    </div>
  )
}

/** O indicador das quatro etapas (DIA-05): sempre visível, com a atual marcada. */
function Passos({ etapaAtual }: { etapaAtual: number }) {
  return (
    <ol className="mb-6 flex flex-wrap items-center gap-x-1 gap-y-2" aria-label={textos.etapaRotulo}>
      {textos.etapas.map((etapa, indice) => {
        const feita = indice < etapaAtual
        const atual = indice === etapaAtual
        return (
          <li key={etapa} className="flex items-center gap-1">
            <span
              aria-current={atual ? "step" : undefined}
              className={
                atual
                  ? "flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[12px] font-medium text-primary-ink"
                  : "flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] text-muted"
              }
            >
              {feita && <Icone nome="check" className="size-3 text-success" />}
              {etapa}
            </span>
            {indice < textos.etapas.length - 1 && (
              <Icone nome="proximo" className="size-3.5 text-muted" />
            )}
          </li>
        )
      })}
    </ol>
  )
}

/** Etapa 0: contexto e objetivo, antes de qualquer pergunta. */
function EtapaContexto() {
  const { atualizarJornada, jornada } = useDados()
  const habilidades = habilidadesDaProfissao(jornada?.profissaoId ?? "")

  return (
    <Card className="mx-auto max-w-[640px]">
      <CardConteudo className="flex flex-col gap-4 p-6 sm:p-8">
        <h2 className="font-display text-xl leading-snug text-balance text-ink">
          {textos.contexto.titulo}
        </h2>
        <p className="text-sm leading-relaxed text-muted">{textos.contexto.texto}</p>

        <ul className="flex flex-col gap-2">
          {textos.contexto.pontos.map((ponto) => (
            <li key={ponto} className="flex gap-2.5 text-sm leading-relaxed text-muted">
              <Icone nome="check" className="mt-0.5 size-4 shrink-0 text-success" />
              <span className="min-w-0">{ponto}</span>
            </li>
          ))}
        </ul>

        <Button
          tamanho="lg"
          className="mt-2 self-start"
          iconeDireita={<Icone nome="seta-direita" />}
          onClick={() => {
            // Marca a primeira habilidade como "não respondida ainda" pra etapa
            // de autoavaliação assumir a tela. O valor real vem da pessoa.
            const primeira = habilidades[0]
            if (primeira) atualizarJornada({ autopercepcao: { [primeira.id]: "nunca-vi" } })
          }}
        >
          {textos.contexto.comecar}
        </Button>
      </CardConteudo>
    </Card>
  )
}

/** Etapa 1: autodeclaração por habilidade (DIA-02). Hipótese, não prova. */
function EtapaAutopercepcao() {
  const { jornada, atualizarJornada } = useDados()
  const [erro, setErro] = useState("")

  const habilidades = habilidadesDaProfissao(jornada?.profissaoId ?? "").filter(
    (habilidade) => habilidade.nivel <= 3
  )

  if (!jornada) return null

  function continuar() {
    const faltando = habilidades.some((habilidade) => !jornada?.autopercepcao[habilidade.id])
    if (faltando) {
      setErro(textos.autopercepcao.responderTudo)
      return
    }
    atualizarJornada({ etapa: "teste" })
  }

  return (
    <div className="mx-auto max-w-[640px]">
      <h2 className="font-display text-lg text-ink">{textos.autopercepcao.titulo}</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">{textos.autopercepcao.texto}</p>

      <div className="mt-5 flex flex-col gap-3">
        {habilidades.map((habilidade) => (
          <fieldset
            key={habilidade.id}
            className="superficie rounded-ds-surface border border-hairline p-4"
          >
            <legend className="sr-only">
              {textos.autopercepcao.legenda} {habilidade.nome}
            </legend>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="min-w-[12rem] flex-1 text-sm font-medium text-ink">{habilidade.nome}</p>
              <div className="flex gap-1.5" role="radiogroup" aria-label={habilidade.nome}>
                {AUTOPERCEPCOES.map((valor) => {
                  const marcado = jornada.autopercepcao[habilidade.id] === valor
                  return (
                    <label
                      key={valor}
                      className={
                        marcado
                          ? "preenchimento-acao cursor-pointer rounded-full px-3 py-1.5 text-[13px] font-medium text-primary-ink pointer-coarse:min-h-11 pointer-coarse:inline-flex pointer-coarse:items-center"
                          : "superficie-elevada cursor-pointer rounded-full border border-hairline px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-primary/40 hover:text-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary pointer-coarse:min-h-11 pointer-coarse:inline-flex pointer-coarse:items-center"
                      }
                    >
                      <input
                        type="radio"
                        name={habilidade.id}
                        checked={marcado}
                        onChange={() => {
                          setErro("")
                          atualizarJornada({
                            autopercepcao: {
                              ...jornada.autopercepcao,
                              [habilidade.id]: valor as Autopercepcao,
                            },
                          })
                        }}
                        className="sr-only"
                      />
                      {rotulosAutopercepcao[valor]}
                    </label>
                  )
                })}
              </div>
            </div>
          </fieldset>
        ))}
      </div>

      {erro && (
        <p role="alert" className="mt-4 text-[13px] text-danger">
          {erro}
        </p>
      )}

      <Button
        tamanho="lg"
        className="mt-5"
        iconeDireita={<Icone nome="seta-direita" />}
        onClick={continuar}
      >
        {textos.autopercepcao.continuar}
      </Button>
    </div>
  )
}

/** Etapa 2: o teste, uma decisão por vez (DIA-04), com o porquê ao lado. */
function EtapaTeste() {
  const router = useRouter()
  const { jornada, atualizarJornada, registrarSessao } = useDados()
  const [rascunho, setRascunho] = useState<string | null>(null)
  const [erro, setErro] = useState("")
  const [confirmandoSaida, setConfirmandoSaida] = useState(false)

  const questoes = questoesDaProfissao(jornada?.profissaoId ?? "")

  if (!jornada) return null

  // Profissão sem banco de questões: resultado provisório, dito às claras.
  if (questoes.length === 0) {
    return (
      <Card className="mx-auto max-w-[640px]">
        <CardConteudo className="flex flex-col gap-4 p-6 sm:p-8">
          <SeloEstado estado="aguardando-validacao" className="self-start" />
          <h2 className="font-display text-lg text-ink">{textos.teste.semQuestoes.titulo}</h2>
          <p className="text-sm leading-relaxed text-muted">{textos.teste.semQuestoes.texto}</p>
          <Button
            tamanho="lg"
            className="self-start"
            iconeDireita={<Icone nome="seta-direita" />}
            onClick={() => {
              const resultado = calcularResultado(jornada)
              if (resultado) {
                atualizarJornada({ resultado, etapa: "resultado" })
                registrarSessao("avaliacao", 8)
              }
            }}
          >
            {textos.teste.semQuestoes.acao}
          </Button>
        </CardConteudo>
      </Card>
    )
  }

  const indice = Math.min(jornada.questaoAtual, questoes.length - 1)
  const questao: Questao = questoes[indice]
  const acabou = jornada.questaoAtual >= questoes.length
  const respostaAtual = rascunho ?? jornada.respostasDoTeste[questao.id] ?? ""

  function gravarEAvancar(resposta: string | null) {
    if (!jornada) return
    const respostas =
      resposta === null
        ? jornada.respostasDoTeste
        : { ...jornada.respostasDoTeste, [questao.id]: resposta }
    const proxima = indice + 1

    if (proxima >= questoes.length) {
      const resultado = calcularResultado({
        ...jornada,
        respostasDoTeste: respostas,
        questaoAtual: proxima,
      })
      atualizarJornada({
        respostasDoTeste: respostas,
        questaoAtual: proxima,
        resultado,
        etapa: "resultado",
      })
      registrarSessao("avaliacao", 15)
    } else {
      atualizarJornada({ respostasDoTeste: respostas, questaoAtual: proxima })
    }
    setRascunho(null)
    setErro("")
  }

  if (acabou) return null

  const ehUltima = indice === questoes.length - 1

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted" aria-live="polite">
            {textos.teste.progresso
              .replace("{atual}", String(indice + 1))
              .replace("{total}", String(questoes.length))}
          </p>
          <Button variante="fantasma" tamanho="sm" onClick={() => setConfirmandoSaida(true)}>
            {textos.teste.salvarESair}
          </Button>
        </div>

        <BarraProgresso
          valor={(indice / questoes.length) * 100}
          rotulo={textos.teste.progresso
            .replace("{atual}", String(indice + 1))
            .replace("{total}", String(questoes.length))}
          className="mb-5"
        />

        <Card>
          <CardConteudo className="flex flex-col gap-4 p-6 sm:p-8">
            {questao.cenario && (
              <div className="rounded-ds-fine border border-hairline bg-elevated p-3.5">
                <p className="text-[11px] font-medium tracking-wide text-muted uppercase">
                  {textos.teste.cenarioRotulo}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink">{questao.cenario}</p>
              </div>
            )}

            <h2 className="font-display text-lg leading-snug text-balance text-ink">
              {questao.enunciado}
            </h2>

            {questao.formato === "curta" ? (
              <Textarea
                rotulo={textos.teste.respostaCurtaRotulo}
                ajuda={textos.teste.respostaCurtaAjuda}
                value={respostaAtual}
                onChange={(evento) => setRascunho(evento.target.value)}
                rows={4}
              />
            ) : (
              <div className="flex flex-col gap-2" role="radiogroup" aria-label={questao.enunciado}>
                {questao.opcoes?.map((opcao, indiceOpcao) => {
                  const marcado = respostaAtual === String(indiceOpcao)
                  return (
                    <label
                      key={opcao}
                      className={
                        marcado
                          ? "flex cursor-pointer items-start gap-3 rounded-ds-fine border border-primary bg-primary/8 px-4 py-3 text-sm leading-relaxed text-ink"
                          : "superficie-elevada flex cursor-pointer items-start gap-3 rounded-ds-fine border border-hairline px-4 py-3 text-sm leading-relaxed text-ink transition-colors hover:border-primary/40 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary"
                      }
                    >
                      <input
                        type="radio"
                        name={questao.id}
                        checked={marcado}
                        onChange={() => {
                          setErro("")
                          setRascunho(String(indiceOpcao))
                        }}
                        className="mt-1 size-4 shrink-0 accent-[var(--ds-primary)]"
                      />
                      <span className="min-w-0">{opcao}</span>
                    </label>
                  )
                })}
              </div>
            )}

            {erro && (
              <p role="alert" className="text-[13px] text-danger">
                {erro}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 border-t border-hairline pt-4">
              <Button
                tamanho="lg"
                iconeDireita={<Icone nome="seta-direita" />}
                onClick={() => {
                  if (!respostaAtual.trim()) {
                    setErro(textos.teste.responda)
                    return
                  }
                  gravarEAvancar(respostaAtual)
                }}
              >
                {ehUltima ? textos.teste.verResultado : textos.teste.proxima}
              </Button>
              {/* Pular é permitido (DIA-06): a pergunta fica sem resposta. */}
              <Button
                variante="fantasma"
                iconeEsquerda={<Icone nome="pular" />}
                onClick={() => gravarEAvancar(null)}
              >
                {textos.teste.pular}
              </Button>
            </div>
          </CardConteudo>
        </Card>
      </div>

      {/* O painel lateral que explica por que a pergunta existe (DIA-04). */}
      <aside className="superficie rounded-ds-surface border border-hairline p-5 lg:sticky lg:top-4">
        <h3 className="flex items-center gap-2 font-display text-sm text-ink">
          <Icone nome="ideia" className="size-4 text-primary-accent" />
          {textos.teste.porqueTitulo}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">{questao.porque}</p>
        <p className="mt-3 border-t border-hairline pt-3 text-[12px] text-muted">
          {textos.teste.dificuldadeRotulo}:{" "}
          <Badge variante="neutra" className="ml-1">
            {textos.teste.dificuldades[questao.dificuldade]}
          </Badge>
        </p>
      </aside>

      <Confirmar
        aberto={confirmandoSaida}
        destrutivo={false}
        titulo={textos.teste.sairTitulo}
        texto={textos.teste.sairTexto}
        rotuloConfirmar={textos.teste.sairConfirmar}
        aoCancelar={() => setConfirmandoSaida(false)}
        aoConfirmar={() => {
          setConfirmandoSaida(false)
          router.push("/app")
        }}
      />
    </div>
  )
}

/** Etapa 3: o resultado explicável (DIA-07), com reavaliação à mão (DIA-08). */
function EtapaResultado() {
  const { jornada, atualizarJornada } = useDados()
  const [confirmandoRefazer, setConfirmandoRefazer] = useState(false)

  const profissao = acharProfissao(jornada?.profissaoId)
  const resultado = jornada?.resultado
  if (!jornada || !profissao || !resultado) return null

  const confianca =
    textos.resultado.confiancaTexto[
      resultado.confianca as keyof typeof textos.resultado.confiancaTexto
    ] ?? textos.resultado.confiancaTexto.media

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-5">
      <Card className="faixa-topo overflow-hidden">
        <CardConteudo className="flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-4">
            <span
              aria-hidden="true"
              className="realce-interno grid size-14 shrink-0 place-items-center rounded-full bg-primary font-display text-2xl font-semibold text-primary-ink"
            >
              {resultado.nivel}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium tracking-wide text-muted uppercase">
                {textos.resultado.nivelRotulo}
              </p>
              <h2 className="font-display text-xl text-ink">
                {profissao.niveis[resultado.nivel - 1]?.nome} · {resultado.nivel} de 5
              </h2>
            </div>
          </div>

          <p className="text-[13px] leading-relaxed text-muted">
            <strong className="font-medium text-ink">{textos.resultado.confiancaRotulo}:</strong>{" "}
            {resultado.confianca}. {confianca}
          </p>

          <div className="rounded-ds-fine border border-hairline bg-elevated p-4">
            <p className="flex items-center gap-2 text-[11px] font-medium tracking-wide text-muted uppercase">
              <Icone nome="comecar" className="size-3.5 text-primary-accent" />
              {textos.resultado.primeiroPassoTitulo}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink">{resultado.primeiroPasso}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {jornada.etapa === "resultado" ? (
              <Button
                tamanho="lg"
                iconeDireita={<Icone nome="seta-direita" />}
                onClick={() => atualizarJornada({ etapa: "trilha" })}
              >
                {textos.resultado.comecarTrilha}
              </Button>
            ) : (
              <BotaoLink href="/app/mapa" tamanho="lg" comChip iconeDireita={<Icone nome="seta-direita" />}>
                {textos.resultado.verMapa}
              </BotaoLink>
            )}
            <Button variante="fantasma" onClick={() => setConfirmandoRefazer(true)}>
              {textos.resultado.refazer}
            </Button>
          </div>
        </CardConteudo>
      </Card>

      <Card>
        <CardConteudo className="p-6">
          <h3 className="font-display text-sm text-ink">{textos.resultado.dominioTitulo}</h3>
          <dl className="mt-4 flex flex-col gap-3">
            {profissao.competencias.map((competencia) => {
              const valor = resultado.dominioPorCompetencia[competencia.id] ?? 0
              return (
                <div key={competencia.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="min-w-0 text-sm text-ink">
                      {competencia.nome}
                      <span className="ml-1.5 text-[11px] text-muted">nível {competencia.nivel}</span>
                    </dt>
                    <dd className="m-0 text-[12px] font-medium tabular-nums text-muted">{valor}%</dd>
                  </div>
                  <BarraProgresso valor={valor} rotulo={competencia.nome} tamanho="sm" className="mt-1.5" />
                </div>
              )
            })}
          </dl>
        </CardConteudo>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardConteudo className="p-5">
            <h3 className="flex items-center gap-2 font-display text-sm text-ink">
              <Icone nome="acertei" className="size-4 text-success" />
              {textos.resultado.fortesTitulo}
            </h3>
            <ul className="mt-3 flex flex-col gap-1.5 text-sm text-muted">
              {resultado.pontosFortes.map((ponto) => (
                <li key={ponto}>{ponto}</li>
              ))}
            </ul>
          </CardConteudo>
        </Card>

        <Card>
          <CardConteudo className="p-5">
            <h3 className="flex items-center gap-2 font-display text-sm text-ink">
              <Icone nome="alerta" className="size-4 text-warning" />
              {textos.resultado.lacunasTitulo}
            </h3>
            <ul className="mt-3 flex flex-col gap-1.5 text-sm text-muted">
              {resultado.lacunasCriticas.map((lacuna) => (
                <li key={lacuna}>{lacuna}</li>
              ))}
            </ul>
          </CardConteudo>
        </Card>
      </div>

      <Card>
        <CardConteudo className="p-5">
          <h3 className="font-display text-sm text-ink">{textos.resultado.aproveitadasTitulo}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {resultado.aproveitadas.length > 0
              ? resultado.aproveitadas.join(". ")
              : textos.resultado.nadaAproveitado}
          </p>
        </CardConteudo>
      </Card>

      <Confirmar
        aberto={confirmandoRefazer}
        destrutivo={false}
        titulo={textos.resultado.refazerConfirmar.titulo}
        texto={textos.resultado.refazerConfirmar.texto}
        rotuloConfirmar={textos.resultado.refazerConfirmar.confirmar}
        aoCancelar={() => setConfirmandoRefazer(false)}
        aoConfirmar={() => {
          setConfirmandoRefazer(false)
          atualizarJornada({
            etapa: "autopercepcao",
            autopercepcao: {},
            respostasDoTeste: {},
            questaoAtual: 0,
          })
        }}
      />
    </div>
  )
}
