# Decisões

O que foi decidido ao construir o Rumo, e por quê. Uma linha por decisão, pra
quem abrir o projeto depois não precisar adivinhar. A régua desta versão é o
documento de requisitos da plataforma de preparação de carreira: os códigos
citados (ONB, CAR, DIA, MAP, APR, PRA, PRO, RNK, RB) vêm dele.

---

## O produto

**O nome.** Rumo. É o que o produto entrega: direção. A pessoa chega sem saber
onde está na carreira e sai com o caminho e o próximo passo.

**A profissão do teste ponta a ponta é UX/UI Designer.** O documento deixa essa
escolha em aberto (seção 21) e o storyboard aponta pra ela. UX tem catálogo
completo: cinco níveis próprios, nove competências, questões, três módulos de
aprendizado com variação de avaliação e dois desafios com rubrica. Front-end e
Social Media têm competências e questões próprias; as outras nove profissões
têm a ficha completa de exploração e caem no resultado provisório por
autodeclaração, com confiança BAIXA dita na tela, porque inventar precisão é
pior que admitir o limite (seção 17).

**O que o menu lista é a arquitetura de informação da seção 3 do documento**,
na ordem: Início, Carreiras, Mapa, Aprender, Praticar, Progresso, Ranking,
Perfil, e as duas peças do projeto (Configurações e Desafio de UX) no fim.

---

## O modelo de dados

**Catálogo e estado do usuário não se misturam.** O catálogo (profissões,
níveis, competências, questões, módulos, desafios) é conteúdo e mora em
constante. O que a pessoa produz (jornada, evidências, sessões) mora no store.
É o que faz a regra RB-07 valer de graça: mudar o currículo nunca apaga
histórico, porque o histórico não guarda currículo.

**A jornada é UM registro vivo**, não uma coleção de linhas: profissão, etapa,
respostas, resultado, conclusões, retomada e visibilidade. Trocar de profissão
(CAR-05) zera só a posição do diagnóstico; evidências e sessões ficam.

**Sessão de estudo só nasce de ação que comprova atividade** (concluir aula,
enviar validação, enviar evidência), nunca de relógio rodando com a aba aberta.
É a leitura honesta do PRO-02 numa versão sem servidor, e a tela de Progresso
diz isso com todas as letras.

**As contas derivadas moram em `src/lib/jornada.ts`**, num lugar só: horas,
sequência, estado de nó, percentual de nível, próxima ação e score. O PRO-03
pede que a pessoa entenda por que um número mudou, e dois lugares fazendo a
mesma conta é como dois números diferentes nascem.

---

## As telas, e a forma de cada uma

**Início (ONB-01/02/03).** A peça central é "continuar de onde parou" com UMA
próxima ação, decidida por `proximaAcao()`. Os indicadores em volta são `dl` e
cada um leva ao próprio detalhamento. A mesma tela vira o convite de escolha
pra quem acabou de chegar: estado muda, tela é uma. Considerei e descartei um
painel de módulos: é exatamente o anti-padrão que o requisito proíbe
("não deve ser apenas um catálogo").

**Carreiras (CAR-01/02).** Áreas como botões de alternância sempre visíveis,
profissões filtradas embaixo, busca e filtro de tipo de trabalho convivendo com
a navegação por área sem escondê-la. A ficha da profissão é página própria
porque o CAR-03 manda mostrar rotina, entregas, níveis e esforço ANTES de
confirmar, e isso não cabe num cartão.

**Diagnóstico (DIA-01..09).** Wizard de quatro etapas com o indicador sempre
visível. O teste mostra uma decisão por vez com o painel lateral explicando por
que a pergunta existe (DIA-04), permite pular e sair salvando (DIA-06), e nunca
revela a resposta certa durante o teste. O "adaptativo" da demonstração é
honesto: a autodeclaração posiciona a hipótese e o teste ajusta, com a conta
declarada em `calcularResultado()`. O resultado sai com nível, confiança em
palavras, domínio por competência, lacunas e primeiro passo (DIA-07).

**Mapa (MAP-01..06).** React Flow com cinco nós fixos serpenteando, conexões
pontilhadas que são dependência de verdade, estados com ícone e texto além da
cor, o nível atual selecionado de saída com o painel de detalhe expandido, e a
próxima ação recomendada acima do mapa. A alternativa em lista tem o mesmo
conteúdo, linear e por teclado. Os nós não se arrastam de propósito: a posição
é informação, não preferência.

**Aprender (APR-01..07).** Navegação lateral com módulos, aulas e estados; o
vídeo com objetivo, resultado esperado, transcrição e velocidade; as tarefas
com o trio o-que-fazer, o-que-entregar, como-saber-que-ficou-bom; e a validação
com nota de corte. Errar aponta o conteúdo exato a revisar e a nova tentativa
usa VARIAÇÃO de questões. Concluir vídeo nunca conclui competência (RB-02):
quem conclui é a validação. A retomada abre a próxima aula útil, não a última
URL (APR-07).

