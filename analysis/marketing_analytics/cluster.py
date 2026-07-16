"""Clusterizacao com K-Means e escolha de k via elbow/silhouette."""

from __future__ import annotations

import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score


def calcular_elbow(features: np.ndarray, k_max: int = 10) -> list[float]:
    """Calcula a inercia (WCSS) para k de 1 a k_max.

    Args:
        features: Array de features (padronizadas ou comprimidas).
        k_max: Valor maximo de k (default 10).

    Returns:
        Lista de inercias para k=1..k_max.
    """
    inercias: list[float] = []
    for k in range(1, k_max + 1):
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        kmeans.fit(features)
        inercias.append(float(kmeans.inertia_))
    return inercias


def calcular_silhouettes(features: np.ndarray, k_min: int = 2, k_max: int = 10) -> list[float]:
    """Calcula o Silhouette Score para k de k_min a k_max.

    Args:
        features: Array de features.
        k_min: k minimo (silhouette exige >= 2).
        k_max: k maximo.

    Returns:
        Lista de silhouettes para k=k_min..k_max.
    """
    silhouettes: list[float] = []
    for k in range(k_min, k_max + 1):
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        labels = kmeans.fit_predict(features)
        silhouettes.append(float(silhouette_score(features, labels)))
    return silhouettes


def treinar_kmeans(
    features: np.ndarray,
    n_clusters: int = 4,
) -> KMeans:
    """Treina K-Means com hiperparametros fixos do PRD.

    Args:
        features: Array de features (comprimida pelo encoder ou padronizada).
        n_clusters: Numero de clusters (default 4 conforme PARTE 3.1).

    Returns:
        Modelo KMeans ajustado.
    """
    kmeans = KMeans(
        n_clusters=n_clusters,
        random_state=42,
        n_init=10,
        max_iter=300,
    )
    kmeans.fit(features)
    return kmeans


def atribuir_labels(kmeans: KMeans, features: np.ndarray) -> np.ndarray:
    """Atribui labels de cluster a amostras usando um KMeans ja ajustado.

    Args:
        kmeans: Modelo KMeans treinado.
        features: Array de features.

    Returns:
        Array de labels (0..k-1) com shape (n,).
    """
    labels = kmeans.predict(features)
    if isinstance(labels, tuple):
        labels = labels[0]
    return np.asarray(labels, dtype=np.int32)


def validar_labels(labels: np.ndarray, n_clusters: int = 4) -> None:
    """Verifica que os labels estao no intervalo [0, k-1] e cobrem todas as amostras.

    Args:
        labels: Array de labels.
        n_clusters: Numero esperado de clusters.

    Raises:
        ValueError: Se os labels estiverem fora do intervalo ou vazios.
    """
    if labels.shape[0] == 0:
        raise ValueError("Labels vazios")
    unicos = np.unique(labels)
    if unicos.min() < 0 or unicos.max() >= n_clusters:
        msg = (
            f"Labels fora do intervalo [0, {n_clusters - 1}]: "
            f"min={unicos.min()}, max={unicos.max()}"
        )
        raise ValueError(msg)
