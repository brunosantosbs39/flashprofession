/**
 * O modelo mental do banco, pra estudo.
 *
 * É uma árvore: o banco tem tabelas, as tabelas têm colunas, a coluna `dados`
 * (jsonb) tem três coleções, cada coleção tem campos, e alguns campos são
 * objetos com campos dentro. A página `/banco` desenha essa árvore em React
 * Flow e deixa você abrir nó por nó.
 *
 * A fonte de verdade de cada nível está no código, e cada nó aponta pra ela:
 * as tabelas em `prisma/schema.prisma` (desenhado a partir do Neon) e em
 * `src/lib/banco.ts`; os campos das coleções em `src/lib/types.ts`. Se o tipo
 * mudar lá e este arquivo não acompanhar, a página passa a mentir, então os
 * dois andam juntos.
 */

export type TipoDeNo = "banco" | "tabela" | "coluna" | "colecao" | "campo" | "objeto"

export type NoDoBanco = {
  id: string
  nome: string
  tipo: TipoDeNo
  /** O tipo do dado, do jeito que aparece no Postgres ou no TypeScript. */
  tipoDado?: string
  descricao: string
  /** O código do documento de requisitos que este dado serve, quando tem. */
  requisito?: string
  /** Um valor de exemplo, como ele aparece de verdade. */
  exemplo?: string
  /** Onde isso mora no código. */
  codigo?: string
  /** Chave primária, chave estrangeira ou índice, quando é coluna. */
  papel?: "PK" | "FK" | "índice"
  filhos?: NoDoBanco[]
}

export const rotulosDeTipo: Record<TipoDeNo, string> = {
  banco: "Banco",
  tabela: "Tabela",
  coluna: "Coluna",
  colecao: "Coleção (dentro do jsonb)",
  campo: "Campo",
  objeto: "Objeto",
}

// --- o desenho atual: duas tabelas, três coleções num jsonb ----------------

