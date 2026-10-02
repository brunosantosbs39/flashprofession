"use client"

import { useId, useState } from "react"
import { Icone } from "@/components/app/icone"
import { Button, Select } from "@/components/ui"
import { sistema } from "@/content/site"
import { cn } from "@/lib/cn"

const textos = sistema.aprender

/**
 * O quadro de vídeo da demonstração.
 *
 * Não existe arquivo de vídeo no projeto: o quadro é desenhado com os tokens e
 * NÃO finge reprodução. Tocar alterna um estado visual parado (sem laço, sem
 * relógio), e o que conta como atividade é o botão de concluir, que é uma
 * decisão da pessoa, não um timer.
 *
 * O que o requisito APR-02 pede está aqui: título, duração, objetivo, resultado
 * esperado, velocidade e transcrição. A transcrição é texto de verdade na
 * página, que é a forma mais acessível que um vídeo pode ter.
 */
export function PainelVideo({
  titulo,
  duracaoMin,
  transcricao,
  concluido,
  aoConcluir,
}: {
  titulo: string
  duracaoMin: number
  transcricao: string
  concluido: boolean
  aoConcluir: () => void
}) {
  const [tocando, setTocando] = useState(false)
  const [transcricaoAberta, setTranscricaoAberta] = useState(false)
  const idTranscricao = useId()

  return (
    <div className="overflow-hidden rounded-ds-surface border border-hairline bg-ink">
      <div
        className="relative grid aspect-video place-items-center"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, color-mix(in srgb, var(--ds-primary) 45%, transparent), transparent 70%)",
        }}
      >
        {/* Formas decorativas do cartaz, fora da árvore de acessibilidade. */}
        <div aria-hidden="true" className={cn("absolute inset-0 transition-opacity duration-300", tocando && "opacity-30")}>
          <span className="absolute -top-10 left-[12%] size-40 rounded-full bg-canvas/10" />
          <span className="absolute right-[8%] -bottom-16 size-52 rounded-full bg-canvas/10" />
        </div>

        <div aria-hidden="true" className={cn("absolute top-4 left-4 max-w-[70%] transition-opacity duration-300", tocando && "opacity-40")}>
          <p className="font-display text-base font-semibold text-canvas">{titulo}</p>
          <p className="mt-0.5 text-[12px] text-canvas/80">
            {duracaoMin} {textos.videoDuracao}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setTocando((atual) => !atual)}
          aria-pressed={tocando}
          aria-label={`${tocando ? "Pausar" : "Tocar"}: ${titulo}`}
          className="relative grid size-16 place-items-center rounded-full bg-canvas/95 text-primary-accent transition-transform hover:scale-105 active:scale-95"
        >
          <Icone nome={tocando ? "aguardando" : "comecar"} className="size-6" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-canvas/15 px-4 py-2.5">
        <span aria-hidden="true" className="h-1 min-w-[120px] flex-1 overflow-hidden rounded-full bg-canvas/20">
          <span
            className="block h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: tocando || concluido ? (concluido ? "100%" : "35%") : "0%" }}
          />
        </span>
        <span className="text-[12px] tabular-nums text-canvas/80" aria-hidden="true">
          {duracaoMin}:00
        </span>

        <Select
          rotulo={textos.velocidade}
          ocultarRotulo
          placeholder={null}
          defaultValue="1x"
          opcoes={[
            { valor: "0.75x", rotulo: "0,75x" },
            { valor: "1x", rotulo: "1x" },
            { valor: "1.5x", rotulo: "1,5x" },
            { valor: "2x", rotulo: "2x" },
          ]}
          classeCampo="w-24 [&_select]:h-8 [&_select]:text-[12px]"
        />

        <Button
          variante="fantasma"
          tamanho="sm"
          aria-expanded={transcricaoAberta}
          aria-controls={idTranscricao}
          onClick={() => setTranscricaoAberta((atual) => !atual)}
          className="text-canvas/80 hover:bg-canvas/10 hover:text-canvas"
        >
          {textos.transcricao}
        </Button>

        <Button
          variante={concluido ? "fantasma" : "secundaria"}
          tamanho="sm"
          onClick={aoConcluir}
          disabled={concluido}
          iconeEsquerda={<Icone nome={concluido ? "acertei" : "check"} />}
          className={cn(!concluido && "ml-auto", concluido && "ml-auto text-success")}
        >
          {concluido ? textos.visto : textos.marcarVisto}
        </Button>
      </div>

      <div id={idTranscricao} hidden={!transcricaoAberta} className="border-t border-canvas/15 bg-canvas px-4 py-3">
        <p className="text-[11px] font-medium tracking-wide text-muted uppercase">{textos.transcricao}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{transcricao}</p>
      </div>
    </div>
  )
}
