"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useState, type FormEvent } from "react"
import { Icone } from "@/components/app/icone"
import { Logo } from "@/components/app/logo"
import { IconeGoogle } from "@/components/auth/icone-google"
import { ModalGoogle } from "@/components/auth/modal-google"
import { Button, Input } from "@/components/ui"
import { entrada, landing, marca } from "@/content/site"
import { entrar } from "@/lib/store"

export type FormularioDeEntradaProps = {
  /**
   * O login com Google está ligado NESTE ambiente: as duas chaves do Google e o
   * AUTH_SECRET estão no `.env.local`. Quem descobre isso é o servidor, em
   * `page.tsx`, porque as chaves não podem ser lidas daqui.
   */
  googleLigado: boolean
  /** Motivo de um login que não deu certo, vindo de `?google=` no endereço. */
  aviso?: string
}

export function FormularioDeEntrada({ googleLigado, aviso }: FormularioDeEntradaProps) {
  const router = useRouter()
  const [usuario, setUsuario] = useState("")
  /*
    A SENHA MORA SÓ AQUI, e é de propósito.

    Ela não é validada contra nada, não vai pro `entrar()`, não vai pro
    localStorage e não sai do navegador: some junto com este componente quando
    a tela troca. Guardar senha em texto puro no armazenamento do navegador
    seria ensinar o contrário do certo dentro de um projeto que existe pra
    ensinar, e não protegeria nada, já que qualquer pessoa lê o localStorage
    pelo inspetor. A autenticação de verdade deste app é o botão do Google
    logo acima, que já está escrito e só espera as chaves.
  */
  const [senha, setSenha] = useState("")
  const [erroUsuario, setErroUsuario] = useState("")
  const [erroSenha, setErroSenha] = useState("")
  const [modalAberto, setModalAberto] = useState(false)
  const [entrando, setEntrando] = useState(false)
  const [indoParaOGoogle, setIndoParaOGoogle] = useState(false)

  const seguirParaOApp = useCallback(
    (nome?: string) => {
      setEntrando(true)
      // Campo em branco vira `undefined` para cair no padrão de `entrar()`.
      // String vazia deixaria o topo do app sem nome nenhum.
      const limpo = (nome ?? usuario).trim()
      entrar(limpo || undefined, limpo.includes("@") ? limpo : undefined)
      // `replace` porque voltar depois de entrar cairia de novo nesta tela.
      router.replace("/app")
    },
    [usuario, router]
  )

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    const semUsuario = usuario.trim().length === 0
    const semSenha = senha.length === 0

    setErroUsuario(semUsuario ? entrada.campos.usuario.erro : "")
    setErroSenha(semSenha ? entrada.campos.senha.erro : "")

    if (semUsuario || semSenha) return

    seguirParaOApp()
  }

  return (
    <>
      <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="flex min-w-0 flex-col px-5 py-6 sm:px-8 lg:px-12 xl:px-20">
          <header className="flex items-center justify-between gap-4">
            <Logo />

            <Link
              href="/"
              className="-mx-2 inline-flex items-center gap-1.5 rounded-ds px-2 py-2 text-[13px] text-muted transition-colors duration-150 hover:text-ink pointer-coarse:min-h-11"
            >
              <Icone nome="seta-esquerda" className="size-4" />
              {entrada.voltar}
            </Link>
          </header>

          <main className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-12 sm:py-16">
            {/* O formulário vira um painel apoiado na página: `.superficie-elevada`
                dá o gradiente e o fio de 1px por dentro, `.fio-luz` acende a aresta
                de cima. O `overflow-hidden` é o que segura esse fio dentro do raio. */}
            <div className="superficie-elevada fio-luz overflow-hidden rounded-ds-surface border border-hairline p-6 sm:p-8">
              <h1 className="font-display text-2xl text-ink sm:text-[28px] sm:leading-tight">
                {entrada.titulo}
              </h1>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {googleLigado ? entrada.subtituloLigado : entrada.subtitulo}
              </p>

              <div className="mt-8">
                {/* Com as chaves no ambiente, o botão manda pro Google de
                    verdade, e é uma navegação de página inteira de propósito: o
                    OAuth sai do app e volta. Sem as chaves, ele abre o modal
                    que ensina a configurar, porque fingir um login que não
                    existe seria pior que não ter o botão. */}
                <Button
                  // Com o Google ligado ele é a única ação da tela, e a única
                  // ação é a primária. Sem o Google, quem manda é o "Entrar".
                  variante={googleLigado ? "primaria" : "secundaria"}
                  tamanho="lg"
                  larguraTotal
                  iconeEsquerda={<IconeGoogle />}
                  carregando={indoParaOGoogle}
                  onClick={() => {
                    if (!googleLigado) {
                      setModalAberto(true)
                      return
                    }
                    setIndoParaOGoogle(true)
                    window.location.href = "/api/auth/google"
                  }}
                >
                  {entrada.google.botao}
                </Button>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                  {googleLigado ? entrada.google.ajudaLigado : entrada.google.ajuda}
                </p>

                {aviso && (
                  <p
                    role="alert"
                    className="mt-3 rounded-ds border border-hairline bg-elevated px-3 py-2.5 text-[12.5px] leading-relaxed text-ink"
                  >
                    {aviso}
                  </p>
                )}
              </div>

              {/* Com o Google ligado, a conta Google É a entrada: a entrada
                  rápida some, porque ela guardaria a jornada num navegador
                  enquanto o banco espera por uma pessoa de verdade. */}
              {googleLigado ? (
                <p className="mt-6 text-[12.5px] leading-relaxed text-muted">
                  {entrada.avisoLigado}
                </p>
              ) : (
                <>
                  <div className="my-7 flex items-center gap-3" aria-hidden="true">
                    <span className="h-px flex-1 bg-hairline" />
                    <span className="text-[11px] tracking-[0.16em] text-muted uppercase">
                      {entrada.separador}
                    </span>
                    <span className="h-px flex-1 bg-hairline" />
                  </div>

                  {/* `noValidate`: a validação é nossa, em português e por campo. */}
                  <form onSubmit={aoEnviar} noValidate className="flex flex-col gap-4">
                    <Input
                      rotulo={entrada.campos.usuario.rotulo}
                      placeholder={entrada.campos.usuario.placeholder}
                      ajuda={entrada.campos.usuario.ajuda}
                      erro={erroUsuario || undefined}
                      value={usuario}
                      onChange={(evento) => {
                        setUsuario(evento.target.value)
                        // O erro sai assim que a pessoa mexe: manter reclamação na
                        // tela enquanto ela corrige é ruído, não ajuda.
                        if (erroUsuario) setErroUsuario("")
                      }}
                      autoComplete="username"
                    />

                    <Input
                      rotulo={entrada.campos.senha.rotulo}
                      placeholder={entrada.campos.senha.placeholder}
                      ajuda={entrada.campos.senha.ajuda}
                      erro={erroSenha || undefined}
                      value={senha}
                      onChange={(evento) => {
                        setSenha(evento.target.value)
                        if (erroSenha) setErroSenha("")
                      }}
                      type="password"
                      autoComplete="current-password"
                    />

                    <Button
                      type="submit"
                      tamanho="lg"
                      larguraTotal
                      carregando={entrando}
                      className="mt-2"
                      iconeDireita={<Icone nome="seta-direita" />}
                    >
                      {entrada.entrarDireto}
                    </Button>
                  </form>

                  <p className="mt-5 text-[12.5px] leading-relaxed text-muted">{entrada.aviso}</p>
                </>
              )}
            </div>
          </main>
        </div>

        <PainelDaMarca />
      </div>

      <ModalGoogle
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        aoEntrarDireto={() => {
          setModalAberto(false)
          seguirParaOApp(usuario)
        }}
      />
    </>
  )
}

