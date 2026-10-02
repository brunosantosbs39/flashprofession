import type {
  Area,
  Desafio,
  Modulo,
  Nivel,
  Profissao,
  Questao,
} from "./types"

/**
 * O catálogo de profissões: a árvore configurável que o documento de requisitos
 * pede. Estrutura comum pra toda profissão, conteúdo próprio de cada uma.
 *
 * TUDO AQUI É CONTEÚDO DE DEMONSTRAÇÃO (regra RB-08), plausível mas ainda não
 * validado por especialista, e as telas dizem isso. A profissão de teste ponta
 * a ponta é UX/UI Designer: ela tem os cinco níveis, as competências, as
 * questões do nivelamento, os módulos de aprendizado e os desafios completos.
 * Front-end e Social Media têm competências e questões próprias; as demais têm
 * a ficha completa de exploração e caem no resultado provisório por
 * autodeclaração até ganharem banco de questões.
 *
 * Isto é catálogo, não dado da pessoa: mora em constante, fora do store, e um
 * dia vira tabela própria. O que a pessoa produz em cima dele (respostas,
 * conclusões, evidências) mora na jornada, em `src/lib/store.ts`.
 */

export const AREAS: Area[] = [
  { id: "criativo-design", nome: "Criativo e Design", descricao: "Interfaces, marcas, conteúdo visual e experiência.", icone: "paleta" },
  { id: "comercial", nome: "Comercial", descricao: "Vendas, pré-vendas e sucesso do cliente.", icone: "aperto" },
  { id: "marketing", nome: "Marketing", descricao: "Aquisição, conteúdo, tráfego e retenção.", icone: "megafone" },
  { id: "tecnologia-dados", nome: "Tecnologia e Dados", descricao: "Desenvolvimento, qualidade, dados e produto.", icone: "codigo" },
  { id: "classicas", nome: "Profissões clássicas", descricao: "Administrativo, financeiro, atendimento e projetos.", icone: "pasta" },
  { id: "comunicacao-educacao", nome: "Comunicação e Educação", descricao: "Ensino, facilitação, jornalismo e roteiro.", icone: "estudar" },
]

/** Os cinco níveis padrão de uma profissão ainda sem currículo próprio. */
function cincoNiveis(nomes: [string, string, string, string, string]): Nivel[] {
  const descricoes = [
    "Primeiro contato: entender o que a profissão faz e como o dia a dia funciona.",
    "Base sólida: dominar o vocabulário, as ferramentas e as tarefas de apoio.",
    "Execução com autonomia: entregar trabalho completo com pouca supervisão.",
    "Problemas complexos: decidir abordagem, priorizar e responder por resultado.",
    "Referência: liderar, formar gente e definir o padrão de qualidade do time.",
  ]
  const criterios = [
    ["Explicar a rotina e as entregas da profissão com as próprias palavras"],
    ["Executar as tarefas de apoio com revisão", "Passar na validação dos fundamentos"],
    ["Entregar um trabalho completo aprovado por rubrica"],
    ["Conduzir um caso complexo do começo ao fim, com evidência"],
    ["Evidências consistentes de liderança técnica ao longo do tempo"],
  ]
  return nomes.map((nome, i) => ({
    ordem: i + 1,
    nome,
    descricao: descricoes[i],
    criterios: criterios[i],
  }))
}

