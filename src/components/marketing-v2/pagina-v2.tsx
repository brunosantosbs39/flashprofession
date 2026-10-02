import Link from "next/link"
import { Icone } from "@/components/app/icone"
import { marca } from "@/content/site"
import { v2 } from "@/content/site-v2"
import { acharProfissao } from "@/lib/catalogo"
import { cn } from "@/lib/cn"
import "./v2.css"

/**
 * A home v2: a mesma promessa, falando alto.
 *
 * A linguagem visual vem da home do coolist: fundo chapado na cor de ação,
 * manchete display em caixa alta com sombra dura, cartões de vidro tortos
 * flutuando, setas desenhadas à mão, selo circular girando e um painel branco
 * de cantos largos subindo por cima do herói. As cores continuam sendo as
 * nossas: tudo sai de `--ds-*` ou de `color-mix` sobre eles (ver `v2.css`).
 *
 * Como o site atual, ela é 100% servidor: as flutuações são CSS, o giro do
 * selo é CSS, e não entra biblioteca de animação.
 *
 * DUAS EXCEÇÕES CONSCIENTES às regras da casa, só nesta página:
 * os cartões usam raio de 2rem (a peça central do vocabulário do coolist, no
 * lugar do nosso raio de superfície) e as setas rabiscadas são SVG desenhado
 * aqui (ilustração, como o mockup da home atual, e não ícone de interface).
 * Botão continua pílula, como manda a casa, e o coolist por acaso concorda.
 */
export function PaginaV2() {
  return (
    <div className="v2 flex min-h-dvh flex-col" style={{ background: "var(--v2-fundo)" }}>
      <a
        href="#conteudo"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[60] focus-visible:rounded-full focus-visible:bg-white focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:text-ink"
      >
        Pular para o conteúdo
      </a>

      <Cabecalho />

      <main id="conteudo" tabIndex={-1} className="flex-1 focus:outline-none">
        <Heroi />

        {/* O painel branco sobe por cima do herói, como uma segunda página. */}
        <div className="v2-painel-topo relative z-20 -mt-6 bg-white pt-6 md:-mt-10 md:pt-10">
          <Cartoes />
          <Numeros />
          <ComoFunciona />
          <Caminho />
        </div>

        <ChamadaFinal />
      </main>

      <Rodape />
    </div>
  )
}

function Cabecalho() {
  return (
    <nav
      aria-label={v2.nav.navegacao}
      className="relative z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 md:px-10 md:py-7"
    >
      <Link href="/" className="rounded-full focus-visible:outline-white">
        {/* O selo da marca: pílula pop com a quina dobrada, à la coolist. */}
        <span
          className="v2-micro relative inline-block rounded-full border-[1.5px] border-white px-4 py-1.5 shadow-sm"
          style={{ background: "var(--v2-pop)", color: "var(--v2-pop-tinta)" }}
        >
          {marca.nome}
          <span
            aria-hidden="true"
            className="absolute -bottom-1.5 left-4 size-3"
            style={{ background: "var(--v2-pop)", clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
          />
        </span>
      </Link>

      <div className="hidden items-center gap-2 md:flex">
        {v2.nav.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-full border border-white/30 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-white/10"
          >
            {link.rotulo}
          </a>
        ))}
      </div>

      <Link
        href="/entrar"
        data-tour="entrar"
        className="v2-micro inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-white px-5 py-2 shadow-sm transition-all hover:brightness-95 pointer-coarse:min-h-11"
        style={{ background: "var(--v2-pop)", color: "var(--v2-pop-tinta)" }}
      >
        {v2.nav.entrar}
        <Icone nome="seta-direita" className="size-3.5" />
      </Link>
    </nav>
  )
}

