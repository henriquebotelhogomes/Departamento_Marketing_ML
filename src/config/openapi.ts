import type { OpenAPIV3 } from "openapi-types";

const spec: OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "CardSense API",
    version: "1.0.0",
    description:
      "API da plataforma CardSense — segmentação de clientes de cartão de crédito. " +
      "Fornece métricas, insights, dados de clientes, segmentos e configurações.\n\n" +
      "**Autenticação:** As rotas protegidas exigem sessão ativa via Auth.js. " +
      "Faça login em `/login` com `demo123 / demo123` antes de testar as chamadas diretamente no Swagger.",
    contact: {
      name: "CardSense",
      url: "https://github.com/seu-usuario/cardsense",
    },
  },
  servers: [
    { url: "http://localhost:3000", description: "Desenvolvimento local" },
  ],
  tags: [
    { name: "Auth", description: "Cadastro e autenticação" },
    { name: "Métricas", description: "KPIs e dados agregados para gráficos" },
    { name: "Insights", description: "Insights executivos de segmentação" },
    { name: "Segmentos", description: "Dados dos segmentos e qualidade do modelo" },
    { name: "Clientes", description: "Listagem e detalhe de clientes" },
    { name: "Dataset", description: "Exportação do dataset completo" },
    { name: "Configurações", description: "Rótulos de segmentos e versão do modelo" },
  ],
  paths: {
    "/api/register": {
      post: {
        tags: ["Auth"],
        summary: "Cadastrar novo usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password", "confirmPassword"],
                properties: {
                  name: { type: "string", minLength: 2, example: "Henrique" },
                  email: { type: "string", format: "email", example: "henrique@email.com" },
                  password: { type: "string", minLength: 6, example: "senha123" },
                  confirmPassword: { type: "string", minLength: 6, example: "senha123" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Usuário criado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          "422": {
            description: "Erro de validação ou email já em uso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "object",
                      properties: {
                        code: { type: "string", example: "VALIDATION_ERROR" },
                        message: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/callback/credentials": {
      post: {
        tags: ["Auth"],
        summary: "Login com credenciais (NextAuth callback)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "demo123" },
                  password: { type: "string", example: "demo123" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Login bem-sucedido" },
          "401": { description: "Credenciais inválidas" },
        },
      },
    },
    "/api/metrics": {
      get: {
        tags: ["Métricas"],
        summary: "KPIs e dados para gráficos do dashboard",
        description: "Retorna indicadores agregados, histogramas, correlação e splits. Aceita filtros opcionais.",
        parameters: [
          { name: "segment", in: "query", schema: { type: "string" }, description: "Filtrar por segmentLabel" },
          { name: "minBalance", in: "query", schema: { type: "number" }, description: "Saldo mínimo" },
          { name: "maxBalance", in: "query", schema: { type: "number" }, description: "Saldo máximo" },
          { name: "minPurchases", in: "query", schema: { type: "number" }, description: "Compras mínimas" },
          { name: "maxPurchases", in: "query", schema: { type: "number" }, description: "Compras máximas" },
          { name: "minCreditLimit", in: "query", schema: { type: "number" }, description: "Limite mínimo" },
          { name: "maxCreditLimit", in: "query", schema: { type: "number" }, description: "Limite máximo" },
          { name: "tenure", in: "query", schema: { type: "number" }, description: "Tempo de relacionamento (meses)" },
          { name: "prcFullPaymentMin", in: "query", schema: { type: "number" }, description: "% pagamento integral mínimo" },
          { name: "prcFullPaymentMax", in: "query", schema: { type: "number" }, description: "% pagamento integral máximo" },
        ],
        responses: {
          "200": {
            description: "Métricas do dashboard",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    kpis: {
                      type: "object",
                      properties: {
                        totalCustomers: { type: "integer", example: 8950 },
                        numSegments: { type: "integer", example: 4 },
                        avgBalance: { type: "number", example: 1564.47 },
                        avgPurchases: { type: "number", example: 1003.20 },
                        avgCreditLimit: { type: "number", example: 4494.45 },
                        avgPayments: { type: "number", example: 1733.14 },
                        avgPrcFullPayment: { type: "number", example: 0.153 },
                        avgTenure: { type: "number", example: 11.5 },
                        cashAdvanceUsersPct: { type: "number", example: 0.49 },
                      },
                    },
                    charts: { type: "object" },
                    hasSegmentation: { type: "boolean" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/insights": {
      get: {
        tags: ["Insights"],
        summary: "Insights executivos de segmentação",
        description: "Retorna análises estratégicas: maior segmento, maior saldo, maior adiantamento, melhor pagador.",
        responses: {
          "200": {
            description: "Lista de insights",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    insights: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          key: { type: "string" },
                          title: { type: "string" },
                          text: { type: "string" },
                          value: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/segments": {
      get: {
        tags: ["Segmentos"],
        summary: "Listar segmentos e metadados do modelo ativo",
        responses: {
          "200": {
            description: "Segmentos ativos com métricas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    activeModelVersion: { type: "string", example: "v1" },
                    segments: {
                      type: "array",
                      items: { type: "object" },
                    },
                    clusterRun: {
                      type: "object",
                      nullable: true,
                      description: "Métricas de qualidade do modelo (Silhouette, DB, CH, inércia)",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/customers": {
      get: {
        tags: ["Clientes"],
        summary: "Listar clientes com paginação e busca",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" }, description: "Busca por CUST_ID" },
          { name: "segment", in: "query", schema: { type: "string" }, description: "Filtrar por segmentLabel" },
          { name: "page", in: "query", schema: { type: "integer", default: 1, minimum: 1 }, description: "Página" },
          { name: "pageSize", in: "query", schema: { type: "integer", default: 50, minimum: 1 }, description: "Itens por página" },
          {
            name: "sortBy",
            in: "query",
            schema: {
              type: "string",
              enum: ["balance", "purchases", "cashAdvance", "creditLimit", "payments", "prcFullPayment", "tenure", "custId"],
              default: "custId",
            },
            description: "Campo de ordenação",
          },
          { name: "sortOrder", in: "query", schema: { type: "string", enum: ["asc", "desc"], default: "asc" } },
        ],
        responses: {
          "200": {
            description: "Lista paginada de clientes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "array", items: { type: "object" } },
                    total: { type: "integer" },
                    page: { type: "integer" },
                    pageSize: { type: "integer" },
                    totalPages: { type: "integer" },
                  },
                },
              },
            },
          },
          "422": {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "object",
                      properties: {
                        code: { type: "string" },
                        message: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/customers/{id}": {
      get: {
        tags: ["Clientes"],
        summary: "Detalhe do cliente com comparação de segmento",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID do cliente (UUID)" },
        ],
        responses: {
          "200": {
            description: "Cliente, segmento e comparação",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    customer: { type: "object" },
                    segment: { type: "object", nullable: true },
                    comparison: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          feature: { type: "string" },
                          customer: { type: "number" },
                          segmentAvg: { type: "number" },
                          overallAvg: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Cliente não encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "object",
                      properties: {
                        message: { type: "string" },
                        code: { type: "string", example: "NOT_FOUND" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/dataset": {
      get: {
        tags: ["Dataset"],
        summary: "Dataset completo com paginação e busca",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" }, description: "Busca por CUST_ID" },
          { name: "page", in: "query", schema: { type: "integer", default: 1, minimum: 1 }, description: "Página" },
          { name: "pageSize", in: "query", schema: { type: "integer", default: 50, minimum: 1 }, description: "Itens por página" },
          {
            name: "sortBy",
            in: "query",
            schema: {
              type: "string",
              enum: ["balance", "purchases", "cashAdvance", "creditLimit", "payments", "prcFullPayment", "tenure", "custId"],
              default: "custId",
            },
          },
          { name: "sortOrder", in: "query", schema: { type: "string", enum: ["asc", "desc"], default: "asc" } },
        ],
        responses: {
          "200": {
            description: "Dataset paginado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "array", items: { type: "object" } },
                    total: { type: "integer" },
                    page: { type: "integer" },
                    pageSize: { type: "integer" },
                    totalPages: { type: "integer" },
                  },
                },
              },
            },
          },
          "422": {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "object",
                      properties: {
                        code: { type: "string" },
                        message: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/dataset/download": {
      get: {
        tags: ["Dataset"],
        summary: "Download do dataset completo em CSV",
        responses: {
          "200": {
            description: "Arquivo CSV",
            content: {
              "text/csv": {
                schema: { type: "string" },
              },
            },
            headers: {
              "Content-Disposition": {
                schema: { type: "string", example: 'attachment; filename="marketing_customers_segmented.csv"' },
              },
            },
          },
        },
      },
    },
    "/api/settings": {
      get: {
        tags: ["Configurações"],
        summary: "Consultar configurações atuais",
        responses: {
          "200": {
            description: "Versão ativa e segmentos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    activeModelVersion: { type: "string", example: "v1" },
                    segments: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Configurações"],
        summary: "Atualizar configurações (rótulos, descrições, versão do modelo)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  activeModelVersion: { type: "string", description: "Versão do modelo a ativar" },
                  segments: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        clusterId: { type: "integer" },
                        label: { type: "string", minLength: 2 },
                        description: { type: "string", minLength: 5 },
                        recommendation: { type: "array", items: { type: "string" } },
                      },
                    },
                  },
                },
              },
              example: {
                segments: [
                  {
                    clusterId: 1,
                    label: "Comprador Premium",
                    description: "Clientes com alto volume de compras e limite elevado",
                    recommendation: ["Oferecer programa de fidelidade premium", "Cashback em compras acima de R$ 3000"],
                  },
                ],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Configurações atualizadas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    activeModelVersion: { type: "string" },
                    segments: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
          "422": {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "object",
                      properties: {
                        code: { type: "string", example: "VALIDATION_ERROR" },
                        message: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default spec;
