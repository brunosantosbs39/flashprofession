import { defineConfig } from "prisma/config"

/**
 * O Prisma aqui é só LEITURA do banco: `db pull` desenha o schema a partir do
 * que existe no Neon, e `studio` abre um cliente pra navegar nas linhas. O app
 * continua falando com o Postgres pelo driver do Neon em `src/lib/banco.ts`;
 * nenhuma tela passa pelo Prisma.
 *
 * A DATABASE_URL vem do `.env.local` (carregado pelo `--env-file` dos scripts
 * em package.json), a mesma que o app usa.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
})
