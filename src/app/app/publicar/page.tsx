"use client"

import { useState } from "react"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { Icone } from "@/components/app/icone"
import { Button, Card, CardConteudo, Input, Select, Textarea } from "@/components/ui"

type Tipo = "disponibilidade" | "trabalho" | null

const categorias = [
  { valor: "", rotulo: "Escolha uma categoria" },
  { valor: "construcao", rotulo: "Construção" },
  { valor: "casa", rotulo: "Casa e limpeza" },
  { valor: "manutencao", rotulo: "Manutenção" },
  { valor: "transporte", rotulo: "Transporte" },
  { valor: "cuidados", rotulo: "Cuidados" },
  { valor: "eventos", rotulo: "Eventos" },
]

export default function PaginaPublicar() {
  const [tipo, setTipo] = useState<Tipo>(null)

  return (
    <>
      <CabecalhoPagina
        titulo="Publicar"
        descricao="Informe se você está oferecendo trabalho ou procurando alguém."
      />

      {!tipo ? (
        <div className="grid gap-4 md:grid-cols-2">
          <button type="button" onClick={() => setTipo("disponibilidade")} className="text-left">
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardConteudo className="flex h-full flex-col gap-4 p-6">
                <span className="grid size-12 place-items-center rounded-full bg-success/12 text-success">
                  <Icone nome="disponivel" className="size-6" />
                </span>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Profissional</p>
                  <h2 className="mt-1 font-display text-xl text-ink">Estou disponível</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Publique sua profissão, valor, localização aproximada e quando pode trabalhar.
                  </p>
                </div>
              </CardConteudo>
            </Card>
          </button>

          <button type="button" onClick={() => setTipo("trabalho")} className="text-left">
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardConteudo className="flex h-full flex-col gap-4 p-6">
                <span className="grid size-12 place-items-center rounded-full bg-primary/12 text-primary-accent">
                  <Icone nome="aperto" className="size-6" />
                </span>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Contratante</p>
                  <h2 className="mt-1 font-display text-xl text-ink">Preciso contratar</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Publique o serviço, orçamento, quando precisa e encontre profissionais próximos.
                  </p>
                </div>
              </CardConteudo>
            </Card>
          </button>
        </div>
      ) : (
        <Card>
          <CardConteudo className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                  {tipo === "disponibilidade" ? "Nova disponibilidade" : "Nova necessidade"}
                </p>
                <h2 className="mt-1 font-display text-xl text-ink">
                  {tipo === "disponibilidade" ? "Conte quando você pode trabalhar" : "Descreva quem você precisa contratar"}
                </h2>
              </div>
              <Button variante="fantasma" tamanho="sm" onClick={() => setTipo(null)}>
                Trocar
              </Button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Select rotulo="Categoria" opcoes={categorias} />
              <Input rotulo={tipo === "disponibilidade" ? "Profissão ou serviço" : "Serviço necessário"} placeholder="Ex.: Pedreiro" />
              <Input rotulo="Quando" placeholder={tipo === "disponibilidade" ? "Hoje até 18h" : "Amanhã às 8h"} />
              <Input rotulo={tipo === "disponibilidade" ? "Quanto cobra" : "Quanto pretende pagar"} placeholder="R$ 250" />
              <Input rotulo="Localização aproximada" placeholder="Setor Bueno, Goiânia" />
              <Input rotulo={tipo === "disponibilidade" ? "Raio de atendimento" : "Duração estimada"} placeholder={tipo === "disponibilidade" ? "15 km" : "1 diária"} />
            </div>

            <div className="mt-4">
              <Textarea
                rotulo="Descrição"
                placeholder={
                  tipo === "disponibilidade"
                    ? "Conte sua experiência, serviços que realiza e condições."
                    : "Explique o serviço, medidas, contexto e o que precisa ser feito."
                }
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Button iconeEsquerda={<Icone nome="enviar" />}>
                {tipo === "disponibilidade" ? "Publicar disponibilidade" : "Publicar trabalho"}
              </Button>
            </div>
          </CardConteudo>
        </Card>
      )}
    </>
  )
}
