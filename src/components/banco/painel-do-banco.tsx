"use client"

import dynamic from "next/dynamic"

/**
 * A ponte entre a página (servidor) e o mapa (navegador, com React Flow).
 * O import adiado com `ssr: false` só pode morar num componente de cliente,
 * por isso este arquivo existe.
 */
const MapaDoBanco = dynamic(
  () => import("@/components/banco/mapa-do-banco").then((modulo) => modulo.MapaDoBanco),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="h-[640px] w-full animate-pulse rounded-ds-surface border border-hairline bg-surface"
      />
    ),
  }
)

export function PainelDoBanco({ contagens }: { contagens: Record<string, number> | null }) {
  return <MapaDoBanco contagens={contagens} />
}
