import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { FileText, Layers, MessageCircleQuestionMark, Plus, SearchX } from "lucide-react"
import { sistema } from "@/content/site"
import { cn } from "@/lib/cn"
import { Button } from "./button"
import { EstadoVazio } from "./estado-vazio"

const meta = {
  title: "Primitivos/EstadoVazio",
  component: EstadoVazio,
  parameters: { layout: "padded" },
  argTypes: {
    titulo: { control: "text" },
    texto: { control: "text" },
    tamanho: { control: "inline-radio", options: ["sm", "md"] },
    icone: { control: false },
    acao: { control: false },
  },
  args: {
    titulo: sistema.vazios.inicioNovo.titulo,
    texto: sistema.vazios.inicioNovo.texto,
    tamanho: "md",
  },
  decorators: [
    // O vazio nunca aparece solto na página: ele mora dentro de uma superfície.
    // A largura acompanha o tamanho, porque `sm` existe justamente para caber
    // numa coluna estreita, dentro de um cartão.
    (Story, contexto) => (
      <div
        className={cn(
          "w-full rounded-ds border border-hairline bg-surface",
          contexto.args.tamanho === "sm" ? "max-w-[280px]" : "max-w-2xl"
        )}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EstadoVazio>

export default meta
type Story = StoryObj<typeof meta>

/** Vazio sem saída é beco: todo estado vazio de lista carrega a ação que o resolve. */
export const InicioNovo: Story = {
  args: {
    icone: <FileText />,
    acao: <Button iconeEsquerda={<Plus />}>{sistema.vazios.inicioNovo.acao}</Button>,
  },
}

/**
 * Os três vazios do onboarding, na ordem em que a jornada se monta. No app
 * eles saem pelo componente `EstadoDaJornada`, que escolhe sozinho qual dos
 * três mostrar; aqui cada um aparece isolado, pra revisar texto e ação.
 */
export const SemProfissao: Story = {
  args: {
    titulo: sistema.vazios.jornada.profissao.titulo,
    texto: sistema.vazios.jornada.profissao.texto,
    icone: <MessageCircleQuestionMark />,
    acao: <Button iconeEsquerda={<Plus />}>{sistema.vazios.jornada.profissao.acao}</Button>,
  },
}

export const SemNivel: Story = {
  args: {
    titulo: sistema.vazios.jornada.nivel.titulo,
    texto: sistema.vazios.jornada.nivel.texto.replace("{profissao}", "UX/UI Designer"),
    icone: <Layers />,
    acao: <Button iconeEsquerda={<Plus />}>{sistema.vazios.jornada.nivel.acao}</Button>,
  },
}

export const SemCurso: Story = {
  args: {
    titulo: sistema.vazios.jornada.curso.titulo,
    texto: sistema.vazios.jornada.curso.texto,
    icone: <Layers />,
    acao: <Button iconeEsquerda={<Plus />}>{sistema.vazios.jornada.curso.acao}</Button>,
  },
}

/**
 * Busca sem resultado é outro vazio: existe cadastro, o filtro é que esconde.
 * Por isso a saída aqui é limpar o filtro, e não cadastrar de novo.
 */
export const SemResultado: Story = {
  args: {
    titulo: sistema.carreiras.semResultado.titulo,
    texto: sistema.carreiras.semResultado.texto,
    icone: <SearchX />,
    acao: <Button variante="secundaria">{sistema.acoes.limpar}</Button>,
  },
}

/** `sm` para vazios apertados: dentro de um cartão ou de um painel lateral. */
export const Pequeno: Story = {
  args: {
    tamanho: "sm",
    titulo: sistema.perfil.evidencias.nenhuma,
    texto: undefined,
    icone: <MessageCircleQuestionMark />,
  },
}

export const SemAcao: Story = {
  args: {
    titulo: sistema.perfil.evidencias.nenhuma,
    texto: undefined,
    tamanho: "sm",
  },
}