export const PROFISSOES: Profissao[] = [
  // -------------------------------------------------------------------------
  // A profissão do teste ponta a ponta.
  // -------------------------------------------------------------------------
  {
    id: "ux-ui-designer",
    areaId: "criativo-design",
    nome: "UX/UI Designer",
    resumo:
      "Desenha produtos digitais que as pessoas conseguem usar: entende o problema, prototipa a solução, testa com gente de verdade e entrega junto com o time.",
    demo: true,
    rotina: [
      "Conversar com usuários e com o time de produto pra entender o problema",
      "Desenhar fluxos e protótipos no Figma, do rascunho ao navegável",
      "Testar as soluções com usuários e ajustar o que não funcionou",
      "Colaborar com engenharia na entrega e acompanhar o resultado",
    ],
    responsabilidades: [
      "Entender usuários antes de desenhar qualquer tela",
      "Criar soluções navegáveis e defender as decisões com evidência",
      "Testar e iterar em cima do que foi aprendido",
      "Colaborar com produto e engenharia do problema à entrega",
    ],
    entregas: [
      "Relatório de pesquisa com achados acionáveis",
      "Fluxo de usuário e protótipo navegável",
      "Teste de usabilidade documentado, com decisões tomadas a partir dele",
      "Interface final especificada pra engenharia",
    ],
    oportunidades: "Produto digital contrata em todo o país, com trabalho remoto comum e progressão clara de júnior a liderança.",
    esforco: "6 a 10 meses de dedicação parcial pra sair do zero ao nível de execução.",
    tipoTrabalho: "Remoto ou híbrido",
    niveis: [
      { ordem: 1, nome: "Iniciante", descricao: "Descobre o que é UX de verdade: o problema antes da tela, o usuário antes do gosto.", criterios: ["Explicar o processo de UX com as próprias palavras", "Analisar uma interface existente apontando 3 problemas com justificativa"] },
      { ordem: 2, nome: "Fundamentos", descricao: "Constrói a base: pesquisa, wireframe, prototipação e teste com usuários.", criterios: ["Conduzir uma entrevista com usuário do começo ao fim", "Prototipar um fluxo completo no Figma", "Passar na validação de fundamentos de pesquisa"] },
      { ordem: 3, nome: "Execução e entrega", descricao: "Entrega features completas: do problema ao protótipo testado e especificado.", criterios: ["Entregar um case completo aprovado pela rubrica de execução", "Documentar um teste de usabilidade com 5 pessoas"] },
      { ordem: 4, nome: "Estratégia de produto", descricao: "Decide o que vale desenhar: métricas, priorização e visão de produto.", criterios: ["Conduzir uma discovery completa com evidências", "Ligar uma decisão de design a uma métrica de produto que mudou"] },
      { ordem: 5, nome: "Liderança e estratégia", descricao: "Forma gente, define padrão de qualidade e responde pela visão de design.", criterios: ["Evidências de mentoria e de crítica de design conduzida", "Definir e defender uma visão de design pra um produto inteiro"] },
    ],
    competencias: [
      { id: "ux-processo", nivel: 1, nome: "Processo de UX", obrigatoria: true, criterio: "Explicar as etapas do processo e o papel de cada uma", esforco: "4 h", habilidades: [ { id: "hab-processo", nome: "Etapas do processo de design" }, { id: "hab-heuristicas", nome: "Análise de interface e heurísticas" } ] },
      { id: "ux-pesquisa", nivel: 2, nome: "Pesquisa com usuários", obrigatoria: true, criterio: "Conduzir entrevista e sintetizar achados acionáveis", esforco: "12 h", habilidades: [ { id: "hab-entrevista", nome: "Entrevista com usuários" }, { id: "hab-sintese", nome: "Síntese de achados" } ] },
      { id: "ux-wireframe", nivel: 2, nome: "Wireframing", obrigatoria: true, criterio: "Transformar um problema em fluxo e wireframe navegável", esforco: "10 h", habilidades: [ { id: "hab-fluxo", nome: "Fluxos de usuário" }, { id: "hab-wireframe", nome: "Wireframes de baixa fidelidade" } ] },
      { id: "ux-prototipo", nivel: 2, nome: "Prototipação", obrigatoria: true, criterio: "Prototipar um fluxo completo e navegável no Figma", esforco: "14 h", habilidades: [ { id: "hab-figma", nome: "Figma: componentes e variantes" }, { id: "hab-prototipagem", nome: "Protótipos navegáveis" } ] },
      { id: "ux-teste", nivel: 3, nome: "Testes de usabilidade", obrigatoria: true, criterio: "Planejar, conduzir e documentar um teste com 5 pessoas", esforco: "16 h", habilidades: [ { id: "hab-plano-teste", nome: "Plano e roteiro de teste" }, { id: "hab-conducao", nome: "Condução e análise de sessões" } ] },
      { id: "ux-comunicacao", nivel: 3, nome: "Comunicação de design", obrigatoria: false, criterio: "Apresentar uma decisão de design ligando problema, evidência e solução", esforco: "8 h", habilidades: [ { id: "hab-storytelling", nome: "Apresentação de decisões" }, { id: "hab-especificacao", nome: "Especificação pra engenharia" } ] },
      { id: "ux-metricas", nivel: 4, nome: "Métricas de produto", obrigatoria: true, criterio: "Definir e acompanhar a métrica de uma melhoria entregue", esforco: "12 h", habilidades: [ { id: "hab-metricas", nome: "Métricas de experiência" }, { id: "hab-experimentos", nome: "Experimentos e validação" } ] },
      { id: "ux-discovery", nivel: 4, nome: "Discovery e priorização", obrigatoria: true, criterio: "Conduzir uma discovery e priorizar com critério explícito", esforco: "18 h", habilidades: [ { id: "hab-discovery", nome: "Descoberta de oportunidades" }, { id: "hab-priorizacao", nome: "Priorização com evidência" } ] },
      { id: "ux-lideranca", nivel: 5, nome: "Liderança de design", obrigatoria: true, criterio: "Evidências de mentoria, crítica e visão de design conduzidas", esforco: "contínuo", habilidades: [ { id: "hab-mentoria", nome: "Mentoria e crítica de design" }, { id: "hab-visao", nome: "Visão e estratégia de design" } ] },
    ],
  },

  // -------------------------------------------------------------------------
  // Profissões com nivelamento próprio (questões abaixo).
  // -------------------------------------------------------------------------
  {
    id: "dev-front-end",
    areaId: "tecnologia-dados",
    nome: "Desenvolvedor(a) Front-end",
    resumo: "Constrói a parte visível dos produtos digitais: transforma design em interface rápida, acessível e que funciona em qualquer tela.",
    demo: true,
    rotina: [
      "Implementar interfaces a partir do design, componente por componente",
      "Revisar código do time e ter o próprio código revisado",
      "Investigar e corrigir problemas reportados por usuários",
      "Acompanhar performance e acessibilidade do que está no ar",
    ],
    responsabilidades: [
      "Escrever HTML, CSS e JavaScript que outras pessoas conseguem manter",
      "Garantir que a interface funciona no celular e no leitor de tela",
      "Colaborar com design e backend na entrega de ponta a ponta",
    ],
    entregas: ["Componentes de interface testados", "Páginas responsivas e acessíveis", "Correções com causa raiz documentada"],
    oportunidades: "Uma das portas de entrada mais contratadas da tecnologia, com remoto comum.",
    esforco: "8 a 12 meses de dedicação parcial até o nível de execução.",
    tipoTrabalho: "Remoto",
    niveis: cincoNiveis(["Iniciante", "Fundamentos", "Execução e entrega", "Arquitetura de front", "Referência técnica"]),
    competencias: [
      { id: "fe-web", nivel: 1, nome: "Como a web funciona", obrigatoria: true, criterio: "Explicar o caminho de uma página do servidor até a tela", esforco: "6 h", habilidades: [ { id: "hab-http", nome: "Navegador, HTTP e DOM" } ] },
      { id: "fe-html-css", nivel: 2, nome: "HTML e CSS", obrigatoria: true, criterio: "Montar uma página responsiva e acessível sem framework", esforco: "20 h", habilidades: [ { id: "hab-html", nome: "HTML semântico" }, { id: "hab-css", nome: "CSS e layout responsivo" } ] },
      { id: "fe-js", nivel: 2, nome: "JavaScript", obrigatoria: true, criterio: "Resolver interação de interface com JavaScript puro", esforco: "24 h", habilidades: [ { id: "hab-js", nome: "Lógica e eventos" } ] },
      { id: "fe-react", nivel: 3, nome: "Componentes e estado", obrigatoria: true, criterio: "Construir uma tela completa com componentes e estado", esforco: "24 h", habilidades: [ { id: "hab-react", nome: "React e componentização" } ] },
      { id: "fe-qualidade", nivel: 4, nome: "Qualidade e performance", obrigatoria: true, criterio: "Diagnosticar e corrigir um problema de performance real", esforco: "16 h", habilidades: [ { id: "hab-perf", nome: "Performance e testes" } ] },
      { id: "fe-lideranca", nivel: 5, nome: "Referência técnica", obrigatoria: true, criterio: "Evidências de revisão de código e decisões de arquitetura", esforco: "contínuo", habilidades: [ { id: "hab-arq", nome: "Arquitetura de front-end" } ] },
    ],
  },
  {
    id: "social-media",
    areaId: "criativo-design",
    nome: "Social Media",
    resumo: "Faz marcas conversarem com gente de verdade nas redes: planeja o conteúdo, produz, publica e aprende com o resultado.",
    demo: true,
    rotina: [
      "Planejar a pauta da semana a partir dos objetivos da marca",
      "Produzir e agendar posts, stories e vídeos curtos",
      "Responder a comunidade e escalar o que precisa de atenção",
      "Ler os números da semana e ajustar a rota",
    ],
    responsabilidades: [
      "Manter a voz da marca consistente em todos os canais",
      "Transformar objetivo de negócio em pauta de conteúdo",
      "Reportar resultado com métrica, não com achismo",
    ],
    entregas: ["Calendário editorial da semana", "Posts publicados com identidade consistente", "Relatório de desempenho com aprendizado"],
    oportunidades: "Todo negócio com presença digital precisa, de loja de bairro a marca nacional.",
    esforco: "4 a 6 meses de dedicação parcial até o nível de execução.",
    tipoTrabalho: "Remoto ou híbrido",
    niveis: cincoNiveis(["Iniciante", "Fundamentos", "Execução e entrega", "Estratégia de canal", "Liderança de conteúdo"]),
    competencias: [
      { id: "sm-redes", nivel: 1, nome: "Linguagem das redes", obrigatoria: true, criterio: "Explicar o que funciona em cada rede e por quê", esforco: "6 h", habilidades: [ { id: "hab-redes", nome: "Formatos e algoritmos" } ] },
      { id: "sm-pauta", nivel: 2, nome: "Planejamento de pauta", obrigatoria: true, criterio: "Montar um calendário editorial de duas semanas com objetivo por post", esforco: "10 h", habilidades: [ { id: "hab-pauta", nome: "Calendário editorial" } ] },
      { id: "sm-producao", nivel: 2, nome: "Produção de conteúdo", obrigatoria: true, criterio: "Produzir um conjunto de posts com identidade consistente", esforco: "16 h", habilidades: [ { id: "hab-producao", nome: "Copy e produção visual" } ] },
      { id: "sm-metricas", nivel: 3, nome: "Métricas de conteúdo", obrigatoria: true, criterio: "Ler um relatório de desempenho e propor 3 ajustes com base nele", esforco: "8 h", habilidades: [ { id: "hab-sm-metricas", nome: "Alcance, engajamento e conversão" } ] },
      { id: "sm-estrategia", nivel: 4, nome: "Estratégia de canal", obrigatoria: true, criterio: "Definir a estratégia de um canal com meta e orçamento", esforco: "14 h", habilidades: [ { id: "hab-sm-estrategia", nome: "Posicionamento e funil" } ] },
      { id: "sm-lideranca", nivel: 5, nome: "Liderança de conteúdo", obrigatoria: true, criterio: "Evidências de gestão de pauta com time e resultado", esforco: "contínuo", habilidades: [ { id: "hab-sm-lideranca", nome: "Gestão de time de conteúdo" } ] },
    ],
  },

  // -------------------------------------------------------------------------
  // Profissões exploráveis: ficha completa, nivelamento por autodeclaração
  // enquanto o banco de questões próprio não chega.
  // -------------------------------------------------------------------------
  ...([
    ["product-designer", "criativo-design", "Product Designer", "Une pesquisa, interface e visão de negócio pra desenhar o produto inteiro, não só as telas.", ["Descoberta", "Fundamentos", "Execução e entrega", "Estratégia de produto", "Liderança de produto"]],
    ["sdr-pre-vendas", "comercial", "SDR / Pré-vendas", "Abre as portas do comercial: encontra as empresas certas, faz o primeiro contato e agenda a conversa de venda.", ["Iniciante", "Prospecção", "Cadência e qualificação", "Especialista em pipeline", "Liderança de pré-vendas"]],
    ["customer-success", "comercial", "Customer Success", "Garante que o cliente alcance o resultado que comprou: acompanha, destrava e transforma uso em renovação.", ["Iniciante", "Fundamentos", "Carteira própria", "Contas estratégicas", "Liderança de CS"]],
    ["gestor-trafego", "marketing", "Gestor(a) de Tráfego", "Faz o anúncio certo chegar na pessoa certa pelo menor custo: campanhas, públicos, criativos e otimização diária.", ["Iniciante", "Fundamentos de mídia", "Operação de campanhas", "Estratégia de aquisição", "Liderança de mídia"]],
    ["copywriter", "marketing", "Copywriter", "Escreve o texto que faz alguém agir: página, anúncio, e-mail e roteiro, sempre com o resultado medido.", ["Iniciante", "Fundamentos", "Execução e entrega", "Estratégia de conversão", "Direção de copy"]],
    ["analista-dados", "tecnologia-dados", "Analista de Dados", "Transforma dado bruto em decisão: coleta, organiza, analisa e conta a história que o número esconde.", ["Iniciante", "Fundamentos", "Análises completas", "Modelagem e previsão", "Referência analítica"]],
    ["assistente-administrativo", "classicas", "Assistente Administrativo", "Mantém a operação da empresa girando: agenda, documentos, compras, apoio ao financeiro e às pessoas.", ["Iniciante", "Rotinas essenciais", "Operação com autonomia", "Processos e melhoria", "Coordenação administrativa"]],
    ["recrutador", "classicas", "Recrutador(a)", "Encontra e conduz as pessoas certas até a contratação: triagem, entrevistas e experiência do candidato.", ["Iniciante", "Fundamentos", "Vagas com autonomia", "Posições estratégicas", "Liderança de recrutamento"]],
    ["designer-instrucional", "comunicacao-educacao", "Designer Instrucional", "Transforma conhecimento em aprendizado que funciona: desenha cursos, trilhas e avaliações que provam domínio.", ["Iniciante", "Fundamentos", "Cursos completos", "Estratégia de aprendizagem", "Liderança educacional"]],
    ["produtor-podcast", "comunicacao-educacao", "Produtor(a) de Podcast", "Cuida do episódio inteiro: pauta, gravação, edição, distribuição e crescimento de audiência.", ["Iniciante", "Fundamentos", "Episódios completos", "Estratégia de audiência", "Direção de conteúdo"]],
  ] as Array<[string, string, string, string, [string, string, string, string, string]]>).map(
    ([id, areaId, nome, resumo, nomesNiveis]): Profissao => ({
      id,
      areaId,
      nome,
      resumo,
      demo: true,
      rotina: [
        "Planejar o dia a partir das prioridades da semana",
        "Executar as entregas principais da função",
        "Alinhar com o time e com quem depende do trabalho",
        "Registrar o que foi feito e o que ficou pra amanhã",
      ],
      responsabilidades: [
        "Entregar as rotinas da função com qualidade e prazo",
        "Comunicar avanço e bloqueio antes de virarem problema",
        "Melhorar o próprio processo a cada ciclo",
      ],
      entregas: ["As entregas típicas da função, documentadas", "Rotina da semana cumprida e registrada"],
      oportunidades: "Demanda constante no mercado brasileiro, com portas de entrada acessíveis.",
      esforco: "4 a 8 meses de dedicação parcial até o nível de execução.",
      tipoTrabalho: "Varia por empresa",
      niveis: cincoNiveis(nomesNiveis),
      competencias: [
        { id: `${id}-c1`, nivel: 1, nome: "Fundamentos da função", obrigatoria: true, criterio: "Explicar a rotina e as entregas com as próprias palavras", esforco: "6 h", habilidades: [{ id: `${id}-h1`, nome: "Vocabulário e rotina da profissão" }] },
        { id: `${id}-c2`, nivel: 2, nome: "Ferramentas essenciais", obrigatoria: true, criterio: "Operar as ferramentas básicas da função com revisão", esforco: "12 h", habilidades: [{ id: `${id}-h2`, nome: "Ferramentas do dia a dia" }] },
        { id: `${id}-c3`, nivel: 3, nome: "Entrega completa", obrigatoria: true, criterio: "Concluir uma entrega típica aprovada por rubrica", esforco: "16 h", habilidades: [{ id: `${id}-h3`, nome: "Execução de ponta a ponta" }] },
        { id: `${id}-c4`, nivel: 4, nome: "Casos complexos", obrigatoria: true, criterio: "Conduzir um caso difícil com decisão documentada", esforco: "16 h", habilidades: [{ id: `${id}-h4`, nome: "Decisão e priorização" }] },
        { id: `${id}-c5`, nivel: 5, nome: "Referência do time", obrigatoria: true, criterio: "Evidências de liderança e formação de gente", esforco: "contínuo", habilidades: [{ id: `${id}-h5`, nome: "Liderança na função" }] },
      ],
    })
  ),
]

