/**
 * A semente visual do produto.
 *
 * O fundo da dobra de abertura não é escolhido a dedo: ele é DERIVADO do nome
 * do produto. Um hash simples do nome decide a família do desenho e os
 * parâmetros dele, então dois produtos diferentes nunca saem com o mesmo fundo,
 * e o mesmo produto sai sempre igual, em toda carga, no servidor e no navegador.
 *
 * É determinístico de propósito: nada de `Math.random()` aqui, senão o servidor
 * e o navegador desenhariam coisas diferentes e o React reclamaria da
 * divergência de hidratação.
 */

/** djb2, com o deslocamento sem sinal pra não estourar em número negativo. */
export function semente(texto: string): number {
  let hash = 5381
  for (let i = 0; i < texto.length; i++) {
    hash = ((hash << 5) + hash + texto.charCodeAt(i)) >>> 0
  }
  return hash
}

/** As famílias possíveis. A ordem importa: é o índice que o hash escolhe. */
export const FAMILIAS = ["ondas", "pontilhado", "malha-diagonal", "aurora"] as const
export type Familia = (typeof FAMILIAS)[number]

export type Fundo = {
  familia: Familia
  /** Distância entre os elementos repetidos, em pixels. */
  espaco: number
  /** Tamanho do elemento (raio do ponto, espessura do fio, amplitude da onda). */
  peso: number
  /** Inclinação do padrão inteiro, em graus. */
  giro: number
  /** Quanto de tinta o padrão recebe, de 0 a 1. */
  forca: number
}

/** Pedaço do hash, sem sinal, dentro de um intervalo. */
function fatia(hash: number, deslocamento: number, quantos: number) {
  return (hash >>> deslocamento) % quantos
}

/**
 * O fundo de um nome.
 *
 * Cada parâmetro sai de um pedaço diferente do hash, então nomes parecidos não
 * caem em fundos parecidos: mudar uma letra vira o hash inteiro.
 */
export function fundoDe(nome: string): Fundo {
  const hash = semente(nome)

  return {
    familia: FAMILIAS[hash % FAMILIAS.length],
    espaco: 22 + fatia(hash, 3, 7) * 2,
    peso: 1.1 + fatia(hash, 7, 5) * 0.25,
    giro: -24 + fatia(hash, 11, 9) * 6,
    forca: 0.16 + fatia(hash, 17, 6) * 0.04,
  }
}