const jornada: NoDoBanco = {
  id: "jornadas",
  nome: "jornadas",
  tipo: "colecao",
  tipoDado: "Jornada",
  descricao:
    "A jornada da pessoa: UM registro vivo que toda tela lê e atualiza. Guarda posição e resposta, nunca o catálogo, pra trocar o currículo de uma profissão não apagar o que a pessoa fez (RB-07). Hoje cada pessoa tem uma jornada; o app sempre lê a primeira.",
  requisito: "ONB-03, ONB-04, RB-07",
  codigo: "src/lib/types.ts (Jornada) · src/lib/store.ts (atualizarJornada)",
  filhos: [
    { id: "jornadas.id", nome: "id", tipo: "campo", tipoDado: "string", descricao: "Gerado no navegador, com prefixo da coleção.", exemplo: '"jor-rs40faj"', codigo: "src/lib/ids.ts" },
    { id: "jornadas.profissaoId", nome: "profissaoId", tipo: "campo", tipoDado: "string | null", descricao: "A profissão objetivo. Nula enquanto a pessoa não escolheu: é o que liga o vazio de onboarding \"sem profissão\".", requisito: "CAR-01, CAR-05", exemplo: '"ux-ui-designer"', codigo: "src/lib/catalogo.ts (PROFISSOES)" },
    { id: "jornadas.etapa", nome: "etapa", tipo: "campo", tipoDado: '"novo" | "autopercepcao" | "teste" | "resultado" | "trilha"', descricao: "A etapa macro em que a pessoa está. É por ela que proximaAcao() decide a única próxima ação da tela (RB-10).", requisito: "ONB-03, RB-10", exemplo: '"trilha"', codigo: "src/lib/jornada.ts (proximaAcao)" },
    { id: "jornadas.autopercepcao", nome: "autopercepcao", tipo: "objeto", tipoDado: "Record<habilidadeId, \"nunca-vi\" | \"conheco\" | \"domino\">", descricao: "O que a pessoa declarou saber em cada habilidade. É hipótese: ajusta a dificuldade do teste, não conclui nada (RB-01).", requisito: "DIA-02, RB-01", exemplo: '{ "ux-pesquisa": "conheco", "ux-prototipo": "nunca-vi" }' },
    { id: "jornadas.respostasDoTeste", nome: "respostasDoTeste", tipo: "objeto", tipoDado: "Record<questaoId, string>", descricao: "A resposta dada em cada questão do nivelamento: o índice da alternativa ou o texto da resposta curta.", requisito: "DIA-03, DIA-05", exemplo: '{ "q-ux-01": "1", "q-ux-07": "Agruparia as falas por tema..." }' },
    { id: "jornadas.questaoAtual", nome: "questaoAtual", tipo: "campo", tipoDado: "number", descricao: "Onde o teste parou. É o que faz sair no meio e voltar amanhã sem repetir trabalho válido.", requisito: "ONB-04, DIA-06", exemplo: "4" },
    {
      id: "jornadas.resultado",
      nome: "resultado",
      tipo: "objeto",
      tipoDado: "ResultadoDiagnostico | null",
      descricao: "O resultado do nivelamento. Nulo até a pessoa concluir o diagnóstico: é o que liga o vazio de onboarding \"sem nível\".",
      requisito: "DIA-07",
      codigo: "src/lib/jornada.ts (calcularResultado)",
      filhos: [
        { id: "resultado.nivel", nome: "nivel", tipo: "campo", tipoDado: "number (1 a 5)", descricao: "O nível em que a pessoa foi posicionada no mapa.", requisito: "DIA-07, MAP-01", exemplo: "2" },
        { id: "resultado.confianca", nome: "confianca", tipo: "campo", tipoDado: "string", descricao: "Em palavras, não em número: resultado sem confiança inventa precisão.", requisito: "DIA-07", exemplo: '"média"' },
        { id: "resultado.dominioPorCompetencia", nome: "dominioPorCompetencia", tipo: "objeto", tipoDado: "Record<competenciaId, number 0..100>", descricao: "Percentual de domínio por competência, como o teste mediu. A tela de Progresso mostra a origem de cada número ao lado dele.", requisito: "DIA-07, PRO-03", exemplo: '{ "ux-pesquisa": 40, "ux-ia": 75 }' },
        { id: "resultado.pontosFortes", nome: "pontosFortes", tipo: "campo", tipoDado: "string[]", descricao: "Ids de competência acima da nota de corte.", exemplo: '["ux-ia"]' },
        { id: "resultado.lacunasCriticas", nome: "lacunasCriticas", tipo: "campo", tipoDado: "string[]", descricao: "Ids de competência obrigatórias do nível que ficaram abaixo da nota de corte. É o que prioriza a trilha.", requisito: "DIA-07, APR-01", exemplo: '["ux-pesquisa"]' },
        { id: "resultado.aproveitadas", nome: "aproveitadas", tipo: "campo", tipoDado: "string[]", descricao: "Competências reaproveitadas de uma profissão anterior ao trocar de objetivo.", requisito: "CAR-05", exemplo: "[]" },
        { id: "resultado.primeiroPasso", nome: "primeiroPasso", tipo: "campo", tipoDado: "string", descricao: "A primeira ação recomendada, em texto, como saiu na tela de resultado.", requisito: "DIA-07", exemplo: '"Concluir o módulo de pesquisa"' },
        { id: "resultado.data", nome: "data", tipo: "campo", tipoDado: "string (ISO)", descricao: "Quando o resultado foi calculado.", exemplo: '"2026-08-23T19:40:00.000Z"' },
      ],
    },
    { id: "jornadas.competenciasConcluidas", nome: "competenciasConcluidas", tipo: "campo", tipoDado: "string[]", descricao: "Ids de competência com a validação aprovada. É a ÚNICA coisa que sobe nível: consumir conteúdo nunca sobe (RB-02).", requisito: "APR-05, RB-02, MAP-05", exemplo: '["ux-pesquisa"]', codigo: "src/lib/jornada.ts (estadoDoNivel)" },
    { id: "jornadas.conteudosVistos", nome: "conteudosVistos", tipo: "campo", tipoDado: "string[]", descricao: "Ids de aula concluída. Marca progresso no módulo, não domínio.", requisito: "APR-02, RB-02", exemplo: '["c-ux-pesq-01"]' },
    { id: "jornadas.tarefasFeitas", nome: "tarefasFeitas", tipo: "campo", tipoDado: "string[]", descricao: "Ids de tarefa prática marcada como feita.", requisito: "APR-03", exemplo: '["t-ux-pesq-01"]' },
    { id: "jornadas.avaliacoes", nome: "avaliacoes", tipo: "objeto", tipoDado: "Record<moduloId, { acertos, total, aprovado, tentativas }>", descricao: "O resultado da validação de cada módulo. Reprovou, a próxima tentativa usa a variação de questões, e o número de tentativas fica registrado.", requisito: "APR-04, APR-05", exemplo: '{ "m-ux-pesquisa": { "acertos": 4, "total": 5, "aprovado": true, "tentativas": 2 } }', codigo: "src/lib/modelo.ts (NOTA_DE_CORTE)" },
    { id: "jornadas.retomada", nome: "retomada", tipo: "objeto", tipoDado: "{ moduloId, conteudoId } | null", descricao: "Onde o aprendizado parou. O \"Continuar\" abre a próxima aula útil, não a última URL.", requisito: "APR-07", exemplo: '{ "moduloId": "m-ux-pesquisa", "conteudoId": "c-ux-pesq-02" }' },
    {
      id: "jornadas.publico",
      nome: "publico",
      tipo: "objeto",
      tipoDado: "{ participaRanking, nomePublico, mostrarEvidencias, disponibilidade }",
      descricao: "O que a pessoa aceitou mostrar. Ranking e busca de recrutadores são opt-in: fora do ranking, nenhum dado dela aparece em lista nenhuma.",
      requisito: "RNK-05",
      filhos: [
        { id: "publico.participaRanking", nome: "participaRanking", tipo: "campo", tipoDado: "boolean", descricao: "Entrou no ranking por escolha. Sair não apaga progresso.", requisito: "RNK-05", exemplo: "false" },
        { id: "publico.nomePublico", nome: "nomePublico", tipo: "campo", tipoDado: "string", descricao: "O nome que aparece pra outras pessoas, que pode ser diferente do nome da conta.", exemplo: '"Ana P."' },
        { id: "publico.mostrarEvidencias", nome: "mostrarEvidencias", tipo: "campo", tipoDado: "boolean", descricao: "Se os cases aparecem no perfil público.", exemplo: "true" },
        { id: "publico.disponibilidade", nome: "disponibilidade", tipo: "campo", tipoDado: "string", descricao: "O que a pessoa quer que recrutadores saibam sobre disponibilidade.", exemplo: '"Aberta a propostas remotas"' },
      ],
    },
    { id: "jornadas.criadoEm", nome: "criadoEm", tipo: "campo", tipoDado: "string (ISO)", descricao: "Quando a jornada nasceu.", exemplo: '"2026-08-23T19:31:12.000Z"' },
  ],
}

