# Rumo

Da dúvida de carreira ao próximo passo certo.

A pessoa escolhe a profissão, descobre em que nível está num diagnóstico em
duas partes (autoavaliação + teste), enxerga o caminho completo em cinco
níveis, aprende com validação no fim, pratica em desafios que viram cases e
acompanha progresso e ranking com consentimento.

Esta versão implementa o documento de requisitos da plataforma de preparação
de carreira com dados de demonstração: toda a jornada é navegável sem backend,
e a profissão do teste ponta a ponta é UX/UI Designer.

---

## Rodar na sua máquina

Precisa do Node 20 ou mais novo.

```bash
npm install
npm run dev
```

Abra http://localhost:3000. O app já vem com uma jornada de demonstração no meio
do caminho (nível 2 em UX/UI Designer), e não precisa de banco, de conta em
serviço nenhum nem de variável de ambiente para funcionar. Em Configurações,
"Limpar tudo" mostra a experiência de quem acabou de chegar e "Restaurar
exemplos" volta ao estado de demonstração.

## O catálogo de componentes

```bash
npm run storybook
```

Abre em http://localhost:6006, com os tokens do design system aplicados e
auditoria de acessibilidade em cada componente.

## Publicar

```bash
npx vercel --prod --yes
```

---

## Como ligar depois

O app nasce sem login de verdade e sem banco, e isso é o que faz ele rodar em
dois comandos. Mas os dois já estão escritos e testados aqui dentro: ligar cada
um é preencher linha no `.env.local`, não programar.

### Login com Google

Crie um ID de cliente OAuth em https://console.cloud.google.com/apis/credentials
(a tela de entrar tem o passo a passo completo dentro do botão do Google) e cole
no `.env.local`:

```
GOOGLE_CLIENT_ID=o-seu-client-id
GOOGLE_CLIENT_SECRET=o-seu-client-secret
AUTH_SECRET=um-texto-aleatorio-de-32-caracteres-ou-mais
```

Reinicie o servidor. O botão passa a autenticar de verdade, sem nenhuma tela
mudar. O código está em `src/lib/google.ts`, `src/lib/sessao-servidor.ts` e nas
três rotas de `src/app/api/auth`.

### Banco de dados no Neon

Crie um projeto Postgres em https://neon.com (tem plano gratuito), copie a
connection string e cole no `.env.local`:

```
DATABASE_URL=postgresql://usuario:senha@servidor/banco?sslmode=require
```

Reinicie o servidor. O mesmo app passa a gravar no Postgres, e a tabela é criada
sozinha na primeira chamada. Nenhuma tela fica sabendo da diferença. O código
está em `src/lib/banco.ts`, na rota `src/app/api/dados` e nos dois lados de
`src/lib/store.ts`. Conexão errada não derruba a tela: o app volta pro navegador
sozinho.

### Ligar a inteligência artificial no nivelamento e no feedback

Hoje o teste adaptativo, a avaliação das respostas curtas e o feedback dos
desafios seguem regras de demonstração, e as telas dizem isso. Para ligar de
verdade, pegue uma chave em https://platform.openai.com/api-keys e cole no
`.env.local`:

```
OPENAI_API_KEY=sk-a-sua-chave
```

Depois peça ao seu assistente as rotas em `src/app/api` (por exemplo,
`avaliar-resposta` e `feedback-desafio`), lendo a chave de `process.env` no
servidor. A chave nunca é escrita no código do navegador.

O resto das conexões (envio de e-mail, WhatsApp, automações com n8n) está em
`PROXIMOS-PASSOS.md`, e a versão navegável dessa lista é a página `/como-usar`.

---

## As telas

