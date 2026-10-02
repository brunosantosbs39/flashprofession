"use client"

import {
  Background,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Icone } from "@/components/app/icone"
import { Button } from "@/components/ui"
import {
  desenhoAtual,
  desenhoSeguinte,
  paginaBanco,
  rotulosDeTipo,
  type NoDoBanco,
  type TipoDeNo,
} from "@/content/banco"
import { cn } from "@/lib/cn"

/**
 * O mapa do banco em React Flow, com drill-down.
 *
 * A árvore vem de `src/content/banco.ts`. Cada nó abre e fecha; o que está
 * aberto define o que aparece no canvas, e a posição é calculada aqui (coluna
 * por profundidade, linha pela ordem), porque posição é informação: o que
 * está à direita mora DENTRO do que está à esquerda.
 *
 * Junto com `src/components/app/mapa/fluxo.tsx`, é um dos dois únicos arquivos
 * que importam a biblioteca, e chega na tela por import adiado.
 */

const LARGURA_DO_NO = 248
const ALTURA_DO_NO = 60
const PASSO_X = 320
const PASSO_Y = 76

const ICONE_DO_TIPO: Record<TipoDeNo, string> = {
  banco: "dados",
  tabela: "lista",
  coluna: "codigo",
  colecao: "pasta",
  campo: "codigo",
  objeto: "pasta",
}

type DadosDoNo = {
  no: NoDoBanco
  aberto: boolean
  selecionado: boolean
  aoAlternar: (id: string) => void
}

function NoDeBanco({ data }: NodeProps) {
  const { no, aberto, selecionado, aoAlternar } = data as unknown as DadosDoNo
  const temFilhos = (no.filhos?.length ?? 0) > 0

  return (
    <div
      className={cn(
        "superficie flex items-center gap-2.5 rounded-ds-surface border px-3 py-2.5 text-left transition-colors",
        selecionado ? "border-primary" : "border-hairline",
        no.tipo === "tabela" && "bg-primary/6",
        no.tipo === "colecao" && "bg-elevated"
      )}
      style={{ width: LARGURA_DO_NO, minHeight: ALTURA_DO_NO }}
    >
      <Handle type="target" position={Position.Left} className="!size-1.5 !border-0 !bg-hairline" />
      {/* A alça de cima recebe só as setas de chave estrangeira, que vêm de outra tabela. */}
      {(no.papel === "PK" || no.tipo === "tabela") && (
        <Handle type="target" id="fk" position={Position.Top} className="!size-1.5 !border-0 !bg-primary" />
      )}
      <span
        aria-hidden="true"
        className={cn(
          "grid size-7 shrink-0 place-items-center rounded-ds",
          no.tipo === "tabela" || no.tipo === "banco"
            ? "bg-primary/12 text-primary-accent"
            : "superficie-elevada border border-hairline text-muted"
        )}
      >
        <Icone nome={ICONE_DO_TIPO[no.tipo]} className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-[13px] font-medium text-ink">{no.nome}</p>
        <p className="truncate text-[11px] text-muted">
          {no.papel ? `${no.papel} · ` : ""}
          {no.tipoDado ?? rotulosDeTipo[no.tipo]}
        </p>
      </div>
      {temFilhos && (
        <button
          type="button"
          aria-label={`${aberto ? paginaBanco.recolherNo : paginaBanco.abrir} ${no.nome} (${no.filhos?.length})`}
          aria-expanded={aberto}
          onClick={(evento) => {
            evento.stopPropagation()
            aoAlternar(no.id)
          }}
          className="grid size-7 shrink-0 place-items-center rounded-full border border-hairline bg-surface text-[11px] font-medium text-muted hover:border-primary/40 hover:text-ink"
        >
          {aberto ? <Icone nome="anterior" className="size-3.5" /> : no.filhos?.length}
        </button>
      )}
      <Handle type="source" position={Position.Right} className="!size-1.5 !border-0 !bg-hairline" />
    </div>
  )
}

const TIPOS_DE_NO = { banco: NoDeBanco }

