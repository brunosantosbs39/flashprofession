"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { use, useState } from "react"
import { Icone } from "@/components/app/icone"
import { BotaoLink } from "@/components/marketing/botao-link"
import { Badge, Button, Card, CardConteudo, Confirmar, EstadoVazio } from "@/components/ui"
import { sistema } from "@/content/site"
import { AREAS, acharProfissao } from "@/lib/catalogo"
import { useDados } from "@/lib/store"

const textos = sistema.profissao

/**
 * A ficha completa da profissão (CAR-03): rotina, responsabilidades, entregas,
 * competências, os cinco níveis, esforço e oportunidades, tudo ANTES de
 * confirmar. Confirmar leva direto pro nivelamento específico dela (CAR-04), e
 * trocar de objetivo pede confirmação sem apagar nada (CAR-05).
 */
export default function PaginaProfissao({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { jornada, trocarProfissao } = useDados()
  const [confirmandoTroca, setConfirmandoTroca] = useState(false)

  const profissao = acharProfissao(id)

  if (!profissao) {
    return (
      <div className="superficie rounded-ds-surface border border-hairline">
        <EstadoVazio
          icone={<Icone nome="carreiras" />}
          titulo={sistema.carreiras.semResultado.titulo}
          texto={sistema.carreiras.semResultado.texto}
          acao={
            <BotaoLink href="/app/carreiras" variante="secundaria">
              {textos.voltar}
            </BotaoLink>
          }
        />
      </div>
    )
  }

  const area = AREAS.find((a) => a.id === profissao.areaId)
  const ehObjetivo = jornada?.profissaoId === profissao.id
  const temTrilhaAndando = Boolean(jornada?.profissaoId && jornada.etapa !== "novo" && !ehObjetivo)

  function escolher() {
    trocarProfissao(profissao!.id)
    router.push("/app/diagnostico")
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-2 border-b border-hairline pb-5">
        <Link
          href="/app/carreiras"
          className="-mx-2 inline-flex w-fit items-center gap-1.5 rounded-ds px-2 py-1.5 text-[13px] text-muted transition-colors hover:text-ink pointer-coarse:min-h-11"
        >
          <Icone nome="seta-esquerda" className="size-4" />
          {textos.voltar}
        </Link>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h1 className="text-xl text-ink sm:text-2xl">{profissao.nome}</h1>
          <Badge variante="neutra">{area?.nome}</Badge>
          {profissao.demo && <Badge variante="aviso">{sistema.demonstracao}</Badge>}
          {ehObjetivo && (
            <Badge variante="destaque" ponto>
              {sistema.carreiras.objetivoAtual}
            </Badge>
          )}
        </div>
        <p className="max-w-prose text-sm leading-relaxed text-muted">{profissao.resumo}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          <Secao titulo={textos.rotina} icone="tempo">
            <ListaComMarca itens={profissao.rotina} />
          </Secao>

          <Secao titulo={textos.responsabilidades} icone="acertei">
            <ListaComMarca itens={profissao.responsabilidades} />
          </Secao>

          <Secao titulo={textos.entregas} icone="evidencia">
            <ListaComMarca itens={profissao.entregas} />
          </Secao>

          <Secao titulo={textos.niveis} icone="mapa">
            <ol className="flex flex-col gap-3">
              {profissao.niveis.map((nivel) => (
                <li key={nivel.ordem} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="realce-interno grid size-7 shrink-0 place-items-center rounded-full bg-primary text-[12px] font-semibold text-primary-ink"
                  >
                    {nivel.ordem}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-medium text-ink">{nivel.nome}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{nivel.descricao}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Secao>

          <Secao titulo={textos.competencias} icone="nivel">
            <ul className="flex flex-wrap gap-2">
              {profissao.competencias.map((competencia) => (
                <li
                  key={competencia.id}
                  className="superficie-elevada rounded-ds-fine border border-hairline px-3 py-1.5 text-[13px] text-ink"
                >
                  {competencia.nome}
                  <span className="ml-1.5 text-[11px] text-muted">nível {competencia.nivel}</span>
                </li>
              ))}
            </ul>
          </Secao>
        </div>

        {/* A coluna de decisão: esforço, oportunidades e o CTA que entra no
            nivelamento. Sticky porque é a razão da página existir. */}
        <Card className="lg:sticky lg:top-4">
          <CardConteudo className="flex flex-col gap-4 p-5">
            <dl className="flex flex-col gap-3 text-sm">
              <div>
                <dt className="text-[11px] font-medium tracking-wide text-muted uppercase">
                  {textos.esforco}
                </dt>
                <dd className="mt-0.5 text-ink">{profissao.esforco}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium tracking-wide text-muted uppercase">
                  {textos.tipoTrabalho}
                </dt>
                <dd className="mt-0.5 text-ink">{profissao.tipoTrabalho}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium tracking-wide text-muted uppercase">
                  {textos.oportunidades}
                </dt>
                <dd className="mt-0.5 leading-relaxed text-ink">{profissao.oportunidades}</dd>
              </div>
            </dl>

            <div className="border-t border-hairline pt-4" data-tour="iniciar-nivelamento">
              {ehObjetivo ? (
                <>
                  <p className="mb-3 text-[13px] text-muted">{textos.jaEscolhida}</p>
                  <BotaoLink href="/app/diagnostico" larguraTotal>
                    {textos.continuarNivelamento}
                  </BotaoLink>
                </>
              ) : (
                <Button
                  larguraTotal
                  tamanho="lg"
                  iconeDireita={<Icone nome="seta-direita" />}
                  onClick={() => {
                    if (temTrilhaAndando) setConfirmandoTroca(true)
                    else escolher()
                  }}
                >
                  {textos.escolher}
                </Button>
              )}
            </div>
          </CardConteudo>
        </Card>
      </div>

      {/* Trocar de objetivo pede confirmação e não apaga evidências (CAR-05). */}
      <Confirmar
        aberto={confirmandoTroca}
        destrutivo={false}
        titulo={textos.trocar.titulo}
        texto={textos.trocar.texto}
        rotuloConfirmar={textos.trocar.confirmar}
        aoCancelar={() => setConfirmandoTroca(false)}
        aoConfirmar={() => {
          setConfirmandoTroca(false)
          escolher()
        }}
      />
    </>
  )
}

function Secao({ titulo, icone, children }: { titulo: string; icone: string; children: React.ReactNode }) {
  return (
    <section aria-label={titulo}>
      <h2 className="mb-3 flex items-center gap-2 font-display text-sm text-ink">
        <Icone nome={icone} className="size-4 text-primary-accent" />
        {titulo}
      </h2>
      {children}
    </section>
  )
}

function ListaComMarca({ itens }: { itens: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {itens.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
          <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-primary" />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  )
}