function Heroi() {
  const { hero } = v2
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="v2-grade pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center px-4 pt-6 pb-16 md:pt-12 md:pb-36">
        {/* A manchete: três linhas empilhadas, desalinhadas de propósito. O
            h1 é um só, com as linhas dentro, pro leitor de tela ouvir a frase
            inteira em vez de três títulos. */}
        <div className="relative mx-auto mt-4 mb-10 w-full max-w-6xl text-center md:mb-14">
          <h1 className="flex w-full flex-col md:gap-2">
            <span className="flex w-full justify-start pl-[4%] sm:pl-[10%] md:pl-[18%]">
              <span
                className="v2-display v2-sombra-dura text-[clamp(3rem,10vw,7.5rem)]"
                style={{ color: "var(--v2-pop)" }}
              >
                {hero.linha1}
              </span>
            </span>
            <span className="flex w-full justify-center">
              <span className="v2-display v2-sombra-dura text-[clamp(5rem,20vw,13rem)] text-white">
                {hero.linha2}
              </span>
            </span>
            <span className="flex w-full justify-end pr-[4%] sm:pr-[10%] md:pr-[20%]">
              <span className="v2-display v2-sombra-dura text-[clamp(2.6rem,8vw,6rem)] text-white">
                {hero.linha3}
              </span>
            </span>
          </h1>

          {/* O cenário em volta da manchete: cartões de vidro com o produto em
              miniatura, setas rabiscadas e o selo girando. Só no desktop, e
              invisível pro leitor de tela: é ilustração. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
            <div className="v2-flutua absolute bottom-[-10%] left-[1%] z-30">
              <CartaoDeVidro cartao={hero.cartaoMapa} rotacao="rotate-[-10deg]" />
            </div>
            <div className="v2-flutua-tarde absolute top-[-4%] right-[-1%] z-30">
              <CartaoDeVidro cartao={hero.cartaoAcao} rotacao="rotate-[10deg]" />
            </div>
            <div className="absolute bottom-[-6%] left-[24%] z-20 size-20 md:size-28">
              <SetaRabiscada lado="esquerda" />
            </div>
            <div className="absolute top-[6%] right-[22%] z-20 size-20 md:size-28">
              <SetaRabiscada lado="direita" />
            </div>
            <div className="absolute right-[4%] bottom-[-24%] z-40">
              <SeloCircular texto={hero.selo} />
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <p className="max-w-xl text-sm leading-snug font-semibold text-white/90 md:text-base">
            {hero.subtitulo}
          </p>
          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
            {/* O único CTA primário da página, na cor pop: regra da casa. */}
            <Link
              href="/entrar"
              className="v2-micro inline-flex items-center gap-2 rounded-full px-7 py-3.5 !text-[13px] shadow-lg transition-all hover:brightness-95 pointer-coarse:min-h-11"
              style={{ background: "var(--v2-pop)", color: "var(--v2-pop-tinta)" }}
            >
              {hero.ctaPrimario}
              <Icone nome="seta-direita" className="size-4" />
            </Link>
            <a
              href="#como-funciona"
              className="v2-micro inline-flex items-center rounded-full border border-white/40 bg-white/10 px-6 py-3.5 !text-[13px] text-white backdrop-blur-sm transition-colors hover:bg-white/20 pointer-coarse:min-h-11"
            >
              {hero.ctaSecundario}
            </a>
          </div>
          <p className="v2-micro mt-1 text-white/70">{hero.micro}</p>
        </div>
      </div>
    </section>
  )
}

type CartaoDoHeroi = {
  selo: string
  meta: string
  titulo: string
  linhas: ReadonlyArray<{ texto: string; feito: boolean }>
}

