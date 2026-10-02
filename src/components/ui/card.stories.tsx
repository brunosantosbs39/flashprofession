import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { estadosDeNo, palavras, sistema } from "@/content/site"
import { Badge } from "./badge"
import { Button } from "./button"
import {
  Card,
  CardCabecalho,
  CardConteudo,
  CardDescricao,
  CardRodape,
  CardTitulo,
} from "./card"

const meta = {
  title: "Primitivos/Card",
  component: Card,
  parameters: { layout: "padded" },
  argTypes: {
    interativo: { control: "boolean" },
  },
  args: {
    interativo: false,
  },
  // A largura fica dentro de cada `render`, e não num decorator do meta:
  // decorator de meta envolve o da story, então o de fora sempre venceria e
  // a story em grade nunca conseguiria ser mais larga que as outras.
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  render: (args) => (
    <div className="w-full max-w-md">
      <Card {...args}>
        <CardCabecalho>
          <CardTitulo>{sistema.carreiras.titulo}</CardTitulo>
          <CardDescricao>{sistema.carreiras.descricao}</CardDescricao>
        </CardCabecalho>
        <CardConteudo>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">{sistema.perfil.publico.nomePublico}</dt>
              <dd className="text-ink">Ana P.</dd>
            </div>
            <div>
              <dt className="text-muted">{sistema.perfil.publico.disponibilidade}</dt>
              <dd className="text-ink">Disponível a partir de outubro</dd>
            </div>
            <div>
              <dt className="text-muted">{sistema.praticar.envio.campoLink}</dt>
              <dd className="text-ink">https://exemplo.com/case-onboarding</dd>
            </div>
            <div>
              <dt className="text-muted">{sistema.praticar.envio.campoTexto}</dt>
              <dd className="text-ink">Investiguei o abandono do onboarding com 5 entrevistas…</dd>
            </div>
          </dl>
        </CardConteudo>
      </Card>
    </div>
  ),
}

/** Cabeçalho, conteúdo e rodapé com divisor: o card completo. */
export const ComRodape: Story = {
  render: (args) => (
    <div className="w-full max-w-md">
      <Card {...args}>
        <CardCabecalho>
          <CardTitulo>{sistema.configuracoes.dados.titulo}</CardTitulo>
          <CardDescricao>{sistema.configuracoes.dados.descricao}</CardDescricao>
        </CardCabecalho>
        <CardConteudo>
          <p className="text-sm leading-relaxed text-muted">
            {sistema.configuracoes.dados.dicaVazios}
          </p>
        </CardConteudo>
        <CardRodape divisor>
          <Button variante="secundaria" tamanho="sm">
            {sistema.configuracoes.dados.restaurar}
          </Button>
          <Button variante="perigo" tamanho="sm">
            {sistema.configuracoes.dados.limpar}
          </Button>
        </CardRodape>
      </Card>
    </div>
  ),
}

/** Ligue `interativo` quando o card inteiro leva para algum lugar. */
export const Interativo: Story = {
  args: { interativo: true },
  render: (args) => (
    <div className="w-full max-w-md">
      <Card {...args}>
        <CardCabecalho>
          <div className="flex items-start justify-between gap-3">
            <CardTitulo>Pesquisa com usuários</CardTitulo>
            <Badge variante="sucesso" ponto>
              {estadosDeNo.concluido.rotulo}
            </Badge>
          </div>
          <CardDescricao>Competência do nível 2 · UX/UI Designer</CardDescricao>
        </CardCabecalho>
        <CardConteudo className="pt-3 text-sm text-muted">
          4 aulas · 3 tarefas · 1 {palavras.caseDePortfolio.singular}
        </CardConteudo>
      </Card>
    </div>
  ),
}

/** Dois cards lado a lado: o ritmo de espaçamento é o mesmo em qualquer largura. */
export const EmGrade: Story = {
  render: (args) => (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
      {[
        { titulo: sistema.carreiras.titulo, descricao: sistema.carreiras.descricao, novo: sistema.carreiras.abrir },
        { titulo: sistema.praticar.titulo, descricao: sistema.praticar.descricao, novo: sistema.praticar.abrir },
      ].map((secao) => (
        <Card key={secao.titulo} {...args}>
          <CardCabecalho>
            <CardTitulo>{secao.titulo}</CardTitulo>
            <CardDescricao>{secao.descricao}</CardDescricao>
          </CardCabecalho>
          <CardConteudo className="pt-3">
            <Button variante="secundaria" tamanho="sm">
              {secao.novo}
            </Button>
          </CardConteudo>
        </Card>
      ))}
    </div>
  ),
}
