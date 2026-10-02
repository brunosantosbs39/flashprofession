import { PaginaV2 } from "@/components/marketing-v2/pagina-v2"
import { Tour } from "@/components/onboarding/tour"

/**
 * NESTA BRANCH (lbrezende/new-ds), a raiz mostra a home v2: a linguagem
 * visual da home do coolist com as nossas cores, mais gritante. A home
 * atual continua intacta em `src/components/marketing/` e volta a valer
 * na branch principal.
 *
 * A primeira parada do tour continua aqui, ancorada no botão de entrar
 * (data-tour="entrar" mora no cabeçalho da v2).
 */
export default function PaginaInicial() {
  return (
    <>
      <Tour />
      <PaginaV2 />
    </>
  )
}
