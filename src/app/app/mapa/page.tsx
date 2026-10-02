"use client"

import { useState } from "react"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { Icone } from "@/components/app/icone"
import { BotaoLink } from "@/components/marketing/botao-link"
import { Card, CardConteudo } from "@/components/ui"
import { profissionais, trabalhos } from "@/marketplace/mock-data"

type Visao = "mapa" | "lista"

export default function PaginaMapaMarketplace() {
  const [visao, setVisao] = useState<Visao>("mapa")
  const [raio, setRaio] = useState(10)

  const profissionaisVisiveis = profissionais.filter((p) => p.distanciaKm <= raio)
  const trabalhosVisiveis = trabalhos.filter((t) => t.distanciaKm <= raio)

  return (
    <>
      <CabecalhoPagina
        titulo="Mapa de oportunidades"
        descricao="Veja profissionais disponíveis e trabalhos próximos sem expor a localização exata."
        acoes={
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setVisao("mapa")}
              className={visao === "mapa" ? "preenchimento-acao rounded-full px-3 py-2 text-sm text-primary-ink" : "rounded-full border border-hairline px-3 py-2 text-sm text-muted"}
            >
              Mapa
            </button>
            <button
              type="button"
              onClick={() => setVisao("lista")}
              className={visao === "lista" ? "preenchimento-acao rounded-full px-3 py-2 text-sm text-primary-ink" : "rounded-full border border-hairline px-3 py-2 text-sm text-muted"}
            >
              Lista
            </button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">Raio:</span>
        {[3, 5, 10, 20, 50].map((km) => (
          <button
            key={km}
            type="button"
            onClick={() => setRaio(km)}
            className={raio === km ? "preenchimento-acao rounded-full px-3 py-1.5 text-xs text-primary-ink" : "rounded-full border border-hairline px-3 py-1.5 text-xs text-muted"}
          >
            {km} km
          </button>
        ))}
      </div>

      {visao === "mapa" ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="relative min-h-[560px] overflow-hidden rounded-ds-surface border border-hairline bg-elevated">
            <div className="absolute inset-0 opacity-50" style={{
              backgroundImage:
                "linear-gradient(var(--ds-hairline) 1px, transparent 1px), linear-gradient(90deg, var(--ds-hairline) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }} />

            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <div className="grid size-12 place-items-center rounded-full border-4 border-canvas bg-primary text-primary-ink">
                <Icone nome="local" className="size-5" />
              </div>
              <p className="mt-1 rounded-full bg-canvas/90 px-2 py-1 text-center text-[11px] font-medium text-ink">
                Você
              </p>
            </div>

            {profissionaisVisiveis.map((p, i) => (
              <BotaoLink
                key={p.id}
                href={`/app/profissionais/${p.id}`}
                variante="secundaria"
                className="absolute z-10 !h-auto !rounded-ds !px-3 !py-2"
                style={{
                  left: `${18 + (i * 29) % 68}%`,
                  top: `${18 + (i * 23) % 58}%`,
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-success" />
                  <span>
                    <strong className="block text-xs">{p.profissao}</strong>
                    <span className="block text-[10px] text-muted">{p.distanciaKm.toFixed(1)} km</span>
                  </span>
                </span>
              </BotaoLink>
            ))}

            {trabalhosVisiveis.map((t, i) => (
              <BotaoLink
                key={t.id}
                href={`/app/trabalhos/${t.id}`}
                variante="secundaria"
                className="absolute z-10 !h-auto !rounded-ds !px-3 !py-2"
                style={{
                  right: `${12 + (i * 24) % 62}%`,
                  bottom: `${12 + (i * 21) % 55}%`,
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <span>
                    <strong className="block text-xs">{t.categoria}</strong>
                    <span className="block text-[10px] text-muted">{t.distanciaKm.toFixed(1)} km</span>
                  </span>
                </span>
              </BotaoLink>
            ))}
          </div>

          <Card>
            <CardConteudo className="p-5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Nesta área</p>
              <h2 className="mt-1 font-display text-lg text-ink">
                {profissionaisVisiveis.length} profissionais · {trabalhosVisiveis.length} trabalhos
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                As posições são aproximadas. O endereço exato só deve ser liberado após uma contratação confirmada.
              </p>
              <div className="mt-5 space-y-3">
                {profissionaisVisiveis.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 border-b border-hairline pb-3">
                    <div>
                      <p className="text-sm font-medium text-ink">{p.nome}</p>
                      <p className="text-xs text-muted">{p.profissao} · {p.distanciaKm.toFixed(1)} km</p>
                    </div>
                    <span className="text-xs text-muted">★ {p.avaliacao.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </CardConteudo>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {[...profissionaisVisiveis.map((p) => ({
            id: p.id,
            tipo: "Profissional",
            titulo: p.nome,
            subtitulo: `${p.profissao} · ${p.distanciaKm.toFixed(1)} km`,
            href: `/app/profissionais/${p.id}`,
          })), ...trabalhosVisiveis.map((t) => ({
            id: t.id,
            tipo: "Trabalho",
            titulo: t.titulo,
            subtitulo: `${t.categoria} · ${t.distanciaKm.toFixed(1)} km`,
            href: `/app/trabalhos/${t.id}`,
          }))].map((item) => (
            <Card key={item.id}>
              <CardConteudo className="p-4">
                <p className="text-[11px] uppercase tracking-wide text-muted">{item.tipo}</p>
                <h2 className="mt-1 font-display text-base text-ink">{item.titulo}</h2>
                <p className="mt-1 text-sm text-muted">{item.subtitulo}</p>
                <BotaoLink className="mt-4" href={item.href} variante="secundaria">
                  Ver detalhes
                </BotaoLink>
              </CardConteudo>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
