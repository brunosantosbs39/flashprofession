import { Icone } from "@/components/app/icone"
import { landing } from "@/content/site"
import { BotaoLink } from "./botao-link"
import { FundoHeroi } from "./fundo-heroi"
import { MockupProduto } from "./mockup-produto"

/**
 * Dobra 1. A promessa de um lado, a prova de que o produto existe do outro.
 *
 * O arranjo é o de duas colunas, e não o centralizado: a promessa deste app é
 * curta, e a prova dele é uma CARTA, que só convence sendo vista. Lado a lado,
 * quem chega lê a frase e vê a carta no mesmo golpe de vista. No celular tudo
 * colapsa numa coluna, com a promessa antes da imagem.
 *
 * Nada aqui carrega JavaScript: o fundo é CSS, os dois botões são links.
 */
export function Heroi() {
  const { hero } = landing

  return (
    /*
      `-mt-16 pt-16` sobe a dobra os 64px do cabeçalho e devolve o mesmo tanto
      por dentro. O espaçamento visível não muda; o que muda é que o cenário
      passa POR BAIXO da barra em vez de começar embaixo dela. Sem isso fica um
      degrau de tom na altura do cabeçalho, que no topo da página é transparente.
    */
    <section className="relative -mt-16 overflow-hidden pt-16">
      <FundoHeroi />

      <div className="relative mx-auto max-w-[1200px] px-4 pt-14 pb-14 sm:px-6 sm:pt-20 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-12 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="flex max-w-2xl flex-col items-start">
          {/* O relevo da `.pilula` dispensa borda: o fio claro em cima e o
              escuro embaixo já desenham o objeto. Somar `border` viraria anel. */}
          <p className="pilula text-xs text-muted sm:text-[13px]">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
            {hero.eyebrow}
          </p>

          {/* Sem `text-ink`: a `.titulo-gradiente` pinta por `background-clip` e
              precisa da cor transparente. A primeira linha continua sólida. */}
          <h1 className="titulo-gradiente mt-6 text-[2rem] leading-[1.08] text-balance sm:text-5xl lg:text-[3.25rem]">
            {hero.titulo}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted sm:text-lg">
            {hero.subtitulo}
          </p>

          {/* Um botão só, de propósito: a dobra tem uma decisão, e o caminho
              de "entender antes" continua no menu, na âncora Como funciona. */}
          <div className="mt-8 flex w-full flex-col sm:w-auto sm:flex-row">
            <BotaoLink
              href="/entrar"
              tamanho="lg"
              comChip
              iconeDireita={
                <Icone
                  nome="seta-direita"
                  className="transition-transform duration-150 group-hover:translate-x-0.5"
                />
              }
            >
              {hero.ctaPrimario}
            </BotaoLink>
          </div>
        </div>

        <div className="mt-12 lg:mt-0">
          <MockupProduto />
        </div>
      </div>
    </section>
  )
}
