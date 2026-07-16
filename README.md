# CardSense

CardSense é uma plataforma de Marketing Analytics para segmentação inteligente de clientes de cartão de crédito. O projeto combina ciência de dados, machine learning não supervisionado e engenharia full stack para descobrir segmentos comportamentais, explicar seus perfis e apoiar decisões de campanhas.

## Por Que Este Projeto Existe

Este projeto foi construído como peça central de portfólio para demonstrar competências de Cientista de Dados:

- Pipeline de ML ponta a ponta com dados reais, tratamento, redução de dimensionalidade, clusterização e avaliação.
- Interpretação de segmentos com variáveis dominantes e recomendações acionáveis de marketing.
- Produto full stack funcional com autenticação, dashboard, filtros, APIs, dataset explorável e documentação técnica.
- Boas práticas de qualidade: testes TypeScript/Python, lint, type checking, documentação MkDocs e reprodutibilidade.

## Principais Funcionalidades

- Dashboard executivo com KPIs, filtros globais e 11 gráficos interativos.
- Segmentação comportamental com Autoencoder + K-Means (`k=4`).
- Painel de qualidade do modelo com Silhouette, Davies-Bouldin, Calinski-Harabasz e inércia.
- Página de insights executivos calculados a partir do banco.
- Lista de clientes com filtros, paginação e detalhe individual.
- Dataset completo com paginação, busca por CUST_ID e exportação CSV.
- Configuração de rótulos de segmentos e versão ativa do modelo.
- Login/cadastro com Auth.js, bcrypt e usuário demo.
- Tema claro/escuro e layout responsivo.

![Dashboard com KPIs e filtros globais](screenshots/dashboard-filtros.png)

*Dashboard executivo com indicadores, filtros por segmento e visão geral do modelo.*

![Página de Insights](screenshots/insights.png)

*Insights estratégicos calculados a partir dos dados de clientes e segmentos.*

## Stack

- Next.js 16, App Router, React 19, TypeScript e Tailwind CSS
- Prisma ORM + SQLite
- Auth.js/NextAuth com credenciais e bcrypt
- Python 3.12 para pipeline de ML
- scikit-learn, TensorFlow/Keras, pandas, numpy, matplotlib e seaborn
- Recharts para visualizações interativas
- Vitest, Testing Library, pytest, Ruff e Pyright
- MkDocs Material para documentação
- Swagger UI para documentação interativa das APIs

## Modelo De Segmentação

Dataset: Credit Card Dataset for Clustering, com 8.950 clientes e 18 variáveis comportamentais.

Pipeline resumido:

1. Carga do CSV original em `data/Marketing_data.csv`.
2. Limpeza e imputação de nulos por mediana.
3. Padronização das features.
4. Treinamento de Autoencoder para representação comprimida.
5. Clusterização com K-Means.
6. PCA 2D para visualização.
7. Avaliação com Silhouette, Davies-Bouldin, Calinski-Harabasz e curva do cotovelo.
8. Rotulagem de negócio e geração de recomendações.

Segmentos finais:

- Comprador Ativo
- Devedor Rotativo
- Usuário de Adiantamento
- Bom Pagador

Artefatos principais:

- `analysis/models/metrics_v1.json`
- `analysis/models/kmeans_v1.joblib`
- `analysis/models/scaler_v1.joblib`
- `analysis/models/pca_v1.joblib`
- `analysis/models/encoder_v1.keras`
- `data/segments.csv`
- `data/segment_profiles.json`
- `analysis/reports/elbow_curve.png`
- `analysis/reports/pca_scatter.png`
- `analysis/reports/segment_profiles.png`
- `analysis/reports/silhouette.png`

![Gráfico de distribuição por segmento](screenshots/graficos1.png)
![Gráficos de perfil de gasto e compras](screenshots/graficos2.png)
![Gráficos de análise de crédito e pagamento](screenshots/graficos3.png)
![Gráficos de correlação e frequência](screenshots/graficos4.png)

