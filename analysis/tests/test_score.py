"""Testes de scoring/atribuicao de segmentos."""

from __future__ import annotations

from pathlib import Path

from analysis.marketing_analytics.cluster import treinar_kmeans
from analysis.marketing_analytics.features import padronizar_features
from analysis.marketing_analytics.interpret import rotular_clusters_automatico
from analysis.marketing_analytics.loading import carregar_dados, extrair_features, limpar_dados
from analysis.marketing_analytics.reduce import aplicar_pca
from analysis.marketing_analytics.score import fazer_scoring


def test_scoring_atribui_segmentos_a_todos(sample_csv_path: Path) -> None:
    """Scoring gera atribuicao de cluster e PCA para todos os clientes."""
    df, _ = limpar_dados(carregar_dados(sample_csv_path))
    features = extrair_features(df)
    features_pad, scaler = padronizar_features(features)
    kmeans = treinar_kmeans(features_pad, n_clusters=4)
    _, pca = aplicar_pca(features_pad)
    rotulos = rotular_clusters_automatico(df, kmeans.labels_)

    resultado = fazer_scoring(df, scaler, None, kmeans, pca, rotulos)

    assert len(resultado) == len(df)
    assert set(resultado.columns) == {
        "CUST_ID",
        "clusterId",
        "pca1",
        "pca2",
        "segmentLabel",
        "modelVersion",
    }
    assert resultado["clusterId"].min() >= 0
    assert resultado["clusterId"].max() < 4
    assert resultado["modelVersion"].nunique() == 1
    assert resultado["modelVersion"].iloc[0] == "v1"
    assert resultado["pca1"].notnull().all()
    assert resultado["pca2"].notnull().all()


def test_rotular_clusters_automatico_atribui_4_rotulos(sample_csv_path: Path) -> None:
    """A rotulagem automatica atribui 4 rotulos distintos."""
    df, _ = limpar_dados(carregar_dados(sample_csv_path))
    features = extrair_features(df)
    features_pad, _ = padronizar_features(features)
    kmeans = treinar_kmeans(features_pad, n_clusters=4)
    rotulos = rotular_clusters_automatico(df, kmeans.labels_)
    assert len(rotulos) == 4
    assert set(rotulos.values()) == {
        "Comprador Ativo",
        "Devedor Rotativo",
        "Usuário de Adiantamento",
        "Bom Pagador",
    }
