"""Metricas de avaliacao de clusterizacao."""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import (
    calinski_harabasz_score,
    davies_bouldin_score,
    silhouette_score,
)


@dataclass(frozen=True)
class MetricasCluster:
    """Conteiner imutavel com as metricas de qualidade dos clusters.

    Attributes:
        silhouette: Score silhouette em [-1, 1] (maior e melhor).
        davies_bouldin: Indice Davies-Bouldin (menor e melhor).
        calinski_harabasz: Score Calinski-Harabasz (maior e melhor).
        inertia: Inercia (WCSS) do modelo.
    """

    silhouette: float
    davies_bouldin: float
    calinski_harabasz: float
    inertia: float


def calcular_metricas(features: np.ndarray, labels: np.ndarray, kmeans: KMeans) -> MetricasCluster:
    """Calcula todas as metricas obrigatórias do PRD.

    Args:
        features: Array de features usadas na clusterizacao.
        labels: Labels de cluster atribuidas.
        kmeans: Modelo KMeans ajustado.

    Returns:
        MetricasCluster com silhouette, davies_bouldin, calinski_harabasz e inertia.
    """
    return MetricasCluster(
        silhouette=float(silhouette_score(features, labels)),
        davies_bouldin=float(davies_bouldin_score(features, labels)),
        calinski_harabasz=float(calinski_harabasz_score(features, labels)),
        inertia=float(kmeans.inertia_),
    )


def validar_faixas_metricas(metricas: MetricasCluster) -> None:
    """Valida que as metricas estao em faixas plausiveis.

    Args:
        metricas: Metricas calculadas.

    Raises:
        ValueError: Se alguma metrica estiver fora de faixa.
    """
    if not -1.0 <= metricas.silhouette <= 1.0:
        raise ValueError(f"Silhouette fora de [-1,1]: {metricas.silhouette}")
    if metricas.davies_bouldin < 0:
        raise ValueError(f"Davies-Bouldin < 0: {metricas.davies_bouldin}")
    if metricas.calinski_harabasz <= 0:
        raise ValueError(f"Calinski-Harabasz <= 0: {metricas.calinski_harabasz}")
