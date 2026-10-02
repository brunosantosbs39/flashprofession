import type { Metadata } from "next"
import Link from "next/link"
import { Icone } from "@/components/app/icone"
import { Logo } from "@/components/app/logo"
import { ListaDeEncaixes } from "@/components/como-usar/lista-de-encaixes"
import { BotaoLink } from "@/components/marketing/botao-link"
import { Divisor } from "@/components/marketing/divisor"
import { RodapeMarketing } from "@/components/marketing/rodape-marketing"
import { Card, CardConteudo } from "@/components/ui"
import { comoUsar, marca } from "@/content/site"

export const metadata: Metadata = {
  title: `${comoUsar.titulo} · ${marca.nome}`,
  description: comoUsar.subtitulo,
}

/**
 * A página Como usar: o mapa do que este projeto já faz e do que ele já está
 * preparado pra fazer.
 *
 * Ela é 100% servidor, sem estado e sem imagem: as ilustrações são os próprios
 * ícones de traço do app, e o resto é tipografia. Todo link externo abre em aba
 * nova, com `rel="noopener noreferrer"`.
 */
export default function PaginaComoUsar() {
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
              href="/"
              className="flex items-center rounded-ds px-3 py-2 text-sm text-muted transition-colors hover:bg-elevated hover:text-ink pointer-coarse:min-h-11"
            >
              {comoUsar.voltar}
            </Link>
            <BotaoLink href="/entrar" tamanho="sm">
              {comoUsar.entrar}
            </BotaoLink>
          </div>
        </div>
      </header>

      <main id="conteudo" tabIndex={-1} className="flex-1">
        <section className="mx-auto max-w-[1200px] px-4 pt-14 pb-4 sm:px-6 sm:pt-20 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-[2rem] leading-[1.1] text-balance text-ink sm:text-4xl lg:text-5xl">
              {comoUsar.titulo}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-pretty text-muted sm:text-lg">
              {comoUsar.subtitulo}
            </p>
          </div>
        </section>

        {/* BLOCO 1 */}
        <section aria-labelledby="pronto-titulo" className="scroll-mt-20">
          <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <div className="max-w-2xl">
              <h2
                id="pronto-titulo"
                className="text-2xl leading-tight text-balance text-ink sm:text-3xl"
              >
                {comoUsar.pronto.titulo}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {comoUsar.pronto.subtitulo}
              </p>
            </div>

            <ul
              className="mt-10 grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
            >
              {comoUsar.pronto.itens.map((item) => (
                <li key={item.titulo} className="h-full">
                  <Card className="h-full">
                    <CardConteudo className="flex h-full flex-col gap-2.5 p-6">
                      <span className="flex items-center gap-2 text-primary-accent">
                        <Icone nome={item.icone} className="size-[18px]" />
                        <Icone nome="check" className="size-4 text-success" />
                      </span>
                      <h3 className="text-base text-ink">{item.titulo}</h3>
                      <p className="text-sm leading-relaxed text-muted">{item.texto}</p>
                    </CardConteudo>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Divisor />

        {/* BLOCO 2 */}
        <ListaDeEncaixes />

        <Divisor />

        {/* BLOCO 3, e ele é bloco de destaque de propósito: é a resposta pra
            pergunta que a lista de cima acabou de plantar. */}
        <section aria-labelledby="workshop-titulo" className="scroll-mt-20">
          <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <Card className="faixa-topo overflow-hidden">
              <CardConteudo className="flex flex-col gap-4 p-8 sm:p-10">
                <span className="pilula w-fit text-xs text-muted">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
                  {comoUsar.workshop.acao}
                </span>

                <h2
                  id="workshop-titulo"
                  className="max-w-2xl text-2xl leading-tight text-balance text-ink sm:text-3xl"
                >
                  {comoUsar.workshop.titulo}
                </h2>

                <p className="max-w-2xl text-base leading-relaxed text-muted">
                  {comoUsar.workshop.texto}
                </p>

                <a
                  href={comoUsar.workshop.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="preenchimento-acao mt-2 inline-flex h-12 w-fit items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium text-primary-ink transition-[filter] duration-150 hover:brightness-[1.08] pointer-coarse:min-h-11"
                >
                  {comoUsar.workshop.acao}
                  <Icone nome="link-externo" className="size-4" />
                </a>
              </CardConteudo>
            </Card>
          </div>
        </section>

        <Divisor />

        {/* BLOCO 4 */}
        <section aria-labelledby="caminhos-titulo" className="scroll-mt-20">
          <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <h2
              id="caminhos-titulo"
              className="max-w-2xl text-2xl leading-tight text-balance text-ink sm:text-3xl"
            >
              {comoUsar.caminhos.titulo}
            </h2>

            <ul className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
              {comoUsar.caminhos.itens.map((item) => (
                <li key={item.titulo} className="h-full">
                  <Card className="h-full">
                    <CardConteudo className="flex h-full flex-col gap-3 p-6 lg:p-8">
                      <span className="superficie-elevada grid size-11 place-items-center rounded-full border border-hairline">
                        <Icone nome={item.icone} className="size-5 text-primary-accent" />
                      </span>

                      <h3 className="text-lg text-ink">{item.titulo}</h3>

                      <p className="text-[13px] text-muted">
                        <span className="block text-[11px] font-medium tracking-wide uppercase">
                          {comoUsar.caminhos.paraQuemRotulo}
                        </span>
                        {item.paraQuem}
                      </p>

                      <p className="text-sm leading-relaxed text-muted">{item.texto}</p>

                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="superficie mt-auto inline-flex h-11 w-fit items-center justify-center gap-2 rounded-full border border-hairline px-5 text-sm font-medium text-ink transition-colors duration-150 hover:bg-elevated pointer-coarse:min-h-11"
                      >
                        {item.acao}
                        <Icone nome="link-externo" className="size-4" />
                      </a>
                    </CardConteudo>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Divisor />

        {/* BLOCO 5 */}
        <section aria-labelledby="proximos-titulo" className="scroll-mt-20">
          <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <h2
              id="proximos-titulo"
              className="max-w-2xl text-2xl leading-tight text-balance text-ink sm:text-3xl"
            >
              {comoUsar.proximos.titulo}
            </h2>

            {/* `ol` porque a ordem é conteúdo: é uma semana de trabalho em
                sequência, não uma lista de opções soltas. */}
            <ol className="mt-8 flex max-w-2xl flex-col gap-3">
              {comoUsar.proximos.itens.map((item, indice) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="realce-interno grid size-7 shrink-0 place-items-center rounded-full bg-primary text-[12px] font-semibold text-primary-ink"
                  >
                    {indice + 1}
                  </span>
                  <span className="min-w-0 pt-0.5 text-sm leading-relaxed text-ink">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <RodapeMarketing />
    </div>
  )
}