| Endereço | O que resolve |
| --- | --- |
| `/` | O site que apresenta o produto, com o caminho de cinco níveis de verdade |
| `/entrar` | A porta do sistema, com Google, usuário e senha |
| `/como-usar` | O que já funciona, o que falta ligar e onde cada coisa encaixa |
| `/app` | Início com retomada: objetivo, progresso e a próxima ação (ONB) |
| `/app/carreiras` | Áreas e profissões, com busca e filtros (CAR) |
| `/app/carreiras/[id]` | A ficha completa da profissão antes de decidir |
| `/app/diagnostico` | O nivelamento: contexto, autoavaliação, teste e resultado (DIA) |
| `/app/mapa` | Os cinco níveis em React Flow, com alternativa em lista (MAP) |
| `/app/aprender` | Vídeos curtos, tarefas e validação com revisão (APR) |
| `/app/praticar` | Desafios com rubrica, evidências e cases (PRA) |
| `/app/progresso` | Indicadores, dedicação, domínio por competência e histórico (PRO) |
| `/app/ranking` | A comunidade com fórmula aberta e opt-in (RNK) |
| `/app/perfil` | Objetivo, visibilidade pública e evidências |
| `/app/desafio` | O guia de refinamento deste app |
| `/app/configuracoes` | Design system, dados de exemplo e perfil de acesso |
| `/exemplo` | Um exemplo à parte de tela de vaga, em HTML e CSS puros |

## A árvore de pastas

```
.claude/launch.json          configuração do servidor de desenvolvimento
.storybook/                  o catálogo de componentes, com os tokens injetados
banco/schema.sql             o desenho da tabela que o app cria sozinho no Neon
n8n/                         o n8n pronto pra subir, com dois exemplos no README
design-system.json           cor, tipografia e raio. Muda aqui, muda tudo
.env.example                 o modelo comentado das chaves, sem valor nenhum

src/app/
  page.tsx                   o site da raiz
  entrar/                    a porta do sistema
  como-usar/                 o mapa do que já funciona e do que falta ligar
  exemplo/                   o exemplo de tela de vaga em HTML puro
  app/                       tudo que fica atrás da sessão
    layout.tsx               a casca: menu, botão de sair e trava de sessão
    page.tsx                 o início com retomada
    carreiras/               áreas, profissões e a ficha de cada uma
    diagnostico/             o nivelamento em quatro etapas
    mapa/                    os cinco níveis em React Flow
    aprender/                módulos, aulas, tarefas e validação
    praticar/                desafios, evidências e cases
    progresso/               indicadores, dedicação e histórico
    ranking/                 a comunidade, com fórmula aberta
    perfil/                  objetivo e visibilidade pública
    desafio/                 o guia de refinamento
    configuracoes/           design system, dados de exemplo e perfil
  api/                       as rotas de servidor: sessão, dados e diagnóstico

src/components/
  ui/                        os primitivos, escritos à mão, com stories
  app/                       os componentes de cada tela do sistema
  marketing/                 as dobras do site, uma por arquivo
  auth/                      a tela de entrar e o passo a passo do Google
  como-usar/                 os blocos da página Como usar
  onboarding/                o tour que guia a jornada inteira

src/content/
  site.ts                    TODA a copy do produto, num arquivo só
  tour.ts                    as doze paradas do onboarding guiado

src/lib/
  types.ts                   o modelo de dados: catálogo e estado do usuário
  catalogo.ts                áreas, profissões, níveis, questões e desafios
  modelo.ts                  o vocabulário do modelo e a fórmula do score
  jornada.ts                 as contas derivadas: horas, estados, próxima ação
  store.ts                   a única porta de dados: navegador ou Postgres
  seed.ts                    a jornada de exemplo no meio do caminho
  banco.ts                   a conversa com o Postgres, desligada
  google.ts                  o fluxo OAuth inteiro, desligado
  sessao-servidor.ts         o cookie assinado da sessão
  design-system.ts           os tokens do JSON viram variáveis CSS
  design-systems.json        o catálogo de 71 identidades da tela de ajustes
  tema.ts                    a prévia de tema, derivando o que falta
  contraste.ts               o cálculo de contraste WCAG
  formato.ts                 data, hora e texto em pt-BR, sem erro de fuso
  semente.ts                 o hash do nome que decide o cenário do site
  cn.ts                      o merge de classe que conhece os três raios
```