const evidencia: NoDoBanco = {
  id: "evidencias",
  nome: "evidencias",
  tipo: "colecao",
  tipoDado: "Evidencia",
  descricao:
    "Uma prova produzida num desafio ou registrada de fora. Nasce rascunho, é enviada, recebe feedback por critério e, com consentimento, vira case no perfil. Várias por pessoa.",
  requisito: "PRA-03, PRA-04, PRA-05, APR-06",
  codigo: "src/lib/types.ts (Evidencia) · src/lib/store.ts (criarEvidencia)",
  filhos: [
    { id: "evidencias.id", nome: "id", tipo: "campo", tipoDado: "string", descricao: "Gerado no navegador, com prefixo da coleção.", exemplo: '"evi-k2m9x1a"' },
    { id: "evidencias.desafioId", nome: "desafioId", tipo: "campo", tipoDado: "string | null", descricao: "O desafio de origem. Nulo quando a evidência veio de fora (um curso na empresa, um projeto).", requisito: "PRA-01, APR-06", exemplo: '"d-ux-onboarding"', codigo: "src/lib/catalogo.ts (DESAFIOS)" },
    { id: "evidencias.habilidade", nome: "habilidade", tipo: "campo", tipoDado: "string", descricao: "A habilidade que a evidência comprova.", exemplo: '"ux-pesquisa"' },
    { id: "evidencias.origem", nome: "origem", tipo: "campo", tipoDado: '"autodeclaracao" | "teste" | "tarefa" | "revisao-humana"', descricao: "De onde veio a prova. A origem fica ao lado de cada número na tela de Progresso.", requisito: "PRO-03", exemplo: '"tarefa"' },
    { id: "evidencias.estado", nome: "estado", tipo: "campo", tipoDado: '"rascunho" | "enviada" | "avaliada" | "case"', descricao: "O ciclo de vida: rascunho → enviada → avaliada → case. Só vira case com consentimento explícito.", requisito: "PRA-03, PRA-05", exemplo: '"case"' },
    { id: "evidencias.texto", nome: "texto", tipo: "campo", tipoDado: "string", descricao: "O relato da pessoa: o que fez, como decidiu, o que aprendeu.", exemplo: '"Entrevistei 6 pessoas e agrupei..."' },
    { id: "evidencias.link", nome: "link", tipo: "campo", tipoDado: "string", descricao: "Endereço do artefato (Figma, repositório, documento).", exemplo: '"https://figma.com/..."' },
    { id: "evidencias.feedback", nome: "feedback", tipo: "objeto", tipoDado: "Array<{ criterio, nota, comentario }> | null", descricao: "Feedback por critério da rubrica, quando avaliada. Nulo antes disso.", requisito: "PRA-04", exemplo: '[{ "criterio": "Clareza do problema", "nota": "Atende", "comentario": "..." }]' },
    { id: "evidencias.fonteFeedback", nome: "fonteFeedback", tipo: "campo", tipoDado: '"automatico" | "pares" | "especialista" | null', descricao: "Quem deu o feedback. A tela diz a fonte, sempre.", requisito: "PRA-04", exemplo: '"automatico"' },
    { id: "evidencias.consentimentoCase", nome: "consentimentoCase", tipo: "campo", tipoDado: "boolean", descricao: "A pessoa autorizou virar case público. Sem isso, não aparece em lugar nenhum.", requisito: "PRA-05, RNK-05", exemplo: "true" },
    { id: "evidencias.criadoEm", nome: "criadoEm", tipo: "campo", tipoDado: "string (ISO)", descricao: "Quando a evidência nasceu.", exemplo: '"2026-08-20T14:02:00.000Z"' },
  ],
}

