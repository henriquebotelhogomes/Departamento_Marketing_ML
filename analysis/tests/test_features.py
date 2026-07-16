"""Testes de padronizacao de features com StandardScaler."""

from __future__ import annotations

from pathlib import Path

import numpy as np

from analysis.marketing_analytics.features import (
    aplicar_scaler,
    padronizar_features,
    validar_padronizacao,
)
from analysis.marketing_analytics.loading import carregar_dados, extrair_features, limpar_dados


def test_padronizar_features_media_zero_desvio_um(sample_csv_path: Path) -> None:
    """Padronizacao produz media ~0 e desvio ~1 por coluna."""
    df, _ = limpar_dados(carregar_dados(sample_csv_path))
    features = extrair_features(df)
    features_pad, scaler = padronizar_features(features)
    validar_padronizacao(features_pad)  # nao levanta
    assert features_pad.shape == features.shape


def test_aplicar_scaler_sem_refit(sample_csv_path: Path) -> None:
    """Aplicar scaler ja ajustado produz o mesmo resultado sem re-fit."""
    df, _ = limpar_dados(carregar_dados(sample_csv_path))
    features = extrair_features(df)
    features_pad, scaler = padronizar_features(features)
    features_retransformadas = aplicar_scaler(features, scaler)
    np.testing.assert_allclose(features_pad, features_retransformadas, atol=1e-10)
