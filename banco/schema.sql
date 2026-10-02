-- =============================================================================
-- O QUE O APP CRIA SOZINHO NO NEON
-- =============================================================================
--
-- Você NÃO precisa rodar este arquivo. Na primeira vez que o app fala com o
-- banco, ele executa exatamente isto (veja `preparar()` em src/lib/banco.ts).
-- O arquivo existe pra você poder LER o desenho sem caçar dentro do código, e
-- pra rodar na mão se um dia quiser recriar o banco do zero.
--
-- Como rodar na mão, se quiser: abra o SQL Editor no painel do Neon
-- (https://console.neon.tech), cole tudo e execute.
-- =============================================================================

-- Quem usa o app. Uma linha por pessoa, criada na volta do login com Google.
-- O id é o e-mail em minúsculas: é o que o Google garante que é dela.
CREATE TABLE IF NOT EXISTS usuarios (
  id             text        PRIMARY KEY,  -- e-mail em minúsculas
  email          text        NOT NULL,     -- como veio do Google
  nome           text        NOT NULL,
  criado_em      timestamptz NOT NULL DEFAULT now(),
  ultimo_acesso  timestamptz NOT NULL DEFAULT now()
);

-- Tudo que cada pessoa produz. CADA LINHA TEM DONO: a chave primária começa
-- pelo usuário, e a rota /api/dados só lê e grava com o dono da sessão
-- assinada. Apagar a pessoa apaga o que é dela (ON DELETE CASCADE).
CREATE TABLE IF NOT EXISTS registros (
  usuario    text        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  colecao    text        NOT NULL,   -- 'jornadas', 'evidencias', 'sessoes'
  id         text        NOT NULL,   -- o mesmo id que o app já usa (jor-a1b2c3)
  dados      jsonb       NOT NULL,   -- o registro inteiro, do jeito que a tela lê
  criado_em  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (usuario, colecao, id)
);

CREATE INDEX IF NOT EXISTS registros_usuario_colecao_criado_em
  ON registros (usuario, colecao, criado_em DESC);


-- =============================================================================
-- O PRÓXIMO DESENHO, QUANDO VOCÊ QUISER IR ALÉM
-- =============================================================================
--
-- Uma tabela com jsonb aguenta o app inteiro e sobrevive a você trocar os
-- campos de ideia. O que ela não te dá é o banco conferindo as suas regras:
-- hoje nada impede uma evidência apontar pra uma jornada que não existe, e
-- "quantas horas por semana cada pessoa estudou" vira uma consulta feia.
--
-- Quando fizer sentido trocar, o desenho é este. Repare no que ele ganha: o
-- REFERENCES não deixa evidência órfã existir, o ON DELETE CASCADE apaga as
-- filhas sozinho, e cada campo ganha tipo de verdade.
--
-- CREATE TABLE jornadas (
--   id           text PRIMARY KEY,
--   usuario      text NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
--   profissao_id text,
--   etapa        text NOT NULL DEFAULT 'novo',
--   resultado    jsonb,               -- nível, confiança, domínio por competência
--   publico      jsonb,               -- opt-in de ranking e visibilidade
--   criado_em    timestamptz NOT NULL DEFAULT now()
-- );
--
-- CREATE TABLE evidencias (
--   id          text PRIMARY KEY,
--   jornada_id  text REFERENCES jornadas(id) ON DELETE CASCADE,
--   desafio_id  text,
--   origem      text NOT NULL,        -- autodeclaração, teste, tarefa, revisão humana
--   estado      text NOT NULL DEFAULT 'rascunho',
--   artefato    jsonb,
--   criado_em   timestamptz NOT NULL DEFAULT now()
-- );
--
-- CREATE TABLE sessoes (
--   id         text PRIMARY KEY,
--   jornada_id text REFERENCES jornadas(id) ON DELETE CASCADE,
--   tipo       text NOT NULL,         -- video, avaliacao, pratica
--   minutos    integer NOT NULL,
--   data       date NOT NULL
-- );
