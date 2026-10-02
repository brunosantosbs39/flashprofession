import { Icone } from "@/components/app/icone"
import { Logo } from "@/components/app/logo"
import { landing, sistema } from "@/content/site"
import { acharProfissao } from "@/lib/catalogo"
import { cn } from "@/lib/cn"

/**
 * A imagem da dobra de abertura, montada em HTML.
 *
 * Não existe arquivo de imagem no projeto de propósito: um PNG de tela
 * envelhece na primeira mudança de design system, e aqui a prévia é pintada
 * pelos mesmos tokens do produto. Troque o `design-system.json` e ela troca junto.
 *
 * O que ela mostra é a tela que define o produto: o mapa dos cinco níveis, com
 * o nível atual em andamento e a próxima ação recomendada. Os nomes dos níveis
 * vêm do catálogo de verdade, então a prévia nunca desmente o app.
 *
 * A prévia inteira é anunciada como UMA imagem (`role="img"` + `aria-label`).
 * Por isso nada aqui dentro pode receber foco: seriam paradas de teclado sem
 * nome nenhum. Os itens do menu são `<li>`, não links.
 */
export function MockupProduto() {
  const { mockup } = landing
  const niveis = acharProfissao("ux-ui-designer")?.niveis ?? []
  const nivelAtual = 2

  return (
    <div
      role="img"
      aria-label={mockup.descricao}
      className="superficie-elevada overflow-hidden rounded-ds-surface border border-hairline"
    >
      {/* Moldura de janela: contexto de "isto é um software" em dois traços. */}
      <div className="flex h-9 items-center gap-2 border-b border-hairline px-3 lg:h-11">
        <span aria-hidden="true" className="flex shrink-0 gap-1.5">
          <span className="size-2 rounded-full bg-hairline" />
          <span className="size-2 rounded-full bg-hairline" />
          <span className="size-2 rounded-full bg-hairline" />
        </span>
        <span className="mx-auto truncate rounded-full border border-hairline bg-surface px-3 py-0.5 text-[10px] text-muted lg:text-xs">
          {mockup.endereco}
        </span>
        <span aria-hidden="true" className="w-[38px] shrink-0" />
      </div>

      <div className="flex bg-surface">
        <div className="hidden w-[132px] shrink-0 flex-col gap-3 border-r border-hairline p-3 sm:flex lg:w-[168px] lg:gap-4 lg:p-4">
          <Logo className="[&_svg]:size-5 [&_span]:text-xs lg:[&_svg]:size-6 lg:[&_span]:text-sm" />

          <ul className="flex flex-col gap-0.5">
            {sistema.nav.slice(0, 6).map((item, indice) => {
              const ativo = indice === 2
              return (
                <li
                  key={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-ds px-2 py-1.5 text-[11px] lg:text-[12px]",
                    ativo ? "bg-primary/10 font-medium text-ink" : "text-muted"
                  )}
                >
                  <Icone
                    nome={item.icone}
                    className={cn("size-3.5 shrink-0", ativo ? "text-primary-accent" : "text-muted")}
                  />
                  <span className="truncate">{item.rotulo}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 sm:p-4 lg:gap-4 lg:p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="truncate font-display text-sm text-ink lg:text-base">
              {mockup.titulo}
            </span>
            <span className="shrink-0 rounded-full border border-hairline bg-elevated px-2.5 py-1 text-[10px] text-muted lg:text-xs">
              {mockup.selo}
            </span>
          </div>

          {/* Os cinco níveis, ligados por fios pontilhados, como no mapa real. */}
          <ol className="flex flex-col">
            {niveis.map((nivel, indice) => {
              const feito = nivel.ordem < nivelAtual
              const atual = nivel.ordem === nivelAtual
              const ultimo = indice === niveis.length - 1
              return (
                <li key={nivel.ordem} className="flex gap-2.5 lg:gap-3">
                  <span aria-hidden="true" className="flex flex-col items-center">
                    <span
                      className={cn(
                        "grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-semibold lg:size-7 lg:text-[11px]",
                        atual
                          ? "realce-interno bg-primary text-primary-ink"
                          : feito
                            ? "border border-success/40 bg-success/12 text-success"
                            : "border border-hairline bg-elevated text-muted"
                      )}
                    >
                      {nivel.ordem}
                    </span>
                    {!ultimo && (
                      <span className="min-h-2.5 w-px flex-1 border-l border-dashed border-hairline lg:min-h-3" />
                    )}
                  </span>

                  <div className={cn("min-w-0 pb-2 lg:pb-2.5", ultimo && "pb-0")}>
                    <p
                      className={cn(
                        "truncate text-[11px] lg:text-[12.5px]",
                        atual ? "font-medium text-ink" : feito ? "text-ink" : "text-muted"
                      )}
                    >
                      {nivel.nome}
                    </p>
                    {atual && (
                      <span className="mt-1 inline-block h-1 w-24 overflow-hidden rounded-full bg-elevated lg:w-32">
                        <span className="block h-full w-2/5 rounded-full bg-primary" />
                      </span>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>

          {/* A próxima ação recomendada, a peça que resume o produto. */}
          <div className="superficie-elevada mt-auto flex items-center gap-2.5 rounded-ds-surface border border-hairline p-2.5 lg:p-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/12 text-primary-accent lg:size-8">
              <Icone nome="comecar" className="size-3.5 lg:size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[9px] font-medium tracking-wide text-muted uppercase lg:text-[10px]">
                {mockup.proximaAcao}
              </span>
              <span className="block truncate text-[11px] text-ink lg:text-[12.5px]">
                {mockup.proximaAcaoTexto}
              </span>
            </span>
            <span className="preenchimento-acao hidden shrink-0 items-center rounded-full px-2.5 py-1.5 text-[10px] font-medium text-primary-ink sm:flex lg:text-[11px]">
              {mockup.continuar}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
