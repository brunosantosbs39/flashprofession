"use client"

import { useMemo, useState } from "react"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { Icone } from "@/components/app/icone"
import { EstadoDaJornada, faltaNaJornada } from "@/components/app/estado-da-jornada"
import { BotaoLink } from "@/components/marketing/botao-link"
import { Badge, Button, Card, CardConteudo, Confirmar } from "@/components/ui"
import { sistema } from "@/content/site"
import { COMUNIDADE_RANKING, acharProfissao } from "@/lib/catalogo"
import { minutosNoPeriodo, scoreDaPessoa, sequenciaDeDias } from "@/lib/jornada"
import { cn } from "@/lib/cn"
import { useDados } from "@/lib/store"

const textos = sistema.ranking

/**
 * O ranking da comunidade (RNK-01), com a fórmula aberta na tela (RNK-03) e
 * participação opt-in de verdade (RNK-05): quem está fora não aparece em lista
 * nenhuma, e sair não apaga progresso. A pontuação premia constância e domínio
 * validado, nunca tempo de tela (RNK-02).
 */
export default function PaginaRanking() {
  const { dados, jornada, atualizarJornada } = useDados()
  const profissao = acharProfissao(jornada?.profissaoId)
  const [confirmandoSaida, setConfirmandoSaida] = useState(false)

  const participa = jornada?.publico.participaRanking ?? false

  const linhas = useMemo(() => {
    const comunidade = COMUNIDADE_RANKING.map((linha) => ({ ...linha, voce: false }))
    if (!participa || !jornada) return comunidade

    const minha = {
      nome: jornada.publico.nomePublico || "Você",
      score: scoreDaPessoa(dados),
      sequenciaDias: sequenciaDeDias(dados.sessoes),
      horasMes: Math.round(minutosNoPeriodo(dados.sessoes, 30) / 60),
      casesAprovados: dados.evidencias.filter((evidencia) => evidencia.estado === "case").length,
      voce: true,
    }
    return [...comunidade, minha].sort((a, b) => b.score - a.score)
  }, [dados, jornada, participa])

  // O ranking compara scores, e score nasce do nível validado: sem profissão
  // e sem nível não há o que comparar. O vazio diz a primeira coisa que falta.
  const falta = faltaNaJornada(jornada, profissao, "nivel")
  if (falta || !jornada || !profissao) {
    return (
      <>
        <CabecalhoPagina titulo={textos.titulo} descricao={textos.descricao} />
        <EstadoDaJornada
          falta={falta ?? "nivel"}
          icone="ranking"
          profissao={profissao}
          tour="ranking"
        />
      </>
    )
  }

  return (
    <div data-tour="ranking">
      <CabecalhoPagina
        titulo={`${textos.titulo}: ${profissao.nome}`}
        descricao={textos.descricao}
        acoes={<Badge variante="neutra">{textos.periodo}</Badge>}
      />

      {/* Fora do ranking: só o convite, nenhum dado da pessoa em lista nenhuma. */}
      {!participa && (
        <div className="superficie mb-5 flex flex-wrap items-center gap-4 rounded-ds-surface border border-hairline p-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/12 text-primary-accent">
            <Icone nome="seguranca" className="size-5" />
          </span>
          <div className="min-w-[220px] flex-1">
            <h2 className="font-display text-sm text-ink">{textos.optIn.titulo}</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">{textos.optIn.texto}</p>
          </div>
          <Button
            onClick={() =>
              atualizarJornada({
                publico: { ...jornada.publico, participaRanking: true },
              })
            }
          >
            {textos.optIn.entrar}
          </Button>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        {/* A tabela vira cartões no celular: os mesmos dados, sem rolagem lateral. */}
        <div className="superficie overflow-hidden rounded-ds-surface border border-hairline">
          <table className="hidden w-full text-sm sm:table">
            <caption className="sr-only">{textos.titulo}</caption>
            <thead>
              <tr className="border-b border-hairline text-left text-[11px] tracking-wide text-muted uppercase">
                <th scope="col" className="px-4 py-3 font-medium">{textos.colunas.posicao}</th>
                <th scope="col" className="px-4 py-3 font-medium">{textos.colunas.nome}</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">{textos.colunas.score}</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">{textos.colunas.sequencia}</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">{textos.colunas.horas}</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">{textos.colunas.cases}</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((linha, indice) => (
                <tr
                  key={linha.nome}
                  className={cn(
                    "border-b border-hairline last:border-b-0",
                    linha.voce && "bg-primary/8"
                  )}
                >
                  <td className="px-4 py-3 font-display tabular-nums text-ink">#{indice + 1}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 text-ink">
                      {linha.nome}
                      {linha.voce && (
                        <Badge variante="destaque" ponto>
                          {textos.voce}
                        </Badge>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums text-ink">{linha.score}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted">{linha.sequenciaDias} dias</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted">{linha.horasMes} h</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted">{linha.casesAprovados}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="flex flex-col divide-y divide-hairline sm:hidden">
            {linhas.map((linha, indice) => (
              <li key={linha.nome} className={cn("flex items-center gap-3 px-4 py-3", linha.voce && "bg-primary/8")}>
                <span className="font-display text-sm tabular-nums text-ink">#{indice + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm text-ink">
                    {linha.nome}
                    {linha.voce && (
                      <Badge variante="destaque" ponto>
                        {textos.voce}
                      </Badge>
                    )}
                  </span>
                  <span className="block text-[12px] text-muted">
                    {linha.sequenciaDias} dias · {linha.horasMes} h · {linha.casesAprovados} cases
                  </span>
                </span>
                <span className="shrink-0 font-medium tabular-nums text-ink">{linha.score}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          {/* A transparência da pontuação (RNK-03): a fórmula na tela. */}
          <Card>
            <CardConteudo className="p-5">
              <h2 className="flex items-center gap-2 font-display text-sm text-ink">
                <Icone nome="grafico" className="size-4 text-primary-accent" />
                {textos.comoFunciona.titulo}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{textos.comoFunciona.texto}</p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {textos.comoFunciona.itens.map((item) => (
                  <li key={item} className="flex gap-2 text-[13px] text-ink">
                    <Icone nome="check" className="mt-0.5 size-3.5 shrink-0 text-success" />
                    <span className="min-w-0">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t border-hairline pt-3 text-[12.5px] leading-relaxed text-muted">
                {textos.comoFunciona.naoConta}
              </p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                {textos.comoFunciona.atualiza}
              </p>
            </CardConteudo>
          </Card>

          {/* O que recrutadores veem (RNK-04), sempre condicionado ao opt-in. */}
          <Card>
            <CardConteudo className="p-5">
              <h2 className="flex items-center gap-2 font-display text-sm text-ink">
                <Icone nome="perfil" className="size-4 text-primary-accent" />
                {textos.recrutadores.titulo}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{textos.recrutadores.texto}</p>
              <BotaoLink href="/app/perfil" variante="secundaria" tamanho="sm" className="mt-3">
                {textos.recrutadores.verPerfil}
              </BotaoLink>
            </CardConteudo>
          </Card>

          {participa && (
            <Button
              variante="fantasma"
              onClick={() => setConfirmandoSaida(true)}
              className="self-start text-danger hover:bg-danger/10 hover:text-danger"
            >
              {textos.sair}
            </Button>
          )}
        </div>
      </div>

      <Confirmar
        aberto={confirmandoSaida}
        titulo={textos.sairConfirmar.titulo}
        texto={textos.sairConfirmar.texto}
        rotuloConfirmar={textos.sairConfirmar.confirmar}
        aoCancelar={() => setConfirmandoSaida(false)}
        aoConfirmar={() => {
          setConfirmandoSaida(false)
          atualizarJornada({ publico: { ...jornada.publico, participaRanking: false } })
        }}
      />
    </div>
  )
}