const sessao: NoDoBanco = {
  id: "sessoes",
  nome: "sessoes",
  tipo: "colecao",
  tipoDado: "SessaoDeEstudo",
  descricao:
    "Um bloco de tempo ativo de estudo. Só nasce de ação que comprova atividade (concluir aula, enviar validação, enviar evidência), nunca de relógio rodando com a aba aberta. Alimenta horas e sequência de dias. Muitas por pessoa.",
  requisito: "PRO-01, PRO-02",
  codigo: "src/lib/types.ts (SessaoDeEstudo) · src/lib/store.ts (registrarSessao) · src/lib/jornada.ts (minutosNoPeriodo, sequenciaDeDias)",
  filhos: [
    { id: "sessoes.id", nome: "id", tipo: "campo", tipoDado: "string", descricao: "Gerado no navegador, com prefixo da coleção.", exemplo: '"ses-9qz0p1t"' },
    { id: "sessoes.tipo", nome: "tipo", tipo: "campo", tipoDado: '"video" | "avaliacao" | "pratica"', descricao: "O que a pessoa estava fazendo. O gráfico de dedicação separa por tipo.", requisito: "PRO-01", exemplo: '"video"' },
    { id: "sessoes.minutos", nome: "minutos", tipo: "campo", tipoDado: "number", descricao: "Duração estimada do bloco, pela duração da aula ou do desafio.", exemplo: "12" },
    { id: "sessoes.data", nome: "data", tipo: "campo", tipoDado: "string (AAAA-MM-DD)", descricao: "O dia LOCAL, montado por componente pra não cair de fuso. É o que a sequência de dias conta.", requisito: "PRO-01", exemplo: '"2026-08-23"' },
    { id: "sessoes.criadoEm", nome: "criadoEm", tipo: "campo", tipoDado: "string (ISO)", descricao: "O instante exato, em UTC.", exemplo: '"2026-08-23T19:45:10.000Z"' },
  ],
}