// --- questões do nivelamento ------------------------------------------------

/**
 * O banco de questões, por profissão. A "adaptação" da versão de demonstração
 * é honesta e simples: a autodeclaração decide em que dificuldade o teste
 * começa, e o painel lateral explica o que cada pergunta está medindo.
 */
export const QUESTOES: Record<string, Questao[]> = {
  "ux-ui-designer": [
    {
      id: "q-ux-1",
      habilidadeId: "hab-processo",
      formato: "multipla",
      dificuldade: "iniciante",
      enunciado: "Um cliente pede \"um app igual ao do concorrente, só que melhor\". Qual é o primeiro passo de UX?",
      opcoes: [
        "Copiar as telas do concorrente e melhorar o visual",
        "Entender que problema os usuários precisam resolver, antes de desenhar",
        "Escolher a paleta de cores e a tipografia do projeto",
        "Começar pelo protótipo de alta fidelidade pra ganhar tempo",
      ],
      certa: 1,
      porque: "Mede se você parte do problema ou da solução. É a diferença entre desenhar telas e fazer design.",
    },
    {
      id: "q-ux-2",
      habilidadeId: "hab-entrevista",
      formato: "cenario",
      dificuldade: "intermediaria",
      enunciado: "Qual é o primeiro passo?",
      cenario: "Você precisa entender as dores de um novo usuário do produto. O time te dá uma semana e acesso a cinco clientes.",
      opcoes: [
        "Enviar um formulário com 30 perguntas pra aproveitar o acesso",
        "Definir o que você precisa aprender e escrever um roteiro de entrevista curto",
        "Mostrar o protótipo novo e perguntar se eles gostaram",
        "Pedir pro time comercial resumir o que os clientes falam",
      ],
      certa: 1,
      porque: "Mede método de pesquisa: entrevista sem objetivo definido vira conversa que não decide nada.",
    },
    {
      id: "q-ux-3",
      habilidadeId: "hab-wireframe",
      formato: "multipla",
      dificuldade: "intermediaria",
      enunciado: "Pra que serve um wireframe de baixa fidelidade?",
      opcoes: [
        "Mostrar ao cliente como o produto final vai ficar",
        "Testar a estrutura e o fluxo antes de investir no visual",
        "Substituir a especificação de engenharia",
        "Documentar a identidade visual da marca",
      ],
      certa: 1,
      porque: "Mede se você entende fidelidade como ferramenta: baixa pra decidir estrutura, alta pra decidir acabamento.",
    },
    {
      id: "q-ux-4",
      habilidadeId: "hab-conducao",
      formato: "multipla",
      dificuldade: "avancada",
      enunciado: "Num teste de usabilidade, a pessoa trava numa etapa e pergunta \"o que eu faço agora?\". A melhor resposta é:",
      opcoes: [
        "Explicar o caminho certo pra ela não se frustrar",
        "Responder com outra pergunta: \"o que você faria se eu não estivesse aqui?\"",
        "Encerrar a sessão, porque o teste já falhou",
        "Anotar como erro do usuário e seguir pro próximo passo",
      ],
      certa: 1,
      porque: "Mede condução de teste: ajudar contamina o dado; devolver a pergunta preserva o que você veio observar.",
    },
    {
      id: "q-ux-5",
      habilidadeId: "hab-sintese",
      formato: "curta",
      dificuldade: "intermediaria",
      enunciado: "Você entrevistou 5 pessoas e saiu com 40 anotações soltas. Descreva, em 2 ou 3 frases, como transforma isso em achados que o time consiga usar.",
      porque: "Mede síntese: a diferença entre coletar opinião e produzir conhecimento acionável. A resposta é avaliada depois, junto com uma revisão.",
    },
  ],
  "dev-front-end": [
    { id: "q-fe-1", habilidadeId: "hab-http", formato: "multipla", dificuldade: "iniciante", enunciado: "O que acontece quando você digita um endereço e aperta Enter?", opcoes: ["O navegador procura o site no seu computador", "O navegador pede a página a um servidor e desenha a resposta", "O site inteiro já está dentro do navegador", "O provedor de internet monta a página"], certa: 1, porque: "Mede o modelo mental básico da web: pedido, resposta e renderização." },
    { id: "q-fe-2", habilidadeId: "hab-html", formato: "multipla", dificuldade: "intermediaria", enunciado: "Por que usar <button> em vez de uma <div> com clique?", opcoes: ["Porque é mais bonito", "Porque o botão nativo já funciona com teclado e leitor de tela", "Porque div não aceita JavaScript", "Não há diferença prática"], certa: 1, porque: "Mede semântica e acessibilidade: o custo invisível de reinventar o elemento nativo." },
    { id: "q-fe-3", habilidadeId: "hab-css", formato: "cenario", dificuldade: "intermediaria", enunciado: "Qual é a melhor abordagem?", cenario: "Uma lista de cartões precisa virar uma coluna no celular e três colunas no desktop.", opcoes: ["Duas páginas separadas, uma pra cada tela", "Grid com auto-fit e largura mínima por cartão", "Tabela HTML com colunas fixas", "JavaScript que detecta o aparelho e injeta o layout"], certa: 1, porque: "Mede layout responsivo: resolver com CSS declarativo antes de apelar pra script." },
    { id: "q-fe-4", habilidadeId: "hab-js", formato: "multipla", dificuldade: "avancada", enunciado: "Um clique num item da lista precisa atualizar um contador. Onde registrar o evento numa lista de 500 itens?", opcoes: ["Um listener em cada item", "Um listener no contêiner, lendo o alvo do evento", "Um setInterval que confere os cliques", "Um listener no document pra cada item"], certa: 1, porque: "Mede delegação de eventos: a diferença entre uma página leve e 500 listeners." },
    { id: "q-fe-5", habilidadeId: "hab-react", formato: "curta", dificuldade: "avancada", enunciado: "Explique em 2 ou 3 frases quando um estado deve subir de um componente pro pai dele.", porque: "Mede raciocínio de arquitetura de componentes. Avaliada depois, com revisão." },
  ],
  "social-media": [
    { id: "q-sm-1", habilidadeId: "hab-redes", formato: "multipla", dificuldade: "iniciante", enunciado: "Uma marca precisa escolher onde investir o conteúdo. O critério certo é:", opcoes: ["A rede que está na moda no momento", "A rede onde o público-alvo da marca realmente passa tempo", "A rede que a concorrência usa", "Todas ao mesmo tempo, sempre"], certa: 1, porque: "Mede o princípio básico do canal: seguir o público, não a moda." },
    { id: "q-sm-2", habilidadeId: "hab-pauta", formato: "multipla", dificuldade: "intermediaria", enunciado: "O que uma pauta de conteúdo precisa ter, além do tema do post?", opcoes: ["Só a data de publicação", "O objetivo do post e como medir se funcionou", "A hashtag do momento", "O nome de quem vai postar"], certa: 1, porque: "Mede planejamento: post sem objetivo é ruído com data marcada." },
    { id: "q-sm-3", habilidadeId: "hab-producao", formato: "cenario", dificuldade: "intermediaria", enunciado: "O que você faz?", cenario: "Um post planejado pra hoje ficou pronto, mas uma notícia quente do setor acabou de sair.", opcoes: ["Publica o planejado, porque pauta é pauta", "Avalia se a marca tem algo legítimo a dizer e, se tiver, adapta a pauta", "Comenta a notícia de qualquer jeito pra surfar o assunto", "Espera uma semana pra ver se o assunto continua"], certa: 1, porque: "Mede critério editorial: oportunidade sem legitimidade queima a marca." },
    { id: "q-sm-4", habilidadeId: "hab-sm-metricas", formato: "multipla", dificuldade: "avancada", enunciado: "Um post teve alcance alto e conversão baixa. A leitura mais útil é:", opcoes: ["O post foi um sucesso, alcance é o que importa", "O gancho funcionou, mas a oferta ou o público estavam errados", "A rede social está com problema", "Conversão não é assunto de social media"], certa: 1, porque: "Mede leitura de funil: separar o que o número diz do que a vaidade quer ouvir." },
    { id: "q-sm-5", habilidadeId: "hab-sm-metricas", formato: "curta", dificuldade: "intermediaria", enunciado: "Descreva em 2 ou 3 frases como você montaria o relatório mensal de um perfil que quer gerar vendas.", porque: "Mede a ponte entre conteúdo e negócio. Avaliada depois, com revisão." },
  ],
}

