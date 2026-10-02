import { marca } from "@/content/site"
import { cn } from "@/lib/cn"

type PropsLogo = {
  className?: string
  /** Só o símbolo, sem o nome ao lado (o nome continua no leitor de tela). */
  somenteSimbolo?: boolean
}

/**
 * A marca é desenhada em SVG e pintada com `currentColor` para herdar o
 * `text-primary-accent`. Trocar o design system no JSON repinta o logo junto.
 *
 * O desenho é o que o produto faz: uma bússola com a agulha apontando o rumo,
 * e o ponteiro cheio porque a direção é o que importa. Duas formas, nenhuma
 * imagem.
 */
export function Logo({ className, somenteSimbolo = false }: PropsLogo) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 32 32"
        className="size-7 shrink-0 text-primary-accent"
        aria-hidden="true"
        focusable="false"
      >
        {/* O aro da bússola. */}
        <circle
          cx="16"
          cy="16"
          r="12.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.35"
        />
        {/* As marcas cardeais, discretas. */}
        <path
          d="M16 4.8v2.4M16 24.8v2.4M4.8 16h2.4M24.8 16h2.4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeOpacity="0.55"
        />
        {/* A agulha: a metade que aponta é cheia, a outra é o contrapeso. */}
        <path d="M21.8 10.2 17.6 17.6 14.4 14.4Z" fill="currentColor" />
        <path
          d="M14.4 14.4 17.6 17.6 10.2 21.8Z"
          fill="currentColor"
          fillOpacity="0.4"
        />
      </svg>

      {somenteSimbolo ? (
        <span className="sr-only">{marca.nome}</span>
      ) : (
        <span
          className="truncate font-display text-base text-ink"
          style={{ fontWeight: "var(--ds-display-weight)", letterSpacing: "var(--ds-tracking)" }}
        >
          {marca.nome}
        </span>
      )}
    </span>
  )
}
