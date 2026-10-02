# Próximos passos

O app que você recebeu é completo de propósito: ele funciona sozinho, sem
servidor, sem banco e sem chave de API. Isso é o que permite rodar em dois
comandos.

Este arquivo é o mapa do que vem **depois**, quando você quiser que ele deixe
de ser uma maquete e vire um produto de verdade.

**Os dois primeiros já estão construídos.** O login com Google e o banco no Neon
não são exercício: o código está escrito, testado e desligado, esperando só as
chaves. Você preenche o `.env.local`, reinicia o servidor e a funcionalidade
liga. Do terceiro em diante volta a ser mapa: o que é, por que vale a pena e
onde está a documentação oficial.

---

## A ordem importa

Faça na ordem abaixo. Cada item depende do anterior estar de pé:

- [ ] 1. **Login com Google**: saber *quem* está usando · *já construído, falta a chave*
- [ ] 2. **Banco de dados (Neon)**: ter *onde* guardar · *já construído, falta a conexão*
- [ ] 3. **API da OpenAI**: teste adaptativo, respostas curtas e feedback de verdade
- [ ] 4. **E-mail (Resend)**: falar com quem usa
- [ ] 5. **WhatsApp**: falar onde a pessoa realmente lê
- [ ] 6. **n8n**: fazer tudo isso acontecer sozinho
- [ ] 7. **MCP do Figma**: encurtar a ponte entre desenho e código
- [ ] 8. **Deploy na Vercel**: colocar no ar

> A Vercel está no fim por dependência, não por prioridade. Se quiser só um link
> pra mostrar no portfólio, **pule direto para o item 8**. O app publica hoje,
> do jeito que está.

---

## 1. Login com Google

> **Já está construído.** Falta só a chave.

**O que fazer.** Abra o app, vá em `/entrar` e clique em "Continuar com Google".
O modal que abre é o passo a passo completo no Google Cloud Console, com cada
valor pronto para copiar. No fim ele te dá três linhas para colar no
`.env.local`. Cole, reinicie o servidor, e o mesmo botão passa a fazer login de
verdade: a pessoa escolhe a conta Google, volta autenticada e o nome dela
aparece no topo do app.

**Por que é o primeiro item.** Sem saber quem é a pessoa, não existe "a
jornada *dela*", só "a jornada". Login é o que separa uma demonstração de um produto
multiusuário.

E é aqui que você, como designer, encosta na parte mais subestimada da
experiência: o que acontece quando a pessoa cancela no meio, quando o link
expira, quando ela entra com a conta errada. Os três casos já têm mensagem
escrita neste app (procure `avisos` em `src/content/site.ts`); a pergunta que
sobra é se são as mensagens certas.

**Onde o código está.**

- `src/lib/google.ts`: a ida e a volta do OAuth, escritas na mão, sem biblioteca
- `src/lib/sessao-servidor.ts`: o cookie assinado que guarda quem entrou
- `src/app/api/auth/`: as três rotas (ir para o Google, voltar dele, e sair)

**Variáveis:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `AUTH_SECRET`
(veja o `.env.example`)

**Credencial do Google:** <https://console.cloud.google.com/apis/credentials>

---

## 2. Banco de dados (Neon)

> **Já está construído.** Falta só a conexão.

**O que é.** Sem `DATABASE_URL`, os dados vivem no `localStorage` do navegador:
trocou de computador, começou do zero; limpou os dados do site, sumiu tudo. Com
ela, o mesmo app passa a guardar num Postgres na nuvem, de forma permanente.

O Neon é um Postgres que roda na nuvem, tem plano gratuito generoso e liga na
Vercel em dois cliques.

**Por que vale a pena.** É o que faz o produto existir fora da sua máquina.
Também é o que permite duas pessoas usarem o mesmo sistema, que é o começo de
qualquer coisa colaborativa.

**O que fazer.** Crie um projeto em <https://console.neon.tech> (o plano
gratuito basta), copie a *connection string* do painel e cole no `.env.local`:

```
DATABASE_URL=postgresql://usuario:senha@servidor/banco?sslmode=require
```

