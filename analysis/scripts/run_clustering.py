"""CLI: treina a pipeline de clusterizacao e salva artefatos + metricas.

Uso: python -m analysis.scripts.run_clustering
"""

from __future__ import annotations

import json
from datetime import UTC, datetime
from pathlib import Path

import numpy as np
import tensorflow as tf
from sklearn.metrics import silhouette_samples

from analysis.marketing_analytics.cluster import (
    calcular_elbow,
    calcular_silhouettes,
    treinar_kmeans,
)
from analysis.marketing_analytics.config import (
    AUTOENCODER_BATCH_SIZE,
    AUTOENCODER_EPOCHS,
    FEATURES,
    MODEL_VERSION,
    N_CLUSTERS,
    N_COMPONENTS_PCA,
    RANDOM_STATE,
)
from analysis.marketing_analytics.evaluate import (
    calcular_metricas,
    validar_faixas_metricas,
)
from analysis.marketing_analytics.features import padronizar_features
from analysis.marketing_analytics.loading import carregar_dados, extrair_features, limpar_dados
from analysis.marketing_analytics.plots import (
    plot_elbow,
    plot_pca_scatter,
    plot_segment_profiles,
    plot_silhouette,
)
from analysis.marketing_analytics.reduce import (
    aplicar_pca,
    construir_autoencoder,
    extrair_encoder,
    treinar_autoencoder,
)

RAIZ = Path(__file__).resolve().parents[2]
DIRETORIO_DATA = RAIZ / "data"
DIRETORIO_MODELOS = RAIZ / "analysis" / "models"
DIRETORIO_REPORTS = RAIZ / "analysis" / "reports"


def main() -> None:
    """Executa o pipeline completo de clusterizacao (Autoencoder+KMeans)."""
    np.random.seed(RANDOM_STATE)
    tf.random.set_seed(RANDOM_STATE)

    DIRETORIO_MODELOS.mkdir(parents=True, exist_ok=True)
    DIRETORIO_REPORTS.mkdir(parents=True, exist_ok=True)

    print("[1/9] Carregando dados...")
    df = carregar_dados(DIRETORIO_DATA / "Marketing_data.csv")

    print("[2/9] Limpando e imputando nulos...")
    df_limpo, medianas = limpar_dados(df)
    print(f"      Medianas: {medianas}")

    print("[3/9] Extraindo e padronizando features (17 features)...")
    features_brutas = extrair_features(df_limpo)
    features_pad, scaler = padronizar_features(features_brutas)

    print("[4/9] Treinando Autoencoder (17->500->2000->10->2000->500->17)...")
    autoencoder = construir_autoencoder(input_dim=len(FEATURES))
    treinar_autoencoder(features_pad, autoencoder, AUTOENCODER_EPOCHS, AUTOENCODER_BATCH_SIZE)
    encoder = extrair_encoder(autoencoder)
    features_comprimidas = encoder.predict(features_pad, verbose=0)

    print("[5/9] Treinando K-Means (k=4) sobre a representacao comprimida...")
    kmeans_principal = treinar_kmeans(features_comprimidas, N_CLUSTERS)
    labels_principal = kmeans_principal.labels_

    print("[6/9] Treinando K-Means baseline (direto, sem autoencoder)...")
    kmeans_baseline = treinar_kmeans(features_pad, N_CLUSTERS)

    print("[7/9]Calculando PCA (2D) para visualizacao...")
    componentes, pca = aplicar_pca(features_pad, N_COMPONENTS_PCA)

    print("[8/9] Avaliando e interpretando segmentos...")
    from analysis.marketing_analytics.interpret import rotular_clusters_automatico

    metricas_principal = calcular_metricas(features_comprimidas, labels_principal, kmeans_principal)
    validar_faixas_metricas(metricas_principal)

    metricas_baseline = calcular_metricas(features_pad, kmeans_baseline.labels_, kmeans_baseline)

    rotulos = rotular_clusters_automatico(df_limpo, labels_principal)
    print(f"      Rotulos: {rotulos}")

    print("[9/9] Salvando artefatos e metricas...")
    import joblib

    joblib.dump(scaler, DIRETORIO_MODELOS / "scaler_v1.joblib")
    joblib.dump(kmeans_principal, DIRETORIO_MODELOS / "kmeans_v1.joblib")
    joblib.dump(pca, DIRETORIO_MODELOS / "pca_v1.joblib")
    encoder.save(DIRETORIO_MODELOS / "encoder_v1.keras")

    inercias = calcular_elbow(features_comprimidas, k_max=10)
    silhouettes = calcular_silhouettes(features_comprimidas, k_min=2, k_max=10)

    metricas_dict: dict[str, object] = {
        "modelVersion": MODEL_VERSION,
        "algorithm": "Autoencoder+KMeans",
        "nClusters": N_CLUSTERS,
        "silhouette": metricas_principal.silhouette,
        "daviesBouldin": metricas_principal.davies_bouldin,
        "calinskiHarabasz": metricas_principal.calinski_harabasz,
        "inertia": metricas_principal.inertia,
        "usedAutoencoder": True,
        "nComponentsPca": N_COMPONENTS_PCA,
        "trainedAt": datetime.now(tz=UTC).isoformat(),
        "medianas": medianas,
        "elbowCurve": [{"k": i + 1, "inertia": inercias[i]} for i in range(len(inercias))],
        "silhouettesCurve": [
            {"k": i + 2, "silhouette": silhouettes[i]} for i in range(len(silhouettes))
        ],
        "baselineKMeans": {
            "silhouette": metricas_baseline.silhouette,
            "daviesBouldin": metricas_baseline.davies_bouldin,
            "calinskiHarabasz": metricas_baseline.calinski_harabasz,
            "inertia": metricas_baseline.inertia,
        },
        "rotulos": {str(k): v for k, v in rotulos.items()},
    }

    with open(DIRETORIO_MODELOS / "metrics_v1.json", "w", encoding="utf-8") as f:
        json.dump(metricas_dict, f, indent=2, ensure_ascii=False)

    plot_elbow(inercias, DIRETORIO_REPORTS / "elbow_curve.png")
    plot_pca_scatter(componentes, labels_principal, rotulos, DIRETORIO_REPORTS / "pca_scatter.png")
    plot_segment_profiles(
        df_limpo, labels_principal, rotulos, DIRETORIO_REPORTS / "segment_profiles.png"
    )

    silhouette_vals = silhouette_samples(features_comprimidas, labels_principal)
    caminho_silhouette = DIRETORIO_REPORTS / "silhouette.png"
    plot_silhouette(features_comprimidas, labels_principal, silhouette_vals, caminho_silhouette)

    print("\n=== Pipeline concluida ===")
    print(f"Silhouette: {metricas_principal.silhouette:.4f}")
    print(f"Davies-Bouldin: {metricas_principal.davies_bouldin:.4f}")
    print(f"Calinski-Harabasz: {metricas_principal.calinski_harabasz:.2f}")
    print(f"Inercia: {metricas_principal.inertia:.2f}")
    print(f"k: {N_CLUSTERS}")
    print(f"Rotulos: {rotulos}")
    print(f"\nArtefatos salvos em: {DIRETORIO_MODELOS}")
    print(f"Reports salvos em: {DIRETORIO_REPORTS}")


if __name__ == "__main__":
    main()
