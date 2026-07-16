# PRD — CardSense: Plataforma de Segmentação Inteligente de Clientes para Marketing

> **Documento de Requisitos de Produto (PRD) + Especificação Técnica**
> Projeto de portfólio profissional de Cientista de Dados Sênior + Engenharia Full Stack.
> Domínio: Marketing Analytics / Segmentação de clientes de cartão de crédito.
> Base de dados: `Marketing_data.csv` (8.950 clientes, 18 variáveis — Credit Card Dataset for Clustering, Kaggle).

---

Você é um Cientista de Dados Sênior e Desenvolvedor Full Stack especializado em Next.js, dashboards analíticos e aplicações de Marketing Analytics / Customer Segmentation.

Seu objetivo é gerar um projeto **COMPLETO, FUNCIONAL e PRONTO PARA EXECUÇÃO**, sem depender de implementações posteriores. Não entregue apenas estrutura, wireframe ou exemplos. Gere um sistema real, com dados carregados do arquivo CSV, pipeline de Machine Learning não-supervisionado (clusterização) e dashboard dinâmico.

Este projeto deve servir como **peça central de portfólio no GitHub e no LinkedIn**, capaz de chamar a atenção de recrutadores e ser defensável em entrevistas técnicas de ciência de dados e engenharia de software.

====================================================================
## PARTE 1 — PRD (PRODUCT REQUIREMENTS DOCUMENT)
====================================================================

Esta parte descreve o **PORQUÊ** e o **O QUÊ** do produto (visão, objetivos, personas, escopo e critérios). A **PARTE 2** (mais abaixo) descreve o **COMO** técnico (stack, modelos, ML, rotas, arquitetura). Em caso de dúvida de implementação, a Parte 2 prevalece; em caso de dúvida de intenção/produto, a Parte 1 prevalece.

### VISÃO DO PRODUTO
Uma plataforma de **Marketing Analytics** que usa Machine Learning não-supervisionado (clusterização) para descobrir e monitorar **segmentos comportamentais** entre clientes de cartão de crédito, permitindo que o time de Marketing personalize campanhas, priorize ofertas e maximize retorno por perfil de cliente.

Este é também um **PROJETO DE PORTFÓLIO**: deve demonstrar competência ponta a ponta em ciência de dados/ML (aprendizado não-supervisionado, redução de dimensionalidade, avaliação de clusters, interpretação de segmentos) e engenharia de software full stack, sendo defensável em entrevistas técnicas.

