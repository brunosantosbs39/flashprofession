/**
 * A copy da home v2, a versão gritante.
 *
 * A v2 fala mais alto e mais curto que o site atual: manchete em caixa alta,
 * frases de uma linha, rótulos micro. Por isso ela tem o próprio arquivo em
 * vez de reusar `landing`: encurtar a copy do site atual pra caber aqui
 * mudaria as duas páginas de uma vez.
 *
 * A regra continua a mesma: NENHUM texto visível mora em componente.
 */

export const v2 = {
  nav: {
    navegacao: "Navegação da página",
    links: [
      { rotulo: "Como funciona", href: "#como-funciona" },
      { rotulo: "O caminho", href: "#caminho" },
    ],
    entrar: "Entrar",
  },

  hero: {
    /** As três linhas da manchete, empilhadas e desalinhadas de propósito. */
    linha1: "#CHEGA DE",
    linha2: "DÚVIDA",
    linha3: "NA CARREIRA",
    subtitulo:
      "O FlashProfession diz em que nível você está de verdade, desenha o caminho de cinco níveis e recomenda a próxima ação. Diagnóstico, mapa, prova. Sem achismo.",
    ctaPrimario: "Descobrir meu nível",
    ctaSecundario: "Ver como funciona",
    micro: "Sem cartão · O nivelamento leva 15 minutos · Sair e voltar não perde nada",
    selo: "COMECE DE GRAÇA • COMECE DE GRAÇA • ",
    /** O cartão de vidro da esquerda: o mapa em miniatura. */
    cartaoMapa: {
      selo: "seu mapa",
      meta: "nível 2 de 5",
      titulo: "UX/UI Designer",
      linhas: [
        { texto: "Iniciante", feito: true },
        { texto: "Fundamentos", feito: true },
        { texto: "Pesquisa com usuários", feito: false },
        { texto: "Execução e entrega", feito: false },
      ],
    },
    /** O cartão da direita: a próxima ação. */
    cartaoAcao: {
      selo: "agora",
      meta: "1 ação por vez",
      titulo: "Sua próxima ação",
      linhas: [
        { texto: "Concluir a validação", feito: false },
        { texto: "Assistir aula 3", feito: true },
        { texto: "Enviar evidência", feito: true },
        { texto: "Praticar no desafio", feito: false },
      ],
    },
  },

  cartoes: {
    titulo: "O que o FlashProfession faz",
    itens: [
      {
        titulo: "DIZ SEU NÍVEL",
        rotulo: "Diagnóstico em 2 partes. O teste confere.",
        miniatura: "nivel" as const,
        miniNivel: { chip: "NÍVEL 2", legenda: "confiança média", percentual: 40 },
      },
      {
        titulo: "MOSTRA O CAMINHO",
        rotulo: "5 níveis à vista. Nada escondido.",
        miniatura: "caminho" as const,
        miniCaminho: ["Iniciante", "Fundamentos", "Execução"],
      },
      {
        titulo: "COBRA PROVA",
        rotulo: "Assistir aula não sobe nível. Validar sobe.",
        miniatura: "prova" as const,
        miniProva: { pergunta: "validação", resposta: "aprovada", selo: "CASE" },
      },
    ],
  },

  numeros: {
    titulo: "Do jeito que se mede",
    itens: [
      { valor: "5", rotulo: "níveis por profissão" },
      { valor: "9", rotulo: "competências mapeadas" },
      { valor: "15", rotulo: "minutos de nivelamento" },
      { valor: "1", rotulo: "próxima ação por vez" },
    ],
  },

  comoFunciona: {
    titulo: "TRÊS PASSOS",
    subtitulo: "O primeiro leva menos de quinze minutos.",
    passos: [
      {
        numero: "01",
        titulo: "ESCOLHA DE OLHOS ABERTOS",
        texto: "Rotina real, entregas e esforço de cada profissão antes de decidir.",
      },
      {
        numero: "02",
        titulo: "DESCUBRA DE ONDE PARTE",
        texto: "Você declara o que sabe, o teste confere, o mapa se monta no seu nível.",
      },
      {
        numero: "03",
        titulo: "SUBA COM PROVA",
        texto: "Aula, prática e validação. O que você produz vira case no seu perfil.",
      },
    ],
  },

  caminho: {
    titulo: "O CAMINHO INTEIRO, SEM MISTÉRIO",
    subtitulo: "Os cinco níveis reais de UX/UI Designer, lidos do catálogo do produto.",
  },

  chamadaFinal: {
    titulo: "PRONTO PRA SABER ONDE VOCÊ ESTÁ?",
    texto: "Quinze minutos. Um nível de verdade. Uma próxima ação.",
    cta: "Começar agora",
  },

  rodape: {
    aviso: "Projeto de demonstração. O conteúdo das profissões é ilustrativo.",
    comoUsar: "Como usar",
  },
} as const
