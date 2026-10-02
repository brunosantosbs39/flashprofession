# Sobre este arquivo

Este projeto **já é o app do Rumo**, a plataforma de preparação de carreira. Não é um esqueleto genérico
esperando personalização, e não é material de aula.

O roteiro de personalização que morava aqui **já foi aplicado**: o modelo de
dados, as telas, a copy, o design system, o site da raiz, a tela de entrar e a
página `/como-usar` são todos deste produto. Não existe mais "entidade genérica"
para renomear nem "rótulo de exemplo" para trocar.

Quem for mexer aqui, pessoa ou assistente, trata este código como produto:

- As regras da casa estão em `AGENTS.md`. Leia antes de escrever qualquer coisa.
- As decisões de desenho, e o motivo de cada uma, estão em `DECISOES.md`.
- O que já funciona e o que ainda falta ligar está em `PROXIMOS-PASSOS.md` e,
  navegável, na página `/como-usar`.
- O que dá pra refinar neste app, com métrica e meta, está na tela
  `/app/desafio`.

Uma coisa continua valendo do roteiro antigo, e é a mais importante: **toda a
copy mora em `src/content/site.ts` e todo o visual sai do `design-system.json`**.
Mudar o tom de voz do produto inteiro é editar um arquivo. Mudar a cara dele é
editar o outro.
