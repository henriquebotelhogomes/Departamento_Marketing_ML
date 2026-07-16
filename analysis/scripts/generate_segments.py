"""CLI: gera data/segments.csv e data/segment_profiles.json para o seed do Prisma.

Uso: python -m analysis.scripts.generate_segments
"""

from __future__ import annotations

import json
from pathlib import Path

import joblib
import numpy as np
import tensorflow as tf

from analysis.marketing_analytics.config import FEATURES, MODEL_VERSION, RANDOM_STATE
from analysis.marketing_analytics.interpret import (
    calcular_dominant_features,
    gerar_perfil_segmentos,
    rotular_clusters_automatico,
)
from analysis.marketing_analytics.loading import carregar_dados, extrair_features, limpar_dados
from analysis.marketing_analytics.reduce import comprimir_com_encoder
from analysis.marketing_analytics.score import fazer_scoring

RAIZ = Path(__file__).resolve().parents[2]
DIRETORIO_DATA = RAIZ / "data"
DIRETORIO_MODELOS = RAIZ / "analysis" / "models"


def main() -> None:
    """Gera segments.csv e segment_profiles.json a partir dos artefatos salvos."""
    np.random.seed(RANDOM_STATE)
    tf.random.set_seed(RANDOM_STATE)

    print("[1/5] Carregando dados...")
    df = carregar_dados(DIRETORIO_DATA / "Marketing_data.csv")

    print("[2/5] Limpando e imputando nulos...")
    df_limpo, _ = limpar_dados(df)

    print("[3/5] Carregando artefatos do modelo...")
    scaler = joblib.load(DIRETORIO_MODELOS / "scaler_v1.joblib")
    kmeans = joblib.load(DIRETORIO_MODELOS / "kmeans_v1.joblib")
    pca = joblib.load(DIRETORIO_MODELOS / "pca_v1.joblib")
    encoder = tf.keras.models.load_model(DIRETORIO_MODELOS / "encoder_v1.keras")

    print("[4/5] Fazendo scoring (atribuindo segmentos)...")
    from analysis.marketing_analytics.cluster import atribuir_labels

    features_brutas = extrair_features(df_limpo)
    features_pad = scaler.transform(features_brutas)
    features_comprimidas = comprimir_com_encoder(features_pad, encoder)
    labels = atribuir_labels(kmeans, features_comprimidas)
    rotulos = rotular_clusters_automatico(df_limpo, labels)

    resultado = fazer_scoring(df_limpo, scaler, encoder, kmeans, pca, rotulos)

    caminho_segments = DIRETORIO_DATA / "segments.csv"
    resultado.to_csv(caminho_segments, index=False)
    print(f"      segments.csv salvo em: {caminho_segments}")

    print("[5/5] Gerando segment_profiles.json...")
    centroides_padronizados = kmeans.cluster_centers_
    centroides_originais = np.array(
        [
            df_limpo[df_limpo.index.isin(np.where(labels == c)[0])][FEATURES].mean().values
            for c in sorted(rotulos.keys())
        ]
    )
    media_geral = np.array([df_limpo[f].mean() for f in FEATURES])

    dominant_features = calcular_dominant_features(
        centroides_padronizados,
        centroides_originais,
        media_geral,
    )

    segmentos = gerar_perfil_segmentos(
        df_limpo,
        labels,
        rotulos,
        dominant_features,
    )

    perfis: dict[str, object] = {
        "modelVersion": MODEL_VERSION,
        "segments": segmentos,
    }

    caminho_perfis = DIRETORIO_DATA / "segment_profiles.json"
    with open(caminho_perfis, "w", encoding="utf-8") as f:
        json.dump(perfis, f, indent=2, ensure_ascii=False)
    print(f"      segment_profiles.json salvo em: {caminho_perfis}")

    print("\n=== Segmentos gerados ===")
    for seg in segmentos:  # type: ignore[union-attr]
        print(
            f"  Cluster {seg['clusterId']}: {seg['label']} "  # type: ignore[index]
            f"({seg['customerCount']} clientes, {seg['sharePct']}%)"  # type: ignore[index]
        )


if __name__ == "__main__":
    main()
