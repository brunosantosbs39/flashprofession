"use client"

import { useMemo, useState } from "react"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { Icone } from "@/components/app/icone"
import { BotaoLink } from "@/components/marketing/botao-link"
import { Card, CardConteudo } from "@/components/ui"
import { feedInicial } from "@/marketplace/mock-data"
import type { ItemFeed } from "@/marketplace/types"

type Filtro = "para-mim" | "proximos" | "agora" | "trabalhos" | "profissionais"

const filtros: Array<{ id: Filtro; rotulo: string }> = [
  { id: "para-mim", rotulo: "Para mim" },
  { id: "proximos", rotulo: "Próximos" },
  { id: "agora", rotulo: "Disponíveis agora" },
  { id: "trabalhos", rotulo: "Trabalhos" },
  { id: "profissionais", rotulo: "Profissionais" },
]

export default function PaginaInicioMarketplace() {
  const [filtro, setFiltro] = useState<Filtro>("para-mim")

  const itens = useMemo(() => {
    if (filtro === "trabalhos") return feedInicial.filter((item) => item.tipo === "trabalho")
    if (filtro === "profissionais") return feedInicial.filter((item) => item.tipo === "disponibilidade")
    if (filtro === "agora") {
      return feedInicial.filter(
        (item) => item.tipo === "disponibilidade" && item.profissional.disponivelAgora
      )
    }
    if (filtro === "proximos") {
      return [...feedInicial].sort((a, b) => distancia(a) - distancia(b))
    }
    return feedInicial
  }, [filtro])

  return (
    <>
      <CabecalhoPagina
        titulo="Encontre trabalho e profissionais perto de você"
        descricao="Oferta e demanda local em tempo quase real."
        acoes={
          <BotaoLink href="/app/publicar" iconeEsquerda={<Icone nome="mais" />}>
            Publicar
          </BotaoLink>
        }
      />

      <section className="grid gap-3 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardConteudo className="p-5 sm:p-6">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
              Busca rápida
            </p>
            <h2 className="mt-1 font-display text-xl text-ink">
              O que você precisa hoje?
            </h2>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <div className="superficie flex min-h-12 flex-1 items-center gap-2 rounded-full border border-hairline px-4 text-sm text-muted">
                <Icone nome="carreiras" className="size-4" />
                Pedreiro, diarista, eletricista, jardineiro...
              </div>
              <BotaoLink href="/app/explorar" tamanho="lg" comChip iconeDireita={<Icone nome="seta-direita" />}>
                Explorar perto de mim
              </BotaoLink>
            </div>
          </CardConteudo>
        </Card>

        <Card>
          <CardConteudo className="flex h-full flex-col justify-between gap-4 p-5">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                Disponibilidade
              </p>
              <p className="mt-1 font-display text-lg text-ink">Está livre para trabalhar?</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Publique sua disponibilidade e apareça para contratantes próximos.
              </p>
            </div>
            <BotaoLink
              href="/app/publicar?tipo=disponibilidade"
              variante="secundaria"
              iconeEsquerda={<Icone nome="disponivel" />}
            >
              Estou disponível
            </BotaoLink>
          </CardConteudo>
        </Card>
      </section>

      <section className="mt-6">
        <div className="flex flex-wrap gap-2">
          {filtros.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFiltro(item.id)}
              className={
                filtro === item.id
                  ? "preenchimento-acao rounded-full px-4 py-2 text-sm font-medium text-primary-ink"
                  : "superficie rounded-full border border-hairline px-4 py-2 text-sm text-muted hover:bg-elevated hover:text-ink"
              }
            >
              {item.rotulo}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {itens.map((item) =>
            item.tipo === "disponibilidade" ? (
              <CardProfissional key={item.profissional.id} item={item} />
            ) : (
              <CardTrabalho key={item.trabalho.id} item={item} />
            )
          )}
        </div>
      </section>
    </>
  )
}

function CardProfissional({ item }: { item: Extract<ItemFeed, { tipo: "disponibilidade" }> }) {
  const p = item.profissional
  return (
    <Card className="overflow-hidden">
      <CardConteudo className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/12 text-primary-accent">
              <Icone nome="perfil" className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-lg text-ink">{p.nome}</h2>
                {p.disponivelAgora && (
                  <span className="rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-medium text-success">
                    Disponível agora
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-ink">{p.profissao}</p>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted">
                <Icone nome="local" className="size-3.5" />
                {p.bairro} · {p.distanciaKm.toFixed(1)} km
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-display text-lg text-ink">R$ {p.valor}</p>
            <p className="text-[11px] text-muted">/{rotuloCobranca(p.formaCobranca)}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-hairline pt-4 text-[13px] text-muted">
          <span>★ {p.avaliacao.toFixed(1)}</span>
          <span>{p.trabalhosConcluidos} trabalhos</span>
          <span>Raio de {p.raioKm} km</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <BotaoLink href={`/app/profissionais/${p.id}`} variante="secundaria">
            Ver perfil
          </BotaoLink>
          <BotaoLink href={`/app/publicar?profissional=${p.id}`}>
            Contratar
          </BotaoLink>
        </div>
      </CardConteudo>
    </Card>
  )
}

function CardTrabalho({ item }: { item: Extract<ItemFeed, { tipo: "trabalho" }> }) {
  const t = item.trabalho
  return (
    <Card className="overflow-hidden">
      <CardConteudo className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary-accent">
                Trabalho
              </span>
              {t.urgente && (
                <span className="rounded-full bg-danger/10 px-2 py-0.5 text-[11px] font-medium text-danger">
                  Preciso agora
                </span>
              )}
            </div>
            <h2 className="mt-2 font-display text-lg text-ink">{t.titulo}</h2>
            <p className="mt-1 text-sm font-medium text-ink">{t.categoria}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-lg text-ink">
              R$ {t.orcamentoMin}–{t.orcamentoMax}
            </p>
            <p className="text-[11px] text-muted">orçamento</p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 text-[13px] text-muted sm:grid-cols-3">
          <span className="flex items-center gap-1.5">
            <Icone nome="local" className="size-3.5" />
            {t.bairro} · {t.distanciaKm.toFixed(1)} km
          </span>
          <span className="flex items-center gap-1.5">
            <Icone nome="calendar" className="size-3.5" />
            {t.quando}
          </span>
          <span>{t.propostas} propostas</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-hairline pt-4">
          <BotaoLink href={`/app/trabalhos/${t.id}`} variante="secundaria">
            Ver trabalho
          </BotaoLink>
          <BotaoLink href={`/app/trabalhos/${t.id}?proposta=1`} iconeDireita={<Icone nome="seta-direita" />}>
            Enviar proposta
          </BotaoLink>
        </div>
      </CardConteudo>
    </Card>
  )
}

function distancia(item: ItemFeed) {
  return item.tipo === "disponibilidade"
    ? item.profissional.distanciaKm
    : item.trabalho.distanciaKm
}

function rotuloCobranca(tipo: string) {
  if (tipo === "diaria") return "diária"
  if (tipo === "hora") return "hora"
  if (tipo === "m2") return "m²"
  return "serviço"
}