// --- módulos de aprendizado (UX, a trilha completa) --------------------------

export const MODULOS: Modulo[] = [
  {
    id: "mod-pesquisa",
    competenciaId: "ux-pesquisa",
    nome: "Pesquisa com usuários",
    objetivo: "Sair capaz de conduzir uma entrevista do começo ao fim e transformar as anotações em achados que o time usa.",
    conteudos: [
      { id: "vid-pesquisa-1", titulo: "Por que pesquisar antes de desenhar", duracaoMin: 6, objetivo: "Entender o custo de desenhar no escuro e o papel da pesquisa no processo.", resultadoEsperado: "Você consegue explicar pro time por que a pesquisa vem antes do protótipo.", transcricao: "Todo produto nasce de uma aposta: alguém acredita que sabe o que o usuário precisa. A pesquisa existe pra transformar essa aposta em conhecimento antes que ela vire código caro. Nesta aula, o caso de um formulário refeito três vezes porque ninguém perguntou ao usuário o que travava..." },
      { id: "vid-pesquisa-2", titulo: "O roteiro de entrevista que funciona", duracaoMin: 8, objetivo: "Montar um roteiro curto que começa no objetivo, não nas perguntas.", resultadoEsperado: "Você tem um roteiro de 6 a 8 perguntas abertas pronto pra usar.", transcricao: "Roteiro bom começa com o que você precisa aprender, não com o que quer perguntar. Perguntas abertas, sobre comportamento passado, sem induzir a resposta. Nunca pergunte \"você usaria?\": pergunte \"como você fez da última vez?\"..." },
      { id: "vid-pesquisa-3", titulo: "Conduzindo sem contaminar", duracaoMin: 7, objetivo: "Aprender a ouvir mais do que falar e a explorar o inesperado.", resultadoEsperado: "Você sabe usar silêncio, follow-up e a técnica dos cinco porquês.", transcricao: "A entrevista descarrilha quando quem pergunta explica demais, completa frases ou defende o produto. O silêncio de três segundos depois de uma resposta é a ferramenta mais barata da pesquisa: a pessoa quase sempre continua e é aí que sai o que importa..." },
      { id: "vid-pesquisa-4", titulo: "Da anotação ao achado", duracaoMin: 9, objetivo: "Sintetizar entrevistas em achados priorizados por evidência.", resultadoEsperado: "Você transforma anotações soltas em 3 a 5 achados com trecho de fala e implicação.", transcricao: "Quarenta anotações não são um resultado, são matéria-prima. A síntese agrupa por padrão, separa fato de opinião e escreve cada achado com três partes: o que vimos, a evidência e o que isso muda no produto..." },
    ],
    tarefas: [
      { id: "tar-roteiro", titulo: "Escreva o seu roteiro de entrevista", oQueFazer: "Escolha um produto que você usa e escreva um roteiro com objetivo declarado e 6 perguntas abertas sobre comportamento.", oQueEntregar: "O roteiro em texto, com o objetivo no topo.", comoSaberQueFicouBom: "Nenhuma pergunta pode ser respondida com sim ou não, e nenhuma menciona a sua solução." },
      { id: "tar-entrevista", titulo: "Conduza uma entrevista de verdade", oQueFazer: "Entreviste uma pessoa por 20 minutos usando o seu roteiro. Grave ou anote sem interpretar durante a conversa.", oQueEntregar: "As anotações cruas da sessão.", comoSaberQueFicouBom: "Você falou menos de um terço do tempo e tem pelo menos uma resposta que te surpreendeu." },
      { id: "tar-sintese", titulo: "Sintetize em achados", oQueFazer: "Transforme as anotações em 3 achados no formato: o que vimos, evidência, implicação.", oQueEntregar: "Os 3 achados escritos.", comoSaberQueFicouBom: "Cada achado tem um trecho de fala real como evidência e aponta uma decisão possível." },
    ],
    avaliacao: [
      { enunciado: "Qual é a melhor forma de recrutar participantes pra uma pesquisa?", opcoes: ["Apenas amigos e família, pela facilidade", "Uma amostra representativa de quem realmente usa ou usaria o produto", "Qualquer pessoa disponível no momento"], certa: 1, revisar: "Reveja \"O roteiro de entrevista que funciona\": recrutamento e critérios." },
      { enunciado: "Durante a entrevista, a pessoa dá uma resposta vaga. O melhor movimento é:", opcoes: ["Passar pra próxima pergunta do roteiro", "Silêncio ou um \"me conta mais\" pra ela aprofundar", "Sugerir uma resposta pra ajudar"], certa: 1, revisar: "Reveja \"Conduzindo sem contaminar\": silêncio e follow-up." },
      { enunciado: "Um achado de pesquisa bem escrito contém:", opcoes: ["A opinião de quem pesquisou sobre o produto", "O padrão observado, a evidência e a implicação pro produto", "A lista completa de tudo que foi dito"], certa: 1, revisar: "Reveja \"Da anotação ao achado\": as três partes do achado." },
      { enunciado: "\"Você usaria essa funcionalidade?\" é uma pergunta ruim porque:", opcoes: ["É longa demais", "Pede previsão e opinião, não comportamento real", "Só funciona presencialmente"], certa: 1, revisar: "Reveja \"O roteiro de entrevista que funciona\": comportamento passado." },
    ],
    avaliacaoVariacao: [
      { enunciado: "Cinco entrevistas bem conduzidas valem mais que um formulário com 200 respostas quando o objetivo é:", opcoes: ["Medir a satisfação média da base", "Entender o porquê de um comportamento", "Provar uma tese pra diretoria"], certa: 1, revisar: "Reveja \"Por que pesquisar antes de desenhar\": qualitativo e quantitativo." },
      { enunciado: "O maior risco de entrevistar só amigos é:", opcoes: ["Eles não terem tempo", "Viés: eles não representam quem usa e tendem a agradar", "O custo alto"], certa: 1, revisar: "Reveja \"O roteiro de entrevista que funciona\": recrutamento e critérios." },
      { enunciado: "Anotar interpretando (\"ela achou confuso\") em vez de registrar o dito é ruim porque:", opcoes: ["Gasta mais papel", "Mistura fato com opinião e contamina a síntese", "Não é ruim, acelera o trabalho"], certa: 1, revisar: "Reveja \"Da anotação ao achado\": separar fato de opinião." },
      { enunciado: "O objetivo declarado no topo do roteiro serve pra:", opcoes: ["Impressionar o entrevistado", "Decidir o que entra e o que sai do roteiro", "Cumprir formalidade do processo"], certa: 1, revisar: "Reveja \"O roteiro de entrevista que funciona\": começar do objetivo." },
    ],
  },
  {
    id: "mod-prototipo",
    competenciaId: "ux-prototipo",
    nome: "Prototipação no Figma",
    objetivo: "Transformar um fluxo desenhado em protótipo navegável, com componentes que aguentam mudança.",
    conteudos: [
      { id: "vid-proto-1", titulo: "Do fluxo ao primeiro frame", duracaoMin: 7, objetivo: "Estruturar o arquivo antes de desenhar a primeira tela.", resultadoEsperado: "Você organiza páginas, frames e nomes de um jeito que o time entende.", transcricao: "Arquivo de Figma bagunçado cobra juros. Antes da primeira tela: uma página por fluxo, frames nomeados pelo passo, e o fluxo desenhado em texto do lado..." },
      { id: "vid-proto-2", titulo: "Componentes e variantes", duracaoMin: 10, objetivo: "Criar componentes com variantes pra mudar uma vez e valer em todo lugar.", resultadoEsperado: "Você monta um botão com variantes de tipo, tamanho e estado.", transcricao: "O componente existe pra mudança custar uma edição, não quarenta. Variantes de tipo, tamanho e estado no mesmo conjunto, com nomes que descrevem intenção..." },
      { id: "vid-proto-3", titulo: "Conectando a navegação", duracaoMin: 6, objetivo: "Ligar as telas num protótipo que dá pra testar com gente.", resultadoEsperado: "Seu fluxo navega de ponta a ponta, com voltar funcionando.", transcricao: "Protótipo é pra ser usado, não assistido. Conecte o caminho feliz inteiro, inclua o voltar e defina o frame inicial..." },
    ],
    tarefas: [
      { id: "tar-componente", titulo: "Monte um componente com variantes", oQueFazer: "Crie um botão com variantes de tipo (primário e secundário), tamanho (médio e grande) e estado (normal e desabilitado).", oQueEntregar: "O link do arquivo Figma com o conjunto de variantes.", comoSaberQueFicouBom: "Trocar a variante numa tela não quebra o layout, e os nomes descrevem intenção." },
      { id: "tar-fluxo-navegavel", titulo: "Prototipe um fluxo completo", oQueFazer: "Escolha um fluxo de 4 a 6 telas e conecte tudo em protótipo navegável, com o voltar funcionando.", oQueEntregar: "O link do protótipo em modo de apresentação.", comoSaberQueFicouBom: "Uma pessoa que nunca viu o arquivo completa o fluxo sem você explicar nada." },
    ],
    avaliacao: [
      { enunciado: "Componentes existem principalmente pra:", opcoes: ["A tela ficar mais bonita", "Mudança custar uma edição em vez de quarenta", "O arquivo ficar mais pesado"], certa: 1, revisar: "Reveja \"Componentes e variantes\"." },
      { enunciado: "O que um protótipo precisa ter pra servir num teste de usabilidade?", opcoes: ["Todas as animações finais", "O caminho da tarefa navegável, incluindo o voltar", "Dados reais de produção"], certa: 1, revisar: "Reveja \"Conectando a navegação\"." },
      { enunciado: "Nomear frames pelo passo do fluxo serve pra:", opcoes: ["Estética do arquivo", "Qualquer pessoa do time achar e entender o fluxo", "Nada, nome não importa"], certa: 1, revisar: "Reveja \"Do fluxo ao primeiro frame\"." },
    ],
    avaliacaoVariacao: [
      { enunciado: "Quando vale criar uma variante nova em vez de um componente novo?", opcoes: ["Sempre que a cor muda", "Quando é o mesmo elemento em outro estado ou tamanho", "Nunca, variantes são frágeis"], certa: 1, revisar: "Reveja \"Componentes e variantes\"." },
      { enunciado: "O frame inicial do protótipo deve ser:", opcoes: ["A tela mais bonita", "O ponto onde a tarefa do teste começa", "Qualquer um, tanto faz"], certa: 1, revisar: "Reveja \"Conectando a navegação\"." },
      { enunciado: "Uma página por fluxo no arquivo serve pra:", opcoes: ["Limitar o número de telas", "Separar contextos e facilitar a navegação do time", "Deixar o arquivo mais leve"], certa: 1, revisar: "Reveja \"Do fluxo ao primeiro frame\"." },
    ],
  },
  {
    id: "mod-teste",
    competenciaId: "ux-teste",
    nome: "Testes de usabilidade",
    objetivo: "Planejar, conduzir e documentar um teste com 5 pessoas, saindo com decisões e não só com vídeos.",
    conteudos: [
      { id: "vid-teste-1", titulo: "O plano de teste em uma página", duracaoMin: 8, objetivo: "Definir tarefa, critério de sucesso e o que observar antes de chamar alguém.", resultadoEsperado: "Você escreve um plano com tarefas reais e critérios observáveis.", transcricao: "Teste sem plano vira demonstração. Uma página basta: objetivo, cinco tarefas escritas como situação (não como instrução de clique) e o que conta como sucesso em cada uma..." },
      { id: "vid-teste-2", titulo: "Conduzindo a sessão", duracaoMin: 9, objetivo: "Observar sem ajudar e registrar o que importa.", resultadoEsperado: "Você conduz uma sessão de 30 minutos sem contaminar o resultado.", transcricao: "A pessoa travou? Ótimo: é isso que você veio ver. Devolva a pergunta, anote o ponto exato e deixe a tarefa seguir. Pense alto, mas só no começo, pra dar o tom..." },
      { id: "vid-teste-3", titulo: "Do vídeo à decisão", duracaoMin: 7, objetivo: "Transformar sessões em problemas priorizados por gravidade e frequência.", resultadoEsperado: "Você entrega uma lista priorizada com evidência e recomendação.", transcricao: "Cinco sessões geram horas de material e a tentação de mostrar tudo. O relatório útil tem uma tabela: problema, quantas pessoas travaram, gravidade e a recomendação..." },
    ],
    tarefas: [
      { id: "tar-plano", titulo: "Escreva um plano de teste", oQueFazer: "Monte o plano de uma página pra testar um fluxo que você prototipou: objetivo, 4 tarefas em formato de situação e critério de sucesso por tarefa.", oQueEntregar: "O plano em texto.", comoSaberQueFicouBom: "Nenhuma tarefa diz onde clicar, e todo critério é observável sem perguntar." },
      { id: "tar-piloto", titulo: "Rode uma sessão piloto", oQueFazer: "Teste o plano com uma pessoa antes das sessões oficiais e ajuste o que travar.", oQueEntregar: "As anotações do piloto e o que você mudou no plano.", comoSaberQueFicouBom: "Você identificou pelo menos um ajuste no roteiro, e ele está justificado." },
    ],
    avaliacao: [
      { enunciado: "Uma tarefa de teste bem escrita:", opcoes: ["Diz exatamente onde a pessoa deve clicar", "Descreve uma situação e deixa a pessoa achar o caminho", "Pergunta se a pessoa gostou da tela"], certa: 1, revisar: "Reveja \"O plano de teste em uma página\"." },
      { enunciado: "Com quantas pessoas um teste de usabilidade já revela a maioria dos problemas graves?", opcoes: ["Cerca de 5", "No mínimo 30", "Pelo menos 100"], certa: 0, revisar: "Reveja \"O plano de teste em uma página\": tamanho da amostra." },
      { enunciado: "A pessoa completou a tarefa por um caminho inesperado. Isso é:", opcoes: ["Erro do usuário", "Dado valioso sobre o modelo mental dela", "Motivo pra invalidar a sessão"], certa: 1, revisar: "Reveja \"Conduzindo a sessão\"." },
    ],
    avaliacaoVariacao: [
      { enunciado: "Priorizar problemas por gravidade e frequência serve pra:", opcoes: ["Encher o relatório", "O time atacar primeiro o que mais machuca", "Justificar o custo do teste"], certa: 1, revisar: "Reveja \"Do vídeo à decisão\"." },
      { enunciado: "A sessão piloto existe pra:", opcoes: ["Treinar o participante", "Consertar o roteiro antes das sessões que valem", "Substituir as sessões oficiais"], certa: 1, revisar: "Reveja \"Conduzindo a sessão\": o piloto." },
      { enunciado: "O critério de sucesso de uma tarefa precisa ser:", opcoes: ["A opinião do designer", "Observável, sem depender de perguntar", "Sempre tempo em segundos"], certa: 1, revisar: "Reveja \"O plano de teste em uma página\"." },
    ],
  },
]

