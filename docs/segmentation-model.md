# Segmentation Model

## Dataset

- Fonte: `data/Marketing_data.csv`
- 8.950 clientes e 18 colunas

## Pipeline

- Limpeza e imputação de nulos
- Padronização com `StandardScaler`
- Autoencoder (10D) + KMeans (`k=4`)
- PCA 2D para visualização

## Métricas

Armazenadas em `analysis/models/metrics_v1.json` e `ClusterRun` no banco.

Principais métricas da versão ativa `v1`:

- Silhouette: ~0.35
- Davies-Bouldin: ~1.52
- Calinski-Harabasz: ~2502
- Inércia: ~88824

## Rotulagem de segmentos

O mapeamento de negócio é determinístico, com base em médias por cluster:

1. Maior `CASH_ADVANCE` -> `Usuário de Adiantamento`
2. Maior `PRC_FULL_PAYMENT` (restantes) -> `Bom Pagador`
3. Maior `PURCHASES` (restantes) -> `Comprador Ativo`
4. Cluster restante -> `Devedor Rotativo`

## Limitações

- Dataset estático e anonimizado.
- Segmentos são aproximações estatísticas.
- K-Means depende de escala e parâmetros fixados.
