"use client"

import { useMemo, useState } from "react"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { Icone } from "@/components/app/icone"
import { BotaoLink } from "@/components/marketing/botao-link"
import { Card, CardConteudo } from "@/components/ui"
import { profissionais, trabalhos } from "@/marketplace/mock-data"

type Visao = "todos" | "profissionais" | "trabalhos"

export default function PaginaExplorar() {
  const [visao, setVisao] = useState<Visao>("todos")
  const [raio, setRaio] = useState(10)

  const profissionaisVisiveis = useMemo(
    () => profissionais.filter((item) => item.distanciaKm <= raio),
    [raio]
  )
  const trabalhosVisiveis = useMemo(
    () => trabalhos.filter((item) => item.distanciaKm <= raio),
    [raio]
  )

  return (
    <>
      <CabecalhoPagina
        titulo="Explorar perto de mim"
        descricao="Encontre profissionais disponíveis e oportunidades dentro do seu raio."
        acoes={
          <BotaoLink href="/app/mapa" variante="secundaria" iconeEsquerda={<Icone nome="mapa2" />}>
            Ver mapa
          </BotaoLink>
        }
      />

      <div className="superficie rounded-ds-surface border border-hairline p-4">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wide text-muted">
              Buscar
            </label>
            <div className="mt-1.5 flex min-h-11 items-center gap-2 rounded-full border border-hairline bg-canvas px-4 text-sm text-muted">
              <Icone nome="carreiras" className="size-4" />
              Profissão, serviço ou categoria
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wide text-muted">
              Raio
            </label>
            <div className="mt-1.5 flex gap-1.5">
              {[3, 5, 10, 20, 50].map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => setRaio(km)}
                  className={
                    raio === km
                      ? "preenchimento-acao rounded-full px-3 py-2 text-xs font-medium text-primary-ink"
                      : "rounded-full border border-hairline px-3 py-2 text-xs text-muted hover:bg-elevated"
                  }
                >
                  {km} km
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {([
          ["todos", "Todos"],
          ["profissionais", "Profissionais"],
          ["trabalhos", "Trabalhos"],
        ] as const).map(([id, rotulo]) => (
          <button
            key={id}
            type="button"
            onClick={() => setVisao(id)}
            className={
              visao === id
                ? "preenchimento-acao rounded-full px-4 py-2 text-sm font-medium text-primary-ink"
                : "superficie rounded-full border border-hairline px-4 py-2 text-sm text-muted"
            }
          >
            {rotulo}
          </button>
        ))}
      </div>

      {(visao === "todos" || visao === "profissionais") && (
        <section className="mt-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Oferta</p>
              <h2 className="font-display text-xl text-ink">Profissionais próximos</h2>
            </div>
            <span className="text-sm text-muted">{profissionaisVisiveis.length} encontrados</span>
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            {profissionaisVisiveis.map((p) => (
              <Card key={p.id}>
                <CardConteudo className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid size-10 place-items-center rounded-full bg-primary/12 text-primary-accent">
                      <Icone nome="perfil" className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-base text-ink">{p.nome}</h3>
                      <p className="text-sm font-medium text-ink">{p.profissao}</p>
                      <p className="mt-1 text-xs text-muted">{p.distanciaKm.toFixed(1)} km · ★ {p.avaliacao.toFixed(1)}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted">
                    {p.disponivelAgora ? "🟢 Disponível agora" : "Disponibilidade programada"} · R$ {p.valor}
                  </p>
                  <BotaoLink className="mt-4" href={`/app/profissionais/${p.id}`} variante="secundaria" larguraTotal>
                    Ver perfil
                  </BotaoLink>
                </CardConteudo>
              </Card>
            ))}
          </div>
        </section>
      )}

      {(visao === "todos" || visao === "trabalhos") && (
        <section className="mt-7">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Demanda</p>
              <h2 className="font-display text-xl text-ink">Trabalhos próximos</h2>
            </div>
            <span className="text-sm text-muted">{trabalhosVisiveis.length} encontrados</span>
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            {trabalhosVisiveis.map((t) => (
              <Card key={t.id}>
                <CardConteudo className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-base text-ink">{t.titulo}</h3>
                      <p className="text-sm font-medium text-ink">{t.categoria}</p>
                    </div>
                    {t.urgente && <span className="text-xs font-medium text-danger">Urgente</span>}
                  </div>
                  <p className="mt-3 text-xs text-muted">{t.bairro} · {t.distanciaKm.toFixed(1)} km · {t.quando}</p>
                  <p className="mt-2 font-display text-lg text-ink">R$ {t.orcamentoMin}–{t.orcamentoMax}</p>
                  <BotaoLink className="mt-4" href={`/app/trabalhos/${t.id}`} larguraTotal>
                    Ver oportunidade
                  </BotaoLink>
                </CardConteudo>
              </Card>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
