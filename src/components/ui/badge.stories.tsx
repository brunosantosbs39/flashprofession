import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { estadosDeNo, sistema } from "@/content/site"
import { Badge, type VarianteBadge } from "./badge"

const VARIANTES: VarianteBadge[] = ["neutra", "sucesso", "aviso", "perigo", "destaque"]

/** O que cada variante quer dizer no produto, com uma amostra real de cada. */
const NO_PRODUTO: { variante: VarianteBadge; rotulo: string }[] = [
  { variante: "sucesso", rotulo: estadosDeNo.concluido.rotulo },
  { variante: "aviso", rotulo: estadosDeNo["nao-iniciado"].rotulo },
  { variante: "neutra", rotulo: estadosDeNo["aguardando-validacao"].rotulo },
  { variante: "perigo", rotulo: estadosDeNo["aguardando-validacao"].rotulo },
  { variante: "destaque", rotulo: sistema.carreiras.objetivoAtual },
]

const meta = {
  title: "Primitivos/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  argTypes: {
    variante: { control: "inline-radio", options: VARIANTES },
    ponto: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: estadosDeNo.concluido.rotulo,
    variante: "neutra",
    ponto: false,
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const Variantes: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {VARIANTES.map((variante) => (
        <Badge key={variante} {...args} variante={variante}>
          {variante}
        </Badge>
      ))}
    </div>
  ),
}

/** A bolinha ajuda a varrer uma lista longa sem depender só da cor. */
export const ComPonto: Story = {
  parameters: { layout: "padded" },
  args: { ponto: true },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {VARIANTES.map((variante) => (
        <Badge key={variante} {...args} variante={variante}>
          {variante}
        </Badge>
      ))}
    </div>
  ),
}

export const NoProduto: Story = {
  parameters: { layout: "padded" },
  args: { ponto: true },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {NO_PRODUTO.map((item) => (
        <Badge key={item.rotulo} {...args} variante={item.variante}>
          {item.rotulo}
        </Badge>
      ))}
    </div>
  ),
}

/** Numa linha de tabela o badge encosta em texto. É aqui que o tamanho se prova. */
export const EmLista: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <ul className="w-full max-w-md divide-y divide-hairline rounded-ds border border-hairline bg-surface">
      {[
        { nome: "Processo de UX", variante: "sucesso" as const, status: estadosDeNo.concluido.rotulo },
        { nome: "Pesquisa com usuários", variante: "aviso" as const, status: estadosDeNo["aguardando-validacao"].rotulo },
        { nome: "Testes de usabilidade", variante: "neutra" as const, status: estadosDeNo["nao-iniciado"].rotulo },
      ].map((linha) => (
        <li key={linha.nome} className="flex items-center justify-between gap-3 px-4 py-3">
          <span className="text-sm text-ink">{linha.nome}</span>
          <Badge variante={linha.variante} ponto>
            {linha.status}
          </Badge>
        </li>
      ))}
    </ul>
  ),
}