// --- desafios práticos (UX) --------------------------------------------------

export const DESAFIOS: Desafio[] = [
  {
    id: "des-cadastro",
    competenciaId: "ux-teste",
    nome: "Melhorar a experiência de cadastro de um app",
    cenario: "Um app de finanças pessoais perde 6 de cada 10 pessoas na tela de cadastro. O time suspeita do formulário, mas ninguém testou. Você tem acesso ao fluxo atual e a 5 usuários.",
    objetivo: "Diagnosticar por que o cadastro perde gente e propor uma versão melhorada, com evidência por trás de cada mudança.",
    restricoes: [
      "O cadastro precisa continuar pedindo e-mail e senha, por exigência de segurança",
      "A solução tem que caber num sprint de desenvolvimento",
      "Sem biblioteca nova: use os componentes que o produto já tem",
    ],
    entrega: "Um case curto com: o problema encontrado, a evidência (teste ou análise), a proposta redesenhada e o resultado esperado com métrica.",
    rubrica: [
      { criterio: "Problema", descricao: "O problema é específico e sustentado por evidência, não por opinião" },
      { criterio: "Pesquisa", descricao: "O método de investigação é adequado e está descrito" },
      { criterio: "Solução", descricao: "A proposta ataca o problema encontrado, com o porquê de cada mudança" },
      { criterio: "Protótipo", descricao: "O fluxo novo é navegável e testável" },
      { criterio: "Testes", descricao: "A proposta foi validada com usuários antes de ser declarada pronta" },
      { criterio: "Resultados", descricao: "Há uma métrica clara pra saber se funcionou" },
    ],
    etapas: [
      "Analise o fluxo atual e levante hipóteses",
      "Teste o fluxo atual com 5 usuários",
      "Redesenhe atacando os problemas encontrados",
      "Valide a proposta e escreva o case",
    ],
    videoTitulo: "Como atacar este desafio",
    videoDuracaoMin: 6,
  },
  {
    id: "des-onboarding",
    competenciaId: "ux-pesquisa",
    nome: "Descobrir por que os usuários abandonam o onboarding",
    cenario: "Um app de estudos tem instalação alta e uso baixo: metade das pessoas abre uma vez e nunca volta. O time quer saber o porquê antes de mudar qualquer tela.",
    objetivo: "Planejar e conduzir uma investigação curta que explique o abandono, e transformar o resultado em recomendações priorizadas.",
    restricoes: [
      "Duas semanas de prazo e nenhum orçamento pra recrutar",
      "Sem mudar o produto durante a investigação",
    ],
    entrega: "Relatório de uma página: método, achados com evidência e 3 recomendações priorizadas.",
    rubrica: [
      { criterio: "Método", descricao: "A escolha de método é justificada pelo que se quer aprender" },
      { criterio: "Condução", descricao: "As sessões seguem boas práticas e estão documentadas" },
      { criterio: "Síntese", descricao: "Os achados separam fato de opinião e têm evidência" },
      { criterio: "Recomendações", descricao: "As recomendações são acionáveis e priorizadas" },
    ],
    etapas: [
      "Defina o que precisa aprender e escolha o método",
      "Recrute e conduza as sessões",
      "Sintetize e priorize as recomendações",
    ],
    videoTitulo: "Como atacar este desafio",
    videoDuracaoMin: 5,
  },
]

