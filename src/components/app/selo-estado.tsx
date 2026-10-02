import { Icone } from "@/components/app/icone"
import { Badge, type VarianteBadge } from "@/components/ui"
import { estadosDeNo } from "@/content/site"
import type { EstadoNo } from "@/lib/types"

/**
 * O selo de estado de um nó da jornada (MAP-04).
 *
 * O requisito é explícito: estado nunca é só cor. Aqui cada um sai com ícone e
 * texto, e a cor é o terceiro sinal, não o único. O mapa, o Aprender e o
 * Praticar usam este mesmo selo pra mesma palavra significar a mesma coisa em
 * todo lugar.
 */
const VARIANTE_DO_ESTADO: Record<EstadoNo, VarianteBadge> = {
  "nao-iniciado": "neutra",
  disponivel: "destaque",
  "em-andamento": "destaque",
  "aguardando-validacao": "aviso",
  concluido: "sucesso",
  bloqueado: "neutra",
}

export function SeloEstado({ estado, className }: { estado: EstadoNo; className?: string }) {
  const definicao = estadosDeNo[estado]

  return (
    <Badge variante={VARIANTE_DO_ESTADO[estado]} className={className}>
      <Icone nome={definicao.icone} className="size-3" />
      {definicao.rotulo}
    </Badge>
  )
}
