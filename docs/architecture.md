# Arquitetura

## Camadas

- `analysis/`: treino, avaliação e scoring do modelo.
- `prisma/`: schema, migrações e seed de dados.
- `src/app/`: páginas e APIs Next.js App Router.
- `src/lib/`: auth, prisma, validações e utilitários.

## Fluxo de dados

1. CSV base + scripts ML geram `segments.csv` e `segment_profiles.json`.
2. Seed Prisma integra CSV base, segmentos e métricas no SQLite.
3. APIs leem SQLite e abastecem dashboard e páginas.