// --- ranking (mock da comunidade) --------------------------------------------

/**
 * A comunidade de demonstração do ranking. Nomes inventados, e a linha da
 * própria pessoa entra por cima destes conforme a pontuação dela.
 */
export const COMUNIDADE_RANKING = [
  { nome: "Carla M.", score: 2840, sequenciaDias: 21, horasMes: 34, casesAprovados: 3 },
  { nome: "Diego F.", score: 2610, sequenciaDias: 14, horasMes: 29, casesAprovados: 3 },
  { nome: "Renata L.", score: 2390, sequenciaDias: 18, horasMes: 26, casesAprovados: 2 },
  { nome: "Tiago R.", score: 2120, sequenciaDias: 9, horasMes: 31, casesAprovados: 2 },
  { nome: "Bruna S.", score: 1980, sequenciaDias: 12, horasMes: 22, casesAprovados: 2 },
  { nome: "Felipe A.", score: 1760, sequenciaDias: 7, horasMes: 19, casesAprovados: 1 },
  { nome: "Marina C.", score: 1540, sequenciaDias: 11, horasMes: 15, casesAprovados: 1 },
  { nome: "Otávio N.", score: 1310, sequenciaDias: 4, horasMes: 17, casesAprovados: 1 },
]

// --- acesso ------------------------------------------------------------------

