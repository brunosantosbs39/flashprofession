import { readFileSync } from "node:fs"

/**
 * Serve o exemplo de aplicativo desktop de vaga, em `/exemplo`.
 *
 * O arquivo é HTML puro, escrito à mão, e mora ao lado desta rota em
 * `vaga.html`. Ele não passa por React nem pelo Tailwind de propósito: o pedido
 * era um exemplo em HTML e CSS, e misturar ele no build do app tiraria
 * justamente a graça de poder abrir o arquivo sozinho.
 *
 * Por que uma rota em vez de largar o arquivo em `public/`: o Next serve
 * `public/exemplo/index.html` só no endereço completo, com o `index.html` no
 * fim. `/exemplo` sozinho dá 404. Esta rota entrega o mesmo arquivo no endereço
 * limpo, e é a única linha de servidor que o exemplo custa.
 *
 * `new URL(..., import.meta.url)` em vez de `process.cwd()`: é assim que o
 * empacotador enxerga a dependência e leva o HTML junto para a publicação. Com
 * um caminho montado em tempo de execução, o arquivo ficaria para trás e a rota
 * quebraria só em produção.
 */

const html = readFileSync(new URL("./vaga.html", import.meta.url), "utf8")

export function GET() {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // É um arquivo estático de verdade: pode ficar em cache no navegador, e a
      // revalidação continua barata porque a resposta é sempre a mesma.
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  })
}
