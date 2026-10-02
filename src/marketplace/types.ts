export type TipoPublicacao = "disponibilidade" | "trabalho"

export type FormaCobranca =
  | "hora"
  | "diaria"
  | "servico"
  | "metro"
  | "m2"
  | "projeto"
  | "combinar"

export type PerfilProfissional = {
  id: string
  nome: string
  profissao: string
  cidade: string
  bairro: string
  distanciaKm: number
  avaliacao: number
  trabalhosConcluidos: number
  disponivelAgora: boolean
  valor: number
  formaCobranca: FormaCobranca
  raioKm: number
}

export type Trabalho = {
  id: string
  titulo: string
  categoria: string
  cidade: string
  bairro: string
  distanciaKm: number
  quando: string
  urgente: boolean
  orcamentoMin: number
  orcamentoMax: number
  propostas: number
}

export type ItemFeed =
  | { tipo: "disponibilidade"; profissional: PerfilProfissional }
  | { tipo: "trabalho"; trabalho: Trabalho }