/** O cartão de vidro do herói: um pedacinho do produto, torto e flutuando. */
function CartaoDeVidro({ cartao, rotacao }: { cartao: CartaoDoHeroi; rotacao: string }) {
  return (
    <div
      className={cn(
        "v2-vidro flex w-48 flex-col rounded-[2rem] p-5 shadow-2xl hover:rotate-0 md:w-60",
        rotacao
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className="v2-micro inline-block rounded-full px-2.5 py-1 !text-[9px]"
          style={{ background: "var(--v2-pop)", color: "var(--v2-pop-tinta)" }}
        >
          {cartao.selo}
        </span>
        <span className="text-[10px] font-bold text-white">{cartao.meta}</span>
      </div>
      <p className="v2-micro mt-3 !text-[13px] !tracking-tight text-white">{cartao.titulo}</p>
      <ul className="mt-3 space-y-2">
        {cartao.linhas.map((linha) => (
          <li key={linha.texto} className="flex items-center gap-2 text-[11px] text-white/90 md:text-xs">
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-md border border-white/50",
                linha.feito && "border-transparent"
              )}
              style={linha.feito ? { background: "var(--v2-pop)" } : undefined}
            >
              {linha.feito && <Icone nome="check" className="size-3" style={{ color: "var(--v2-pop-tinta)" }} />}
            </span>
            <span className={cn(linha.feito && "text-white/60 line-through")}>{linha.texto}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** A seta rabiscada, desenhada à mão: ilustração, não ícone de interface. */
function SetaRabiscada({ lado }: { lado: "esquerda" | "direita" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="size-full overflow-visible stroke-current"
      style={{ color: "var(--v2-pop)" }}
      fill="none"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {lado === "esquerda" ? (
        <>
          <path d="M10,90 C 10,40 40,20 60,50 C 70,65 80,75 95,70" />
          <path d="M80,55 L95,70 L85,85" />
        </>
      ) : (
        <>
          <path d="M90,10 C 80,60 60,80 40,60 C 20,40 40,20 60,30 C 80,40 70,70 50,80" />
          <path d="M65,75 L50,80 L55,65" />
        </>
      )}
    </svg>
  )
}

/** O selo circular com o texto girando em volta da seta. */
function SeloCircular({ texto }: { texto: string }) {
  return (
    <div
      className="relative flex size-28 rotate-12 items-center justify-center rounded-full shadow-xl md:size-36"
      style={{ background: "var(--v2-pop)" }}
    >
      <div className="v2-gira absolute inset-1">
        <svg viewBox="0 0 100 100" className="size-full">
          <path
            id="v2-selo-caminho"
            d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
            fill="none"
          />
          <text className="v2-micro !text-[11px]" fill="var(--v2-pop-tinta)">
            <textPath href="#v2-selo-caminho" startOffset="0%">
              {texto}
            </textPath>
          </text>
        </svg>
      </div>
      <svg
        viewBox="0 0 100 100"
        className="size-10 overflow-visible stroke-current"
        style={{ color: "var(--v2-pop-tinta)" }}
        fill="none"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20,80 Q 40,50 30,30 T 80,20" />
        <path d="M60,10 L80,20 L70,40" />
      </svg>
    </div>
  )
}

function Cartoes() {
  return (
    <section aria-label={v2.cartoes.titulo} className="px-5 pt-14 pb-4 sm:px-8 md:pt-20 md:pb-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {v2.cartoes.itens.map((item) => (
          <div
            key={item.titulo}
            className="relative overflow-hidden rounded-[2rem] border border-hairline bg-surface p-7 md:p-8"
          >
            <h3 className="v2-display !text-2xl text-ink md:!text-3xl">{item.titulo}</h3>
            <p className="v2-micro mt-3 !text-[11px] text-muted md:!text-xs">{item.rotulo}</p>
            <div className="mt-8 flex justify-center">
              {item.miniatura === "nivel" && item.miniNivel && (
                <div
                  className="relative z-10 w-full max-w-[220px] rounded-2xl p-4 text-white shadow-lg"
                  style={{ background: "var(--v2-fundo)" }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="v2-micro rounded-full px-2.5 py-1 !text-[9px]"
                      style={{ background: "var(--v2-pop)", color: "var(--v2-pop-tinta)" }}
                    >
                      {item.miniNivel.chip}
                    </span>
                    <span className="text-[10px] font-bold text-white/80">{item.miniNivel.legenda}</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/25">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.miniNivel.percentual}%`, background: "var(--v2-pop)" }}
                    />
                  </div>
                </div>
              )}

              {item.miniatura === "caminho" && item.miniCaminho && (
                <ol className="relative z-10 flex flex-col gap-1.5">
                  {item.miniCaminho.map((nivel, indice) => (
                    <li
                      key={nivel}
                      className={cn(
                        "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold shadow-sm",
                        indice === 1 ? "text-white" : "border border-hairline bg-white text-ink"
                      )}
                      style={indice === 1 ? { background: "var(--v2-fundo)" } : undefined}
                    >
                      <span className="tabular-nums">{indice + 1}</span>
                      {nivel}
                    </li>
                  ))}
                </ol>
              )}

              {item.miniatura === "prova" && item.miniProva && (
                <div className="relative z-10 flex items-center rounded-full p-1.5 pr-2 text-white shadow-lg" style={{ background: "var(--v2-fundo)" }}>
                  <span className="v2-micro mr-2 rounded-full bg-white/20 px-4 py-2 !text-[10px] text-white">
                    {item.miniProva.pergunta} {item.miniProva.resposta}
                  </span>
                  <span
                    className="v2-micro rotate-6 rounded-full px-3 py-2 !text-[10px] shadow-md"
                    style={{ background: "var(--v2-pop)", color: "var(--v2-pop-tinta)" }}
                  >
                    {item.miniProva.selo}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Numeros() {
  return (
    <section aria-label={v2.numeros.titulo} className="px-5 py-10 sm:px-8 md:py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
        {v2.numeros.itens.map((item) => (
          <div key={item.rotulo} className="text-center">
            <p className="v2-display !text-6xl md:!text-7xl" style={{ color: "var(--v2-fundo)" }}>
              {item.valor}
            </p>
            <p className="v2-micro mt-2 text-muted">{item.rotulo}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ComoFunciona() {
  return (
    <section id="como-funciona" aria-labelledby="v2-como-titulo" className="scroll-mt-20 px-5 py-10 sm:px-8 md:py-14">
      <div className="mx-auto max-w-6xl">
        <h2 id="v2-como-titulo" className="v2-display !text-4xl text-ink md:!text-5xl">
          {v2.comoFunciona.titulo}
        </h2>
        <p className="v2-micro mt-3 text-muted">{v2.comoFunciona.subtitulo}</p>

        <ol className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
          {v2.comoFunciona.passos.map((passo) => (
            <li key={passo.numero} className="rounded-[2rem] border border-hairline bg-surface p-7 md:p-8">
              <p className="v2-display !text-5xl" style={{ color: "var(--v2-fundo)" }}>
                {passo.numero}
              </p>
              <h3 className="v2-micro mt-4 !text-[13px] text-ink">{passo.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{passo.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Caminho() {
  const niveis = acharProfissao("ux-ui-designer")?.niveis ?? []
  return (
    <section id="caminho" aria-labelledby="v2-caminho-titulo" className="scroll-mt-20 px-5 py-10 pb-16 sm:px-8 md:py-14 md:pb-24">
      <div className="mx-auto max-w-6xl">
        <h2 id="v2-caminho-titulo" className="v2-display !text-4xl text-ink md:!text-5xl">
          {v2.caminho.titulo}
        </h2>
        <p className="v2-micro mt-3 text-muted">{v2.caminho.subtitulo}</p>

        <ol className="mt-10 flex flex-col gap-3">
          {niveis.map((nivel, indice) => (
            <li
              key={nivel.ordem}
              className={cn(
                "flex items-center gap-4 rounded-full border px-5 py-3.5 md:px-7",
                indice === 1 ? "border-transparent text-white shadow-lg" : "border-hairline bg-surface text-ink"
              )}
              style={indice === 1 ? { background: "var(--v2-fundo)" } : undefined}
            >
              <span
                className={cn(
                  "v2-display grid size-9 shrink-0 place-items-center rounded-full !text-base",
                  indice !== 1 && "text-white"
                )}
                style={
                  indice === 1
                    ? { background: "var(--v2-pop)", color: "var(--v2-pop-tinta)" }
                    : { background: "var(--v2-fundo)" }
                }
              >
                {nivel.ordem}
              </span>
              <span className="v2-micro !text-[13px]">{nivel.nome}</span>
              <span className={cn("ml-auto hidden max-w-[46ch] truncate text-xs sm:block", indice === 1 ? "text-white/80" : "text-muted")}>
                {nivel.descricao}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function ChamadaFinal() {
  return (
    <section aria-labelledby="v2-final-titulo" className="relative overflow-hidden px-5 py-20 text-center sm:px-8 md:py-28">
      <div aria-hidden="true" className="v2-grade pointer-events-none absolute inset-0" />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-5">
        <h2 id="v2-final-titulo" className="v2-display v2-sombra-dura !text-4xl text-white md:!text-6xl">
          {v2.chamadaFinal.titulo}
        </h2>
        <p className="v2-micro text-white/80">{v2.chamadaFinal.texto}</p>
        {/* Secundário de propósito: o primário da página é o do herói. */}
        <Link
          href="/entrar"
          className="v2-micro mt-2 inline-flex items-center gap-2 rounded-full border-[1.5px] border-white/60 bg-white/10 px-7 py-3.5 !text-[13px] text-white backdrop-blur-sm transition-colors hover:bg-white/20 pointer-coarse:min-h-11"
        >
          {v2.chamadaFinal.cta}
          <Icone nome="seta-direita" className="size-4" />
        </Link>
      </div>
    </section>
  )
}

function Rodape() {
  return (
    <footer className="border-t border-white/20 px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <p className="v2-micro text-white/70">
          {marca.nome} · {v2.rodape.aviso}
        </p>
        <div className="flex items-center gap-4">
          <Link href="/como-usar" className="v2-micro text-white/70 transition-colors hover:text-white">
            {v2.rodape.comoUsar}
          </Link>
        </div>
      </div>
    </footer>
  )
}
