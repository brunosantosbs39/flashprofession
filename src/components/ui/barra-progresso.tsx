import { cn } from "@/lib/cn"

export type BarraProgressoProps = {
  /** De 0 a 100. Valores fora da faixa são presos nela. */
  valor: number
  /** Nome acessível da barra. Obrigatório: barra sem rótulo é um risco mudo. */
  rotulo: string
  /** Mostra o percentual em texto ao lado. O número nunca é só visual. */
  mostrarValor?: boolean
  tamanho?: "sm" | "md"
  className?: string
}

/**
 * Barra de progresso do design system.
 *
 * Ela é uma `progressbar` de verdade pro leitor de tela: rótulo, mínimo,
 * máximo e valor atual anunciados. O desenho segue a regra da casa: sem sombra
 * externa, cor pelos tokens, e o preenchimento anima só `width` numa faixa de
 * 6 píxeis, onde o recálculo de layout é irrelevante.
 */
export function BarraProgresso({
  valor,
  rotulo,
  mostrarValor = false,
  tamanho = "md",
  className,
}: BarraProgressoProps) {
  const preso = Math.max(0, Math.min(100, Math.round(valor)))

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        role="progressbar"
        aria-label={rotulo}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={preso}
        className={cn(
          "min-w-0 flex-1 overflow-hidden rounded-full bg-elevated",
          tamanho === "sm" ? "h-1" : "h-1.5"
        )}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${preso}%` }}
        />
      </div>

      {mostrarValor && (
        <span className="shrink-0 text-[12px] font-medium tabular-nums text-muted">{preso}%</span>
      )}
    </div>
  )
}