export function acharArea(id: string | null | undefined) {
  return AREAS.find((area) => area.id === id) ?? null
}

export function acharProfissao(id: string | null | undefined) {
  return PROFISSOES.find((profissao) => profissao.id === id) ?? null
}

export function profissoesDaArea(areaId: string) {
  return PROFISSOES.filter((profissao) => profissao.areaId === areaId)
}

export function questoesDaProfissao(profissaoId: string): Questao[] {
  return QUESTOES[profissaoId] ?? []
}

export function modulosDaProfissao(profissaoId: string): Modulo[] {
  // Os módulos completos existem pra profissão do teste ponta a ponta. As
  // outras caem no estado honesto de "conteúdo em preparação" na tela.
  return profissaoId === "ux-ui-designer" ? MODULOS : []
}

export function desafiosDaProfissao(profissaoId: string): Desafio[] {
  return profissaoId === "ux-ui-designer" ? DESAFIOS : []
}

/** Todas as habilidades de uma profissão, na ordem dos níveis. */
export function habilidadesDaProfissao(profissaoId: string) {
  const profissao = acharProfissao(profissaoId)
  if (!profissao) return []
  return profissao.competencias.flatMap((competencia) =>
    competencia.habilidades.map((habilidade) => ({ ...habilidade, competenciaId: competencia.id, nivel: competencia.nivel }))
  )
}
