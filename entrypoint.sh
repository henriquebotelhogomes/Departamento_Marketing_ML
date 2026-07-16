#!/bin/sh
set -e

# Garante que o diretório do banco SQLite existe
DB_DIR="data"
if [ ! -d "$DB_DIR" ]; then
  mkdir -p "$DB_DIR"
fi

echo "→ Gerando Prisma Client..."
npx prisma generate

echo "→ Aplicando migrations..."
npx prisma migrate deploy

echo "→ Populando banco de dados..."
tsx prisma/seed.ts

echo "→ Iniciando Next.js..."
exec node_modules/.bin/next start
