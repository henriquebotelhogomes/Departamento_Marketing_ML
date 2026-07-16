# Pipeline de ML

## Treino

```bash
python -m analysis.scripts.run_clustering
```

Gera artefatos em `analysis/models/` e figuras em `analysis/reports/`.

Artefatos principais:

- `analysis/models/scaler_v1.joblib`
- `analysis/models/kmeans_v1.joblib`
- `analysis/models/pca_v1.joblib`
- `analysis/models/encoder_v1.keras`
- `analysis/models/metrics_v1.json`

## Scoring

```bash
python -m analysis.scripts.generate_segments
```

Gera:

- `data/segments.csv`
- `data/segment_profiles.json`

## Reprodutibilidade

- Seed aleatória fixa (`random_state=42`).
- Hiperparâmetros de K-Means e arquitetura de autoencoder fixos no módulo `analysis/marketing_analytics/config.py`.
