import { Icone } from "@/components/app/icone"
import { Card, CardConteudo } from "@/components/ui"
import { comoUsar } from "@/content/site"

/**
 * A lista do que ainda falta conectar.
 *
 * Cada item termina apontando pro arquivo ou pra pasta onde ele já está
 * esperando. É isso que faz a página ser útil em vez de decorativa: quem lê sai
 * sabendo onde abrir o editor.
 */
export function ListaDeEncaixes() {
  const { conectar } = comoUsar

  return (
    <section aria-labelledby="conectar-titulo" className="scroll-mt-20">
      <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-2xl">
          <h2
            id="conectar-titulo"
            className="text-2xl leading-tight text-balance text-ink sm:text-3xl"
          >
            {conectar.titulo}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">{conectar.subtitulo}</p>
        </div>

        <ul
          className="mt-10 grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
        >
          {conectar.itens.map((item) => (
            <li key={item.titulo} className="h-full">
              <Card className="h-full">
                <CardConteudo className="flex h-full flex-col gap-3 p-6">
                  <span className="superficie-elevada grid size-10 place-items-center rounded-full border border-hairline">
                    <Icone nome={item.icone} className="size-[18px] text-primary-accent" />
                  </span>

                  <h3 className="text-base text-ink">{item.titulo}</h3>
                  <p className="text-sm leading-relaxed text-muted">{item.texto}</p>

                  <p className="mt-auto border-t border-hairline pt-3 text-[12.5px] text-muted">
                    <span className="block text-[11px] font-medium tracking-wide uppercase">
                      {conectar.ondeRotulo}
                    </span>
                    <code className="mt-1 block font-mono break-words text-ink">{item.onde}</code>
                  </p>
                </CardConteudo>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
