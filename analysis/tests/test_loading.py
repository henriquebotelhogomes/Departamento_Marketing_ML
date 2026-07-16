"""Testes de carga, limpeza e imputacao de dados."""

from __future__ import annotations

from pathlib import Path

import pandas as pd
import pytest

from analysis.marketing_analytics.loading import (
    carregar_dados,
    extrair_features,
    imputar_nulos,
    limpar_dados,
    validar_sem_nulos,
)


def test_carregar_dados_colunas_esperadas(sample_csv_path: Path) -> None:
    """Carrega o CSV e verifica que as 18 colunas estao presentes."""
    df = carregar_dados(sample_csv_path)
    assert len(df) == 7
    assert "CUST_ID" in df.columns
    assert "BALANCE" in df.columns
    assert "TENURE" in df.columns
    assert set(df.columns) == {
        "CUST_ID",
        "BALANCE",
        "BALANCE_FREQUENCY",
        "PURCHASES",
        "ONEOFF_PURCHASES",
        "INSTALLMENTS_PURCHASES",
        "CASH_ADVANCE",
        "PURCHASES_FREQUENCY",
        "ONEOFF_PURCHASES_FREQUENCY",
        "PURCHASES_INSTALLMENTS_FREQUENCY",
        "CASH_ADVANCE_FREQUENCY",
        "CASH_ADVANCE_TRX",
        "PURCHASES_TRX",
        "CREDIT_LIMIT",
        "PAYMENTS",
        "MINIMUM_PAYMENTS",
        "PRC_FULL_PAYMENT",
        "TENURE",
    }


def test_carregar_dados_arquivo_inexistente(tmp_path: Path) -> None:
    """Levanta FileNotFoundError para caminho inexistente."""
    with pytest.raises(FileNotFoundError, match="Arquivo nao encontrado"):
        carregar_dados(tmp_path / "inexistente.csv")


def test_imputar_nulos_preenche_colunas(sample_csv_path: Path) -> None:
    """Imputa nulos em MINIMUM_PAYMENTS e CREDIT_LIMIT pela mediana."""
    df = carregar_dados(sample_csv_path)
    df_imputado, medianas = imputar_nulos(df)
    assert "MINIMUM_PAYMENTS" in medianas
    assert "CREDIT_LIMIT" in medianas
    assert df_imputado["MINIMUM_PAYMENTS"].isnull().sum() == 0
    assert df_imputado["CREDIT_LIMIT"].isnull().sum() == 0


def test_limpar_dados_remove_duplicatas(sample_csv_path: Path, tmp_path: Path) -> None:
    """Remove duplicatas por CUST_ID na limpeza."""
    df = carregar_dados(sample_csv_path)
    df_com_dup = pd.concat([df, df.iloc[[0]]], ignore_index=True)
    df_limpo, _ = limpar_dados(df_com_dup)
    assert len(df_limpo) == len(df)


def test_extrair_features_shape_e_ordem(sample_csv_path: Path) -> None:
    """Extrai features com shape (n, 17) na ordem canonica."""
    df, _ = limpar_dados(carregar_dados(sample_csv_path))
    features = extrair_features(df)
    assert features.shape == (len(df), 17)


def test_validar_sem_nulos_passa(sample_csv_path: Path) -> None:
    """Valida que nao ha nulos apos imputacao."""
    df, _ = limpar_dados(carregar_dados(sample_csv_path))
    validar_sem_nulos(df)  # nao levanta


def test_validar_sem_nulos_falha() -> None:
    """Levanta ValueError se houver nulos."""
    df = pd.DataFrame({"A": [1, None], "B": [2, 3]})
    with pytest.raises(ValueError, match="valores nulos"):
        validar_sem_nulos(df)