**Praticar (PRA-01..05).** Cenário, objetivo, restrições, entrega e rubrica à
vista antes de começar; etapas na lateral; evidência com rascunho e envio
final; feedback por critério com a fonte declarada (automático, pares ou
especialista); e case só com consentimento explícito.

**Progresso (PRO-01..05).** Indicadores em `dl`, gráfico de dedicação em SVG à
mão com a mesma informação em texto pro leitor de tela, domínio por competência
com a ORIGEM de cada número ao lado, e linha do tempo com sessões agrupadas por
dia (extrato bancário não é histórico).

**Ranking (RNK-01..05).** Tabela no desktop que vira cartões no celular, a
fórmula do score aberta na tela com os pesos (constância e domínio validado
pesam, hora pesa pouco, clique não pesa), o bloco do que recrutadores veem, e o
opt-in de verdade: fora do ranking, nenhum dado da pessoa aparece em lista
nenhuma, e sair não apaga progresso.

**Perfil.** Objetivo, visibilidade pública campo a campo (nome público,
disponibilidade, exibir evidências) e a lista de evidências com o consentimento
de cada case à mão.

---

## O onboarding guiado

**O tour percorre a jornada inteira, na ordem do documento**: site → entrar →
início → carreiras → ficha da profissão → diagnóstico → mapa → aprender →
praticar → progresso → ranking → fecho. Cada parada diz onde clicar pra chegar
na próxima, então ele é também o roteiro de teste de quem abre o app pela
primeira vez. São doze paradas em `src/content/tour.ts`, sobre o mesmo
invólucro de driver.js do andaime.

**Um conserto no invólucro**: a limpeza de navegação regravava a posição da
jornada mesmo quando o trecho já tinha terminado pelo botão, voltando o tour um
passo. Agora ela só grava se o balão ainda estava de pé (`isActive()`).

---

## As dobras do site

| Dobra | O que ela carrega |
| --- | --- |
| Abertura | A promessa ("Da dúvida de carreira ao próximo passo certo") com a prévia do mapa de cinco níveis ao lado |
| Como funciona | Os três passos: escolher de olhos abertos, descobrir o nível, seguir com prova no fim |
| O caminho | A dobra viva: os cinco níveis REAIS de UX/UI Designer, lidos do catálogo |
| O que muda | Os três benefícios: saber onde está com evidência, caminho visível, prova em vez de certificado |

A prévia do herói mostra o mapa com a próxima ação porque é a tela que define o
produto. `planos.tsx` e `time.tsx` continuam guardadas: não há preço nem sócios
pra anunciar nesta fase.

---

## Dependências

**`@xyflow/react` entrou** porque o requisito MAP-02 pede React Flow pelo nome.
Condições cumpridas: importado num arquivo só (`fluxo.tsx`), chega por
`next/dynamic` com `ssr: false`, esqueleto no lugar enquanto carrega, e a
alternativa em lista garante que o mapa nunca é o único acesso. Considerei e
descartei desenhar o mapa em SVG à mão: o requisito nomeia a biblioteca, e
zoom, pan e navegação por nó viriam ao custo de reimplementar o que ela já faz.

**Nada mais entrou.** O gráfico de dedicação é SVG à mão (o painel simples não
justifica biblioteca), o player de vídeo é desenhado com tokens (não existe
arquivo de vídeo pra reproduzir, e fingir reprodução seria mentir na tela).

---

## O botão é pílula

**Todos os botões do design system têm as bordas em semicírculo**
(`rounded-full`), por decisão de design: o primitivo `Button`, o `BotaoLink`
que espelha ele, os botões de área em Carreiras, os seletores da autoavaliação,
os links com cara de botão do Desafio e do Como usar, o botão de limpar da
busca (que vira círculo) e até o botão falso da prévia do site. `rounded-full`
em vez de um número porque o navegador fecha o semicírculo em qualquer altura.
Campo, cartão e selo continuam nos três raios do design system: a pílula é do
botão, não da interface inteira.

## Um CTA primário por tela

**Só a ação principal da tela é `primaria`.** Qualquer outro botão da mesma
tela é `secundaria`, `fantasma` ou `perigo`. É regra do design system, não
preferência de página: dois botões primários competindo pela mesma atenção
viram zero botão primário, e a pessoa passa a decidir por posição em vez de
hierarquia. A contagem é da TELA montada, não do componente isolado, porque é a
tela que a pessoa vê.

**O site da raiz saiu de três primários para um.** O CTA da página é o do
herói ("Descobrir meu nível", com o chip de seta, a anatomia do CTA de
referência).
Viraram secundários o "Entrar" do cabeçalho, que é atalho de quem já tem conta,
e o fecho da dobra Como funciona, que é a mesma ação repetida depois da
explicação. O fecho também perdeu o `comChip`: o chip tem fundo `--ds-canvas`,
que é praticamente a superfície do botão secundário, então ele sumiria dentro
do próprio botão. Considerei e descartei manter o fecho primário com o
argumento de que fica longe do herói: rolagem não cria uma tela nova, e a
regra existe justamente para não ser negociada a cada dobra.

