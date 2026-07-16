"""Carga, limpeza e imputacao do CSV de marketing."""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

from analysis.marketing_analytics.config import COLUNAS_PARA_IMPUTAR, FEATURES


def carregar_dados(caminho_csv: str | Path) -> pd.DataFrame:
    """Carrega o CSV de marketing e valida as colunas esperadas.

    Args:
        caminho_csv: Caminho para o arquivo Marketing_data.csv.

    Returns:
        DataFrame com as 18 colunas originais (incluindo CUST_ID).

    Raises:
        FileNotFoundError: Se o arquivo nao existir.
        ValueError: Se colunas obrigatórias estiverem ausentes.
    """
    caminho = Path(caminho_csv)
    if not caminho.exists():
        raise FileNotFoundError(f"Arquivo nao encontrado: {caminho}")

    df = pd.read_csv(caminho)
    colunas_esperadas = ["CUST_ID", *FEATURES]
    colunas_faltando = [c for c in colunas_esperadas if c not in df.columns]
    if colunas_faltando:
        raise ValueError(f"Colunas obrigatórias ausentes: {colunas_faltando}")

    return df


def imputar_nulos(df: pd.DataFrame) -> tuple[pd.DataFrame, dict[str, float]]:
    """Imputa valores ausentes pela mediana da coluna.

    Args:
        df: DataFrame com possiveis valores nulos.

    Returns:
        Tupla (DataFrame imputado, dicionario de medianas usadas).
    """
    medianas: dict[str, float] = {}
    df_imputado = df.copy()
    for coluna in COLUNAS_PARA_IMPUTAR:
        if coluna in df_imputado.columns:
            mediana = float(df_imputado[coluna].median())
            medianas[coluna] = mediana
            df_imputado[coluna] = df_imputado[coluna].fillna(mediana)
    return df_imputado, medianas


def limpar_dados(df: pd.DataFrame) -> tuple[pd.DataFrame, dict[str, float]]:
    """Pipeline completo de limpeza: remove duplicatas e imputa nulos.

    Args:
        df: DataFrame bruto carregado do CSV.

    Returns:
        Tupla (DataFrame limpo, dicionario de medianas usadas).
    """
    df_limpo = df.drop_duplicates(subset=["CUST_ID"]).reset_index(drop=True)
    df_limpo, medianas = imputar_nulos(df_limpo)
    return df_limpo, medianas


def extrair_features(df: pd.DataFrame) -> np.ndarray:
    """Extrai a matriz de features na ordem canonica (CUST_ID excluido).

    Args:
        df: DataFrame limpo com as 18 colunas.

    Returns:
        Array numpy com shape (n_amostras, 17) na ordem canonica.
    """
    return df[FEATURES].to_numpy(dtype=np.float64)


def validar_sem_nulos(df: pd.DataFrame) -> None:
    """Verifica que nao ha valores nulos apos a limpeza.

    Args:
        df: DataFrame imputado.

    Raises:
        ValueError: Se houver valores nulos.
    """
    nulos = df.isnull().sum().sum()
    if nulos > 0:
        raise ValueError(f"DataFrame contem {nulos} valores nulos apos imputacao")
