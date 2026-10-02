"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { Icone } from "@/components/app/icone"
import {
  Badge,
  Button,
  CampoBusca,
  Card,
  CardTitulo,
  EstadoVazio,
  Select,
  type OpcaoSelect,
} from "@/components/ui"
import { palavras, sistema } from "@/content/site"
import { AREAS, PROFISSOES } from "@/lib/catalogo"
import { chaveDeBusca, contar } from "@/lib/formato"
import { useDados } from "@/lib/store"

const textos = sistema.carreiras

/**
 * Escolha progressiva de carreira (CAR-01): primeiro a área, depois as
 * profissões filtradas por ela. As áreas ficam sempre visíveis como filtros
 * de um toque, então buscar e navegar por área convivem sem se esconder
 * (CAR-02).
 */
export default function PaginaCarreiras() {
  const { jornada } = useDados()

  const [areaId, setAreaId] = useState<string | null>(null)
  const [busca, setBusca] = useState("")
  const [tipo, setTipo] = useState("todos")

  const tiposDeTrabalho: OpcaoSelect[] = useMemo(() => {
    const tipos = [...new Set(PROFISSOES.map((profissao) => profissao.tipoTrabalho))]
    return [
      { valor: "todos", rotulo: textos.filtroTodos },
      ...tipos.map((valor) => ({ valor, rotulo: valor })),
    ]
  }, [])

  const termo = chaveDeBusca(busca.trim())

  const visiveis = useMemo(
    () =>
      PROFISSOES.filter((profissao) => areaId === null || profissao.areaId === areaId)
        .filter((profissao) => tipo === "todos" || profissao.tipoTrabalho === tipo)
        .filter((profissao) => termo === "" || chaveDeBusca(profissao.nome).includes(termo)),
    [areaId, tipo, termo]
  )

  const filtrando = areaId !== null || termo !== "" || tipo !== "todos"

  function limpar() {
    setAreaId(null)
    setBusca("")
    setTipo("todos")
  }

  return (
    <>
      <CabecalhoPagina titulo={textos.titulo} descricao={textos.descricao} />

      {/* Passo 1: a área. Botões de alternância, sempre visíveis. */}
      <fieldset className="mb-5 border-0 p-0">
        <legend className="mb-2 text-[13px] font-medium text-ink">{textos.areasRotulo}</legend>
        <div className="flex flex-wrap gap-2">
          <BotaoDeArea
            ativo={areaId === null}
            aoEscolher={() => setAreaId(null)}
            icone="lista"
            nome={textos.todasAsAreas}
          />
          {AREAS.map((area) => (
            <BotaoDeArea
              key={area.id}
              ativo={areaId === area.id}
              aoEscolher={() => setAreaId(areaId === area.id ? null : area.id)}
              icone={area.icone}
              nome={area.nome}
            />
          ))}
        </div>
      </fieldset>

      {/* Busca e filtro convivem com a navegação por área, sem escondê-la. */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <CampoBusca
          valor={busca}
          aoMudar={setBusca}
          rotulo={textos.buscar}
          placeholder={textos.buscar}
          classeCampo="sm:min-w-0 sm:max-w-sm sm:flex-1"
        />
        <Select
          rotulo={textos.filtroTrabalho}
          ocultarRotulo
          opcoes={tiposDeTrabalho}
          placeholder={null}
          value={tipo}
          onChange={(evento) => setTipo(evento.target.value)}
          classeCampo="sm:w-56"
        />
        {/* Anunciado a cada mudança: quem usa leitor de tela recebe a contagem. */}
        <p aria-live="polite" className="text-sm text-muted sm:ml-auto">
          {contar(visiveis.length, palavras.profissao.singular, palavras.profissao.plural)}
        </p>
      </div>

      {visiveis.length === 0 ? (
        <div className="superficie rounded-ds-surface border border-hairline">
          <EstadoVazio
            icone={<Icone nome="carreiras" />}
            titulo={textos.semResultado.titulo}
            texto={textos.semResultado.texto}
            acao={
              <Button variante="secundaria" onClick={limpar}>
                {textos.semResultado.acao}
              </Button>
            }
          />
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" data-tour="profissoes">
          {visiveis.map((profissao) => {
            const area = AREAS.find((a) => a.id === profissao.areaId)
            const ehObjetivo = jornada?.profissaoId === profissao.id

            return (
              <li key={profissao.id}>
                <Card
                  interativo
                  className="relative flex h-full flex-col gap-3 p-5 has-[:focus-visible]:border-primary/40"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 text-[12px] text-muted">
                      <Icone nome={area?.icone ?? "pasta"} className="size-3.5 text-primary-accent" />
                      {area?.nome}
                    </span>
                    {ehObjetivo && (
                      <Badge variante="destaque" ponto>
                        {textos.objetivoAtual}
                      </Badge>
                    )}
                  </div>

                  <CardTitulo como="h2" className="text-[15px] leading-snug">
                    <Link
                      href={`/app/carreiras/${profissao.id}`}
                      className="after:absolute after:inset-0"
                    >
                      {profissao.nome}
                    </Link>
                  </CardTitulo>

                  <p className="line-clamp-3 text-[13px] leading-relaxed text-muted">
                    {profissao.resumo}
                  </p>

                  <p className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-hairline pt-3 text-[12px] text-muted">
                    <span>{profissao.tipoTrabalho}</span>
                    <span aria-hidden="true">·</span>
                    <span>{profissao.esforco}</span>
                  </p>
                </Card>
              </li>
            )
          })}
        </ul>
      )}

      {filtrando && visiveis.length > 0 && (
        <p className="mt-5 text-[13px] text-muted">
          <button
            type="button"
            onClick={limpar}
            className="rounded-ds font-medium text-primary-accent underline underline-offset-2 hover:text-ink"
          >
            {textos.semResultado.acao}
          </button>
        </p>
      )}
    </>
  )
}

function BotaoDeArea({
  ativo,
  aoEscolher,
  icone,
  nome,
}: {
  ativo: boolean
  aoEscolher: () => void
  icone: string
  nome: string
}) {
  return (
    <button
      type="button"
      onClick={aoEscolher}
      aria-pressed={ativo}
      className={
        ativo
          ? "preenchimento-acao inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium text-primary-ink pointer-coarse:min-h-11"
          : "superficie inline-flex items-center gap-2 rounded-full border border-hairline px-3.5 py-2 text-[13px] text-ink transition-colors hover:border-primary/40 hover:bg-elevated pointer-coarse:min-h-11"
      }
    >
      <Icone nome={icone} className="size-4" />
      {nome}
    </button>
  )
}
