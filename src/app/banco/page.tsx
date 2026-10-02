import type { Metadata } from "next"
import Link from "next/link"
import { PainelDoBanco } from "@/components/banco/painel-do-banco"
import { Logo } from "@/components/app/logo"
import { RodapeMarketing } from "@/components/marketing/rodape-marketing"
import { Card, CardConteudo } from "@/components/ui"
import { paginaBanco, stack } from "@/content/banco"
import { marca } from "@/content/site"
import { contagens } from "@/lib/banco"

export const metadata: Metadata = {
  title: `${paginaBanco.titulo} · ${marca.nome}`,
  description: paginaBanco.subtitulo,
}

// As contagens vêm do banco a cada abertura: nada de página estática.
export const dynamic = "force-dynamic"

/**
 * A página de estudo do banco: o mapa interativo, como ler, as duas
 * ferramentas (Studio e db pull) e a stack inteira, camada por camada.
 *
 * Fica fora da casca do app de propósito: não é tela do produto, é material
 * de quem está aprendendo o projeto, como `/como-usar` e `/exemplo`.
 */
export default async function PaginaBanco() {
  const numeros = await contagens()

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="cabecalho-condensa sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center rounded-ds transition-opacity hover:opacity-80 pointer-coarse:min-h-11"
          >
            <Logo />
          </Link>
          <div className="ml-auto flex shrink-0 items-center gap-1">
            <Link
              href="/como-usar"
              className="flex items-center rounded-ds px-3 py-2 text-sm text-muted transition-colors hover:bg-elevated hover:text-ink pointer-coarse:min-h-11"
            >
              {paginaBanco.comoUsar}
            </Link>
            <Link
              href="/"
              className="flex items-center rounded-ds px-3 py-2 text-sm text-muted transition-colors hover:bg-elevated hover:text-ink pointer-coarse:min-h-11"
            >
              {paginaBanco.voltar}
            </Link>
          </div>
        </div>
      </header>

      <main id="conteudo" tabIndex={-1} className="flex-1">
        <section className="mx-auto max-w-[1200px] px-4 pt-12 pb-6 sm:px-6 sm:pt-16 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-[2rem] leading-[1.1] text-balance text-ink sm:text-4xl">
              {paginaBanco.titulo}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-pretty text-muted sm:text-lg">
              {paginaBanco.subtitulo}
            </p>
          </div>
        </section>

        <section aria-label={paginaBanco.titulo} className="mx-auto max-w-[1200px] px-4 pb-10 sm:px-6 lg:px-8">
          <PainelDoBanco contagens={numeros} />
        </section>

        <section className="mx-auto grid max-w-[1200px] gap-4 px-4 pb-14 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Card>
            <CardConteudo>
              <h2 className="font-display text-lg text-ink">{paginaBanco.comoLer.titulo}</h2>
              <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed text-muted">
                {paginaBanco.comoLer.itens.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </CardConteudo>
          </Card>

          <Card>
            <CardConteudo className="flex flex-col gap-5">
              <h2 className="font-display text-lg text-ink">{paginaBanco.ferramentas.titulo}</h2>
              {[paginaBanco.ferramentas.studio, paginaBanco.ferramentas.desenhar].map((ferramenta) => (
                <div key={ferramenta.titulo}>
                  <h3 className="text-sm font-medium text-ink">{ferramenta.titulo}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{ferramenta.texto}</p>
                  <code className="mt-2 inline-block rounded-ds border border-hairline bg-elevated px-2.5 py-1.5 font-mono text-[12.5px] text-ink">
                    {ferramenta.comando}
                  </code>
                  {"endereco" in ferramenta && (
                    <p className="mt-1 font-mono text-[12px] text-muted">{ferramenta.endereco}</p>
                  )}
                </div>
              ))}
            </CardConteudo>
          </Card>
        </section>

        <section aria-labelledby="stack-titulo" className="border-t border-hairline bg-surface">
          <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8">
            <h2 id="stack-titulo" className="text-2xl leading-tight text-balance text-ink sm:text-3xl">
              {stack.titulo}
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {stack.camadas.map((camada) => (
                <Card key={camada.nome}>
                  <CardConteudo>
                    <h3 className="text-[11px] font-medium tracking-wide text-muted uppercase">
                      {camada.nome}
                    </h3>
                    <dl className="mt-3 flex flex-col gap-3">
                      {camada.itens.map(([nome, papel]) => (
                        <div key={nome}>
                          <dt className="text-sm font-medium text-ink">{nome}</dt>
                          <dd className="text-[13px] leading-relaxed text-muted">{papel}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardConteudo>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <RodapeMarketing />
    </div>
  )
}