export const desenhoAtual: NoDoBanco = {
  id: "banco",
  nome: "rumo (Neon Postgres)",
  tipo: "banco",
  descricao:
    "Duas tabelas. A pessoa mora em `usuarios`; tudo que ela produz mora em `registros`, um jsonb por registro. Cada linha tem dono, e a rota /api/dados só lê e grava com o dono da sessão assinada.",
  codigo: "prisma/schema.prisma · banco/schema.sql · src/lib/banco.ts",
  filhos: [
    {
      id: "usuarios",
      nome: "usuarios",
      tipo: "tabela",
      descricao: "Quem usa o app. Uma linha por pessoa, criada na volta do login com Google (upsert: na primeira vez cria, nas outras atualiza nome e último acesso).",
      codigo: "src/lib/banco.ts (registrarUsuario) · src/app/api/auth/callback/google/route.ts",
      filhos: [
        { id: "usuarios.id", nome: "id", tipo: "coluna", tipoDado: "text", papel: "PK", descricao: "O e-mail em minúsculas. Ana@x.com e ana@x.com são a mesma caixa de entrada, e tratar como duas pessoas faria a jornada sumir na segunda entrada.", exemplo: '"lbrezende@gmail.com"', codigo: "src/lib/banco.ts (idDoUsuario)" },
        { id: "usuarios.email", nome: "email", tipo: "coluna", tipoDado: "text", descricao: "O e-mail como veio do Google, com as letras originais.", exemplo: '"LBRezende@gmail.com"' },
        { id: "usuarios.nome", nome: "nome", tipo: "coluna", tipoDado: "text", descricao: "O nome da conta Google. Atualiza a cada login: a pessoa pode ter trocado.", exemplo: '"Leandro B. Rezende"' },
        { id: "usuarios.criado_em", nome: "criado_em", tipo: "coluna", tipoDado: "timestamptz", descricao: "O primeiro login.", exemplo: "2026-08-23 19:31:12+00" },
        { id: "usuarios.ultimo_acesso", nome: "ultimo_acesso", tipo: "coluna", tipoDado: "timestamptz", descricao: "O login mais recente. Útil pra lembrete por pendência real (PRO-05), quando ele existir.", requisito: "PRO-05", exemplo: "2026-08-23 19:31:12+00" },
      ],
    },
    {
      id: "registros",
      nome: "registros",
      tipo: "tabela",
      descricao:
        "Tudo que cada pessoa produz, um registro por linha, com o conteúdo inteiro em jsonb. Uma tabela só pras três coleções: trocar os campos de uma coleção ou inventar coleção nova não pede migração. O preço é o banco não conferir as regras (nada impede uma evidência apontar pra um desafio que não existe): o desenho seguinte resolve isso.",
      codigo: "src/lib/banco.ts · src/app/api/dados/route.ts",
      filhos: [
        { id: "registros.usuario", nome: "usuario", tipo: "coluna", tipoDado: "text", papel: "FK", descricao: "O dono. Aponta pra usuarios.id com ON DELETE CASCADE: apagar a pessoa apaga o que é dela. É a primeira coluna da chave primária, e toda consulta começa por ela.", exemplo: '"lbrezende@gmail.com"' },
        { id: "registros.colecao", nome: "colecao", tipo: "coluna", tipoDado: "text", papel: "PK", descricao: "Qual das três coleções: jornadas, evidencias ou sessoes. A rota recusa qualquer outro valor (ehColecao).", exemplo: '"jornadas"', codigo: "src/lib/banco.ts (COLECOES)" },
        { id: "registros.id", nome: "id", tipo: "coluna", tipoDado: "text", papel: "PK", descricao: "O mesmo id que o app gera no navegador (jor-, evi-, ses-). Repetido dentro do jsonb, de propósito: a tela lê o registro inteiro de `dados`.", exemplo: '"jor-rs40faj"', codigo: "src/lib/ids.ts" },
        {
          id: "registros.dados",
          nome: "dados",
          tipo: "coluna",
          tipoDado: "jsonb",
          descricao: "O registro inteiro, do jeito que a tela lê. O PATCH funde um pedaço novo com o operador || do jsonb, numa ida só ao banco. Abra pra ver as três formas que cabem aqui dentro.",
          codigo: "src/lib/banco.ts (atualizar) · src/lib/types.ts (Dados)",
          filhos: [jornada, evidencia, sessao],
        },
        { id: "registros.criado_em", nome: "criado_em", tipo: "coluna", tipoDado: "timestamptz", papel: "índice", descricao: "Quando a linha nasceu. O índice (usuario, colecao, criado_em DESC) é o que deixa \"mais novo primeiro\" barato pra cada pessoa.", exemplo: "2026-08-23 19:33:05+00" },
      ],
    },
  ],
}

