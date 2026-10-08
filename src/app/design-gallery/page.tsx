"use client"

import { useMemo, useState } from "react"
import catalogoBruto from "@/lib/design-systems.json"

type Sistema = {
  id: string
  name: string
  vibe: string
  mode: "light" | "dark"
  tokens: {
    canvas: string | null
    surface: string | null
    ink: string | null
    primary: string | null
    accent: string | null
    hairline: string | null
  }
  type: {
    display: string
    body: string
    displayWeight: number
    tracking: number | string
  }
  radius: string
  source: string
}

type Catalogo = {
  generatedFrom: string
  total: number
  renderable: number
  systems: Sistema[]
}

const catalogo = catalogoBruto as Catalogo

type FiltroModo = "todos" | "light" | "dark"

function cssDoSistema(sistema: Sistema) {
  const { tokens, type, radius } = sistema
  return `:root {
  --canvas: ${tokens.canvas ?? "transparent"};
  --surface: ${tokens.surface ?? tokens.canvas ?? "transparent"};
  --ink: ${tokens.ink ?? "#111111"};
  --primary: ${tokens.primary ?? tokens.ink ?? "#111111"};
  --accent: ${tokens.accent ?? tokens.primary ?? "transparent"};
  --hairline: ${tokens.hairline ?? "rgba(127,127,127,.25)"};
  --font-display: ${type.display};
  --font-body: ${type.body};
  --display-weight: ${type.displayWeight};
  --tracking: ${type.tracking};
  --radius: ${radius};
}`
}

function textoJson(sistema: Sistema) {
  return JSON.stringify(sistema, null, 2)
}