Reinicie o servidor. Na primeira vez que o app fala com o banco ele cria a
tabela sozinho, e a partir daí é o Postgres que guarda tudo. Nenhuma tela muda,
nenhuma linha de código muda. Para conferir que ligou, cadastre alguma coisa e
abra o app em outro navegador: o que você cadastrou está lá.

Se o banco estiver fora do ar, o app **não quebra**: a pessoa logada vê a
jornada vazia e o erro fica no terminal. Ele NÃO volta pros dados de exemplo
nesse caso, de propósito: mostrar a jornada de demonstração no lugar da de
alguém seria mentir pra quem está logado.

**Onde o código está.**

- `src/lib/banco.ts`: a conversa com o Postgres
- `src/app/api/dados/route.ts`: a porta que o navegador usa
- `banco/schema.sql`: o desenho da tabela, e o desenho seguinte quando você
  quiser ir além de uma tabela só

**Login e banco são uma coisa só.** Com a `DATABASE_URL` preenchida, a rota
`/api/dados` só responde pra quem tem a sessão assinada do item 1: cada
registro nasce com dono (a tabela `usuarios`, criada na volta do Google), e
ninguém lê nem grava o que é de outra pessoa. Quem acabou de entrar recebe a
jornada vazia, e o app mostra os três estados de onboarding (sem profissão,
sem nível, sem curso) até a pessoa montar a dela.

**Pra olhar o banco.** Duas ferramentas, as duas lendo a `DATABASE_URL` do
`.env.local`:

- `npm run banco:studio` abre o Prisma Studio em <http://localhost:5555>: cada
  tabela, linha por linha, com filtro e edição.
- `npm run banco:desenhar` lê o Neon e reescreve `prisma/schema.prisma`, a
  documentação do que existe no banco agora. Rode depois de mudar uma tabela.
- A página `/banco` do próprio app é o mapa pra estudar: da tabela até o campo
  dentro do jsonb, com o requisito que cada dado serve e onde ele mora no
  código, mais a stack inteira no fim.

**Documentação:** <https://neon.com/docs/introduction>

**Variável:** `DATABASE_URL`

---

## 3. API da OpenAI

> **A peça que muda mais o produto.** Hoje o nivelamento usa regras simples e
> declaradas, as respostas curtas ficam sem avaliação e o feedback dos desafios
> é de demonstração. Com a chave, cada um desses vira IA de verdade.

**O que fazer.**

1. Pegue uma chave em https://platform.openai.com/api-keys. A conta pede cartão
   e cobra por uso; um app deste tamanho gasta centavos por mês.
2. Cole no `.env.local`:

   ```
   OPENAI_API_KEY=sk-a-sua-chave
   ```

3. Peça pro seu assistente, com estas palavras:

   > Crie a rota `src/app/api/avaliar-resposta/route.ts` que recebe uma
   > resposta curta do nivelamento e a habilidade medida, chama a API da OpenAI
   > no servidor lendo a chave de `process.env.OPENAI_API_KEY`, e devolve nota
   > e comentário em JSON. Depois, a rota `feedback-desafio` que avalia uma
   > evidência contra a rubrica do desafio. A chave nunca aparece no navegador
   > e nunca é escrita no código.

**Por que vale pra designer.** É a diferença entre um produto que USA
inteligência artificial e um produto que fala sobre ela. E é aqui que entra o
trabalho de verdade: o que mostrar enquanto a resposta não chega, como
apresentar uma nota gerada por IA sem parecer sentença, e onde o humano revisa.

**Documentação.** https://platform.openai.com/docs/api-reference/responses

**A regra da casa, e ela não é negociável.** A chave mora em variável de
ambiente, é documentada sem valor no `.env.example`, a chamada sai de uma rota
de servidor e nada disso é enviado ao repositório.

---

## 4. E-mail (Resend)

**O que é.** Mandar e-mail de verdade a partir do app: boas-vindas, confirmação
baseado em pendência real: a validação que ficou pra trás, o feedback que chegou.

O Resend é o serviço mais simples para isso hoje. A parte boa para designers: os
e-mails são escritos como componentes React, então dá para desenhar de verdade,
sem tabela HTML de 1998.

