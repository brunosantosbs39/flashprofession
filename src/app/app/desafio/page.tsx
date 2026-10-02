import type { Metadata } from "next"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { Icone } from "@/components/app/icone"
import { Card, CardConteudo } from "@/components/ui"
import { desafio, marca } from "@/content/site"

export const metadata: Metadata = {
  title: `${desafio.titulo} · ${marca.nome}`,
}

/**
 * O guia de refinamento deste app.
 *
 * É uma tela de leitura: sem formulário, sem estado, tudo servidor. Ela conta o
 * que dá pra melhorar aqui dentro, como testar com gente de verdade e qual
 * número prova que a melhora aconteceu.
 *
 * Todo link externo abre em aba nova, com `rel="noopener noreferrer"`.
 */
export default function PaginaDesafio() {
  return (
    <>
      <CabecalhoPagina titulo={desafio.titulo} descricao={desafio.descricao} />

      <div className="flex max-w-[70ch] flex-col gap-6">
        <Card className="faixa-topo overflow-hidden">
          <CardConteudo className="flex flex-col gap-3">
            <p className="text-sm leading-relaxed text-ink">{desafio.abertura.texto}</p>
            <LinkExterno href={desafio.abertura.link.href} rotulo={desafio.abertura.link.rotulo} />
          </CardConteudo>
        </Card>

        <section aria-labelledby="refinar-titulo" className="flex flex-col gap-4">
          <div>
            <h2 id="refinar-titulo" className="font-display text-lg text-ink">
              {desafio.refinar.titulo}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{desafio.refinar.intro}</p>
          </div>

          <Card>
            <CardConteudo className="flex flex-col gap-2">
              <h3 className="flex items-center gap-2 font-display text-sm text-ink">
                <Icone nome="alerta" className="size-4 text-warning" />
                {desafio.refinar.ponto.titulo}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{desafio.refinar.ponto.texto}</p>
            </CardConteudo>
          </Card>

          <Card>
            <CardConteudo className="flex flex-col gap-3">
              <h3 className="flex items-center gap-2 font-display text-sm text-ink">
                <Icone nome="ideia" className="size-4 text-primary-accent" />
                {desafio.refinar.solucao.titulo}
              </h3>
              <ListaComMarca itens={desafio.refinar.solucao.itens} />
            </CardConteudo>
          </Card>

          <Card>
            <CardConteudo className="flex flex-col gap-3">
              <h3 className="flex items-center gap-2 font-display text-sm text-ink">
                <Icone nome="usuario" className="size-4 text-primary-accent" />
                {desafio.refinar.teste.titulo}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{desafio.refinar.teste.intro}</p>
              <ListaComMarca itens={desafio.refinar.teste.itens} />
            </CardConteudo>
          </Card>

          <Card>
            <CardConteudo className="flex flex-col gap-3">
              <h3 className="flex items-center gap-2 font-display text-sm text-ink">
                <Icone nome="respostas" className="size-4 text-primary-accent" />
                {desafio.refinar.metrica.titulo}
              </h3>

              {/* `dl` porque são pares de rótulo e valor: quem usa leitor de tela
                  ouve "Métrica: Adoção", e não duas frases soltas. */}
              <dl className="flex flex-col gap-3">
                <div>
                  <dt className="text-[11px] font-medium tracking-wide text-muted uppercase">
                    {desafio.refinar.metrica.rotulos.metrica}
                  </dt>
                  <dd className="mt-0.5 text-sm text-ink">
                    <span className="font-display">{desafio.refinar.metrica.nome}</span>
                    <span className="mt-1 block leading-relaxed text-muted">
                      {desafio.refinar.metrica.definicao}
                    </span>
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-medium tracking-wide text-muted uppercase">
                    {desafio.refinar.metrica.rotulos.comoMedir}
                  </dt>
                  <dd className="mt-0.5 text-sm leading-relaxed text-ink">
                    {desafio.refinar.metrica.comoMedir}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-medium tracking-wide text-muted uppercase">
                    {desafio.refinar.metrica.rotulos.meta}
                  </dt>
                  <dd className="mt-0.5 text-sm leading-relaxed text-ink">
                    {desafio.refinar.metrica.meta}
                  </dd>
                </div>
              </dl>

              <p className="border-t border-hairline pt-3 text-[13px] leading-relaxed text-muted">
                {desafio.refinar.metrica.fecho}
              </p>
            </CardConteudo>
          </Card>

          <Card>
            <CardConteudo className="flex flex-col gap-2">
              <h3 className="flex items-center gap-2 font-display text-sm text-ink">
                <Icone nome="errei" className="size-4 text-danger" />
                {desafio.refinar.armadilha.titulo}
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                {desafio.refinar.armadilha.texto}
              </p>
            </CardConteudo>
          </Card>
        </section>

        <section aria-labelledby="carreira-titulo" className="flex flex-col gap-3">
          <h2 id="carreira-titulo" className="font-display text-lg text-ink">
            {desafio.carreira.titulo}
          </h2>

          {desafio.carreira.paragrafos.map((paragrafo) => (
            <p key={paragrafo} className="text-sm leading-relaxed text-muted">
              {paragrafo}
            </p>
          ))}

          <p className="text-sm leading-relaxed text-muted">
            {desafio.carreira.fecho.antes}
            <LinkNoTexto
              href={desafio.carreira.fecho.link1.href}
              rotulo={desafio.carreira.fecho.link1.rotulo}
            />
            {desafio.carreira.fecho.meio}
            <LinkNoTexto
              href={desafio.carreira.fecho.link2.href}
              rotulo={desafio.carreira.fecho.link2.rotulo}
            />
            {desafio.carreira.fecho.depois}
          </p>
        </section>

        {/* O tour de boas-vindas para aqui. Ver src/content/tour.ts. */}
        <section
          data-tour="desafio-fecho"
          className="flex flex-col gap-4 border-t border-hairline pt-6"
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={desafio.fecho.primario.href}
              target="_blank"
              rel="noopener noreferrer"
              className="preenchimento-acao group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium text-primary-ink transition-[filter] duration-150 hover:brightness-[1.08] pointer-coarse:min-h-11"
            >
              {desafio.fecho.primario.rotulo}
              <Icone nome="link-externo" className="size-4" />
            </a>

            <a
              href={desafio.fecho.secundario.href}
              target="_blank"
              rel="noopener noreferrer"
              className="superficie inline-flex h-12 items-center justify-center gap-2 rounded-full border border-hairline px-6 text-[15px] font-medium text-ink transition-colors duration-150 hover:bg-elevated pointer-coarse:min-h-11"
            >
              {desafio.fecho.secundario.rotulo}
              <Icone nome="link-externo" className="size-4" />
            </a>
          </div>

          <p className="text-[13px] text-muted">
            <LinkNoTexto
              href={desafio.fecho.linkedin.href}
              rotulo={desafio.fecho.linkedin.rotulo}
            />
          </p>
        </section>
      </div>
    </>
  )
}

/** Item de lista com um traço curto no lugar do marcador redondo do navegador. */
function ListaComMarca({ itens }: { itens: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {itens.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
          <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-primary" />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function LinkNoTexto({ href, rotulo }: { href: string; rotulo: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-ds font-medium text-primary-accent underline underline-offset-2 hover:text-ink"
    >
      {rotulo}
    </a>
  )
}

function LinkExterno({ href, rotulo }: { href: string; rotulo: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-fit items-center gap-1.5 rounded-ds text-sm font-medium text-primary-accent hover:text-ink pointer-coarse:min-h-11"
    >
      {rotulo}
      <Icone nome="link-externo" className="size-4" />
    </a>
  )
}