// --- o próximo desenho: uma tabela por coleção, com o banco conferindo -----

export const desenhoSeguinte: NoDoBanco = {
  id: "banco-v2",
  nome: "rumo, desenho seguinte",
  tipo: "banco",
  descricao:
    "O mesmo conteúdo, com uma tabela por coleção e colunas tipadas. O que ele ganha: o REFERENCES não deixa evidência órfã existir, o ON DELETE CASCADE apaga as filhas sozinho, e \"quantas horas por semana cada pessoa estudou\" vira um GROUP BY em vez de uma consulta em jsonb. O que ele custa: cada mudança de campo vira ALTER TABLE. Está desenhado, comentado, em banco/schema.sql.",
  codigo: "banco/schema.sql (seção \"O próximo desenho\")",
  filhos: [
    {
      id: "v2.usuarios",
      nome: "usuarios",
      tipo: "tabela",
      descricao: "Igual ao desenho atual: a pessoa, criada no login.",
      filhos: [
        { id: "v2.usuarios.id", nome: "id", tipo: "coluna", tipoDado: "text", papel: "PK", descricao: "E-mail em minúsculas." },
        { id: "v2.usuarios.nome", nome: "nome", tipo: "coluna", tipoDado: "text", descricao: "Nome da conta Google." },
      ],
    },
    {
      id: "v2.jornadas",
      nome: "jornadas",
      tipo: "tabela",
      descricao: "Uma linha por jornada, com os campos mais consultados em coluna própria e o resto (respostas, avaliações, retomada) ainda em jsonb.",
      filhos: [
        { id: "v2.jornadas.id", nome: "id", tipo: "coluna", tipoDado: "text", papel: "PK", descricao: "O mesmo jor-… de hoje." },
        { id: "v2.jornadas.usuario", nome: "usuario", tipo: "coluna", tipoDado: "text", papel: "FK", descricao: "REFERENCES usuarios(id) ON DELETE CASCADE." },
        { id: "v2.jornadas.profissao_id", nome: "profissao_id", tipo: "coluna", tipoDado: "text", descricao: "A profissão objetivo, consultável sem abrir jsonb: \"quantas pessoas miram UX?\" vira um COUNT." },
        { id: "v2.jornadas.etapa", nome: "etapa", tipo: "coluna", tipoDado: "text", descricao: "NOT NULL DEFAULT 'novo'. Um CHECK pode travar nos cinco valores válidos." },
        { id: "v2.jornadas.resultado", nome: "resultado", tipo: "coluna", tipoDado: "jsonb", descricao: "Nível, confiança e domínio por competência. Continua jsonb porque a forma ainda muda." },
        { id: "v2.jornadas.publico", nome: "publico", tipo: "coluna", tipoDado: "jsonb", descricao: "Opt-in de ranking e visibilidade." },
      ],
    },
    {
      id: "v2.evidencias",
      nome: "evidencias",
      tipo: "tabela",
      descricao: "Uma linha por evidência, amarrada à jornada. O banco passa a impedir evidência sem jornada.",
      filhos: [
        { id: "v2.evidencias.id", nome: "id", tipo: "coluna", tipoDado: "text", papel: "PK", descricao: "O mesmo evi-… de hoje." },
        { id: "v2.evidencias.jornada_id", nome: "jornada_id", tipo: "coluna", tipoDado: "text", papel: "FK", descricao: "REFERENCES jornadas(id) ON DELETE CASCADE: o que hoje é só convenção vira regra que o banco confere." },
        { id: "v2.evidencias.desafio_id", nome: "desafio_id", tipo: "coluna", tipoDado: "text", descricao: "O desafio de origem, ou nulo." },
        { id: "v2.evidencias.origem", nome: "origem", tipo: "coluna", tipoDado: "text", descricao: "autodeclaração, teste, tarefa ou revisão humana." },
        { id: "v2.evidencias.estado", nome: "estado", tipo: "coluna", tipoDado: "text", descricao: "NOT NULL DEFAULT 'rascunho'." },
        { id: "v2.evidencias.artefato", nome: "artefato", tipo: "coluna", tipoDado: "jsonb", descricao: "Texto, link, feedback por critério e consentimento." },
      ],
    },
    {
      id: "v2.sessoes",
      nome: "sessoes",
      tipo: "tabela",
      descricao: "Uma linha por bloco de estudo, com minutos e data em coluna: horas por semana e sequência de dias viram SQL simples.",
      filhos: [
        { id: "v2.sessoes.id", nome: "id", tipo: "coluna", tipoDado: "text", papel: "PK", descricao: "O mesmo ses-… de hoje." },
        { id: "v2.sessoes.jornada_id", nome: "jornada_id", tipo: "coluna", tipoDado: "text", papel: "FK", descricao: "REFERENCES jornadas(id) ON DELETE CASCADE." },
        { id: "v2.sessoes.tipo", nome: "tipo", tipo: "coluna", tipoDado: "text", descricao: "video, avaliacao ou pratica." },
        { id: "v2.sessoes.minutos", nome: "minutos", tipo: "coluna", tipoDado: "integer", descricao: "SUM(minutos) WHERE data >= hoje - 7 é a dedicação da semana." },
        { id: "v2.sessoes.data", nome: "data", tipo: "coluna", tipoDado: "date", descricao: "Tipo date de verdade: o banco sabe que é um dia." },
      ],
    },
  ],
}