**Por que vale a pena.** E-mail é a única tela do seu produto que a pessoa vê
sem abrir o produto. Um bom e-mail transacional traz gente de volta; um ruim vira
spam mentalmente. É um exercício de UX writing e de hierarquia num espaço muito
apertado.

**Onde está.** <https://resend.com/docs/introduction>

**Variável:** `RESEND_API_KEY`

---

## 5. WhatsApp

**O que é.** No Brasil, é onde a comunicação acontece de fato. Confirmar
o feedback do desafio que chegou, a sequência prestes a quebrar. Tudo isso funciona muito
melhor no WhatsApp do que no e-mail.

A API oficial é a WhatsApp Cloud API, da Meta. O cadastro é burocrático (exige
verificação do negócio), então dá para começar pela sandbox da Twilio, que
funciona em minutos.

**Por que vale a pena.** É o canal com a maior taxa de leitura que existe e, por
isso mesmo, o mais fácil de estragar. Definir *o que* merece uma mensagem e
*quando* ela pode ser mandada é decisão de produto, não de engenharia. E é uma
ótima história pro seu portfólio.

**Onde está.**

- Oficial (Meta): <https://developers.facebook.com/docs/whatsapp/cloud-api>
- Caminho mais rápido para testar: <https://www.twilio.com/docs/whatsapp>

**Variável:** `WHATSAPP_TOKEN`

---

## 6. n8n (automações)

**O que é.** Um app onde você monta automações arrastando caixinhas: *quando
chegar o feedback de um desafio, me avise no WhatsApp*. Sem escrever código.

Já está preparado neste repositório: a pasta [`n8n/`](./n8n/) tem um
`docker-compose.yml` pronto e um README explicando tudo em linguagem simples.

**Por que vale a pena.** É o que junta os itens 3 e 4 numa coisa só. E é o item
com melhor relação entre esforço e resultado: em uma tarde você tem uma
automação real funcionando, que dá para gravar em vídeo e mostrar.

Também é um jeito confortável de pensar como sistema. Os fluxos do n8n se
parecem muito com os fluxos que você já desenha no Figma.

**Onde está.** <https://docs.n8n.io>, e o [`n8n/README.md`](./n8n/README.md)
deste projeto.

**Variável:** `N8N_WEBHOOK_URL`

---

## 7. MCP do Figma

**O que é.** MCP é um jeito de dar ferramentas para a IA. O MCP do Figma deixa
o Claude Code (ou o Cursor) **ler o seu arquivo do Figma** (frames, cores,
espaçamentos, nomes de camada) em vez de adivinhar a partir de um print.

Na prática: você seleciona um frame no Figma, pede "implemente esta tela" no
Claude Code, e ele monta o componente usando as medidas e os tokens do seu
próprio arquivo.

**Por que vale a pena.** Este é o item mais transformador da lista para quem é
designer. Ele inverte o jogo: em vez de você aprender a programar para ver seu
desenho de pé, o desenho vira código com você continuando no Figma.

Funciona muito bem com este projeto, porque o design system aqui já é um
conjunto de tokens, o mesmo vocabulário que o Figma exporta.

**Onde está.** <https://developers.figma.com/docs/figma-mcp-server/>

---

## 8. Deploy na Vercel

**O que é.** Colocar o app num endereço público, que qualquer pessoa abre.

**Por que vale a pena.** Um link vale mais que dez prints. Recrutador abre o
link no celular e usa o seu produto; ninguém abre um PDF de 40 páginas.

E, como já dito lá em cima: **isso funciona hoje.** Você não precisa de nenhum
dos seis itens anteriores para publicar. O app roda inteiro no navegador de quem
visita, cada pessoa com a própria cópia dos dados de exemplo.

**Onde está.** <https://vercel.com/docs/frameworks/nextjs>, e o passo a passo
resumido está no [`README.md`](./README.md#como-publicar-na-internet-vercel).

---

## Antes de qualquer um desses passos

Uma regra que vale para os sete itens:

**Chave de API é senha.** Ela vai no arquivo `.env.local`, que nunca sobe para o
GitHub. O [`.env.example`](./.env.example) existe justamente para você saber
quais chaves precisa, sem ninguém precisar te mandar as dela.

Se vazar uma chave, apague-a no painel do serviço e gere outra. Não existe
desvazar.