function Preview({ sistema, compacto = false }: { sistema: Sistema; compacto?: boolean }) {
  const canvas = sistema.tokens.canvas ?? (sistema.mode === "dark" ? "#0b0b0b" : "#ffffff")
  const surface = sistema.tokens.surface ?? canvas
  const ink = sistema.tokens.ink ?? (sistema.mode === "dark" ? "#ffffff" : "#111111")
  const primary = sistema.tokens.primary ?? ink
  const hairline = sistema.tokens.hairline ?? (sistema.mode === "dark" ? "#303030" : "#e5e5e5")

  return (
    <div
      className={`relative overflow-hidden ${compacto ? "h-52" : "min-h-[430px]"}`}
      style={{ background: canvas, color: ink }}
    >
      <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b px-5 py-4" style={{ borderColor: hairline }}>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: primary }} />
          <span className="text-xs font-semibold tracking-wide">{sistema.name}</span>
        </div>
        <div className="flex gap-4 text-[10px] opacity-60">
          <span>Produto</span>
          <span>Recursos</span>
          <span>Entrar</span>
        </div>
      </div>

      <div className={`flex h-full flex-col justify-center ${compacto ? "px-5 pt-12" : "px-8 pt-20 md:px-12"}`}>
        <div className="max-w-[85%]">
          <span
            className="mb-3 inline-flex rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em]"
            style={{ borderColor: hairline, color: primary }}
          >
            Design system
          </span>
          <h3
            className={compacto ? "text-2xl leading-[1.04]" : "text-4xl leading-[1.02] md:text-5xl"}
            style={{
              fontFamily: sistema.type.display,
              fontWeight: sistema.type.displayWeight,
              letterSpacing: typeof sistema.type.tracking === "number" ? `${sistema.type.tracking}px` : sistema.type.tracking,
            }}
          >
            Interfaces que parecem feitas para esta marca.
          </h3>
          {!compacto && (
            <p className="mt-4 max-w-xl text-sm leading-6 opacity-65" style={{ fontFamily: sistema.type.body }}>
              Uma prévia reutilizável de hierarquia, cor, tipografia, superfície, bordas e ação principal.
            </p>
          )}
          <div className="mt-5 flex items-center gap-3">
            <span
              className="inline-flex items-center justify-center px-4 py-2 text-[11px] font-semibold"
              style={{ background: primary, color: canvas, borderRadius: sistema.radius }}
            >
              Começar agora
            </span>
            <span
              className="inline-flex items-center justify-center border px-4 py-2 text-[11px] font-medium"
              style={{ borderColor: hairline, borderRadius: sistema.radius }}
            >
              Ver detalhes
            </span>
          </div>
        </div>

        <div className={`grid grid-cols-3 gap-2 ${compacto ? "mt-5" : "mt-9"}`}>
          {["01", "02", "03"].map((n, i) => (
            <div
              key={n}
              className={compacto ? "h-14 border p-2" : "h-24 border p-3"}
              style={{ background: surface, borderColor: hairline, borderRadius: sistema.radius }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] opacity-50">{n}</span>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: i === 0 ? primary : sistema.tokens.accent ?? hairline }} />
              </div>
              {!compacto && <div className="mt-5 h-1.5 w-2/3 rounded-full opacity-20" style={{ background: ink }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DesignGalleryPage() {
  const [busca, setBusca] = useState("")
  const [modo, setModo] = useState<FiltroModo>("todos")
  const [selecionado, setSelecionado] = useState<Sistema | null>(null)
  const [copiado, setCopiado] = useState<string | null>(null)

  const sistemas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return catalogo.systems.filter((sistema) => {
      const bateModo = modo === "todos" || sistema.mode === modo
      const bateBusca = !termo || `${sistema.name} ${sistema.vibe} ${sistema.id}`.toLowerCase().includes(termo)
      return bateModo && bateBusca
    })
  }, [busca, modo])

  async function copiar(valor: string, chave: string) {
    await navigator.clipboard.writeText(valor)
    setCopiado(chave)
    window.setTimeout(() => setCopiado((atual) => (atual === chave ? null : atual)), 1600)
  }

  return (
    <main className="min-h-screen bg-[#0b0d10] text-white">
      <section className="border-b border-white/10 bg-[#0b0d10]">
        <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-8 md:py-14">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Biblioteca independente
              </div>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Design Systems Gallery</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 md:text-base">
                {catalogo.total} sistemas prontos para visualizar, comparar, copiar e reutilizar sem alterar o marketplace.
              </p>
            </div>

            <button
              onClick={() => copiar(JSON.stringify(catalogo, null, 2), "catalogo")}
              className="rounded-xl border border-white/15 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              {copiado === "catalogo" ? "Catálogo copiado" : "Copiar catálogo completo"}
            </button>
          </div>

          <div className="mt-9 grid gap-3 md:grid-cols-[1fr_auto]">
            <label className="flex items-center rounded-xl border border-white/10 bg-white/[0.04] px-4">
              <span className="mr-3 text-white/35">⌕</span>
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar Airbnb, Apple, Ferrari, Linear, Stripe..."
                className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
              />
            </label>
            <div className="flex rounded-xl border border-white/10 bg-white/[0.04] p-1">
              {(["todos", "light", "dark"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setModo(item)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${modo === item ? "bg-white text-black" : "text-white/55 hover:text-white"}`}
                >
                  {item === "todos" ? "Todos" : item === "light" ? "Claros" : "Escuros"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 md:py-10">
        <div className="mb-5 flex items-center justify-between text-xs text-white/40">
          <span>{sistemas.length} sistemas visíveis</span>
          <span>Fonte: {catalogo.generatedFrom}</span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sistemas.map((sistema) => (
            <article key={sistema.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
              <button onClick={() => setSelecionado(sistema)} className="block w-full text-left">
                <Preview sistema={sistema} compacto />
              </button>
              <div className="border-t border-white/10 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold">{sistema.name}</h2>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/45">{sistema.vibe}</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-white/40">{sistema.mode}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  {[sistema.tokens.canvas, sistema.tokens.surface, sistema.tokens.primary, sistema.tokens.accent, sistema.tokens.ink]
                    .filter(Boolean)
                    .map((cor, index) => (
                      <span key={`${cor}-${index}`} className="h-6 w-6 rounded-full border border-white/10" style={{ background: cor ?? undefined }} title={cor ?? ""} />
                    ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button onClick={() => setSelecionado(sistema)} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/[0.05]">
                    Pré-visualizar
                  </button>
                  <button onClick={() => copiar(textoJson(sistema), sistema.id)} className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black hover:bg-white/90">
                    {copiado === sistema.id ? "Copiado" : "Copiar JSON"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {sistemas.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 py-20 text-center text-sm text-white/40">Nenhum design encontrado.</div>
        )}
      </section>

      {selecionado && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-3 backdrop-blur-md md:p-8" onClick={() => setSelecionado(null)}>
          <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/15 bg-[#111318] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Pré-visualização reutilizável</p>
                <h2 className="mt-1 text-xl font-semibold">{selecionado.name}</h2>
              </div>
              <button onClick={() => setSelecionado(null)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 hover:bg-white/5">×</button>
            </div>

            <div className="grid lg:grid-cols-[1.55fr_.8fr]">
              <Preview sistema={selecionado} />
              <aside className="border-t border-white/10 p-5 lg:border-l lg:border-t-0">
                <p className="text-sm leading-6 text-white/55">{selecionado.vibe}</p>

                <div className="mt-6 space-y-4 text-xs">
                  <Info titulo="Modo" valor={selecionado.mode} />
                  <Info titulo="Raio" valor={selecionado.radius} />
                  <Info titulo="Display" valor={selecionado.type.display} />
                  <Info titulo="Body" valor={selecionado.type.body} />
                  <Info titulo="Peso display" valor={String(selecionado.type.displayWeight)} />
                  <Info titulo="Origem" valor={selecionado.source} />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2">
                  {Object.entries(selecionado.tokens).map(([nome, cor]) => (
                    <div key={nome} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <div className="mb-2 h-8 rounded-lg border border-white/10" style={{ background: cor ?? "transparent" }} />
                      <div className="text-[10px] uppercase tracking-wider text-white/35">{nome}</div>
                      <div className="mt-1 truncate text-[11px] text-white/70">{cor ?? "—"}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-2">
                  <button onClick={() => copiar(textoJson(selecionado), `modal-json-${selecionado.id}`)} className="rounded-xl bg-white px-4 py-3 text-xs font-semibold text-black">
                    {copiado === `modal-json-${selecionado.id}` ? "JSON copiado" : "Copiar preset JSON"}
                  </button>
                  <button onClick={() => copiar(cssDoSistema(selecionado), `modal-css-${selecionado.id}`)} className="rounded-xl border border-white/15 px-4 py-3 text-xs font-semibold text-white/75 hover:bg-white/5">
                    {copiado === `modal-css-${selecionado.id}` ? "CSS copiado" : "Copiar variáveis CSS"}
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function Info({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="grid grid-cols-[90px_1fr] gap-3 border-b border-white/10 pb-3">
      <span className="text-white/35">{titulo}</span>
      <span className="break-words text-white/75">{valor}</span>
    </div>
  )
}
