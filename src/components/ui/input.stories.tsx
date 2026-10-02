import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { FileText, Tag } from "lucide-react"
import { sistema } from "@/content/site"
import { Input } from "./input"

const campos = sistema.perfil.publico

const meta = {
  title: "Primitivos/Input",
  component: Input,
  parameters: { layout: "padded" },
  argTypes: {
    rotulo: { control: "text" },
    ajuda: { control: "text" },
    erro: { control: "text" },
    obrigatorio: { control: "boolean" },
    ocultarRotulo: { control: "boolean" },
    disabled: { control: "boolean" },
    iconeEsquerda: { control: false },
    iconeDireita: { control: false },
  },
  args: {
    rotulo: campos.nomePublico,
    placeholder: campos.exemploNome,
    obrigatorio: false,
    ocultarRotulo: false,
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const Obrigatorio: Story = {
  args: { obrigatorio: true },
}

/** A ajuda some quando aparece um erro. Duas mensagens ao mesmo tempo viram ruído. */
export const ComAjuda: Story = {
  args: {
    rotulo: campos.disponibilidade,
    placeholder: campos.exemploDisponibilidade,
    ajuda: campos.ajudaDisponibilidade,
    iconeEsquerda: <FileText />,
  },
}

export const ComErro: Story = {
  args: {
    rotulo: sistema.praticar.envio.campoLink,
    placeholder: sistema.praticar.envio.exemploLink,
    erro: sistema.praticar.envio.textoObrigatorio,
    defaultValue: "Ana",
    iconeEsquerda: <Tag />,
  },
}

export const ComIcone: Story = {
  args: {
    rotulo: sistema.praticar.envio.campoLink,
    placeholder: sistema.praticar.envio.exemploLink,
    iconeEsquerda: <Tag />,
  },
}

export const Desabilitado: Story = {
  args: {
    disabled: true,
    defaultValue: "Ana P.",
  },
}

/** Os três estados juntos: é assim que se compara altura, cor e espaçamento. */
export const Estados: Story = {
  render: (args) => (
    <div className="flex flex-col gap-5">
      <Input {...args} rotulo={campos.nomePublico} placeholder={campos.exemploNome} />
      <Input
        {...args}
        rotulo={campos.disponibilidade}
        placeholder={campos.exemploDisponibilidade}
        ajuda={campos.ajudaDisponibilidade}
      />
      <Input
        {...args}
        rotulo={sistema.praticar.envio.campoLink}
        defaultValue="Ana"
        erro={sistema.praticar.envio.textoObrigatorio}
      />
      <Input
        {...args}
        rotulo={campos.disponibilidade}
        defaultValue="Ana P."
        disabled
      />
    </div>
  ),
}
