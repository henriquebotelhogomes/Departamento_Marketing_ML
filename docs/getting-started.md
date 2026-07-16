# Getting Started

## Requisitos

- Node.js 20+
- Python 3.11+

## Passos

```bash
npm install
python -m analysis.scripts.run_clustering
python -m analysis.scripts.generate_segments
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Acesso demo

- `demo123` / `demo123`
