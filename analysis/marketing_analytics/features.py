"""Padronizacao de features com StandardScaler."""

from __future__ import annotations

import numpy as np
from sklearn.preprocessing import StandardScaler


def padronizar_features(features: np.ndarray) -> tuple[np.ndarray, StandardScaler]:
    """Ajusta o StandardScaler e transforma as features.

    Args:
        features: Array de shape (n_amostras, 17) com valores brutos.

    Returns:
        Tupla (features padronizadas, scaler ajustado).
    """
    scaler = StandardScaler()
    features_padronizadas = scaler.fit_transform(features)
    return features_padronizadas, scaler


def aplicar_scaler(features: np.ndarray, scaler: StandardScaler) -> np.ndarray:
    """Aplica um scaler ja ajustado a novos dados (sem re-fit).

    Args:
        features: Array de features brutas.
        scaler: StandardScaler previamente ajustado no treino.

    Returns:
        Features padronizadas.
    """
    transformadas = scaler.transform(features)
    return np.asarray(transformadas, dtype=np.float64)


def validar_padronizacao(features_padronizadas: np.ndarray) -> None:
    """Verifica que a padronizacao produziu media ~0 e desvio ~1 por coluna.

    Args:
        features_padronizadas: Array padronizado de shape (n, 17).

    Raises:
        ValueError: Se media ou desvio estiverem fora da tolerancia.
    """
    medias = features_padronizadas.mean(axis=0)
    desvios = features_padronizadas.std(axis=0)
    if not np.allclose(medias, 0.0, atol=1e-10):
        raise ValueError(f"Media das features nao e ~0: {medias}")
    if not np.allclose(desvios, 1.0, atol=1e-10):
        raise ValueError(f"Desvio das features nao e ~1: {desvios}")