/** A stack, camada por camada, pra página de estudo. */
export const stack = {
  titulo: "A stack deste app",
  camadas: [
    {
      nome: "Front-end",
      itens: [
        ["Next.js 16 (App Router, Turbopack)", "as páginas, o roteamento e as rotas de API no mesmo projeto"],
        ["React 19", "os componentes; useSyncExternalStore é a base do store"],
        ["TypeScript", "os tipos em src/lib/types.ts são a forma de tudo que o banco guarda"],
        ["Tailwind CSS 4", "estilo por classes, com os tokens do design-system.json em @theme"],
        ["@xyflow/react (React Flow)", "o mapa dos cinco níveis e este mapa do banco"],
        ["driver.js", "o tour guiado de onboarding"],
        ["lucide-react", "os ícones, sempre pelo mapa de icone.tsx"],
        ["zod", "validação de formulário no navegador"],
        ["Storybook 10", "a vitrine dos primitivos do design system"],
      ],
    },
    {
      nome: "Back-end",
      itens: [
        ["Rotas de API do Next.js (src/app/api)", "o único lugar que lê segredo de ambiente"],
        ["Login com Google (OAuth 2.0 à mão)", "ida e volta em src/lib/google.ts, sem biblioteca de auth"],
        ["Sessão assinada (HMAC-SHA256, cookie httpOnly)", "src/lib/sessao-servidor.ts; AUTH_SECRET assina"],
        ["Neon Postgres (serverless)", "o banco; driver @neondatabase/serverless em src/lib/banco.ts"],
        ["Prisma (só leitura)", "db pull desenha o schema, Studio navega nas linhas; o app não passa por ele"],
        ["Vercel", "hospedagem, build e variáveis de ambiente, em produção e preview"],
      ],
    },
    {
      nome: "Preparado, ainda desligado",
      itens: [
        ["OpenAI", "nivelamento adaptativo, avaliação de resposta curta e feedback dos desafios"],
        ["Resend e WhatsApp", "lembretes por pendência real (PRO-05)"],
        ["n8n", "automações disparadas por webhook"],
      ],
    },
  ],
} as const