**`planos.tsx` já nasce certo** (um primário no plano em destaque, os outros
secundários), mas ele continua guardado. No dia em que a dobra de planos entrar
na landing, o primário do herói ou o do plano destacado tem que ceder: dois na
mesma página quebram a regra.

---

## Storybook

**Primitivo novo com story nova**: `BarraProgresso` nasceu com
`barra-progresso.stories.tsx` (padrão, completa, pequena e o uso em lista de
domínio por competência). As stories existentes foram atualizadas pro
vocabulário e pros dados do produto novo: os exemplos agora são competências,
perfis públicos e evidências, não sobras do produto anterior.

---

## O que ficou de fora, e por quê

**Autoria de conteúdo, ATS e contratação completa**: fora do escopo declarado
na seção 1 do documento. **Notificações**: o documento pede lembretes por
pendência real (PRO-05), que dependem de e-mail/WhatsApp ainda não ligados; os
encaixes estão em `PROXIMOS-PASSOS.md`. **Revisão humana de resposta curta e
feedback por IA**: as respostas curtas ficam registradas na jornada e o
feedback dos desafios é de demonstração, com o caminho pra ligar a OpenAI
documentado.

---

## Login de verdade e banco por pessoa

**O login é o Google, e só ele, quando as chaves existem.** A entrada rápida
(nome e senha que não iam a lugar nenhum) servia pra testar telas sem conta.
Com `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `AUTH_SECRET` no ambiente, ela
some da tela de entrar: guardaria a jornada num navegador enquanto o banco
espera por uma pessoa de verdade. Sem as chaves (o `npm run dev` de quem clonou
o projeto), tudo continua como era.

**Cada registro tem dono.** A tabela `usuarios` nasce na volta do Google (id =
e-mail em minúsculas) e `registros` ganhou a coluna `usuario` na chave
primária. A rota `/api/dados` lê o dono do cookie assinado, nunca do corpo da
requisição, e sem sessão responde 401. Duas pessoas no mesmo app veem cada uma
só a própria jornada; quem acabou de entrar recebe as três coleções vazias.

**Banco ligado nunca cai pros dados de exemplo.** Se o Neon estiver dormindo
ou fora do ar, a pessoa logada vê a jornada vazia e o erro fica no log. Mostrar
a jornada de demonstração no lugar da dela seria mentir pra quem está logado.

**A casca espera o servidor antes de decidir.** Depois de voltar do Google o
cookie já existe, mas o navegador ainda não copiou a sessão pra si; decidir
nesse instante expulsava quem tinha acabado de entrar. `useEstadoDaSessao()`
diz quando a resposta chegou, e só então a casca escolhe entre app e `/entrar`.

**Três vazios de onboarding, um componente.** `EstadoDaJornada` decide, na
ordem em que a jornada se monta, a PRIMEIRA coisa que falta: profissão, nível
ou curso começado. Mapa, Aprender, Praticar, Progresso e Ranking mostram o
mesmo estado com as mesmas palavras e uma única ação (RB-10). Antes cada tela
tinha o seu texto, e o Mapa mandava fazer o nivelamento de quem nem tinha
profissão.

**Perfil vira leitura com login real.** Nome e e-mail vêm da conta Google;
editar aqui gravaria uma sessão local que o servidor ignora, e um e-mail
diferente apontaria pra jornada de outra pessoa.

---

## O mapa do banco e o Prisma

**`/banco` é material de estudo, não tela do produto.** Fica fora da casca do
app, como `/como-usar` e `/exemplo`. O mapa é uma árvore em React Flow: da
tabela no Postgres até o campo dentro do jsonb, abrindo nó por nó, com o
requisito que cada dado serve, um exemplo e onde ele mora no código. A
posição é calculada (coluna por profundidade), porque "à direita" quer dizer
"dentro de". A seta cheia é chave estrangeira; a pontilhada é pertencimento.

**A árvore mora em `src/content/banco.ts`, à mão.** Poderia ser gerada dos
tipos, mas o que vale pra estudar é a descrição, o requisito e o exemplo, e
isso ninguém gera. O preço é manter os dois juntos quando `types.ts` mudar, e
o arquivo avisa isso no cabeçalho.

**Dois desenhos, lado a lado.** O atual (duas tabelas, três coleções num
jsonb) e o seguinte (uma tabela por coleção, com REFERENCES e colunas
tipadas), que já estava comentado em `banco/schema.sql`. Ver os dois no mesmo
lugar é o que explica por que o atual existe e o que o seguinte compra.

**Prisma entrou só pra olhar.** `db pull` desenha o schema a partir do que
existe no Neon e o Studio navega nas linhas. O app continua no driver do Neon:
trocar a camada de dados por um ORM pra ganhar um visualizador seria pagar
caro por uma ferramenta que cabe num script.
