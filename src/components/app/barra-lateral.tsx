"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { sistema } from "@/content/site"
import { navMarketplace } from "@/marketplace/nav"
import { cn } from "@/lib/cn"
import { Icone } from "./icone"
import { Logo } from "./logo"

type PropsBarraLateral = {
  aberta: boolean
  aoFechar: () => void
}

function ehAtivo(atual: string, href: string) {
  if (href === "/app") return atual === "/app"
  return atual === href || atual.startsWith(`${href}/`)
}

export function BarraLateral({ aberta, aoFechar }: PropsBarraLateral) {
  const atual = usePathname()
  const refFechar = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    aoFechar()
  }, [atual, aoFechar])

  useEffect(() => {
    const consulta = window.matchMedia("(min-width: 1024px)")
    const aoMudar = () => {
      if (consulta.matches) aoFechar()
    }
    consulta.addEventListener("change", aoMudar)
    return () => consulta.removeEventListener("change", aoMudar)
  }, [aoFechar])

  useEffect(() => {
    if (!aberta) return

    const quadro = requestAnimationFrame(() => refFechar.current?.focus())
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") aoFechar()
    }
    document.addEventListener("keydown", aoTeclar)

    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      cancelAnimationFrame(quadro)
      document.removeEventListener("keydown", aoTeclar)
      document.body.style.overflow = overflowAnterior
    }
  }, [aberta, aoFechar])

  return (
    <>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={aoFechar}
        className={cn(
          "fixed inset-0 z-40 bg-canvas/70 backdrop-blur-[2px] transition-opacity duration-200 lg:hidden",
          aberta ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        id="barra-lateral"
        className={cn(
          "painel-lateral fixed inset-y-0 left-0 z-50 flex w-[248px] max-w-[86vw] flex-col border-r border-hairline",
          "transition-[transform,visibility] duration-200 ease-out",
          aberta ? "visible translate-x-0" : "invisible -translate-x-full",
          "lg:visible lg:translate-x-0"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-hairline px-4">
          <Link
            href="/app"
            className="-mx-1 flex min-w-0 items-center rounded-ds px-1 py-1 transition-opacity hover:opacity-80 pointer-coarse:min-h-11"
          >
            <Logo />
          </Link>

          <Button
            ref={refFechar}
            variante="fantasma"
            tamanho="sm"
            onClick={aoFechar}
            aria-label={sistema.casca.fecharMenu}
            iconeEsquerda={<Icone nome="fechar" />}
            className="shrink-0 lg:hidden"
          />
        </div>

        <nav
          aria-label={sistema.casca.navegacao}
          className="flex-1 overflow-y-auto px-3 py-4"
        >
          <ul className="flex flex-col gap-0.5">
            {navMarketplace.map((item) => {
              const ativo = ehAtivo(atual, item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={ativo ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-ds px-3 py-2 text-sm transition-colors pointer-coarse:min-h-11",
                      ativo
                        ? "superficie-elevada font-medium text-ink"
                        : "text-muted hover:bg-elevated hover:text-ink"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute top-1/2 -left-2 h-6 w-[2px] -translate-y-1/2 rounded-full bg-primary transition-opacity duration-150",
                        ativo ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <Icone
                      nome={item.icone}
                      className={cn(
                        "size-[18px] shrink-0 transition-colors",
                        ativo ? "text-primary-accent" : "text-muted group-hover:text-ink"
                      )}
                    />
                    <span className="truncate">{item.rotulo}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-hairline p-3">
          <div className="rounded-ds border border-hairline bg-elevated/50 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">FlashProfession 2.0</p>
            <p className="mt-1 text-xs leading-relaxed text-ink">
              Marketplace local de profissionais e oportunidades.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
