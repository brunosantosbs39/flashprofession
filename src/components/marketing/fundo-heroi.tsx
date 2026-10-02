import { marca } from "@/content/site"
import { fundoDe } from "@/lib/semente"

/**
 * O cenário da dobra de abertura.
 *
 * Ele não foi escolhido: foi DERIVADO do nome do produto, em `src/lib/semente.ts`.
 * O hash do nome decide a família do desenho e os parâmetros dela, então este
 * fundo é único deste produto e é sempre o mesmo. Trocar o nome em `marca.nome`
 * troca o fundo inteiro sem mexer aqui.
 *
 * TUDO AQUI É CSS. Zero JavaScript, zero canvas, zero laço de render: são
 * gradientes repetidos e uma máscara radial que apaga o padrão antes de ele
 * chegar no texto. Nada se move sozinho, então não tem o que parar quando a
 * dobra sai da tela nem quando a pessoa pede menos movimento, e o título, o
 * parágrafo e o botão nascem legíveis sem esperar nada carregar.
 *
 * A cor sai toda de `--ds-primary` e `--ds-hairline` por `color-mix`: trocar o
 * design system repinta o fundo junto com o resto do app.
 */
export function FundoHeroi() {
  const fundo = fundoDe(marca.nome)

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/*
        A máscara segura o padrão até o fim do cabeçalho e o acende ao longo de
        128px. Sem ela, a luz nasce em cima do menu e derruba o contraste do
        link `muted`, que é derivado pra 4.5:1 EM CIMA DO CANVAS.
      */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 4rem, black 12rem)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 4rem, black 12rem)",
        }}
      >
        <div
          className="absolute inset-[-30%]"
          style={{
            transform: `rotate(${fundo.giro}deg)`,
            opacity: fundo.forca,
            ...desenho(fundo),
          }}
        />
      </div>

      {/* A luz da marca, em duas camadas: a larga e rasa acende a dobra inteira,
          a bola acima do título dá o foco. Uma só ou tinge tudo, ou apaga antes
          de chegar na manchete. */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 4rem, black 12rem)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 4rem, black 12rem)",
        }}
      >
        <div className="aura-secao size-full">
          <div className="absolute -top-80 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        </div>
      </div>
    </div>
  )
}

/** A receita de cada família, em `background-image` e `background-size`. */
function desenho(fundo: ReturnType<typeof fundoDe>): React.CSSProperties {
  const tinta = "color-mix(in oklab, var(--ds-primary) 55%, var(--ds-hairline))"
  const passo = `${fundo.espaco}px`

  switch (fundo.familia) {
    case "pontilhado":
      // Um campo de pontos: o padrão mais discreto do cardápio, e o que menos
      // disputa com texto por cima.
      return {
        backgroundImage: `radial-gradient(circle at center, ${tinta} ${fundo.peso}px, transparent ${fundo.peso}px)`,
        backgroundSize: `${passo} ${passo}`,
      }

    case "ondas":
      // Faixas curvas empilhadas, feitas com dois gradientes cônicos deslocados.
      return {
        backgroundImage: `repeating-radial-gradient(circle at 50% 120%, transparent 0, transparent ${fundo.espaco * 2}px, ${tinta} ${fundo.espaco * 2}px, ${tinta} ${fundo.espaco * 2 + fundo.peso}px)`,
      }

    case "malha-diagonal":
      // Duas famílias de fios cruzados, sem virar o quadriculado de sempre:
      // eles se encontram em ângulo, não em cruz.
      return {
        backgroundImage: [
          `repeating-linear-gradient(60deg, ${tinta} 0 ${fundo.peso}px, transparent ${fundo.peso}px ${passo})`,
          `repeating-linear-gradient(-60deg, ${tinta} 0 ${fundo.peso}px, transparent ${fundo.peso}px ${passo})`,
        ].join(", "),
      }

    case "aurora":
      // Manchas largas de luz, sem repetição: o padrão mais orgânico dos quatro.
      return {
        backgroundImage: [
          `radial-gradient(ellipse ${fundo.espaco * 14}px ${fundo.espaco * 8}px at 18% 12%, ${tinta}, transparent 70%)`,
          `radial-gradient(ellipse ${fundo.espaco * 11}px ${fundo.espaco * 9}px at 82% 4%, ${tinta}, transparent 72%)`,
        ].join(", "),
      }
  }
}
