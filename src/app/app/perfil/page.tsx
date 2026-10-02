"use client"

import { useState } from "react"
import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { Icone } from "@/components/app/icone"
import { BotaoLink } from "@/components/marketing/botao-link"
import { Badge, Button, Card, CardConteudo, EstadoVazio, Input } from "@/components/ui"
import { sistema } from "@/content/site"
import { acharProfissao } from "@/lib/catalogo"
import { useDados } from "@/lib/store"

const textos = sistema.perfil

/**
 * O perfil: o objetivo profissional, a visibilidade pública e as evidências.
 *
 * Tudo que aparece pra fora é opt-in (RNK-05): a pessoa escolhe o nome
 * público, o que exibir e a disponibilidade, e pode sair sem perder nada.
 */
export default function PaginaPerfil() {
  const { dados, jornada, atualizarJornada, atualizarEvidencia } = useDados()
  const profissao = acharProfissao(jornada?.profissaoId)

  const [nomePublico, setNomePublico] = useState(jornada?.publico.nomePublico ?? "")
  const [disponibilidade, setDisponibilidade] = useState(jornada?.publico.disponibilidade ?? "")
  const [aviso, setAviso] = useState("")

  return (
    <>
      <CabecalhoPagina titulo={textos.titulo} descricao={textos.descricao} />

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-5">
          {/* O objetivo profissional, com a troca a um clique (CAR-05). */}
          <Card>
            <CardConteudo className="flex flex-col gap-3 p-5">
              <h2 className="flex items-center gap-2 font-display text-sm text-ink">
                <Icone nome="carreiras" className="size-4 text-primary-accent" />
                {textos.objetivo.titulo}
              </h2>

              {profissao ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-medium text-ink">{profissao.nome}</p>
                    {jornada?.resultado && (
                      <Badge variante="destaque">
                        Nível {jornada.resultado.nivel} de 5
                      </Badge>
                    )}
                  </div>
                  <p className="text-[13px] text-muted">{textos.objetivo.nivelAlvo}</p>
                  <BotaoLink href="/app/carreiras" variante="secundaria" tamanho="sm" className="self-start">
                    {textos.objetivo.trocar}
                  </BotaoLink>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted">{textos.objetivo.semObjetivo}</p>
                  <BotaoLink href="/app/carreiras" tamanho="sm" className="self-start">
                    {sistema.vazios.inicioNovo.acao}
                  </BotaoLink>
                </>
              )}
            </CardConteudo>
          </Card>

          {/* A visibilidade pública, campo a campo, tudo opt-in (RNK-05). */}
          <Card>
            <CardConteudo className="flex flex-col gap-4 p-5">
              <div>
                <h2 className="flex items-center gap-2 font-display text-sm text-ink">
                  <Icone nome="seguranca" className="size-4 text-primary-accent" />
                  {textos.publico.titulo}
                </h2>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{textos.publico.texto}</p>
              </div>

              <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-ink">
                <input
                  type="checkbox"
                  checked={jornada?.publico.participaRanking ?? false}
                  onChange={(evento) =>
                    jornada &&
                    atualizarJornada({
                      publico: { ...jornada.publico, participaRanking: evento.target.checked },
                    })
                  }
                  className="mt-0.5 size-4 shrink-0 accent-[var(--ds-primary)]"
                />
                {textos.publico.participar}
              </label>

              <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-ink">
                <input
                  type="checkbox"
                  checked={jornada?.publico.mostrarEvidencias ?? false}
                  onChange={(evento) =>
                    jornada &&
                    atualizarJornada({
                      publico: { ...jornada.publico, mostrarEvidencias: evento.target.checked },
                    })
                  }
                  className="mt-0.5 size-4 shrink-0 accent-[var(--ds-primary)]"
                />
                {textos.publico.mostrarEvidencias}
              </label>

              <Input
                rotulo={textos.publico.nomePublico}
                placeholder={textos.publico.exemploNome}
                ajuda={textos.publico.ajudaNome}
                value={nomePublico}
                onChange={(evento) => setNomePublico(evento.target.value)}
              />

              <Input
                rotulo={textos.publico.disponibilidade}
                placeholder={textos.publico.exemploDisponibilidade}
                ajuda={textos.publico.ajudaDisponibilidade}
                value={disponibilidade}
                onChange={(evento) => setDisponibilidade(evento.target.value)}
              />

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => {
                    if (!jornada) return
                    atualizarJornada({
                      publico: {
                        ...jornada.publico,
                        nomePublico: nomePublico.trim(),
                        disponibilidade: disponibilidade.trim(),
                      },
                    })
                    setAviso(textos.publico.salvo)
                  }}
                >
                  {textos.publico.salvar}
                </Button>
                <p role="status" aria-live="polite" className="text-[13px] text-muted">
                  {aviso}
                </p>
              </div>
            </CardConteudo>
          </Card>
        </div>

        {/* As evidências e cases, com a visibilidade de cada um à mão. */}
        <Card>
          <CardConteudo className="flex flex-col gap-3 p-5">
            <div>
              <h2 className="flex items-center gap-2 font-display text-sm text-ink">
                <Icone nome="evidencia" className="size-4 text-primary-accent" />
                {textos.evidencias.titulo}
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{textos.evidencias.texto}</p>
            </div>

            {dados.evidencias.length === 0 ? (
              <EstadoVazio
                tamanho="sm"
                icone={<Icone nome="evidencia" />}
                titulo={textos.evidencias.nenhuma}
                acao={
                  <BotaoLink href="/app/praticar" variante="secundaria" tamanho="sm">
                    {textos.evidencias.irPraticar}
                  </BotaoLink>
                }
              />
            ) : (
              <ul className="flex flex-col gap-2.5">
                {dados.evidencias.map((evidencia) => (
                  <li
                    key={evidencia.id}
                    className="superficie-elevada rounded-ds-fine border border-hairline p-3.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="min-w-0 text-sm font-medium text-ink">{evidencia.habilidade}</p>
                      <Badge
                        variante={evidencia.estado === "case" ? "sucesso" : evidencia.estado === "rascunho" ? "neutra" : "destaque"}
                        ponto
                      >
                        {sistema.praticar.estados[evidencia.estado]}
                      </Badge>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted">
                      {evidencia.texto}
                    </p>
                    {evidencia.estado === "case" && (
                      <label className="mt-2.5 flex cursor-pointer items-center gap-2 border-t border-hairline pt-2.5 text-[12.5px] text-ink">
                        <input
                          type="checkbox"
                          checked={evidencia.consentimentoCase}
                          onChange={(evento) =>
                            atualizarEvidencia(evidencia.id, {
                              consentimentoCase: evento.target.checked,
                              estado: evento.target.checked ? "case" : "avaliada",
                            })
                          }
                          className="size-4 shrink-0 accent-[var(--ds-primary)]"
                        />
                        {sistema.praticar.feedback.consentimento}
                      </label>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardConteudo>
        </Card>
      </div>
    </>
  )
}