### PROBLEMA E CONTEXTO DE NEGÓCIO
* O Marketing trata a base de clientes como um bloco homogêneo, desperdiçando verba com campanhas genéricas de baixa conversão.
* Sem segmentação orientada por dados, ofertas de cashback, upgrade de limite, renegociação e cross-sell são disparadas sem foco.
* Comportamentos de risco (uso abusivo de adiantamento/*cash advance*, dívida rotativa) e oportunidades (bons pagadores, alto volume de compras) ficam invisíveis no agregado.
* A base histórica (8.950 clientes, 18 variáveis de comportamento financeiro) permite descobrir perfis latentes por meio de clusterização e transformá-los em ações de marketing acionáveis.

### OBJETIVOS (OUTCOMES)
* Descobrir segmentos comportamentais interpretáveis a partir dos dados transacionais dos clientes.
* Atribuir cada cliente a um segmento e permitir explorar/filtrar a base por perfil.
* Explicar **o que define cada segmento** (variáveis dominantes) para gerar ação, não apenas um rótulo.
* Recomendar ações de marketing específicas por segmento (cashback, renegociação, cross-sell, monitoramento de risco).
* Demonstrar um pipeline de ML sério (dados, padronização, redução de dimensionalidade, clusterização, avaliação, interpretação) integrado a um produto real.

### MÉTRICAS DE SUCESSO
Do produto (demonstração/portfólio):
* Dashboard funcional que apresenta os segmentos, seus tamanhos e características.
* Cada segmento acompanhado dos fatores que o definem e de recomendações de marketing.
* Exploração da base completa com atribuição de segmento por cliente e exportação.
* Experiência premium, responsiva e navegável em qualquer dispositivo.

Do modelo (qualidade técnica):
* **Silhouette Score** como métrica principal de qualidade dos clusters, reportada no dashboard e no *model card*.
* **Davies-Bouldin Index** e **Calinski-Harabasz Score** como métricas complementares.
* Número de clusters (*k*) escolhido de forma justificada (método do cotovelo / *elbow* + silhouette).
* Comparação entre K-Means direto e K-Means sobre representação comprimida (Autoencoder), com decisão registrada.

### PÚBLICO-ALVO E PERSONAS
Embora o sistema não use papéis/permissões (qualquer usuário autenticado vê tudo), o produto é desenhado para estas personas:
* **Analista de Marketing / CRM:** explora segmentos, valida perfis e monitora indicadores de comportamento.
* **Gestor de Campanhas:** consulta os segmentos-alvo e planeja ações personalizadas.
* **Diretoria / Marketing estratégico:** visão executiva da composição da base e do valor por segmento.

### JOBS-TO-BE-DONE
* "Quando planejo uma campanha, quero saber quais segmentos existem na base, para direcionar a oferta certa."
* "Quando olho um segmento, quero entender o que o define, para desenhar a mensagem correta."
* "Quando priorizo verba, quero ver o tamanho e o valor de cada segmento, para investir onde há retorno."
* "Quando exploro os dados, quero ver a base completa com o segmento de cada cliente e poder exportá-la, para análises próprias."

### USER STORIES E CRITÉRIOS DE ACEITAÇÃO

**US1 — Acesso**
* Como visitante, quero me cadastrar e entrar, para acessar o dashboard.
* Aceitação: cadastro válido cria usuário (bcrypt) e faz auto-login; login válido redireciona ao dashboard; rotas protegidas sem sessão redirecionam para `/login`; existe usuário demo (demo123/demo123).

**US2 — Visão executiva (dashboard)**
* Como usuário, quero ver KPIs e gráficos do comportamento da base e da composição por segmento, para entender a situação geral.
* Aceitação: KPIs e gráficos refletem o banco; composição por segmento reflete a atribuição do modelo; filtros globais funcionam.

**US3 — Segmentação (ML)**
* Como usuário, quero ver a que segmento cada cliente pertence, para direcionar campanhas.
* Aceitação: cada cliente tem `clusterId`, `segmentLabel` e `pca1`/`pca2` derivados de um modelo treinado; a base pode ser filtrada por segmento; o mapa de dispersão PCA colore por segmento.

**US4 — Interpretabilidade dos segmentos**
* Como usuário, quero entender o que caracteriza cada segmento, para agir.
* Aceitação: cada segmento exibe as variáveis dominantes (comparação do centróide vs. média geral) e recomendações de marketing coerentes.

**US5 — Qualidade do modelo**
* Como avaliador técnico, quero ver as métricas de clusterização, para confiar na segmentação.
* Aceitação: painel com algoritmo, versão, `k` escolhido, Silhouette, Davies-Bouldin, Calinski-Harabasz, curva do cotovelo (*elbow*) e método de escolha do `k`.

**US6 — Exploração e exportação de dados**
* Como usuário, quero ver a base completa (com segmento) e baixá-la, para análises próprias.
* Aceitação: `/dataset` mostra todas as colunas com paginação (25/50/100/200/500/1000) e permite baixar o CSV completo com a coluna de segmento.

**US7 — Configuração de segmentação**
* Como usuário, quero ajustar rótulos e o número de segmentos exibidos, para adequar à estratégia.
* Aceitação: `/settings` permite renomear segmentos e escolher a versão de modelo ativa; reclassificação de rótulos não exige re-treino.

### ESCOPO
Dentro do escopo (MVP):
* Autenticação por email/senha com cadastro e auto-login; usuário demo.
* Carga de dados via seed/scripts a partir do CSV do projeto (sem upload manual).
* Pipeline de ML em Python (limpeza, imputação, padronização, redução de dimensionalidade, clusterização, avaliação, interpretação) gerando atribuições de segmento consumidas pelo app.
* Dashboard, insights, lista de clientes, detalhe individual, dataset completo e configurações.
* Tema claro/escuro, responsividade completa, documentação MkDocs e testes.

Fora do escopo (agora):
* Multi-tenant, papéis/permissões e RBAC.
* Upload manual de arquivos ou integração com CRMs externos.
* Serviço de inferência online (a atribuição de segmento é em *batch*).
* Dados reais/produção — a base é estática e anonimizada.

Futuro (planejado):
* CI/CD com GitHub Actions (quando o repositório existir).
* Possível microserviço de inferência (FastAPI) e re-clusterização agendada.
* Modelagem de CLV (Customer Lifetime Value) por segmento.

### REQUISITOS NÃO-FUNCIONAIS
* Desempenho: telas e consultas responsivas para a base de ~8.950 registros; paginação no servidor.
* Usabilidade/acessibilidade: contraste AA, navegação por teclado, estados de loading/erro/vazio.
* Responsividade: mobile-first, sem overflow horizontal nas larguras-alvo.
* Qualidade: ESLint/Prettier, tsc, Ruff, Pyright sem erros; testes passando.
* Reprodutibilidade: pipeline de ML determinístico (`random_state`), execução documentada.
* Privacidade: uso responsável de dados de clientes; anonimização de IDs (ver seção LGPD).
* Manutenibilidade: separação de camadas (app, lib, server) e componentização.

### PREMISSAS
* A base de dados é o CSV fixo do projeto (`Marketing_data.csv`), estático.
* Valores monetários estão em dólar (USD) — dataset internacional.
* Interface e conteúdo em português (locale pt-BR).
* Todos os usuários autenticados têm o mesmo nível de acesso.
* Não há rótulo/alvo supervisionado: o problema é de **aprendizado não-supervisionado**.

### RISCOS E MITIGAÇÕES
* **Valores ausentes** (`MINIMUM_PAYMENTS` ~3,5%, `CREDIT_LIMIT` 1 registro) → imputar com mediana; documentar estratégia.
* **Outliers** (ex.: compras de US$ 49.039, adiantamento de US$ 47.137) → padronizar; considerar tratamento robusto/log; documentar impacto.
* **Escolha de `k` arbitrária** → justificar via *elbow* + Silhouette; comparar cenários.
* **Instabilidade do K-Means** → fixar `random_state` e `n_init`; padronizar features antes de clusterizar.
* **Interpretação equivocada dos segmentos** → nomear com base em evidência (centróides), documentar limitações; ferramenta de apoio, não decisão automática.

### GLOSSÁRIO
* **Segmento/Cluster:** grupo de clientes com comportamento financeiro semelhante descoberto pelo modelo.
* **clusterId:** identificador numérico do cluster atribuído pelo K-Means (0..k-1).
* **segmentLabel:** rótulo de negócio interpretável do segmento (ex.: "Devedor Rotativo").
* **pca1 / pca2:** coordenadas do cliente nas duas primeiras componentes principais (visualização 2D).
* **Silhouette Score:** mede coesão x separação dos clusters (−1 a 1; maior é melhor).
* **Davies-Bouldin Index:** média da similaridade entre clusters (menor é melhor).
* **Calinski-Harabasz Score:** razão dispersão entre/dentro dos clusters (maior é melhor).
* **Inércia (WCSS):** soma das distâncias quadradas ao centróide; base do método do cotovelo.
* **Centróide:** ponto médio de um cluster no espaço de features (define o perfil do segmento).
* **Autoencoder:** rede neural que aprende representação comprimida das features (redução de dimensionalidade não-linear).
* **ClusterRun:** registro de uma execução de clusterização e suas métricas.

====================================================================
## PARTE 2 — ESPECIFICAÇÃO TÉCNICA DE IMPLEMENTAÇÃO
====================================================================

### CONTEXTO DO PROJETO
Este projeto é uma aplicação de **Marketing Analytics** focada em segmentar clientes de cartão de crédito por comportamento financeiro. A base de referência está em:
* `C:\Projetos\Departamento_Marketing_ML\data\Marketing_data.csv`

**Não há variável-alvo supervisionada.** O problema central é de **clusterização** (aprendizado não-supervisionado): descobrir segmentos comportamentais e atribuir cada cliente a um deles.

O dataset possui **8.950 clientes e 18 colunas**: `CUST_ID`, `BALANCE`, `BALANCE_FREQUENCY`, `PURCHASES`, `ONEOFF_PURCHASES`, `INSTALLMENTS_PURCHASES`, `CASH_ADVANCE`, `PURCHASES_FREQUENCY`, `ONEOFF_PURCHASES_FREQUENCY`, `PURCHASES_INSTALLMENTS_FREQUENCY`, `CASH_ADVANCE_FREQUENCY`, `CASH_ADVANCE_TRX`, `PURCHASES_TRX`, `CREDIT_LIMIT`, `PAYMENTS`, `MINIMUM_PAYMENTS`, `PRC_FULL_PAYMENT`, `TENURE`.

### STACK OBRIGATÓRIA
* Next.js 15+
* App Router
* TypeScript
* Tailwind CSS
* Prisma ORM
* SQLite
* NextAuth/Auth.js
* bcrypt
* React Hook Form
* Zod
* Lucide Icons
* Recharts ou biblioteca equivalente para gráficos interativos
* PapaParse ou parser equivalente para importação de CSV

### FERRAMENTAS DE QUALIDADE E DOCUMENTAÇÃO
* Vitest + Testing Library (testes TypeScript)
* pytest (testes Python da camada de análise)
* Ruff (lint e format Python)
* Pyright (type checking Python, modo strict)
* ESLint + Prettier (qualidade TypeScript)
* MkDocs + Material for MkDocs (documentação)

### OBJETIVO DO SISTEMA
Criar uma landing page premium com dashboard executivo de Marketing Analytics. O dashboard deve ajudar o time de Marketing a identificar segmentos de clientes, visualizar padrões de comportamento financeiro e priorizar ações personalizadas por perfil.

O sistema deve responder visualmente a perguntas como:
* Quantos segmentos existem e qual o tamanho de cada um?
* O que caracteriza cada segmento (saldo, compras, adiantamento, pagamento)?
* Quais clientes são bons pagadores, devedores rotativos, compradores ativos ou usuários de adiantamento?
* Qual segmento concentra maior limite de crédito e volume de compras?
* Como saldo, limite, compras à vista/parceladas, adiantamento e taxa de pagamento se relacionam?
* Que ação de marketing recomendar para cada segmento?

### COMPORTAMENTO INICIAL
O sistema NÃO possui papéis/roles nem usuário administrador. Qualquer usuário válido e autenticado tem acesso completo (dashboard, insights, clientes, dataset e configurações).

Ao acessar o sistema:
* Se o usuário NÃO estiver autenticado, exibir a tela de login.
* A tela de login deve conter a opção de cadastrar um novo usuário.
* Rotas protegidas devem redirecionar para `/login` quando não houver sessão.

Após autenticação:
* Redirecionar para o dashboard.
* Permitir navegação para dashboard analítico, insights, lista de clientes, dataset completo e configurações.

### AUTENTICAÇÃO
Utilizar Auth.js (NextAuth) com estratégia de credenciais. Login por email e senha.

Requisitos:
* Senhas criptografadas com bcrypt.
* Sessão persistente.
* Middleware de proteção das rotas autenticadas.
* Sem controle por roles: todo usuário autenticado tem os mesmos acessos.

### LOGIN
Tela `/login` deve conter: campo de email, campo de senha, botão de entrar e link para cadastrar (`/register`).
Comportamento: email/senha válidos autenticam e redirecionam para `/dashboard`; inválidos exibem mensagem de erro amigável.

### CADASTRO DE USUÁRIO
Tela `/register`: nome, email, senha, confirmar senha.
Comportamento: validar com Zod (email válido, senha mínima, confirmação igual); impedir email duplicado; criar usuário com bcrypt; após cadastro, autenticar automaticamente e redirecionar para `/dashboard`; sem aprovação nem etapas adicionais.

### USUÁRIO DEMO
Para facilitar avaliação (portfólio/entrevista), o seed deve criar um usuário demo pré-cadastrado:
* login (email): `demo123`
* senha: `demo123`

Requisitos:
* Criar via seed, com senha criptografada em bcrypt (não armazenar em texto puro).
* A tela de login deve exibir essas credenciais de forma visível (ex.: aviso "Acesso demo: demo123 / demo123") e/ou botão "Entrar como demo".
* Como o login é por email, aceitar `demo123` como identificador da conta demo (o schema Zod de login deve permitir o valor `demo123` especificamente para essa conta; demais cadastros seguem validação de email normal).

### INTERNACIONALIZAÇÃO E FORMATAÇÃO
* Locale padrão: pt-BR. Toda a interface, textos e mensagens em português.
* Datas em pt-BR (dd/MM/yyyy). Números em pt-BR (separador de milhar e decimal).
* **MOEDA:** os valores monetários (`BALANCE`, `PURCHASES`, `CASH_ADVANCE`, `CREDIT_LIMIT`, `PAYMENTS`, `MINIMUM_PAYMENTS`, etc.) são em DÓLAR (USD). Exibir com prefixo/rótulo USD de forma consistente em todo o app.
* Centralizar formatadores em `src/lib/utils` (`formatCurrency`, `formatDate`, `formatNumber`, `formatPercent`).

### BANCO DE DADOS
Utilizar exclusivamente SQLite. Não utilizar dados mockados nem arrays hardcoded para simular dados do dashboard. Todos os indicadores devem ser derivados do banco após importação do CSV.

O `Marketing_data.csv` deve ser a fonte inicial de dados. Criar seed ou rotina de importação que leia o CSV real (junto às atribuições de segmento geradas pela camada de ML) e grave os registros no SQLite.

### MODELOS MÍNIMOS

**User**
* id, name, email, password, createdAt, updatedAt

**Customer**
* id
* custId
* balance
* balanceFrequency
* purchases
* oneoffPurchases
* installmentsPurchases
* cashAdvance
* purchasesFrequency
* oneoffPurchasesFrequency
* purchasesInstallmentsFrequency
* cashAdvanceFrequency
* cashAdvanceTrx
* purchasesTrx
* creditLimit
* payments
* minimumPayments
* prcFullPayment
* tenure
* clusterId
* segmentLabel
* pca1
* pca2
* modelVersion
* scoredAt
* createdAt
* updatedAt

**Segment** (perfil interpretado de cada cluster)
* id
* modelVersion
* clusterId
* label
* description
* customerCount
* sharePct
* dominantFeatures (JSON: variáveis que definem o segmento + direção/magnitude)
* avgBalance
* avgPurchases
* avgCashAdvance
* avgCreditLimit
* avgPrcFullPayment
* recommendation
* updatedAt

**ClusterRun** (registro de um treino/execução de clusterização)
* id
* modelVersion
* algorithm            // ex.: "KMeans", "Autoencoder+KMeans"
* nClusters            // k escolhido
* silhouette
* daviesBouldin
* calinskiHarabasz
* inertia
* usedAutoencoder      // boolean
* nComponentsPca
* trainedAt
* notes

**SegmentationConfig**
* id
* activeModelVersion
* updatedAt

### ABORDAGEM DE MACHINE LEARNING
Este é o **núcleo do projeto de portfólio**. A segmentação NÃO é calculada por regras fixas, e sim por um **modelo de Machine Learning não-supervisionado (clusterização)** treinado sobre o comportamento financeiro dos clientes.

**Definição do problema:**
* Tarefa: clusterização (aprendizado não-supervisionado).
* Não há alvo/rótulo verdadeiro; os segmentos são descobertos a partir dos dados.
* Saída principal: `clusterId` (0..k-1) por cliente + coordenadas `pca1`/`pca2` para visualização.
* `segmentLabel` é o rótulo de negócio derivado da interpretação dos centróides.
* Perfil de cada segmento derivado da comparação entre o centróide (em escala original) e a média geral.

**Onde o ML roda:**
* Todo o treinamento, avaliação e interpretação ficam na camada Python, em `analysis/marketing_analytics` (scikit-learn, e opcionalmente TensorFlow/Keras para o Autoencoder).
* O app Next.js NÃO treina modelo. Ele consome as atribuições já calculadas e persistidas no banco.
* Fluxo: Python treina → gera artefatos (scaler, modelo, autoencoder) → script de scoring gera atribuições → atribuições são gravadas no SQLite → dashboard lê do banco.

**Bibliotecas Python:**
* pandas, numpy (manipulação de dados)
* scikit-learn (padronização, PCA, KMeans, métricas de cluster)
* tensorflow/keras (Autoencoder para redução de dimensionalidade — opcional, mas recomendado pois consta do notebook original)
* joblib (serialização de artefatos)
* matplotlib/seaborn (gráficos de avaliação: cotovelo, dispersão PCA, perfis de cluster)

### PIPELINE DE DADOS E FEATURES
* Remover `CUST_ID` das features (usar apenas como identificador; anonimizar na exibição).
* Tratar valores ausentes: imputar `MINIMUM_PAYMENTS` (~313 nulos) e `CREDIT_LIMIT` (1 nulo) com a **mediana** (documentar a estratégia).
* Todas as 17 variáveis numéricas restantes entram na clusterização.
* Padronizar as features com `StandardScaler` (obrigatório antes de K-Means, pois usa distância euclidiana).
* Encapsular o pré-processamento de forma reutilizável; o mesmo `scaler` ajustado no treino deve ser reutilizado no scoring (evitar re-fit).
* Considerar tratamento de outliers (documentar decisão: manter, winsorizar ou transformar via log em variáveis assimétricas).

### REDUÇÃO DE DIMENSIONALIDADE E CLUSTERIZAÇÃO
* **PCA (2 componentes):** usado obrigatoriamente para **visualização 2D** dos clusters (`pca1`, `pca2`).
* **Autoencoder (OBRIGATÓRIO — ver PARTE 3.1):** rede neural (17 → 500 → 2000 → 10 → 2000 → 500 → 17) para aprender uma representação comprimida (encoder de 10 dimensões), sobre a qual o K-Means é aplicado. O K-Means direto é rodado apenas como baseline comparativo.
* **K-Means:** algoritmo principal de clusterização.
    * `k` FIXO = **4** (ver PARTE 3.1). A curva do cotovelo (elbow) e o Silhouette são reportados como justificativa/evidência, mas o valor de produção é 4.
    * Hiperparâmetros fixos e sementes definidos na PARTE 3.1 (`random_state=42`, `n_init=10`).

### AVALIAÇÃO (MÉTRICAS OBRIGATÓRIAS)
Como o problema é não-supervisionado, usar métricas internas de qualidade de cluster:
* **Silhouette Score** (métrica principal).
* **Davies-Bouldin Index** (menor é melhor).
* **Calinski-Harabasz Score** (maior é melhor).
* **Inércia / curva do cotovelo** (para justificar o `k`).
Cada execução registra suas métricas na tabela `ClusterRun`.

### INTERPRETAÇÃO DOS SEGMENTOS (SUBSTITUI O SHAP)
* Comparar os **centróides em escala original** (via `scaler.inverse_transform`) com a média geral da base para identificar as variáveis que mais definem cada cluster (`dominantFeatures`, com direção e magnitude).
* Nomear cada cluster com um `segmentLabel` de negócio interpretável, baseado em evidência. Perfis esperados (ajustar conforme os dados reais):
    * 🛍️ **Comprador Ativo** — alta frequência/volume de compras, baixo adiantamento.
    * 💳 **Devedor Rotativo** — alto saldo, baixa taxa de pagamento completo.
    * 💵 **Usuário de Adiantamento** — alto `CASH_ADVANCE` e `CASH_ADVANCE_FREQUENCY`, poucas compras.
    * ✅ **Bom Pagador** — alto `PRC_FULL_PAYMENT`, baixo saldo devedor.
* O painel de segmento no app é alimentado por `Segment.dominantFeatures` e `Segment.recommendation`.

### ARTEFATOS DO MODELO
* Salvar o `StandardScaler`, o modelo `KMeans` e, se usado, o `Autoencoder`/encoder como artefatos versionados (ex.: `models/scaler_vX.joblib`, `models/kmeans_vX.joblib`, `models/encoder_vX.keras`).
* Salvar metadados (métricas, data, versão, algoritmo, `k`) e as figuras de avaliação.
* Definir `modelVersion` e registrar em `ClusterRun`; `SegmentationConfig.activeModelVersion` aponta o modelo em produção.

### SCORING E INTEGRAÇÃO COM O BANCO
* Um script de scoring (Python) carrega os artefatos ativos, aplica scaler → (autoencoder) → K-Means para todos os clientes e gera: `clusterId`, `segmentLabel`, `pca1`, `pca2`, `modelVersion`, `scoredAt`.
* O scoring exporta um arquivo (ex.: `data/segments.csv` com `CUST_ID`, `clusterId`, `pca1`, `pca2`) e o resumo por segmento (ex.: `data/segment_profiles.json`), que o seed do Prisma consome ao popular o SQLite.
* Renomeação de rótulos de segmento no app não requer re-treino (apenas atualiza `Segment.label`).

### HONESTIDADE E LIMITAÇÕES (documentar)
* O dataset é estático e anonimizado; a segmentação é demonstrativa.
* Clusters são construções estatísticas — não fronteiras absolutas; a interpretação de negócio é uma aproximação.
* A escolha de `k` e do algoritmo influencia os segmentos; documentar as decisões.
* Documentar premissas, limitações, imputação e possíveis vieses em `docs/segmentation-model.md` (model card).

### CARGA DE DADOS
NÃO existe importação manual de arquivos pelos usuários. Não deve haver tela de upload nem qualquer forma de o usuário enviar CSV pela interface.

A única fonte de dados é o CSV já existente no projeto: `data/Marketing_data.csv`.

Requisitos:
* A carga ocorre exclusivamente via seed do Prisma (`prisma/seed.ts`) e/ou scripts (`scripts/import-csv.ts`).
* O seed lê `data/Marketing_data.csv`, `data/segments.csv` e `data/segment_profiles.json` e grava tudo no SQLite.
* Cada `Customer` é persistido com seus dados originais + `clusterId`, `segmentLabel`, `pca1`, `pca2` e `modelVersion`.
* Evitar duplicidade por `CUST_ID` (carga idempotente).
* A interface é somente leitura sobre os dados: nenhuma rota ou componente deve aceitar arquivos do usuário.
* **Robustez:** se `data/segments.csv` não existir no seed, carregar os clientes mesmo assim, deixando campos de segmento nulos, e exibir no dashboard um aviso de que a segmentação ainda não foi gerada (com instrução de rodar a camada de ML). O app não deve quebrar.

### LANDING PAGE
A rota `/` deve ser uma landing page premium de produto analítico para Marketing. Deve funcionar como apresentação executiva e entrada para o dashboard.

Conteúdo obrigatório:
* Hero com proposta de valor clara: descobrir segmentos de clientes e personalizar campanhas.
* Indicadores principais do dataset: total de clientes, saldo médio, compras médias, limite médio, nº de segmentos.
* Seção visual mostrando os cards de segmentos descobertos.
* Seção explicando o que caracteriza cada segmento (variáveis dominantes).
* Seção destacando o modelo: algoritmo (K-Means / Autoencoder + K-Means) e métrica principal (Silhouette).
* CTA para acessar o dashboard.

A landing deve parecer produto SaaS premium de Marketing Analytics, não um CRUD.

### DASHBOARD PRINCIPAL
Criar rota `/dashboard`, dinâmico e recalculado com os dados do banco.

Filtros globais:
* Segmento
* Faixa de saldo (BALANCE)
* Faixa de limite de crédito (CREDIT_LIMIT)
* Faixa de compras (PURCHASES)
* Tempo de relacionamento (TENURE)
* Faixa de taxa de pagamento completo (PRC_FULL_PAYMENT)

KPIs obrigatórios:
* Total de clientes (base completa).
* Número de segmentos descobertos.
* Saldo médio (USD).
* Compras médias (USD).
* Limite de crédito médio (USD).
* Pagamento médio realizado (USD).
* % médio de fatura paga integralmente.
* Tempo médio de relacionamento (TENURE).
* % de clientes que usaram Cash Advance ao menos uma vez.

### GRÁFICOS OBRIGATÓRIOS
Implementar gráficos interativos, responsivos e filtráveis:
* **Mapa de dispersão PCA** (`pca1` x `pca2`), colorido por segmento — visualização central da clusterização.
* Distribuição de clientes por segmento (barras/donut) com tamanho e % de cada.
* Histograma de saldo (BALANCE).
* Histograma/box plot de limite de crédito (CREDIT_LIMIT).
* Scatter Saldo vs. Limite de Crédito, colorido por segmento.
* Donut/barra: compras à vista vs. parceladas.
* Barras: frequência de compras (Nunca / Baixa / Média / Alta).
* Scatter Cash Advance vs. Saldo, colorido por segmento.
* Donut: pagamento de fatura (integral vs. parcial).
* Comparação de médias de variáveis-chave por segmento (barras agrupadas / radar).
* Heatmap de correlação entre variáveis numéricas relevantes.

### QUALIDADE DO MODELO (NO DASHBOARD)
Exibir um bloco/painel dedicado ao modelo de clusterização (lido de `ClusterRun` / `SegmentationConfig.activeModelVersion`):
* Algoritmo do modelo ativo e versão (`modelVersion`), com indicação se usou Autoencoder.
* Métrica principal em destaque: **Silhouette Score**.
* Métricas complementares: Davies-Bouldin, Calinski-Harabasz, inércia.
* Número de clusters (`k`) e justificativa (curva do cotovelo — imagem gerada em `analysis/reports`).
* Mapa de dispersão PCA dos clusters (imagem ou componente).
* Data da última execução (`trainedAt`).
Esse painel demonstra a competência de ML não-supervisionado e é peça central para a defesa em entrevista.

### INSIGHTS EXECUTIVOS
Criar `/insights` (ou bloco no dashboard) com textos gerados a partir dos dados reais (não hardcoded):
* Maior segmento da base e sua participação (%).
* Segmento com maior saldo médio devedor.
* Segmento com maior uso de adiantamento (risco).
* Segmento com melhor taxa de pagamento (oportunidade de cross-sell).
* Diferença de limite médio entre segmentos.
* Relação entre compras à vista e parceladas por segmento.
* Concentração de volume de compras nos maiores compradores.

Os números devem ser calculados a partir do banco.

### LISTA DE CLIENTES
Criar rota `/customers`. Tabela avançada com:
* CUST_ID (anonimizado/mascarado)
* Segmento (label + badge colorido)
* Saldo (BALANCE)
* Compras (PURCHASES)
* Cash Advance
* Limite de Crédito (CREDIT_LIMIT)
* Pagamentos (PAYMENTS)
* % Fatura Paga Integralmente (PRC_FULL_PAYMENT)
* Tempo de relacionamento (TENURE)

Funcionalidades:
* Busca textual (por CUST_ID).
* Filtro por segmento.
* Filtros por faixa (saldo, compras, limite, tenure).
* Ordenação por qualquer coluna numérica.
* Paginação (servidor).
* Exportação CSV dos resultados filtrados.
* Destaque visual por cor de segmento.

### DETALHE DO CLIENTE
Criar rota `/customers/[id]`. Deve conter:
* Resumo do perfil do cliente.
* Segmento atribuído com badge e descrição do perfil.
* Posição do cliente no mapa PCA (destacado entre os demais).
* Principais variáveis do cliente vs. média do seu segmento vs. média geral (barras/comparativo).
* Dados de compras (à vista/parcelado), adiantamento, saldo e limite.
* Dados de pagamento (PAYMENTS, MINIMUM_PAYMENTS, PRC_FULL_PAYMENT).
* Recomendações de ação de marketing coerentes com o segmento.

### RECOMENDAÇÕES DE MARKETING
Gerar recomendações por segmento (baseadas em regras sobre o perfil do centróide):
* **Comprador Ativo:** cashback, programa de fidelidade, upgrade de limite.
* **Devedor Rotativo:** renegociação de dívida, educação financeira, parcelamento de saldo.
* **Usuário de Adiantamento:** monitoramento de risco, alertas proativos, oferta de crédito pessoal.
* **Bom Pagador:** upgrade para cartão premium, benefícios exclusivos, cross-sell.
* Regras adicionais complementares por cliente (ex.: se `PRC_FULL_PAYMENT` alto → cross-sell; se `CASH_ADVANCE_FREQUENCY` alto → monitoramento).

### DATASET COMPLETO (VISUALIZAÇÃO DO CSV)
Criar rota `/dataset` para visualização completa e bruta dos dados do CSV.

Objetivo: explorar TODAS as 18 colunas originais + a coluna de segmento atribuído.

Requisitos:
* Tabela com todas as colunas do `Marketing_data.csv` (+ `segmentLabel`/`clusterId`).
* Scroll horizontal quando necessário; cabeçalho fixo (sticky).
* Paginação no lado do servidor.
* Seletor de itens por página: 25, 50, 100, 200, 500, 1000.
* Exibir contagem total e intervalo atual (ex.: "Exibindo 1–50 de 8.950").
* Navegação de páginas (primeira, anterior, próxima, última).
* Busca textual opcional.
* Estado de carregamento (skeleton) e estado vazio.
* Totalmente responsivo.

Download do CSV:
* Botão "Baixar CSV" bem visível (inclusive no mobile).
* Servir via rota de API dedicada (streaming/attachment com `Content-Disposition`), gerando o CSV a partir do banco.
* O arquivo deve conter todas as colunas originais + segmento.

### ÁREA DE CONFIGURAÇÕES
Não existe painel administrativo separado nem papel de administrador. Não existe tela de importação de dados (carga apenas via seed/scripts). A tela de configurações fica disponível para qualquer usuário autenticado.

Criar tela `/settings`. Campos:
* Renomear rótulos de segmentos (`segmentLabel`).
* Selecionar a versão de modelo ativa (`activeModelVersion`).
* Ajustar descrições e recomendações por segmento.
Alterações de rótulo/descrição não exigem re-treino.

### DESIGN OBRIGATÓRIO
IMPORTANTE: o sistema NÃO deve parecer um CRUD. Deve parecer um produto comercial premium de Marketing Analytics pronto para produção.

Direção visual:
* Visual de SaaS executivo moderno (inspiração: Linear, Vercel Analytics, Mixpanel, Tableau Cloud, Amplitude).
* Fundo claro off-white ou slate muito escuro, com acabamento sofisticado.
* Cards com profundidade sutil; muito espaço em branco; tipografia forte e moderna.
* Cores consistentes por segmento (paleta categórica estável).
* Gráficos limpos, sem excesso visual.
* Navegação lateral ou topbar minimalista; componentização adequada.

### DESIGN SYSTEM E TOKENS
Definir design system centralizado, sem valores mágicos espalhados.
* Cores, espaçamentos, raios, sombras e tipografia como tokens em `tailwind.config.ts` e `globals.css` (CSS variables).
* **Paleta categórica de segmentos** padronizada e reutilizável (uma cor estável por segmento, consistente em todos os gráficos e badges).
* Cores auxiliares de sentido: sucesso/verde (bom pagador), atenção/laranja (devedor rotativo), perigo/vermelho (adiantamento), primária/azul.
* Contraste acessível em fundo claro e escuro.
* Tipografia: fonte moderna (Inter, Geist ou Satoshi) com escala consistente.
* Espaçamento em múltiplos de 4px; raios e sombras padronizados.

### TEMA CLARO E ESCURO
* Suportar tema claro e escuro; alternância persistida (localStorage) e respeitando `prefers-color-scheme` na primeira visita.
* Todos os componentes, gráficos e badges de segmento devem funcionar nos dois temas.

### GRID E LAYOUT BASE
* Largura máxima controlada por container central (ex.: `max-w-7xl`) com padding lateral responsivo.
* Usar CSS Grid e Flexbox; evitar posicionamentos absolutos frágeis.
* Layout autenticado com sidebar fixa (desktop) + área de conteúdo scrollável.
* Espaçamento vertical consistente; cards em grid responsivo.

### RESPONSIVIDADE (OBRIGATÓRIA)
Mobile-first. Breakpoints padrão Tailwind (base < 640, sm, md, lg, xl, 2xl).

Regras por breakpoint:
* **Navegação:** desktop (lg+) sidebar fixa; tablet (md) sidebar recolhível/drawer; mobile topbar com hambúrguer + drawer.
* **Grid de KPIs:** mobile 1 col; sm 2 col; lg 3–4 col.
* **Gráficos:** mobile largura total empilhados (altura reduzida); md 2 por linha; sempre `ResponsiveContainer`, nunca largura fixa em px.
* **Filtros globais:** desktop barra/painel; mobile drawer/bottom sheet.
* **Tabela de clientes:** desktop tabela completa com scroll horizontal; mobile cards empilhados ou tabela com scroll e colunas prioritárias.
* **Dataset:** sempre scroll horizontal + header sticky; seletor de página e download sempre acessíveis.
* **Detalhe do cliente:** desktop duas colunas (conteúdo + card lateral de segmento/ações); mobile coluna única.
* **Landing:** hero/KPIs/cards reempilham em coluna única no mobile, CTA sempre acessível.

Requisitos gerais: sem overflow horizontal indevido; gráficos/imagens fluidos; textos responsivos com truncamento; áreas de toque ~44px; modais/drawers adaptados; testar em 360px, 768px, 1024px, 1440px.

### ACESSIBILIDADE E USABILIDADE
* Contraste mínimo AA; navegação por teclado e foco visível.
* HTML semântico e ARIA quando necessário.
* Não comunicar segmento apenas por cor: acompanhar de rótulo/ícone.
* Estados de loading (skeletons), erro e vazio em todas as telas.
* Respeitar `prefers-reduced-motion`.

### ESTRUTURA DE LAYOUT (COMPONENTES)
Centralizar layout em `src/components/layout`: `AppShell`, `Sidebar`, `Topbar`, `MobileNav`/`Drawer`, `PageHeader`, `GlobalFilters`, `Container`/`Section`, `ThemeToggle`. Componentes de página consomem esses componentes, sem duplicar estrutura de layout.

### EMPTY STATES
* Base não carregada: "Base de clientes ainda não carregada. Execute o seed do projeto (`npx prisma db seed`) para popular o dashboard."
* Segmentação não gerada: "Segmentação ainda não gerada. Execute a camada de ML (`python -m analysis.scripts.run_clustering`)."
* Filtros sem resultado: "Nenhum cliente encontrado para os filtros selecionados."

### TRATAMENTO DE ERROS E LOGGING
* Rotas de API tratam erros de forma consistente com status apropriado (400, 401, 404, 422, 500) e corpo JSON padronizado (`{ error: { message, code } }`).
* Nunca vazar stack traces/detalhes sensíveis ao cliente.
* Validar entrada com Zod (422 em falha). Rotas autenticadas retornam 401 sem sessão.
* Logging estruturado no servidor (pino ou console estruturado); sem logar dados sensíveis.
* No client, Error Boundaries e páginas `error.tsx`/`not-found.tsx`.
* Cada tela com três estados: carregando (skeleton), erro (mensagem + retry) e vazio.

### PRIVACIDADE E USO RESPONSÁVEL (LGPD)
* O dataset é público e anonimizado (Kaggle); não contém PII real além de IDs sintéticos.
* Boas práticas: mascarar/anonimizar `CUST_ID` na exibição; minimização de dados; não expor dados individuais fora da área autenticada.
* Documentar que a ferramenta é de apoio à decisão de marketing, não decisão automática sobre clientes; registrar análise de possíveis vieses no model card.
* Registrar considerações em `docs/segmentation-model.md` e no README.

### TESTES UNITÁRIOS
Obrigatórios, cobrindo a lógica de negócio crítica.

**Frontend/Backend (TypeScript) — Vitest + Testing Library:**
* Cobertura mínima 80% em `src/lib/segments`, `src/lib/metrics` e `src/lib/csv`.
* Testar: derivação de perfil/rótulo de segmento a partir de `dominantFeatures`; regras de recomendação de marketing; agregações e KPIs; correlações; parsing e validação do CSV; schemas Zod.
* Testes de integração das rotas principais (`customers`, `metrics`, `insights`, `segments`).
* Fixtures determinísticas em `tests/fixtures`.

**Machine Learning (Python) — pytest:**
* Testar: carga/limpeza/imputação; padronização; smoke test de clusterização; cálculo das métricas (silhouette, DB, CH); scoring/atribuição.
* Reprodutibilidade (`random_state` fixo).
* CSV de amostra determinístico em `tests/fixtures`.

Scripts esperados:
* `npm run test` / `test:watch` / `test:cov`
* `pytest`
* `python -m analysis.scripts.run_clustering`      # treina, avalia e salva artefatos + métricas
* `python -m analysis.scripts.generate_segments`   # gera data/segments.csv e segment_profiles.json

### DEPENDÊNCIAS PYTHON (pyproject.toml)
* pandas, numpy
* scikit-learn
* tensorflow/keras (Autoencoder — opcional)
* joblib
* matplotlib, seaborn
* pytest
* ruff, pyright

### QUALIDADE DE CÓDIGO PYTHON (RUFF + PYRIGHT)
* Ruff configurado em `pyproject.toml`; regras E, F, I, N, UP, B, SIM; `line-length` 100; import sorting; `ruff check .` e `ruff format .` sem erros.
* Pyright em modo `strict`; type hints completos nas funções públicas; `pyright` sem erros.

### QUALIDADE TYPESCRIPT
* ESLint sem erros; Prettier aplicado; `tsc --noEmit` sem erros.

### DOCUMENTAÇÃO (MKDOCS)
Gerada com MkDocs + Material. Configuração em `mkdocs.yml`, conteúdo em `docs/`:
* `index.md`: visão geral do produto.
* `getting-started.md`: instalação, migrações, execução.
* `architecture.md`: arquitetura e árvore de diretórios.
* `segmentation-model.md`: model card (dados, imputação, features, algoritmo, `k`, métricas, interpretação dos segmentos, limitações e vieses).
* `ml-pipeline.md`: pipeline de ML (pré-processamento, PCA, autoencoder, K-Means, avaliação, scoring).
* `api.md`: referência das rotas de API.
* `data-pipeline.md`: fluxo do CSV e das atribuições de segmento até o banco.
* `contributing.md`: padrões de código, testes, Ruff, Pyright, ESLint.
Comandos: `mkdocs serve`, `mkdocs build` (sem erros).

### QUALIDADE OBRIGATÓRIA
Não utilizar: TODO, FIXME, mock data, dados fictícios hardcoded no dashboard. Todas as funcionalidades conectadas ao banco. O projeto deve compilar sem erros. Cálculos centralizados em funções testáveis. Componentes organizados e reutilizáveis.

### ESTRUTURA MÍNIMA DE ROTAS
* `/`
* `/login`
* `/register`
* `/dashboard`
* `/insights`
* `/customers`
* `/customers/[id]`
* `/dataset`
* `/settings`

### ÁRVORE DE DIRETÓRIOS E ARQUIVOS

```
Departamento_Marketing_ML/
├── prisma/
│   ├── schema.prisma                # Modelos User, Customer, Segment, ClusterRun, SegmentationConfig
│   ├── seed.ts                      # Carrega Marketing_data.csv + segments.csv + segment_profiles.json
│   └── migrations/
├── public/
│   └── images/
├── data/
│   ├── Marketing_data.csv           # Fonte de dados original (carga via seed/scripts)
│   ├── segments.csv                 # Atribuições geradas pela camada de ML (CUST_ID, clusterId, pca1, pca2)
│   └── segment_profiles.json        # Perfis/recomendações por segmento (consumidos pelo seed)
├── scripts/
│   ├── import-csv.ts                # Script CLI de carga do CSV para o banco
│   └── relabel-segments.ts          # Atualiza rótulos/descrições de segmentos (sem re-treino)
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   ├── loading.tsx
│   │   ├── (marketing)/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx             # Landing page premium (/)
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx       # /login
│   │   │   └── register/page.tsx    # /register
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx   # /dashboard
│   │   │   ├── insights/page.tsx    # /insights
│   │   │   ├── customers/
│   │   │   │   ├── page.tsx         # /customers
│   │   │   │   └── [id]/page.tsx    # /customers/[id]
│   │   │   ├── dataset/page.tsx     # /dataset
│   │   │   └── settings/page.tsx    # /settings
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── register/route.ts
│   │       ├── customers/route.ts            # Listagem/filtros/paginação/export
│   │       ├── dataset/route.ts              # Dataset completo paginado
│   │       ├── dataset/download/route.ts     # Download do CSV completo (attachment)
│   │       ├── metrics/route.ts              # KPIs e agregações
│   │       ├── insights/route.ts             # Insights executivos calculados
│   │       ├── segments/route.ts             # Perfis dos segmentos + métricas do modelo (ClusterRun)
│   │       └── settings/route.ts             # Leitura/gravação de SegmentationConfig / rótulos
│   ├── components/
│   │   ├── ui/                      # Botões, inputs, cards, tabela, badges de segmento
│   │   ├── layout/                  # AppShell, Sidebar, Topbar, MobileNav, PageHeader, GlobalFilters, Container, ThemeToggle
│   │   ├── charts/                  # Wrappers Recharts (Bar, Histogram, Scatter, PcaScatter, Donut, Heatmap, Radar)
│   │   ├── dashboard/               # KpiCard, DashboardGrid, SegmentDistribution
│   │   ├── customers/               # CustomersTable, SegmentBadge, CustomerProfileCompare
│   │   ├── segments/                # SegmentCard, SegmentProfile, ModelQualityPanel
│   │   ├── dataset/                 # DatasetTable, PageSizeSelector, Pagination, DownloadCsvButton
│   │   ├── marketing/               # Hero, SegmentCards, FeatureHighlights, CTA
│   │   └── settings/               # SettingsForm
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── utils.ts                 # cn, formatCurrency, formatDate, formatNumber, formatPercent
│   │   ├── auth/
│   │   │   ├── options.ts
│   │   │   └── session.ts
│   │   ├── segments/
│   │   │   ├── profile.ts           # Deriva perfil/dominantFeatures a partir de centróides
│   │   │   ├── labels.ts            # Mapeamento clusterId -> segmentLabel e cores
│   │   │   └── recommendations.ts   # Regras de recomendação de marketing por segmento
│   │   ├── metrics/
│   │   │   ├── aggregations.ts      # KPIs e agrupamentos por segmento/dimensão
│   │   │   └── correlations.ts      # Matriz de correlação
│   │   ├── csv/
│   │   │   ├── parser.ts            # Parsing/validação do CSV (PapaParse)
│   │   │   └── mapping.ts           # Mapeia colunas do CSV -> campos Customer
│   │   └── validations/
│   │       ├── auth.schema.ts
│   │       ├── customer.schema.ts
│   │       └── settings.schema.ts
│   ├── server/
│   │   ├── services/                # customer, metrics, insights, segments, auth
│   │   └── repositories/            # Acesso a dados via Prisma
│   ├── hooks/                       # useFilters, useCustomers, useMetrics
│   ├── types/                       # Customer, Metrics, Segment, User
│   ├── config/
│   │   ├── site.ts
│   │   └── constants.ts             # Colunas, cores de segmento, faixas default
│   ├── styles/
│   └── middleware.ts                # Proteção das rotas autenticadas
├── tests/
│   ├── unit/
│   │   ├── segments/
│   │   │   ├── profile.test.ts
│   │   │   ├── labels.test.ts
│   │   │   └── recommendations.test.ts
│   │   ├── metrics/
│   │   │   ├── aggregations.test.ts
│   │   │   └── correlations.test.ts
│   │   ├── csv/
│   │   │   ├── parser.test.ts
│   │   │   └── mapping.test.ts
│   │   └── validations/
│   ├── integration/
│   │   ├── api-customers.test.ts
│   │   ├── api-metrics.test.ts
│   │   └── api-insights.test.ts
│   ├── fixtures/
│   │   └── sample_marketing.csv
│   └── setup.ts
├── analysis/
│   ├── eda.ipynb                          # Análise exploratória
│   ├── clustering.ipynb                    # Modelagem (PCA, autoencoder, K-Means, avaliação)
│   ├── models/
│   │   ├── scaler_v1.joblib                # (NÃO versionar binários pesados)
│   │   ├── kmeans_v1.joblib
│   │   ├── encoder_v1.keras
│   │   └── metrics_v1.json                 # Métricas e metadados (versionado)
│   ├── reports/
│   │   ├── elbow_curve.png                 # Curva do cotovelo
│   │   ├── pca_scatter.png                 # Dispersão dos clusters (PCA 2D)
│   │   ├── silhouette.png
│   │   └── segment_profiles.png            # Perfis dos centróides
│   ├── marketing_analytics/
│   │   ├── __init__.py
│   │   ├── loading.py                      # Carga, limpeza e imputação do CSV
│   │   ├── features.py                     # Padronização (StandardScaler)
│   │   ├── reduce.py                       # PCA e Autoencoder
│   │   ├── cluster.py                      # K-Means, escolha de k (elbow/silhouette)
│   │   ├── evaluate.py                     # Métricas de cluster (silhouette, DB, CH, inércia)
│   │   ├── interpret.py                    # Perfil dos centróides + rótulos de negócio
│   │   ├── score.py                        # Scoring: atribui cluster + pca a cada cliente
│   │   ├── metrics.py                      # Agregações/correlações (EDA)
│   │   └── plots.py                        # Geração de gráficos
│   ├── scripts/
│   │   ├── run_clustering.py               # CLI: treina, avalia e salva artefatos + métricas
│   │   └── generate_segments.py            # CLI: gera data/segments.csv e segment_profiles.json
│   └── tests/
│       ├── __init__.py
│       ├── test_loading.py
│       ├── test_features.py
│       ├── test_cluster.py
│       ├── test_evaluate.py
│       └── test_score.py
├── docs/
│   ├── index.md
│   ├── getting-started.md
│   ├── architecture.md
│   ├── segmentation-model.md               # Model card
│   ├── ml-pipeline.md
│   ├── api.md
│   ├── data-pipeline.md
│   └── contributing.md
├── .env
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── .gitignore                              # node_modules, .env, *.joblib, *.keras, dev.db
├── vitest.config.ts
├── mkdocs.yml
├── pyproject.toml
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

Regras da estrutura:
* Route groups: `(marketing)` público, `(auth)` login/cadastro, `(dashboard)` autenticado.
* Lógica de negócio em `src/server` e `src/lib`, nunca dentro dos componentes de página.
* A lógica de segmentos (rótulos, perfil, recomendações) reside em `src/lib/segments` e é reutilizada por seed, scripts e rotas de API.
* No app (TypeScript), a segmentação em si NÃO é treinada; o treino/clusterização é exclusivo da camada Python.
* Componentes visuais puros e reutilizáveis, recebendo dados via props.
* As rotas de API são a única ponte entre client e banco.

### EXECUÇÃO
Requisitos: Node.js 20 LTS+; Python 3.11+; npm (com `package-lock.json`); registrar o seed no `package.json` (`"prisma": { "seed": "..." }`).

Fluxo completo:
* Camada de ML (Python), uma vez para gerar artefatos e atribuições:
    * `pip install -e .`
    * `python -m analysis.scripts.run_clustering`
    * `python -m analysis.scripts.generate_segments`   # gera data/segments.csv e segment_profiles.json
* App (Next.js):
    * `npm install`
    * `npx prisma migrate dev`
    * `npx prisma db seed`
    * `npm run dev`

Robustez do seed:
* Versionar `data/segments.csv` e `data/segment_profiles.json` já gerados para o app rodar sem executar o treino.
* Se não existirem no seed: carregar clientes mesmo assim (segmentos nulos) e exibir aviso; o app não deve quebrar.
* Carga idempotente (rodar o seed novamente não duplica registros).

### VERSIONAMENTO DE ARTEFATOS
* Versionar no Git: `data/segments.csv`, `data/segment_profiles.json` e métricas (`analysis/models/metrics_vX.json`).
* NÃO versionar binários pesados (`*.joblib`, `*.keras`) — adicionar ao `.gitignore`.
* Figuras de avaliação (`analysis/reports/*.png`) podem ser versionadas se úteis à documentação/README.

### CI/CD (ITEM FUTURO)
Planejado para o final do projeto (quando o repositório GitHub existir):
* GitHub Actions em push/PR: instalar deps, lint (ESLint + Ruff), type-check (tsc --noEmit + Pyright), testes (Vitest + pytest) e build do Next.js.
* Opcional: build da documentação (`mkdocs build`) e deploy.

### README
Gerar README com: instalação, configuração, migrações, execução; carga do CSV via seed/scripts; pipeline de ML (como rodar a clusterização, avaliar e gerar segmentos); métricas do modelo e principais decisões (resumo do model card); estrutura do projeto; explicação do modelo de segmentação (features, padronização, PCA, autoencoder, K-Means, escolha de `k`, interpretação, limitações); como rodar os testes (Vitest e pytest); verificações de qualidade (ESLint, Prettier, Ruff, Pyright); como servir/gerar a documentação (MkDocs); explicação do acesso via cadastro/login; credenciais demo (demo123/demo123); nota de privacidade/uso responsável (LGPD) e limitações; menção ao CI/CD planejado.

Para chamar atenção de recrutadores no GitHub/LinkedIn, o README deve incluir:
* Badges (build, cobertura, licença, tecnologias).
* Screenshots/GIF do dashboard e do mapa de segmentos (PCA).
* Um resumo executivo de 2–3 parágrafos (problema → solução → resultado) no topo.
* Seção "Destaques técnicos" (ML não-supervisionado, autoencoder, avaliação de clusters, full stack, testes, docs).
* Link para a documentação (MkDocs) e para o deploy, quando disponíveis.

### CRITÉRIO DE APROVAÇÃO
O projeto será aprovado apenas se:
* Compilar sem erros.
* Possuir autenticação e cadastro com auto-login funcionais.
* Possuir SQLite funcional; carregar a base a partir de `data/Marketing_data.csv` via seed/scripts; persistir clientes no banco.
* Treinar um modelo de ML não-supervisionado (K-Means, com PCA para visualização e, preferencialmente, Autoencoder comparado ao K-Means direto).
* Tratar valores ausentes de forma explícita (imputação documentada).
* Escolher `k` de forma justificada (elbow + silhouette).
* Avaliar a clusterização com Silhouette, Davies-Bouldin, Calinski-Harabasz e inércia (registrados em `ClusterRun`).
* Atribuir `clusterId`, `segmentLabel`, `pca1`, `pca2` por cliente.
* Interpretar e nomear os segmentos com base nos centróides; preencher `dominantFeatures` e `recommendation` por segmento.
* Persistir métricas e versão do modelo (`ClusterRun` / `modelVersion`).
* Criar usuário demo (demo123/demo123) via seed e exibi-lo na tela de login.
* Usar locale pt-BR e exibir valores monetários em USD de forma consistente.
* Tratar erros nas rotas de API de forma padronizada; estados de loading/erro/vazio nas telas.
* Rodar mesmo sem segmentação gerada (seed tolerante à ausência de `data/segments.csv`).
* Exibir landing page premium, dashboard dinâmico e gráficos filtráveis (incluindo o mapa de dispersão PCA por segmento).
* Exibir lista de clientes com filtros e ordenação e detalhe individual com perfil de segmento e comparativos.
* Ser totalmente responsivo (mobile-first) sem overflow horizontal em 360px, 768px, 1024px e 1440px.
* Suportar tema claro e escuro com alternância persistida.
* Permitir configuração de rótulos/descrições de segmentos por qualquer usuário autenticado.
* Exibir `/dataset` com todas as colunas do CSV + segmento, paginação (25/50/100/200/500/1000) e download do CSV completo.
* Não permitir upload/importação manual pela interface (carga somente via seed/scripts).
* Não usar dados mockados para indicadores principais.
* Possuir testes unitários passando com cobertura mínima na lógica de segmentos, métricas e CSV.
* Possuir testes Python cobrindo dados, features, clusterização, avaliação e scoring.
* Passar sem erros em ESLint, `tsc --noEmit`, Ruff e Pyright.
* Possuir documentação MkDocs funcional (`mkdocs build` sem erros).
* Parecer um produto real de Marketing Analytics pronto para uso.

====================================================================
## PARTE 3 — ESPECIFICAÇÕES DETERMINÍSTICAS (CONTRATOS FIXOS)
====================================================================

Esta parte elimina ambiguidades para garantir implementação **reprodutível e consistente**. Em caso de conflito, a PARTE 3 prevalece sobre as Partes 1 e 2 nos pontos técnicos que ela cobre.

### 3.1 DECISÕES FIXAS DE ML (NÃO NEGOCIÁVEIS)

Para reprodutibilidade determinística entre execuções e implementações:

* **Pipeline canônico obrigatório:** `StandardScaler` → **Autoencoder (encoder de 10 dimensões)** → `KMeans`. O Autoencoder **é obrigatório** (não é opcional). Justificativa: consta do notebook original e é o diferencial técnico do portfólio.
* **Número de clusters FIXO: `k = 4`.** Aplicado sobre a representação comprimida do encoder (10D). Os 4 segmentos mapeiam para os perfis de negócio (Comprador Ativo, Devedor Rotativo, Usuário de Adiantamento, Bom Pagador).
* **Modelo de comparação (baseline):** rodar também K-Means direto (sem autoencoder) sobre os dados padronizados, com `k = 4`, apenas para reportar métricas comparativas no `ClusterRun`. O modelo **ativo/produção** é o `Autoencoder+KMeans`.
* **`modelVersion` inicial:** `"v1"`.
* **Hiperparâmetros fixos:**
    * `StandardScaler`: padrão (with_mean=True, with_std=True).
    * `KMeans`: `n_clusters=4`, `random_state=42`, `n_init=10`, `max_iter=300`.
    * `PCA` (para visualização): `n_components=2`, `random_state=42`.
    * Autoencoder: arquitetura `17 → 500 → 2000 → 10 (encoded) → 2000 → 500 → 17`; ativação `relu` nas camadas ocultas, linear na saída; `optimizer='adam'`, `loss='mean_squared_error'`, `epochs=50`, `batch_size=128`. Fixar sementes: `numpy.random.seed(42)`, `tensorflow.random.set_seed(42)`.
* **Ordem canônica das 17 features** (usada em scaler, encoder, K-Means, `dominantFeatures` — sempre nesta ordem):
  `BALANCE, BALANCE_FREQUENCY, PURCHASES, ONEOFF_PURCHASES, INSTALLMENTS_PURCHASES, CASH_ADVANCE, PURCHASES_FREQUENCY, ONEOFF_PURCHASES_FREQUENCY, PURCHASES_INSTALLMENTS_FREQUENCY, CASH_ADVANCE_FREQUENCY, CASH_ADVANCE_TRX, PURCHASES_TRX, CREDIT_LIMIT, PAYMENTS, MINIMUM_PAYMENTS, PRC_FULL_PAYMENT, TENURE`.
  (`CUST_ID` é excluído das features.)
* **Imputação (fixa):** `MINIMUM_PAYMENTS` e `CREDIT_LIMIT` → **mediana da coluna** calculada no conjunto de treino completo; persistir a mediana usada nos metadados (`metrics_v1.json`) para reprodutibilidade no scoring.
* **Outliers (fixa):** **manter** os outliers (não remover nem winsorizar) no MVP; a padronização já reduz o impacto. Documentar essa decisão no model card.

### 3.2 MAPA CSV → CAMPO PRISMA (EXATO)

O parser (`src/lib/csv/mapping.ts`) e o loader Python (`loading.py`) devem usar exatamente este mapeamento:

| Coluna CSV | Campo Customer (Prisma) | Tipo | Nulável |
|---|---|---|---|
| `CUST_ID` | `custId` | String | não (único) |
| `BALANCE` | `balance` | Float | não |
| `BALANCE_FREQUENCY` | `balanceFrequency` | Float | não |
| `PURCHASES` | `purchases` | Float | não |
| `ONEOFF_PURCHASES` | `oneoffPurchases` | Float | não |
| `INSTALLMENTS_PURCHASES` | `installmentsPurchases` | Float | não |
| `CASH_ADVANCE` | `cashAdvance` | Float | não |
| `PURCHASES_FREQUENCY` | `purchasesFrequency` | Float | não |
| `ONEOFF_PURCHASES_FREQUENCY` | `oneoffPurchasesFrequency` | Float | não |
| `PURCHASES_INSTALLMENTS_FREQUENCY` | `purchasesInstallmentsFrequency` | Float | não |
| `CASH_ADVANCE_FREQUENCY` | `cashAdvanceFrequency` | Float | não |
| `CASH_ADVANCE_TRX` | `cashAdvanceTrx` | Int | não |
| `PURCHASES_TRX` | `purchasesTrx` | Int | não |
| `CREDIT_LIMIT` | `creditLimit` | Float | não (imputado) |
| `PAYMENTS` | `payments` | Float | não |
| `MINIMUM_PAYMENTS` | `minimumPayments` | Float | não (imputado) |
| `PRC_FULL_PAYMENT` | `prcFullPayment` | Float | não |
| `TENURE` | `tenure` | Int | não |

Regra de imputação na carga: se `MINIMUM_PAYMENTS`/`CREDIT_LIMIT` vierem vazios no CSV, o valor já vem imputado por `data/segments.csv`/pipeline Python; o seed **não** deve recalcular medianas (usa o valor entregue). Se rodar sem a camada ML, o seed imputa com a mediana da própria coluna no CSV.

### 3.3 SCHEMA PRISMA DETALHADO (CANÔNICO)

`datasource` = SQLite; `provider = "prisma-client-js"`. Usar exatamente estes tipos:

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Customer {
  id                              String    @id @default(cuid())
  custId                          String    @unique
  balance                         Float
  balanceFrequency                Float
  purchases                       Float
  oneoffPurchases                 Float
  installmentsPurchases           Float
  cashAdvance                     Float
  purchasesFrequency              Float
  oneoffPurchasesFrequency        Float
  purchasesInstallmentsFrequency  Float
  cashAdvanceFrequency            Float
  cashAdvanceTrx                  Int
  purchasesTrx                    Int
  creditLimit                     Float
  payments                        Float
  minimumPayments                 Float
  prcFullPayment                  Float
  tenure                          Int
  clusterId                       Int?
  segmentLabel                    String?
  pca1                            Float?
  pca2                            Float?
  modelVersion                    String?
  scoredAt                        DateTime?
  createdAt                       DateTime  @default(now())
  updatedAt                       DateTime  @updatedAt

  @@index([clusterId])
  @@index([segmentLabel])
  @@index([balance])
  @@index([purchases])
  @@index([creditLimit])
}

model Segment {
  id               String   @id @default(cuid())
  modelVersion     String
  clusterId        Int
  label            String
  description      String
  customerCount    Int
  sharePct         Float
  dominantFeatures String   // JSON serializado (ver 3.5)
  avgBalance       Float
  avgPurchases     Float
  avgCashAdvance   Float
  avgCreditLimit   Float
  avgPrcFullPayment Float
  recommendation   String   // JSON serializado (array de strings) ou texto
  updatedAt        DateTime @updatedAt

  @@unique([modelVersion, clusterId])
}

model ClusterRun {
  id                String   @id @default(cuid())
  modelVersion      String   @unique
  algorithm         String   // "Autoencoder+KMeans" | "KMeans"
  nClusters         Int
  silhouette        Float
  daviesBouldin     Float
  calinskiHarabasz  Float
  inertia           Float
  usedAutoencoder   Boolean
  nComponentsPca    Int
  trainedAt         DateTime
  notes             String?
}

model SegmentationConfig {
  id                 String   @id @default(cuid())
  activeModelVersion String
  updatedAt          DateTime @updatedAt
}
```

Observação SQLite: não há tipo JSON nativo; `dominantFeatures` e `recommendation` são `String` contendo JSON serializado (parse no app).

### 3.4 SINCRONIZAÇÃO DE RÓTULOS (segmentLabel)

Regra para resolver a duplicação `Customer.segmentLabel` × `Segment.label`:
* **Fonte da verdade = `Segment.label`** (chaveado por `modelVersion` + `clusterId`).
* `Customer.segmentLabel` é um **cache desnormalizado** preenchido na carga, apenas para leitura rápida/exportação.
* Ao renomear um segmento em `/settings` (ou via `scripts/relabel-segments.ts`): atualizar `Segment.label` **e** executar um `UPDATE` em massa em `Customer.segmentLabel` de todos os clientes com aquele `clusterId` e `modelVersion` ativos, dentro de **uma transação**. Assim o cache nunca fica dessincronizado.
* Componentes de UI que exibem cor por segmento devem chavear por `clusterId` (estável), nunca pelo texto do label.

### 3.5 SCHEMA DO JSON `dominantFeatures`

Formato fixo (array ordenado do mais dominante para o menos, no máximo 6 itens):

```json
[
  { "feature": "CASH_ADVANCE", "direction": "high", "zScore": 2.13, "centroidValue": 4200.5, "overallMean": 978.8 },
  { "feature": "PURCHASES", "direction": "low", "zScore": -0.87, "centroidValue": 120.3, "overallMean": 1003.2 }
]
```

Regras:
* `feature`: nome da coluna CSV original (maiúsculas).
* `direction`: `"high"` se `zScore > 0`, `"low"` se `zScore < 0`.
* `zScore`: `(centroide_padronizado)` da feature — ou seja, o valor do centróide no espaço já padronizado (equivale a quantos desvios-padrão o segmento está da média geral).
* `centroidValue`: valor do centróide em escala original (via `inverse_transform`).
* `overallMean`: média geral da feature na base completa (escala original).
* Seleção dos itens: ordenar por `abs(zScore)` desc; incluir os que tiverem `abs(zScore) >= 0.5` (mín. 3 itens; máx. 6).

`recommendation`: JSON array de strings, ex.: `["Ofertar cashback", "Programa de fidelidade", "Upgrade de limite"]`.

### 3.6 FORMATO DE `data/segments.csv` E `data/segment_profiles.json`

`data/segments.csv` (uma linha por cliente, cabeçalho exato):
```
CUST_ID,clusterId,pca1,pca2,segmentLabel,modelVersion
C10001,3,-1.234,0.567,Bom Pagador,v1
```

`data/segment_profiles.json` (uma entrada por cluster):
```json
{
  "modelVersion": "v1",
  "segments": [
    {
      "clusterId": 0,
      "label": "Devedor Rotativo",
      "description": "Alto saldo devedor e baixa taxa de pagamento integral.",
      "customerCount": 3120,
      "sharePct": 34.86,
      "avgBalance": 2450.1,
      "avgPurchases": 640.2,
      "avgCashAdvance": 310.5,
      "avgCreditLimit": 5200.0,
      "avgPrcFullPayment": 0.04,
      "dominantFeatures": [ { "feature": "BALANCE", "direction": "high", "zScore": 1.4, "centroidValue": 2450.1, "overallMean": 1564.5 } ],
      "recommendation": ["Renegociação de dívida", "Educação financeira", "Parcelamento de saldo"]
    }
  ]
}
```

### 3.7 CONTRATOS DE API

Convenções globais:
* Todas as respostas de sucesso: HTTP 200 com JSON conforme abaixo.
* Erros: `{ "error": { "message": string, "code": string } }` com status 400/401/404/422/500.
* Rotas autenticadas retornam 401 sem sessão válida.
* Paginação padrão: `page` (1-based, default 1), `pageSize` (default 25).
* Valores monetários trafegam como número (Float) em USD; a formatação é no cliente.

**GET `/api/metrics`** — KPIs e agregações do dashboard. Query (todos opcionais, filtros globais): `segment` (clusterId), `balanceMin`, `balanceMax`, `creditLimitMin`, `creditLimitMax`, `purchasesMin`, `purchasesMax`, `tenure`, `prcFullPaymentMin`, `prcFullPaymentMax`.
```json
{
  "kpis": {
    "totalCustomers": 8950,
    "numSegments": 4,
    "avgBalance": 1564.47,
    "avgPurchases": 1003.20,
    "avgCreditLimit": 4494.45,
    "avgPayments": 1733.14,
    "avgPrcFullPayment": 0.1537,
    "avgTenure": 11.52,
    "cashAdvanceUsersPct": 0.46
  },
  "segmentDistribution": [ { "clusterId": 0, "label": "Devedor Rotativo", "count": 3120, "sharePct": 34.86 } ],
  "charts": {
    "balanceHistogram": [ { "bucket": "0–2k", "count": 6100 } ],
    "creditLimitHistogram": [ { "bucket": "0–2k", "count": 1200 } ],
    "purchaseTypeSplit": { "oneoff": 0.59, "installments": 0.41 },
    "purchasesFrequencyBuckets": [ { "bucket": "Alta", "count": 4380 } ],
    "correlationMatrix": [ { "x": "BALANCE", "y": "CASH_ADVANCE", "value": 0.5 } ]
  },
  "hasSegmentation": true
}
```

**GET `/api/customers`** — lista paginada/filtrada. Query: `page`, `pageSize` (25|50|100|200|500|1000), `search` (por custId), `segment` (clusterId), `balanceMin/Max`, `purchasesMin/Max`, `creditLimitMin/Max`, `tenure`, `sortBy` (campo Customer), `sortDir` (`asc|desc`).
```json
{
  "data": [
    { "id": "clx...", "custId": "C10001", "clusterId": 3, "segmentLabel": "Bom Pagador",
      "balance": 40.9, "purchases": 95.4, "cashAdvance": 0, "creditLimit": 1000,
      "payments": 201.8, "prcFullPayment": 0, "tenure": 12 }
  ],
  "total": 8950,
  "page": 1,
  "pageSize": 25,
  "totalPages": 358
}
```

**GET `/api/customers/[id]`** — detalhe de um cliente (por `id` cuid ou `custId`). Retorna todos os campos do `Customer` + o perfil do seu segmento + comparativos:
```json
{
  "customer": { "...todos os campos..." },
  "segment": { "clusterId": 3, "label": "Bom Pagador", "description": "...", "dominantFeatures": [ ... ], "recommendation": [ ... ] },
  "comparison": [
    { "feature": "BALANCE", "customer": 40.9, "segmentAvg": 300.1, "overallAvg": 1564.5 }
  ]
}
```

**GET `/api/segments`** — perfis dos segmentos + métricas do modelo ativo:
```json
{
  "modelVersion": "v1",
  "model": { "algorithm": "Autoencoder+KMeans", "nClusters": 4, "silhouette": 0.42,
             "daviesBouldin": 0.98, "calinskiHarabasz": 3120.5, "inertia": 12345.6,
             "usedAutoencoder": true, "nComponentsPca": 2, "trainedAt": "2026-07-15T00:00:00Z" },
  "segments": [ { "clusterId": 0, "label": "...", "description": "...", "customerCount": 3120,
                  "sharePct": 34.86, "dominantFeatures": [ ... ], "recommendation": [ ... ],
                  "avgBalance": 2450.1, "avgPurchases": 640.2, "avgCashAdvance": 310.5,
                  "avgCreditLimit": 5200.0, "avgPrcFullPayment": 0.04 } ]
}
```

**GET `/api/insights`** — insights executivos calculados (array de textos + dados de apoio):
```json
{ "insights": [ { "key": "largest-segment", "title": "Maior segmento",
                  "text": "O segmento 'Devedor Rotativo' concentra 34,9% da base (3.120 clientes).",
                  "value": 34.86 } ] }
```

**GET `/api/dataset`** — dataset completo paginado (todas as colunas + segmento). Query: `page`, `pageSize` (25|50|100|200|500|1000), `search`.
```json
{ "data": [ { "custId": "C10001", "balance": 40.9, "...": "...(todas as 18 colunas)...", "clusterId": 3, "segmentLabel": "Bom Pagador" } ],
  "total": 8950, "page": 1, "pageSize": 50, "totalPages": 179 }
```

**GET `/api/dataset/download`** — retorna o CSV completo. Headers: `Content-Type: text/csv; charset=utf-8`, `Content-Disposition: attachment; filename="marketing_customers_segmented.csv"`. Corpo = CSV com todas as colunas originais + `clusterId` + `segmentLabel`.

**POST `/api/register`** — body `{ name, email, password, confirmPassword }` validado por Zod. Sucesso: 201 `{ "user": { "id", "name", "email" } }`. Email duplicado: 422 com `code: "EMAIL_TAKEN"`.

**GET `/api/settings`** — retorna `{ "activeModelVersion": "v1", "segments": [ { "clusterId", "label", "description", "recommendation" } ] }`.

**PATCH `/api/settings`** — body `{ "activeModelVersion"?: string, "segments"?: [ { "clusterId": number, "label"?: string, "description"?: string, "recommendation"?: string[] } ] }`. Valida com Zod; atualiza `Segment` e propaga `Customer.segmentLabel` em transação (ver 3.4). Retorna o estado atualizado.

`/api/auth/[...nextauth]` — handler padrão do NextAuth (Credentials).

### 3.8 CONSTANTES E BINS FIXOS (`src/config/constants.ts`)

**Cores por segmento (chaveadas por clusterId — atribuídas conforme o perfil dominante identificado no scoring):**
* Comprador Ativo → `#2563EB` (azul)
* Devedor Rotativo → `#EA580C` (laranja)
* Usuário de Adiantamento → `#DC2626` (vermelho)
* Bom Pagador → `#16A34A` (verde)
* Fallback / não classificado → `#6B7280` (cinza)

**Bins do histograma de BALANCE (USD):** `[0–2000, 2000–4000, 4000–6000, 6000–8000, 8000–10000, 10000+]`.

**Bins do histograma de CREDIT_LIMIT (USD):** `[0–2000, 2000–4000, 4000–6000, 6000–8000, 8000–10000, 10000+]`.

**Buckets de frequência de compras (`PURCHASES_FREQUENCY`, aplicável às demais colunas `*_FREQUENCY`):**
* `Nunca`: valor `== 0`
* `Baixa`: `> 0` e `< 0.25`
* `Média`: `>= 0.25` e `< 0.75`
* `Alta`: `>= 0.75`

**Faixas do filtro TENURE:** valores discretos de 6 a 12 (selectbox com valores presentes na base); filtro por igualdade.

**Split compras à vista vs. parceladas:** `oneoff = soma(ONEOFF_PURCHASES) / (soma(ONEOFF_PURCHASES)+soma(INSTALLMENTS_PURCHASES))`; `installments = complemento`.

**`cashAdvanceUsersPct`:** proporção de clientes com `CASH_ADVANCE > 0`.

**Variáveis do heatmap de correlação (subconjunto relevante, correlação de Pearson):**
`BALANCE, PURCHASES, ONEOFF_PURCHASES, INSTALLMENTS_PURCHASES, CASH_ADVANCE, CREDIT_LIMIT, PAYMENTS, MINIMUM_PAYMENTS, PRC_FULL_PAYMENT`.

**Mascaramento de `custId` na UI:** exibir os 3 primeiros e 2 últimos caracteres (ex.: `C10001` → `C10…01`); valor completo apenas no download do CSV.

### 3.9 VERSÕES PINADAS (baseline recomendada)

Para reprodutibilidade (ajustar patches conforme disponibilidade, mantendo os majors):
* Node.js `20.x` LTS; npm `10.x`.
* Next.js `15.x`; React `19.x`; TypeScript `5.x`.
* Tailwind CSS `3.4.x`; Prisma `5.x`; `@prisma/client` `5.x`.
* `next-auth` `5.x` (Auth.js) ou `4.x` estável — usar uma versão e documentar; bcrypt `5.x`.
* `react-hook-form` `7.x`; `zod` `3.x`; `recharts` `2.x`; `papaparse` `5.x`; `lucide-react` (última estável).
* Vitest `2.x`; `@testing-library/react` `16.x`.
* Python `3.11`; pandas `2.x`; numpy `1.26.x`; scikit-learn `1.4.x`; tensorflow `2.15.x`; joblib `1.3.x`; matplotlib `3.8.x`; seaborn `0.13.x`; pytest `8.x`; ruff (última); pyright (última).

Pinar versões exatas em `package.json`/`package-lock.json` e `pyproject.toml` na primeira instalação e commitar os lockfiles.

### 3.10 VARIÁVEIS DE AMBIENTE (`.env.example`)

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="troque-por-um-segredo-forte"
NEXTAUTH_URL="http://localhost:3000"
```

`.env` real não é versionado (consta do `.gitignore`).

### 3.11 REGRA DE CLASSIFICAÇÃO DOS 4 SEGMENTOS (rotulagem automática)

Como o `clusterId` do K-Means é arbitrário entre execuções, `interpret.py` deve **atribuir os rótulos de negócio automaticamente** a partir dos centróides (escala original), por regra determinística:
* **Usuário de Adiantamento:** cluster com maior `CASH_ADVANCE` médio.
* **Bom Pagador:** entre os restantes, cluster com maior `PRC_FULL_PAYMENT` médio.
* **Comprador Ativo:** entre os restantes, cluster com maior `PURCHASES` médio.
* **Devedor Rotativo:** o cluster restante (ou, se empate, o de maior `BALANCE` médio com baixo `PRC_FULL_PAYMENT`).

Registrar o mapeamento `clusterId → label` em `segment_profiles.json`. Se um perfil real divergir, `interpret.py` deve escolher o rótulo pela característica dominante e documentar no model card (a regra acima é o critério de desempate padrão).

---

## STATUS DE EXECUCAO (checkpoint em 2026-07-15)

### Fase 1 - Fundacao do projeto
**Status:** Concluida

- Estrutura base criada (`data/`, `analysis/`, `src/`, `tests/`, `docs/`, `prisma/`).
- Configuracoes iniciais prontas (`package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `.eslintrc.json`, `.prettierrc`, `.editorconfig`, `.env.example`, `.gitignore`).
- Dataset copiado para `data/Marketing_data.csv`.
- Ambiente Python com `.venv` e dependencias instaladas para Python 3.12.

### Fase 2 - Pipeline de ML (clusterizacao)
**Status:** Concluida

- Camada `analysis/marketing_analytics` implementada:
  - `loading.py`, `features.py`, `reduce.py`, `cluster.py`, `evaluate.py`, `interpret.py`, `score.py`, `metrics.py`, `plots.py`.
- CLIs implementadas:
  - `analysis/scripts/run_clustering.py`
  - `analysis/scripts/generate_segments.py`
- Testes Python implementados e validados:
  - `analysis/tests/test_loading.py`
  - `analysis/tests/test_features.py`
  - `analysis/tests/test_cluster.py`
  - `analysis/tests/test_evaluate.py`
  - `analysis/tests/test_score.py`
- Validacoes executadas:
  - `ruff check analysis` -> OK
  - `pyright` -> OK (0 erros)
  - `pytest analysis/tests -q` -> OK (14 passed)
- Pipeline executado com dados reais e artefatos gerados:
  - `analysis/models/metrics_v1.json`
  - `analysis/models/scaler_v1.joblib`
  - `analysis/models/kmeans_v1.joblib`
  - `analysis/models/pca_v1.joblib`
  - `analysis/models/encoder_v1.keras`
  - `analysis/reports/elbow_curve.png`
  - `analysis/reports/pca_scatter.png`
  - `analysis/reports/segment_profiles.png`
  - `data/segments.csv`
  - `data/segment_profiles.json`

### Fase 3 - Backend base + autenticacao (Auth.js + Prisma + SQLite)
**Status:** Concluida

- Prisma configurado com modelos `User`, `Customer`, `Segment`, `ClusterRun`, `SegmentationConfig` em `prisma/schema.prisma`.
- Migracao inicial aplicada (`prisma/migrations/20260715181512_fase3_auth_base/migration.sql`).
- Seed idempotente implementado em `prisma/seed.ts`:
  - cria/atualiza usuario demo (`demo123` / `demo123`) com bcrypt;
  - importa `data/Marketing_data.csv`;
  - integra `data/segments.csv` e `data/segment_profiles.json`;
  - importa metricas de `analysis/models/metrics_v1.json`.
- Auth.js com credenciais implementado:
  - `src/lib/auth/options.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/middleware.ts`.
- Registro de usuario implementado:
  - `src/app/api/register/route.ts`, validacao Zod em `src/lib/validations/auth.schema.ts`.
- Estrutura inicial de rotas App Router criada:
  - layouts/paginas para `(marketing)`, `(auth)`, `(dashboard)` e rotas principais (`/login`, `/register`, `/dashboard`, `/insights`, `/customers`, `/dataset`, `/settings`).
- Validacoes executadas nesta etapa:
  - `npx prisma generate` -> OK
  - `npx prisma migrate dev --name fase3_auth_base --skip-seed` -> OK
  - `npx prisma db seed` -> OK (8.950 clientes, 4 segmentos)
  - `npm run typecheck` -> OK
  - `npm run lint` -> OK
  - `mkdocs build` -> OK

- APIs implementadas:
  - `/api/register`
  - `/api/auth/[...nextauth]`
  - `/api/metrics`
  - `/api/insights`
  - `/api/segments`
  - `/api/settings` (GET/PATCH)
  - `/api/customers`
  - `/api/dataset`
  - `/api/dataset/download`

- Páginas implementadas com consumo real do banco:
  - `/` (landing)
  - `/login`, `/register`
  - `/dashboard`
  - `/insights`
  - `/customers`
  - `/customers/[id]`
  - `/dataset`
  - `/settings`

- Scripts auxiliares implementados:
  - `scripts/import-csv.ts`
  - `scripts/relabel-segments.ts`

- Documentacao base criada em `docs/` e `README.md` para execucao e arquitetura.

### Proxima retomada (continuidade da Fase 3)

- Iniciar Fase 4: refinamento visual premium, componentes de graficos interativos e filtros globais avancados.
- Iniciar Fase 5: cobertura de testes unitarios/integracao TypeScript ate meta definida no PRD.
- Iniciar Fase 6: consolidacao da documentacao tecnica e model card detalhado.

### Fase 4 - Refinamento visual e graficos interativos
**Status:** Concluida (implementacao completa em 2026-07-15)

- Design system visual evoluido (tokens CSS, superficies e cards) em `src/app/globals.css`.
- **Tema claro/escuro completo** implementado:
  - Provider com `next-themes` em `src/components/providers/theme-provider.tsx`.
  - Componente `ThemeToggle` em `src/components/ui/theme-toggle.tsx`.
  - Suporte a `prefers-color-scheme` e persistencia em localStorage.
  - Tokens CSS para dark mode em `globals.css`.
- **Layout responsivo** com componentes modulares:
  - `Sidebar`, `Topbar`, `MobileNav` separados em `src/components/layout/`.
  - Menu mobile com drawer adaptado para telas pequenas.
  - Icones Lucide integrados na navegacao.
- **Filtros globais completos** no dashboard:
  - Segmento, Saldo (min/max), Compras (min/max), Limite (min/max), TENURE, PRC_FULL_PAYMENT (min/max).
- **11 graficos obrigatorios** implementados em `src/components/charts/`:
  - `PcaScatter` (dispersao PCA por segmento)
  - `DonutChart` (distribuicao por segmento, compras a vista vs parcelado, pagamento de fatura)
  - `Histogram` (saldo e limite de credito)
  - `ScatterPlot` (saldo vs limite, cash advance vs saldo)
  - `FrequencyBars` (frequencia de compras: Nunca/Baixa/Media/Alta)
  - `SegmentRadar` (comparacao de medias por segmento)
  - `Heatmap` (matriz de correlacao)
- **Painel de Qualidade do Modelo** (`ModelQualityPanel`):
  - Exibe algoritmo, versao, k, Silhouette, Davies-Bouldin, Calinski-Harabasz, data de treino.
  - Indicador visual se usou Autoencoder.
- **Insights com visualizacao**:
  - 7 insights calculados do banco (maior segmento, maior saldo, maior adiantamento, melhor pagador, diferenca de limite, compras a vista vs parcelado, concentracao de volume).
  - Mapa de dispersao PCA integrado na pagina.
- **API `/api/customers/[id]`** criada conforme contrato (customer + segment + comparison).
- **API `/api/metrics`** expandida com histogramas, splits, frequencias e matriz de correlacao.
- Componentizacao em `src/components/charts/`, `src/components/segments/`, `src/components/ui/`.
- Validacao desta etapa:
  - `npm run typecheck` -> pendente
  - `npm run lint` -> pendente

### Fase 5 - Testes TypeScript (unit + integration)
**Status:** Concluida

- Suite de testes implementada para modulos criticos:
  - `src/lib/segments` (labels, profile, recommendations)
  - `src/lib/metrics` (aggregations, correlations)
  - `src/lib/csv` (parser, mapping)
  - `src/lib/validations` (auth, settings, customer)
- Testes de integracao API adicionados:
  - `tests/integration/api-customers.test.ts`
  - `tests/integration/api-metrics.test.ts`
  - `tests/integration/api-insights.test.ts`
- Cobertura validada com thresholds do projeto:
  - `npm run test` -> OK
  - `npm run test:cov` -> OK (linhas/funcoes/statements >= 80, branches >= 80)

### Proxima retomada (Fase 6 -> Fase 7)

- Consolidar documentacao tecnica final (model card expandido e exemplos de API completos).
- Rodar bateria final de validacao cruzada (TS/Python/docs) para fechamento total.

### Fase 6 - Documentacao tecnica final
**Status:** Concluida

- Documentacao expandida em `docs/`:
  - `docs/api.md` com exemplos de payloads e respostas.
  - `docs/segmentation-model.md` com metricas, rotulagem e limitacoes.
  - `docs/ml-pipeline.md` com artefatos e reproducibilidade.
  - `docs/data-pipeline.md` com estrategia de falha controlada.
- `README.md` consolidado com setup, scripts e credenciais demo.
- Build de documentacao validado: `mkdocs build` -> OK.

### Fase 7 - Validacao final e prontidao de entrega
**Status:** Concluida

- Validacao TypeScript:
  - `npm run typecheck` -> OK
  - `npm run lint` -> OK
- Validacao de testes TS:
  - `npm run test` -> OK
  - `npm run test:cov` -> OK (cobertura com thresholds atendidos)
- Validacao Python (via `.venv`):
  - `pytest analysis/tests -q` -> OK (14 passed)
  - `ruff check analysis` -> OK
  - `pyright` -> OK (0 errors)
- Validacao docs:
  - `mkdocs build` -> OK

### Fase 8 - Completude de artefatos e recursos
**Status:** Concluida (2026-07-15)

- **Notebooks** organizados em `analysis/`:
  - `analysis/eda.ipynb` (analise exploratoria)
  - `analysis/clustering.ipynb` (pipeline de clusterizacao)
- **Grafico silhouette.png** gerado via `plot_silhouette()` em `analysis/marketing_analytics/plots.py`.
- **Fixtures de teste** criadas em `tests/fixtures/sample_marketing.csv`.
- **Config** adicionada em `src/config/site.ts`.
- Todos os 4 reports PNG presentes em `analysis/reports/`:
  - `elbow_curve.png`, `pca_scatter.png`, `segment_profiles.png`, `silhouette.png`

### STATUS GERAL DO PRD
**Status:** Implementacao concluida (Fases 1 a 8)

- O projeto esta funcional ponta a ponta com:
  - pipeline ML + artefatos (autoencoder + K-Means, k=4),
  - backend/auth (Auth.js + Prisma + SQLite),
  - dashboard premium com 11 graficos interativos + tema claro/escuro,
  - 7 insights executivos calculados,
  - todas as APIs de dados conforme contrato,
  - testes TypeScript e Python,
  - documentacao MkDocs completa.

*Documento gerado como PRD profissional para projeto de portfólio (GitHub + LinkedIn).*
*Domínio: Marketing Analytics — Segmentação de Clientes de Cartão de Crédito.*
*Base: Credit Card Dataset for Clustering (Kaggle) — 8.950 clientes, 18 variáveis.*
*PARTE 3 adicionada para garantir implementação determinística e sem ambiguidade.*