/** Altura de um subárvore, em linhas, contando só o que está aberto. */
function linhas(no: NoDoBanco, abertos: Set<string>): number {
  if (!abertos.has(no.id) || !no.filhos?.length) return 1
  return Math.max(1, no.filhos.reduce((total, filho) => total + linhas(filho, abertos), 0))
}

function achar(no: NoDoBanco, id: string, caminho: NoDoBanco[] = []): NoDoBanco[] | null {
  const atual = [...caminho, no]
  if (no.id === id) return atual
  for (const filho of no.filhos ?? []) {
    const achado = achar(filho, id, atual)
    if (achado) return achado
  }
  return null
}

function todosOsIds(no: NoDoBanco): string[] {
  return [no.id, ...(no.filhos ?? []).flatMap(todosOsIds)]
}

export function MapaDoBanco({ contagens }: { contagens: Record<string, number> | null }) {
  const [desenho, setDesenho] = useState<"atual" | "seguinte">("atual")
  const raiz = desenho === "atual" ? desenhoAtual : desenhoSeguinte

  const [abertos, setAbertos] = useState<Set<string>>(
    () => new Set(["banco", "usuarios", "registros", "banco-v2"])
  )
  const [selecionadoId, setSelecionadoId] = useState<string>("registros")

  const alternar = useCallback((id: string) => {
    setAbertos((atual) => {
      const proximo = new Set(atual)
      if (proximo.has(id)) proximo.delete(id)
      else proximo.add(id)
      return proximo
    })
    setSelecionadoId(id)
  }, [])

  const { nos, arestas } = useMemo(() => {
    const nos: Node[] = []
    const arestas: Edge[] = []

    function colocar(no: NoDoBanco, profundidade: number, linhaInicial: number) {
      const altura = linhas(no, abertos)
      // O pai fica centralizado em relação ao bloco dos filhos.
      const y = (linhaInicial + (altura - 1) / 2) * PASSO_Y
      nos.push({
        id: no.id,
        type: "banco",
        position: { x: profundidade * PASSO_X, y },
        // Tamanho declarado: o enquadramento funciona antes de o navegador
        // medir o nó (e em aba escondida, onde ele nunca mede).
        width: LARGURA_DO_NO,
        height: ALTURA_DO_NO,
        data: { no, aberto: abertos.has(no.id), selecionado: no.id === selecionadoId, aoAlternar: alternar },
        draggable: false,
        selectable: true,
        focusable: true,
        ariaLabel: `${rotulosDeTipo[no.tipo]} ${no.nome}`,
      })
      if (!abertos.has(no.id) || !no.filhos) return
      let linha = linhaInicial
      for (const filho of no.filhos) {
        arestas.push({
          id: `${no.id}->${filho.id}`,
          source: no.id,
          target: filho.id,
          type: "smoothstep",
          style: { stroke: "var(--ds-hairline)", strokeWidth: 1.5, strokeDasharray: "5 5" },
        })
        colocar(filho, profundidade + 1, linha)
        linha += linhas(filho, abertos)
      }
    }
    colocar(raiz, 0, 0)

    // As chaves estrangeiras: a seta cheia, na cor de ação, que cruza a árvore.
    const FKS: Array<[string, string]> = [
      ["registros.usuario", "usuarios.id"],
      ["v2.jornadas.usuario", "v2.usuarios.id"],
      ["v2.evidencias.jornada_id", "v2.jornadas.id"],
      ["v2.sessoes.jornada_id", "v2.jornadas.id"],
    ]
    const visiveis = new Set(nos.map((no) => no.id))
    // Com a tabela fechada, a seta sai da tabela inteira (o id da coluna é
    // "tabela.coluna", então a tabela é tudo antes do último ponto).
    const tabelaDe = (id: string) => id.slice(0, id.lastIndexOf("."))
    for (const [colunaDe, colunaPara] of FKS) {
      const de = visiveis.has(colunaDe) ? colunaDe : tabelaDe(colunaDe)
      const para = visiveis.has(colunaPara) ? colunaPara : tabelaDe(colunaPara)
      if (visiveis.has(de) && visiveis.has(para)) {
        arestas.push({
          id: `fk-${colunaDe}`,
          source: de,
          target: para,
          targetHandle: "fk",
          type: "smoothstep",
          label: "FK",
          labelStyle: { fill: "var(--ds-primary-accent)", fontSize: 10, fontWeight: 600 },
          labelBgStyle: { fill: "var(--ds-surface)" },
          style: { stroke: "var(--ds-primary)", strokeWidth: 1.5 },
        })
      }
    }
    return { nos, arestas }
  }, [raiz, abertos, selecionadoId, alternar])

  const caminho = achar(raiz, selecionadoId) ?? [raiz]
  const selecionado = caminho[caminho.length - 1]
  const contagem = contagens?.[selecionado.id]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div role="group" aria-label={paginaBanco.qualDesenho} className="flex flex-wrap gap-2">
          {(
            [
              ["atual", paginaBanco.desenhos.atual],
              ["seguinte", paginaBanco.desenhos.seguinte],
            ] as const
          ).map(([valor, rotulo]) => (
            <button
              key={valor}
              type="button"
              aria-pressed={desenho === valor}
              onClick={() => {
                setDesenho(valor)
                setSelecionadoId(valor === "atual" ? "registros" : "v2.jornadas")
              }}
              className={
                desenho === valor
                  ? "preenchimento-acao inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium text-primary-ink pointer-coarse:min-h-11"
                  : "superficie inline-flex items-center gap-2 rounded-full border border-hairline px-3.5 py-2 text-[13px] text-ink transition-colors hover:border-primary/40 hover:bg-elevated pointer-coarse:min-h-11"
              }
            >
              {rotulo}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <Button
            variante="secundaria"
            tamanho="sm"
            onClick={() => setAbertos(new Set(todosOsIds(raiz)))}
          >
            {paginaBanco.abrirTudo}
          </Button>
          <Button
            variante="fantasma"
            tamanho="sm"
            onClick={() => setAbertos(new Set([raiz.id, ...(raiz.filhos ?? []).map((f) => f.id)]))}
          >
            {paginaBanco.recolher}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <ReactFlowProvider>
          <Canvas
            nos={nos}
            arestas={arestas}
            foco={selecionado}
            aberto={abertos.has(selecionado.id)}
            aoSelecionar={setSelecionadoId}
            aoAlternar={alternar}
          />
        </ReactFlowProvider>

        {/* O painel de detalhe do nó selecionado, com o caminho até ele. */}
        <aside
          aria-live="polite"
          className="superficie flex flex-col gap-4 rounded-ds-surface border border-hairline p-5"
        >
          <nav aria-label={paginaBanco.caminho} className="flex flex-wrap items-center gap-1 text-[12px] text-muted">
            {caminho.map((no, indice) => (
              <span key={no.id} className="flex items-center gap-1">
                {indice > 0 && <span aria-hidden="true">›</span>}
                <button
                  type="button"
                  onClick={() => setSelecionadoId(no.id)}
                  className={cn(
                    "rounded-ds font-mono hover:text-ink",
                    indice === caminho.length - 1 && "text-ink"
                  )}
                >
                  {no.nome}
                </button>
              </span>
            ))}
          </nav>

          <div>
            <p className="text-[11px] font-medium tracking-wide text-muted uppercase">
              {rotulosDeTipo[selecionado.tipo]}
              {selecionado.papel ? ` · ${selecionado.papel}` : ""}
            </p>
            <h2 className="mt-1 font-mono text-lg font-semibold text-ink">{selecionado.nome}</h2>
            {selecionado.tipoDado && (
              <p className="mt-1 font-mono text-[12px] break-words text-primary-accent">
                {selecionado.tipoDado}
              </p>
            )}
          </div>

          <p className="text-sm leading-relaxed text-ink">{selecionado.descricao}</p>

          {typeof contagem === "number" && (
            <p className="text-[13px] text-muted">
              {paginaBanco.noBancoAgora}: <strong className="font-medium text-ink">{contagem}</strong>{" "}
              {contagem === 1 ? paginaBanco.linha.singular : paginaBanco.linha.plural}
            </p>
          )}

          <dl className="flex flex-col gap-3 border-t border-hairline pt-4 text-[13px]">
            {selecionado.requisito && (
              <div>
                <dt className="text-[11px] font-medium tracking-wide text-muted uppercase">{paginaBanco.secoes.requisito}</dt>
                <dd className="mt-0.5 text-ink">{selecionado.requisito}</dd>
              </div>
            )}
            {selecionado.exemplo && (
              <div>
                <dt className="text-[11px] font-medium tracking-wide text-muted uppercase">{paginaBanco.secoes.exemplo}</dt>
                <dd className="mt-0.5 overflow-x-auto rounded-ds border border-hairline bg-elevated px-2.5 py-2 font-mono text-[12px] text-ink">
                  {selecionado.exemplo}
                </dd>
              </div>
            )}
            {selecionado.codigo && (
              <div>
                <dt className="text-[11px] font-medium tracking-wide text-muted uppercase">{paginaBanco.secoes.codigo}</dt>
                <dd className="mt-0.5 font-mono text-[12px] break-words text-ink">{selecionado.codigo}</dd>
              </div>
            )}
          </dl>

          {selecionado.filhos && selecionado.filhos.length > 0 && (
            <div className="border-t border-hairline pt-4">
              <p className="text-[11px] font-medium tracking-wide text-muted uppercase">
                {paginaBanco.secoes.dentro} ({selecionado.filhos.length})
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {selecionado.filhos.map((filho) => (
                  <li key={filho.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setAbertos((atual) => new Set(atual).add(selecionado.id))
                        setSelecionadoId(filho.id)
                      }}
                      className="flex w-full items-center gap-2 rounded-ds px-2 py-1.5 text-left text-[13px] hover:bg-elevated"
                    >
                      <span className="font-mono text-ink">{filho.nome}</span>
                      <span className="truncate text-[11px] text-muted">{filho.tipoDado ?? rotulosDeTipo[filho.tipo]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

/**
 * O canvas em si. Vive dentro do `ReactFlowProvider` pra poder reenquadrar:
 * quando um nó abre, a câmera vai até ele e os filhos, em vez de deixar a
 * árvore crescer pra fora da tela.
 */
function Canvas({
  nos,
  arestas,
  foco,
  aberto,
  aoSelecionar,
  aoAlternar,
}: {
  nos: Node[]
  arestas: Edge[]
  foco: NoDoBanco
  aberto: boolean
  aoSelecionar: (id: string) => void
  aoAlternar: (id: string) => void
}) {
  const { fitView, getNodes } = useReactFlow()

  useEffect(() => {
    const ids = new Set([foco.id, ...(aberto ? (foco.filhos ?? []).map((f) => f.id) : [])])
    // Os nós novos precisam existir no DOM e estar medidos antes de enquadrar;
    // o React Flow mede num ResizeObserver, então espera-se um instante.
    const relogio = window.setTimeout(() => {
      const alvo = getNodes().filter((n) => ids.has(n.id))
      if (alvo.length === 0) return
      // A animação anda em requestAnimationFrame, que aba escondida não
      // roda: sem ela, o enquadramento acontece de qualquer jeito.
      const duracao = document.visibilityState === "visible" ? 350 : 0
      void fitView({ nodes: alvo, duration: duracao, padding: 0.25, maxZoom: 1 })
    }, 120)
    return () => window.clearTimeout(relogio)
  }, [foco, aberto, nos, fitView, getNodes])

  return (
    <div className="h-[640px] w-full overflow-hidden rounded-ds-surface border border-hairline bg-canvas">
      <ReactFlow
        nodes={nos}
        edges={arestas}
        nodeTypes={TIPOS_DE_NO}
        onNodeClick={(_, node) => aoSelecionar(node.id)}
        onNodeDoubleClick={(_, node) => aoAlternar(node.id)}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
        minZoom={0.2}
        maxZoom={1.5}
        nodesConnectable={false}
        elementsSelectable
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--ds-hairline)" />
      </ReactFlow>
    </div>
  )
}
