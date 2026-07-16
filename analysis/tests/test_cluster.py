"""Testes de clusterizacao com K-Means: smoke test e reprodutibilidade."""

from __future__ import annotations

from pathlib import Path

import numpy as np

from analysis.marketing_analytics.cluster import (
    treinar_kmeans,
    validar_labels,
)
from analysis.marketing_analytics.features import padronizar_features
from analysis.marketing_analytics.loading import carregar_dados, extrair_features, limpar_dados


def test_kmeans_smoke_labels_no_intervalo(sample_csv_path: Path) -> None:
    """Smoke test: KMeans com k=4 retorna labels em [0,3] cobrindo todas as amostras."""
    df, _ = limpar_dados(carregar_dados(sample_csv_path))
    features = extrair_features(df)
    features_pad, _ = padronizar_features(features)
    kmeans = treinar_kmeans(features_pad, n_clusters=4)
    labels = kmeans.labels_
    assert labels.shape[0] == features.shape[0]
    assert labels.min() >= 0
    assert labels.max() < 4
    validar_labels(labels, n_clusters=4)  # nao levanta


def test_kmeans_reprodutibilidade(sample_csv_path: Path) -> None:
    """Duas execucoes com random_state=42 produzem os mesmos labels."""
    df, _ = limpar_dados(carregar_dados(sample_csv_path))
    features = extrair_features(df)
    features_pad, _ = padronizar_features(features)

    kmeans_1 = treinar_kmeans(features_pad, n_clusters=4)
    kmeans_2 = treinar_kmeans(features_pad, n_clusters=4)
    np.testing.assert_array_equal(kmeans_1.labels_, kmeans_2.labels_)