/** A copy da página /banco. Texto visível mora aqui, não no componente. */
export const paginaBanco = {
  titulo: "O banco, camada por camada",
  subtitulo:
    "Um mapa pra estudar onde cada dado do FlashProfession mora: da tabela no Postgres até o campo dentro do jsonb. Clique num nó pra ler, no número pra abrir o que tem dentro.",
  desenhos: { atual: "Desenho atual", seguinte: "Desenho seguinte" },
  abrirTudo: "Abrir tudo",
  recolher: "Recolher",
  caminho: "Caminho",
  qualDesenho: "Qual desenho",
  noBancoAgora: "No banco agora",
  linha: { singular: "linha", plural: "linhas" },
  secoes: { requisito: "Requisito", exemplo: "Exemplo", codigo: "No código", dentro: "Dentro" },
  abrir: "Abrir",
  recolherNo: "Recolher",
  comoLer: {
    titulo: "Como ler o mapa",
    itens: [
      "Da esquerda pra direita é \"está dentro de\": o banco tem tabelas, a tabela tem colunas, a coluna dados tem três coleções, a coleção tem campos.",
      "A linha pontilhada é esse \"dentro\". A linha cheia, roxa, é chave estrangeira: uma coluna que aponta pra outra tabela.",
      "A contagem ao lado de cada nó é o que está no Neon agora, de todas as pessoas somadas. Abra o Prisma Studio pra ver linha por linha.",
    ],
  },
  ferramentas: {
    titulo: "As duas ferramentas",
    studio: {
      titulo: "Prisma Studio",
      texto: "Um cliente de banco no navegador: abre cada tabela, filtra, edita uma linha. Roda na sua máquina, com a DATABASE_URL do .env.local.",
      comando: "npm run banco:studio",
      endereco: "http://localhost:5555",
    },
    desenhar: {
      titulo: "Redesenhar o schema",
      texto: "Lê o que existe no Neon e reescreve prisma/schema.prisma. Rode depois de mudar uma tabela, pra documentação acompanhar.",
      comando: "npm run banco:desenhar",
    },
  },
  voltar: "Voltar para o site",
  comoUsar: "Como usar",
} as const
