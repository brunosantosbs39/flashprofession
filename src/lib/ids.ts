/**
 * O gerador de id do app, num arquivo sem "use client": o store é de navegador,
 * e importar ele de um módulo puro arrastaria a diretiva junto.
 */
export function novoId(prefixo: string) {
  return `${prefixo}-${Math.random().toString(36).slice(2, 9)}`
}
