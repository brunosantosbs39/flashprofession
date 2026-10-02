import { Icone } from "@/components/app/icone"
import { landing } from "@/content/site"
import { acharProfissao } from "@/lib/catalogo"
import { cn } from "@/lib/cn"

/**
 * Dobra 3. A dobra viva: os cinco níveis de verdade do catálogo, da profissão
 * de demonstração completa.
 *
 * Nada aqui é texto de vitrine escrito pra vender: são os mesmos níveis, com as
 * mesmas descrições, que a pessoa encontra no mapa dentro do app. Explicar o
 * que é um caminho de cinco níveis custa um parágrafo; mostrar o caminho custa
 * uma olhada.
 */
export function Caminho() {
  const niveis = acharProfissao("ux-ui-designer")?.niveis ?? []

  return (
    <section id="caminho" aria-labelledby="caminho-titulo" className="scroll-mt-20">
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <h2
            id="caminho-titulo"
            className="text-2xl leading-tight text-balance text-ink sm:text-3xl lg:text-4xl"
          >
            {landing.caminho.titulo}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
            {landing.caminho.subtitulo}
          </p>
        </div>

        {/* Um `ol` de verdade: a ordem dos níveis é conteúdo, não decoração. */}
        <ol className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-5">
          {niveis.map((nivel, indice) => {
            const ultimo = indice === niveis.length - 1
            return (
              <li key={nivel.ordem} className="relative flex gap-4 lg:flex-col lg:gap-4">
                {!ultimo && (
                  <>
                    {/* O fio pontilhado que liga os níveis: vertical no celular,
                        horizontal no desktop, igual ao mapa de dentro do app. */}
                    <span
                      aria-hidden="true"
                      className="absolute top-12 -bottom-4 left-[17px] w-px border-l border-dashed border-hairline lg:hidden"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute top-[17px] left-12 -right-2 hidden border-t border-dashed border-hairline lg:block"
                    />
                  </>
                )}

                <span
                  aria-hidden="true"
                  className={cn(
                    "relative grid size-9 shrink-0 place-items-center rounded-full font-display text-[13px] font-semibold",
                    nivel.ordem === 1
                      ? "realce-interno bg-primary text-primary-ink"
                      : "superficie-elevada border border-hairline text-ink"
                  )}
                >
                  {nivel.ordem}
                </span>

                <div className="min-w-0 pb-2 lg:pb-0">
                  <h3 className="flex items-center gap-1.5 text-base text-ink">{nivel.nome}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{nivel.descricao}</p>
                  <p className="mt-2 flex items-start gap-1.5 text-[12px] leading-relaxed text-muted">
                    <Icone nome="check" className="mt-0.5 size-3.5 shrink-0 text-success" />
                    <span className="min-w-0">{nivel.criterios[0]}</span>
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
