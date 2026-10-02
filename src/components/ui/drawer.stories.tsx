import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useEffect, useState } from "react"
import { fn } from "storybook/test"
import { estadosDeNo, sistema } from "@/content/site"
import { Badge } from "./badge"
import { Button } from "./button"
import { Drawer, type DrawerProps, type LarguraDrawer } from "./drawer"
import { EstadoVazio } from "./estado-vazio"
import { Input } from "./input"
import { Select } from "./select"

/** Mesmo motivo do modal: aberto por padrão cobriria a documentação inteira. */
function DrawerComGatilho({ aberto, aoFechar, ...props }: DrawerProps) {
  const [visivel, setVisivel] = useState(aberto)

  useEffect(() => setVisivel(aberto), [aberto])

  return (
    <>
      <Button variante="secundaria" onClick={() => setVisivel(true)}>
        {props.titulo}
      </Button>

      <Drawer
        {...props}
        aberto={visivel}
        aoFechar={() => {
          setVisivel(false)
          aoFechar()
        }}
      />
    </>
  )
}

const LARGURAS: LarguraDrawer[] = ["sm", "md", "lg"]

const formulario = sistema.praticar.envio
const detalhe = sistema.perfil.evidencias

const meta = {
  title: "Primitivos/Drawer",
  component: Drawer,
  parameters: { layout: "centered" },
  argTypes: {
    largura: { control: "inline-radio", options: LARGURAS },
    mostrarFechar: { control: "boolean" },
    fecharNoOverlay: { control: "boolean" },
    titulo: { control: "text" },
    descricao: { control: "text" },
    aberto: { control: "boolean" },
    rodape: { control: false },
    children: { control: false },
    refFocoInicial: { control: false },
  },
  args: {
    aberto: false,
    aoFechar: fn(),
    titulo: "Case: abandono do onboarding",
    descricao: "Pesquisa com usuários · UX/UI Designer",
    largura: "md",
    mostrarFechar: true,
    fecharNoOverlay: true,
  },
  render: (args) => <DrawerComGatilho {...args} />,
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

/** O painel lateral existe para editar sem perder a lista de vista. */
export const Padrao: Story = {
  args: {
    children: (
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <h3 className="font-display text-sm text-ink">{detalhe.titulo}</h3>
          <dl className="grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">{formulario.campoLink}</dt>
              <dd className="text-ink">https://exemplo.com/case-onboarding</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">{formulario.campoTexto}</dt>
              <dd className="text-ink">Investiguei o abandono com 5 entrevistas…</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">{formulario.campoLink}</dt>
              <dd>
                <Badge variante="sucesso" ponto>
                  {estadosDeNo.concluido.rotulo}
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">{detalhe.titulo}</dt>
              <dd className="text-ink">19/08/2026</dd>
            </div>
          </dl>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="font-display text-sm text-ink">{detalhe.titulo}</h3>
          <div className="rounded-ds border border-hairline bg-elevated">
            <EstadoVazio tamanho="sm" titulo={detalhe.nenhuma} />
          </div>
        </section>
      </div>
    ),
    rodape: (
      <>
        <Button variante="perigo">{sistema.ranking.sair}</Button>
        <Button>{formulario.salvarRascunho}</Button>
      </>
    ),
  },
}

export const ComFormulario: Story = {
  args: {
    titulo: formulario.titulo,
    descricao: formulario.exemploTexto,
    children: (
      <div className="flex flex-col gap-4">
        <Input rotulo={formulario.campoTexto} placeholder={formulario.exemploTexto} obrigatorio />
        <Input rotulo={formulario.campoLink} placeholder={formulario.exemploLink} />
        <Input
          rotulo={formulario.campoLink}
          placeholder={formulario.exemploLink}
          type="email"
          obrigatorio
        />
        <Input
          rotulo={formulario.campoTexto}
          placeholder={formulario.exemploTexto}
          ajuda={formulario.exemploLink}
        />
        <Select
          rotulo={formulario.campoLink}
          opcoes={[
            { valor: "ativo", rotulo: estadosDeNo.concluido.rotulo },
            { valor: "pendente", rotulo: estadosDeNo["nao-iniciado"].rotulo },
            { valor: "inativo", rotulo: estadosDeNo["aguardando-validacao"].rotulo },
          ]}
          defaultValue="ativo"
        />
      </div>
    ),
    rodape: (
      <>
        <Button variante="secundaria">{sistema.acoes.cancelar}</Button>
        <Button>{formulario.enviarFinal}</Button>
      </>
    ),
  },
}

export const Larguras: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {LARGURAS.map((largura) => (
        <DrawerComGatilho
          key={largura}
          {...args}
          largura={largura}
          titulo={largura}
          descricao={sistema.carreiras.descricao}
        >
          <p className="text-sm leading-relaxed text-muted">{sistema.carreiras.descricao}</p>
        </DrawerComGatilho>
      ))}
    </div>
  ),
}

export const SemRodape: Story = {
  args: {
    titulo: detalhe.titulo,
    descricao: undefined,
    children: (
      <p className="text-sm leading-relaxed text-muted">{sistema.carreiras.descricao}</p>
    ),
  },
}