*Painel de 11 gráficos interativos: distribuição de segmentos, perfil de gastos, análise de crédito, correlação de variáveis e mais.*

## Como Executar

### 1. Instalar dependências JavaScript

```bash
npm install
```

### 2. Preparar ambiente Python

Use Python 3.12. Se estiver em Windows, ative sua virtualenv antes de rodar os comandos Python.

```bash
pip install -e .[dev]
```

### 3. Gerar artefatos de ML

```bash
npm run ml:train
npm run ml:segments
```

### 4. Criar banco e carregar dados

```bash
npx prisma migrate dev
npm run db:seed
```

### 5. Iniciar aplicação

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Credenciais Demo

- Login: `demo123`
- Senha: `demo123`

## Scripts Úteis

- `npm run dev`: inicia o app em desenvolvimento
- `npm run build`: gera build de produção
- `npm run typecheck`: valida TypeScript
- `npx eslint src --ext .ts,.tsx`: roda ESLint diretamente
- `npm run test`: roda testes TypeScript
- `npm run test:cov`: roda cobertura TypeScript
- `npm run db:seed`: importa CSV, segmentos, métricas e usuário demo
- `npm run db:relabel`: reaplica rótulos de segmento no banco
- `npm run ml:train`: executa pipeline de clusterização
- `npm run ml:segments`: gera artefatos de segmentos
- `npm run docs:serve`: serve documentação MkDocs localmente
- `npm run docs:build`: valida build da documentação
- Swagger UI: acesse `http://localhost:3000/api/docs` com o app rodando

## Validação De Qualidade

Antes de publicar ou demonstrar o projeto, rode:

```bash
npm run typecheck
npx eslint src --ext .ts,.tsx
npm run test
npm run test:cov
pytest analysis/tests -q
ruff check analysis
pyright analysis
npm run docs:build
npm run build
```

## Documentação

A documentação técnica está em `docs/` e cobre:

- Arquitetura do sistema
- Pipeline de ML
- Model card de segmentação
- Pipeline de dados
- APIs disponíveis
- Guia de execução

Para servir localmente:

```bash
npm run docs:serve
```

![Documentação técnica com MkDocs Material](screenshots/mkdocs1.png)

*Documentação técnica completa: arquitetura, pipeline de ML, modelo de segmentação e APIs.*

## APIs Principais

A documentação interativa completa está disponível em `http://localhost:3000/api/docs` (Swagger UI).

![Swagger UI — Documentação interativa das APIs](screenshots/swagger.png)

*Swagger UI com todas as rotas documentadas, schemas de request/response e botão "Try it out".*

- `POST /api/register`
- `GET /api/insights`
- `GET /api/segments`
- `GET /api/customers`
- `GET /api/customers/[id]`
- `GET /api/dataset`
- `GET /api/dataset/download`
- `GET/PATCH /api/settings`

## Decisões Técnicas Importantes

- O problema é não supervisionado; não há variável-alvo.
- `k=4` foi fixado para o MVP com apoio de elbow/silhouette e interpretabilidade de negócio.
- Outliers foram mantidos no MVP; a padronização reduz impacto e a decisão está documentada no model card.
- A ferramenta é apoio à decisão de marketing, não decisão automática sobre clientes.
- Dados são estáticos e anonimizados para fins de portfólio.

## Privacidade E Limitações

- O dataset é público/anonimizado e usado apenas para demonstração.
- Os segmentos são aproximações estatísticas e devem ser interpretados com contexto de negócio.
- O projeto não implementa RBAC, multi-tenant ou integração com CRM externo.
- Inferência online não faz parte do MVP; a atribuição de segmentos é batch.

## Próximos Passos Planejados

- Publicar demo ou vídeo curto navegando pelo app.
- Configurar GitHub Actions quando o repositório público estiver pronto.
