"use client"

import {
  Background,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useMemo } from "react"
import { Icone } from "@/components/app/icone"
import { estadosDeNo, sistema } from "@/content/site"
import { cn } from "@/lib/cn"
import type { EstadoNo, Nivel } from "@/lib/types"

/**
 * O mapa interativo dos cinco níveis, em React Flow (MAP-02).
 *
 * Este arquivo é o ÚNICO que importa a biblioteca, e ele chega na tela por
 * import adiado: o resto do app não paga pelo peso dele. As conexões
 * pontilhadas são dependência de verdade (um nível abre quando o anterior
 * fecha), não decoração, e cada nó carrega texto e ícone de estado além da
 * cor (MAP-04).
 *
 * Os nós não se arrastam de propósito: a posição do nível no caminho é
 * informação, não preferência. O que sobra de interação é o que o requisito
 * pede: zoom, pan, centralizar e selecionar. O teclado navega pelos nós com
 * Tab e seleciona com Enter, e a alternativa em lista completa mora na tela,
 * fora deste arquivo.
 */

export type NoDeNivel = {
  nivel: Nivel
  estado: EstadoNo
  percentual: number
  atual: boolean
}

type DadosDoNo = { no: NoDeNivel; selecionado: boolean }

function NoNivel({ data }: NodeProps) {
  const { no, selecionado } = data as unknown as DadosDoNo
  const definicao = estadosDeNo[no.estado]

  return (
    <div
      className={cn(
        "superficie w-[228px] rounded-ds-surface border p-3.5 text-left transition-colors",
        selecionado ? "border-primary" : "border-hairline",
        no.estado === "bloqueado" && "opacity-70"
      )}
    >
      <Handle type="target" position={Position.Top} className="!size-1.5 !border-0 !bg-hairline" />
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full font-display text-[13px] font-semibold",
            no.atual
              ? "realce-interno bg-primary text-primary-ink"
              : no.estado === "concluido"
                ? "border border-success/40 bg-success/12 text-success"
                : "superficie-elevada border border-hairline text-ink"
          )}
        >
          {no.nivel.ordem}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-ink">{no.nivel.nome}</p>
          <p className="flex items-center gap-1 text-[11px] text-muted">
            <Icone nome={definicao.icone} className="size-3" />
            {definicao.rotulo}
          </p>
        </div>
      </div>

      {no.percentual > 0 && no.estado !== "concluido" && (
        <div aria-hidden="true" className="mt-2.5 h-1 overflow-hidden rounded-full bg-elevated">
          <div className="h-full rounded-full bg-primary" style={{ width: `${no.percentual}%` }} />
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!size-1.5 !border-0 !bg-hairline" />
    </div>
  )
}

const TIPOS_DE_NO = { nivel: NoNivel }

export function FluxoDoMapa({
  niveis,
  selecionado,
  aoSelecionar,
}: {
  niveis: NoDeNivel[]
  selecionado: number
  aoSelecionar: (ordem: number) => void
}) {
  const nos: Node[] = useMemo(
    () =>
      niveis.map((no, indice) => ({
        id: String(no.nivel.ordem),
        type: "nivel",
        // Serpenteia de leve: caminho, não escada. A posição é fixa de
        // propósito, porque ela é informação.
        position: { x: indice % 2 === 0 ? 0 : 150, y: indice * 128 },
        data: { no, selecionado: no.nivel.ordem === selecionado },
        draggable: false,
        selectable: true,
        focusable: true,
        ariaLabel: `${sistema.mapa.titulo}: nível ${no.nivel.ordem}, ${no.nivel.nome}, ${estadosDeNo[no.estado].rotulo}`,
      })),
    [niveis, selecionado]
  )

  const arestas: Edge[] = useMemo(
    () =>
      niveis.slice(0, -1).map((no) => ({
        id: `aresta-${no.nivel.ordem}`,
        source: String(no.nivel.ordem),
        target: String(no.nivel.ordem + 1),
        type: "smoothstep",
        // A conexão pontilhada que o requisito pede: dependência real.
        style: { stroke: "var(--ds-hairline)", strokeWidth: 1.5, strokeDasharray: "5 5" },
      })),
    [niveis]
  )

  return (
    <div className="h-[560px] w-full overflow-hidden rounded-ds-surface border border-hairline bg-canvas">
      <ReactFlow
        nodes={nos}
        edges={arestas}
        nodeTypes={TIPOS_DE_NO}
        onNodeClick={(_, node) => aoSelecionar(Number(node.id))}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.5}
        maxZoom={1.5}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        proOptions={{ hideAttribution: true }}
        aria-label={sistema.mapa.titulo}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--ds-hairline)" />
      </ReactFlow>
    </div>
  )
}
