import { CabecalhoPagina } from "@/components/app/cabecalho-pagina"
import { Icone } from "@/components/app/icone"
import { Card, CardConteudo, EstadoVazio } from "@/components/ui"

export default function PaginaMensagens() {
  return (
    <>
      <CabecalhoPagina
        titulo="Mensagens"
        descricao="Conversas com profissionais e contratantes interessados."
      />
      <Card>
        <CardConteudo className="p-0">
          <EstadoVazio
            icone={<Icone nome="pergunta" />}
            titulo="Nenhuma conversa ainda"
            texto="Quando houver interesse em uma publicação ou proposta, a conversa aparecerá aqui."
          />
        </CardConteudo>
      </Card>
    </>
  )
}
