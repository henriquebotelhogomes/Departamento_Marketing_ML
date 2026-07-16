"""Testes de metricas de avaliacao de clusterizacao."""

from __future__ import annotations

from pathlib import Path

from analysis.marketing_analytics.cluster import treinar_kmeans
from analysis.marketing_analytics.evaluate import (
    calcular_metricas,
    validar_faixas_metricas,
)
from analysis.marketing_analytics.features import padronizar_features
from analysis.marketing_analytics.loading import carregar_dados, extrair_features, limpar_dados


def test_calcular_metricas_faixas_validas(sample_csv_path: Path) -> None:
    """Metricas calculadas estao em faixas plausiveis."""
    df, _ = limpar_dados(carregar_dados(sample_csv_path))
    features = extrair_features(df)
    features_pad, _ = padronizar_features(features)

    kmeans = treinar_kmeans(features_pad, n_clusters=3)
    metricas = calcular_metricas(features_pad, kmeans.labels_, kmeans)

    assert -1.0 <= metricas.silhouette <= 1.0
    assert metricas.davies_bouldin > 0
    assert metricas.calinski_harabasz > 0
    assert metricas.inertia > 0
    validar_faixas_metricas(metricas)  # nao levanta
