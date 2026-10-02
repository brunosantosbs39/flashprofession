import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { estadosDeNo, sistema } from "@/content/site"
import { PROFISSOES } from "@/lib/catalogo"
import { Select, type OpcaoSelect } from "./select"

const situacoes: OpcaoSelect[] = [
  { valor: "ativo", rotulo: estadosDeNo.concluido.rotulo },
  { valor: "pendente", rotulo: estadosDeNo["nao-iniciado"].rotulo },
  { valor: "inativo", rotulo: estadosDeNo["aguardando-validacao"].rotulo },
]

/** Os conteúdos de exemplo do próprio app: opção de verdade, não texto inventado. */
const profissoes: OpcaoSelect[] = PROFISSOES.slice(0, 4).map((profissao) => ({
  valor: profissao.id,
  rotulo: profissao.nome,
}))

const meta = {
  title: "Primitivos/Select",
  component: Select,
  parameters: { layout: "padded" },
  argTypes: {
    rotulo: { control: "text" },
    ajuda: { control: "text" },
    erro: { control: "text" },
    placeholder: { control: "text" },
    obrigatorio: { control: "boolean" },
    disabled: { control: "boolean" },
    opcoes: { control: false },
  },
  args: {
    rotulo: sistema.carreiras.filtroTrabalho,
    opcoes: situacoes,
    defaultValue: "",
    obrigatorio: false,
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

/** Começa no placeholder: nada escolhido é diferente de "Ativo" por acidente. */
export const Padrao: Story = {}

export const ComValor: Story = {
  args: { defaultValue: "ativo" },
}

export const ComErro: Story = {
  args: {
    rotulo: sistema.carreiras.filtroTrabalho,
    erro: sistema.praticar.envio.textoObrigatorio,
    obrigatorio: true,
  },
}

export const ComAjuda: Story = {
  args: {
    rotulo: sistema.perfil.publico.disponibilidade,
    opcoes: profissoes,
    defaultValue: "media",
    ajuda: sistema.perfil.publico.ajudaDisponibilidade,
  },
}

/** Sem placeholder quando toda escolha é válida e uma já vem marcada. */
export const SemPlaceholder: Story = {
  args: {
    rotulo: sistema.carreiras.filtroTrabalho,
    opcoes: situacoes,
    placeholder: null,
    defaultValue: "pendente",
  },
}

export const Desabilitado: Story = {
  args: { disabled: true, defaultValue: "inativo" },
}
