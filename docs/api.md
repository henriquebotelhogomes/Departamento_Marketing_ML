# API

## Rotas implementadas

- `POST /api/register`
- `GET/POST /api/auth/[...nextauth]`
- `GET /api/metrics`
- `GET /api/insights`
- `GET /api/segments`
- `GET/PATCH /api/settings`
- `GET /api/customers`
- `GET /api/dataset`
- `GET /api/dataset/download`

## Exemplos

### `GET /api/metrics`

```json
{
  "totalCustomers": 8950,
  "nSegments": 4,
  "avgBalance": 1564.47,
  "avgPurchases": 1003.20,
  "avgCreditLimit": 4494.45,
  "avgPayments": 1733.14,
  "avgPrcFullPayment": 0.153,
  "avgTenure": 11.5,
  "cashAdvanceUsersPct": 0.49
}
```

### `GET /api/customers?page=1&pageSize=25&search=C100&segment=Bom%20Pagador`

```json
{
  "data": [
    {
      "id": "clx...",
      "custId": "C10003",
      "balance": 2495.148862,
      "purchases": 773.17,
      "clusterId": 2,
      "segmentLabel": "Bom Pagador"
    }
  ],
  "total": 123,
  "page": 1,
  "pageSize": 25,
  "totalPages": 5
}
```

### `PATCH /api/settings`

```json
{
  "activeModelVersion": "v1",
  "segments": [
    { "clusterId": 1, "label": "Comprador Premium" }
  ]
}
```

## Respostas

As rotas retornam JSON e usam status padrao (`200`, `201`, `422`, `500`).

- `422`: validação de entrada (Zod)
- `500`: erro interno
