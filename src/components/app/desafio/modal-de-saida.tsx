"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Icone } from "@/components/app/icone"
import { Button, Modal } from "@/components/ui"
import { saida } from "@/content/site"

/** Onde fica registrado que este convite já apareceu. Vale só nesta aba. */
const CHAVE_VISTO = "colo-o-conteudo-que-preciso:saida:v1"

/** O endereço da tela do desafio. Muda aqui se a rota for renomeada. */
const ROTA_DESAFIO = "/app/desafio"

function jaApareceu() {
  try {
    return !!window.sessionStorage.getItem(CHAVE_VISTO)
  } catch {
    // Modo privado: sem onde marcar, melhor não abrir do que abrir toda hora.
    return true
  }
}

function marcarComoVisto() {
  try {
    window.sessionStorage.setItem(CHAVE_VISTO, "1")
  } catch {
    // Sem onde gravar. O convite apareceu, e era o que importava.
  }
}

/**
 * O convite que aparece quando o ponteiro sai da janela pela borda de cima.
 *
 * Ele existe pra um momento só: a pessoa terminou de olhar o app e está indo
 * embora. Por isso ele abre UMA vez por sessão, em qualquer tela de dentro, e
 * depois de fechado não volta mais.
 *
 * NO CELULAR ELE NÃO EXISTE, e o listener nem chega a ser registrado: em tela
 * de toque não existe "sair pela borda de cima", e o que apareceria ali seria
 * um pop-up aleatório no meio da tarefa.
 *
 * A acessibilidade toda (foco preso, Esc fechando, foco devolvido a quem
 * estava) vem do `Modal`, que já resolve isso pro app inteiro.
 */
export function ModalDeSaida() {
  const router = useRouter()
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    // Ponteiro grosso é dedo. Nada disso faz sentido no dedo.
    const ponteiroFino = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    if (!ponteiroFino || jaApareceu()) return

    function aoSair(evento: MouseEvent) {
      // `relatedTarget` nulo quer dizer que o ponteiro deixou o documento, e não
      // que ele passou de um elemento pro outro. E só conta a borda de cima:
      // sair pelos lados é rolar a página ou trocar de janela.
      if (evento.relatedTarget || evento.clientY > 0) return
      marcarComoVisto()
      setAberto(true)
      document.removeEventListener("mouseout", aoSair)
    }

    document.addEventListener("mouseout", aoSair)
    return () => document.removeEventListener("mouseout", aoSair)
  }, [])

  return (
    <Modal
      aberto={aberto}
      aoFechar={() => setAberto(false)}
      titulo={saida.titulo}
      icone={<Icone nome="desafio" className="text-primary-accent" />}
      rodape={
        <>
          <Button variante="secundaria" onClick={() => setAberto(false)}>
            {saida.secundario}
          </Button>
          <Button
            onClick={() => {
              setAberto(false)
              router.push(ROTA_DESAFIO)
            }}
            iconeDireita={<Icone nome="seta-direita" />}
          >
            {saida.primario}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-muted">{saida.texto}</p>
    </Modal>
  )
}