/**
 * Vitrine da marca, só no desktop. No celular ela viraria uma rolagem antes do
 * formulário. Quem abriu `/entrar` veio entrar, não ler o site.
 *
 * O conteúdo é reaproveitado do site de propósito: personalizar o app é
 * reescrever um arquivo, e esta coluna acompanha sem virar cópia divergente.
 */
function PainelDaMarca() {
  return (
    // `.aura-secao` é a aura radial da camada de acabamento: fica ATRÁS do
    // conteúdo e vale nos 71 temas. Opacidade baixa de propósito, porque o texto
    // por cima é `muted` em parte deles e um véu mais forte comeria o contraste.
    <aside className="aura-secao hidden overflow-hidden border-l border-hairline bg-surface lg:block">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 size-[420px] rounded-full bg-primary/20 blur-[120px]"
      />

      <div className="relative flex h-full flex-col justify-center gap-12 px-12 py-16 xl:px-20">
        <div>
          {/* A cor da marca entra pelo ponto, não pelo texto: `text-primary` em
              13px fica abaixo de 4,5:1 nos temas de primária clara. */}
          <p className="flex items-center gap-2 text-[13px] font-medium tracking-wide text-ink">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
            {landing.hero.eyebrow}
          </p>
          <h2 className="mt-3 max-w-[16ch] font-display text-[32px] leading-[1.15] text-ink xl:text-[38px]">
            {marca.tagline}
          </h2>
          <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-muted">
            {marca.descricaoCurta}
          </p>
        </div>

        <ul className="flex max-w-[46ch] flex-col gap-6">
          {landing.beneficios.itens.map((item) => (
            <li key={item.titulo} className="flex gap-3.5">
              <span className="superficie-elevada mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-ds text-primary-accent">
                <Icone nome={item.icone} className="size-[18px]" />
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{item.titulo}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{item.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
