"""Configuracao de testes pytest."""

from __future__ import annotations

from pathlib import Path

import pytest


@pytest.fixture
def sample_csv_path(tmp_path: Path) -> Path:
    """CSV de amostra deterministico para testes do loading/parser."""
    csv_content = (
        "CUST_ID,BALANCE,BALANCE_FREQUENCY,PURCHASES,ONEOFF_PURCHASES,"
        "INSTALLMENTS_PURCHASES,CASH_ADVANCE,PURCHASES_FREQUENCY,"
        "ONEOFF_PURCHASES_FREQUENCY,PURCHASES_INSTALLMENTS_FREQUENCY,"
        "CASH_ADVANCE_FREQUENCY,CASH_ADVANCE_TRX,PURCHASES_TRX,"
        "CREDIT_LIMIT,PAYMENTS,MINIMUM_PAYMENTS,PRC_FULL_PAYMENT,TENURE\n"
        "C001,100.0,0.9,50.0,30.0,20.0,0.0,0.5,0.3,0.2,0.0,0,2,1000,200,50,0.0,12\n"
        "C002,2000.0,0.8,0.0,0.0,0.0,500.0,0.0,0.0,0.0,0.5,3,0,3000,800,100,0.0,12\n"
        "C003,500.0,1.0,2000.0,1500.0,500.0,0.0,1.0,1.0,0.5,0.0,0,15,5000,1500,450.0,0.5,12\n"
        "C004,3000.0,0.7,100.0,50.0,50.0,1000.0,0.1,0.1,0.0,0.8,8,1,2000,600,300.0,0.1,12\n"
        "C005,150.0,0.6,500.0,0.0,500.0,0.0,0.8,0.0,0.8,0.0,0,5,1500,700,120.0,0.9,12\n"
        "C006,950.0,0.5,100.0,100.0,0.0,200.0,0.2,0.2,0.0,0.3,2,1,,300,80.0,0.0,6\n"
        "C007,800.0,1.0,300.0,0.0,300.0,0.0,0.7,0.0,0.7,0.0,0,3,2500,400,,1.0,11\n"
    )
    caminho = tmp_path / "sample_marketing.csv"
    caminho.write_text(csv_content, encoding="utf-8")
    return caminho
