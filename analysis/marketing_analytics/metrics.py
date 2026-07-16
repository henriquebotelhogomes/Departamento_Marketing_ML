"""Agregacoes e correlacoes para EDA (analysis/marketing_analytics/metrics)."""

from __future__ import annotations

import pandas as pd

VARS_CORRELACAO = [
    "BALANCE",
    "PURCHASES",
    "ONEOFF_PURCHASES",
    "INSTALLMENTS_PURCHASES",
    "CASH_ADVANCE",
    "CREDIT_LIMIT",
    "PAYMENTS",
    "MINIMUM_PAYMENTS",
    "PRC_FULL_PAYMENT",
]


def matriz_correlacao(df: pd.DataFrame) -> pd.DataFrame:
    """Calcula a matriz de correlacao de Pearson para as variaveis relevantes.

    Args:
        df: DataFrame limpo com as 18 colunas.

    Returns:
        Matriz de correlacao (9x9) em formato DataFrame.
    """
    return df[VARS_CORRELACAO].corr(method="pearson")


def kpis_gerais(df: pd.DataFrame) -> dict[str, float]:
    """Calcula os KPIs gerais do dashboard.

    Args:
        df: DataFrame limpo com as 18 colunas.

    Returns:
        Dicionario com os KPIs principais.
    """
    total = len(df)
    cash_advance_pct = float((df["CASH_ADVANCE"] > 0).sum() / total) if total > 0 else 0.0
    return {
        "totalCustomers": float(total),
        "avgBalance": float(df["BALANCE"].mean()),
        "avgPurchases": float(df["PURCHASES"].mean()),
        "avgCreditLimit": float(df["CREDIT_LIMIT"].mean()),
        "avgPayments": float(df["PAYMENTS"].mean()),
        "avgPrcFullPayment": float(df["PRC_FULL_PAYMENT"].mean()),
        "avgTenure": float(df["TENURE"].mean()),
        "cashAdvanceUsersPct": cash_advance_pct,
    }


def split_compras_avista_parcelado(df: pd.DataFrame) -> dict[str, float]:
    """Calcula o split de compras a vista vs parceladas.

    Args:
        df: DataFrame limpo.

    Returns:
        Dicionario com {oneoff, installments} como proporcoes [0,1].
    """
    soma_avista = float(df["ONEOFF_PURCHASES"].sum())
    soma_parcelado = float(df["INSTALLMENTS_PURCHASES"].sum())
    total = soma_avista + soma_parcelado
    if total == 0:
        return {"oneoff": 0.0, "installments": 0.0}
    return {
        "oneoff": round(soma_avista / total, 4),
        "installments": round(soma_parcelado / total, 4),
    }
