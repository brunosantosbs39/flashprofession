import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { sistema } from "@/content/site"
import { BarraProgresso } from "./barra-progresso"

const meta = {
  title: "Primitivos/BarraProgresso",
  component: BarraProgresso,
  parameters: { layout: "padded" },
  argTypes: {
    valor: { control: { type: "range", min: 0, max: 100 } },
    rotulo: { control: "text" },
    mostrarValor: { control: "boolean" },
    tamanho: { control: "inline-radio", options: ["sm", "md"] },
  },
  args: {
    valor: 58,
    rotulo: sistema.progresso.indicadores.proximoNivel,
    mostrarValor: true,
    tamanho: "md",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BarraProgresso>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const Completa: Story = {
  args: { valor: 100 },
}

/** `sm` para dentro de linha de lista, onde 6px de altura pesariam. */
export const Pequena: Story = {
  args: { tamanho: "sm", mostrarValor: false, valor: 35 },
}

/** O uso mais comum no produto: domínio por competência, uma barra por linha. */
export const EmLista: Story = {
  render: () => (
    <dl className="flex w-full max-w-sm flex-col gap-3">
      {[
        { nome: "Processo de UX", valor: 82 },
        { nome: "Pesquisa com usuários", valor: 45 },
        { nome: "Testes de usabilidade", valor: 15 },
      ].map((linha) => (
        <div key={linha.nome}>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-sm text-ink">{linha.nome}</dt>
            <dd className="m-0 text-[12px] font-medium tabular-nums text-muted">{linha.valor}%</dd>
          </div>
          <BarraProgresso valor={linha.valor} rotulo={linha.nome} tamanho="sm" className="mt-1.5" />
        </div>
      ))}
    </dl>
  ),
}
