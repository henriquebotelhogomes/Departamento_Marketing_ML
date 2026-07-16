# Pipeline de Dados

1. `Marketing_data.csv` é lido no seed.
2. `segments.csv` adiciona `clusterId`, `segmentLabel`, `pca1`, `pca2`, `modelVersion`.
3. `segment_profiles.json` popula tabela `Segment`.
4. `metrics_v1.json` popula tabela `ClusterRun`.

A carga é idempotente por `custId`.

## Falha controlada

Se `segments.csv` e `segment_profiles.json` não existirem:

- os clientes ainda são carregados no banco;
- campos de segmentação ficam nulos;
- o app continua funcional e exibe aviso para executar a camada de ML.
