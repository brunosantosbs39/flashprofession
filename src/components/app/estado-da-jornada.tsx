import { Icone } from "@/components/app/icone"
import { BotaoLink } from "@/components/marketing/botao-link"
import { EstadoVazio } from "@/components/ui"
import { sistema } from "@/content/site"
import type { Dados, Jornada, Profissao } from "@/lib/types"

/** O que ainda falta pra tela ter conteúdo, na ordem em que a jornada se monta. */
export type FaltaNaJornada = "profissao" | "nivel" | "curso"

/**
 * Decide qual dos três vazios do onboarding a tela deve mostrar.
 *
 * A ordem importa: sem profissão não existe nivelamento, e sem nivelamento
 * não existe curso. Cada tela diz até onde ela precisa que a jornada tenha
 * chegado (`ate`), e recebe de volta a PRIMEIRA coisa que falta, que é a única
 * que a pessoa consegue resolver agora.
 */
export function faltaNaJornada(
  jornada: Jornada | null,
  profissao: Profissao | null | undefined,
  ate: FaltaNaJornada,
  dados?: Dados
): FaltaNaJornada | null {
  if (!jornada || !jornada.profissaoId || !profissao) return "profissao"
  if (ate === "profissao") return null
  if (!jornada.resultado) return "nivel"
  if (ate === "nivel") return null
  const comecou =
    jornada.conteudosVistos.length > 0 ||
    jornada.competenciasConcluidas.length > 0 ||
    (dados?.sessoes.length ?? 0) > 0
  return comecou ? null : "curso"
}

export type EstadoDaJornadaProps = {
  falta: FaltaNaJornada
  /** O ícone da tela, pra pessoa saber onde está mesmo com a tela vazia. */
  icone: string
  profissao?: Profissao | null
  /** O `data-tour` da tela, pro onboarding guiado continuar apontando certo. */
  tour?: string
}

/**
 * O estado vazio de quem ainda está montando a jornada.
 *
 * Vazio aqui não é erro nem "nada encontrado": é a primeira tela que a
 * pessoa vê depois de entrar, e ela precisa dizer UMA coisa, a próxima
 * (regra RB-10). O componente é um só pra Mapa, Aprender, Praticar, Progresso
 * e Ranking dizerem a mesma coisa com as mesmas palavras.
 */
export function EstadoDaJornada({ falta, icone, profissao, tour }: EstadoDaJornadaProps) {
  const copy = sistema.vazios.jornada[falta]
  const texto = copy.texto.replace("{profissao}", profissao?.nome ?? "")

  return (
    <div className="superficie rounded-ds-surface border border-hairline" data-tour={tour}>
      <EstadoVazio
        icone={<Icone nome={icone} />}
        titulo={copy.titulo}
        texto={texto}
        acao={
          <BotaoLink href={copy.href} comChip iconeDireita={<Icone nome="seta-direita" />}>
            {copy.acao}
          </BotaoLink>
        }
      />
    </div>
  )
}
