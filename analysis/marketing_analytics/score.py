"""Scoring: atribui cluster e coordenadas PCA a cada cliente."""

from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from tensorflow import keras

from analysis.marketing_analytics.config import FEATURES, MODEL_VERSION
from analysis.marketing_analytics.reduce import aplicar_pca_transform, comprimir_com_encoder


def fazer_scoring(
    df: pd.DataFrame,
    scaler: StandardScaler,
    encoder: keras.Model | None,
    kmeans: KMeans,
    pca: PCA,
    rotulos: dict[int, str],
) -> pd.DataFrame:
    """Gera as atribuicoes de segmento para todos os clientes.

    Args:
        df: DataFrame limpo com as 18 colunas originais.
        scaler: StandardScaler ajustado no treino.
        encoder: Modelo Keras do encoder (None se pipeline KMeans direto).
        kmeans: KMeans ajustado.
        pca: PCA ajustado para visualizacao 2D.
        rotulos: Mapeamento clusterId -> rotulo.

    Returns:
        DataFrame com colunas CUST_ID, clusterId, pca1, pca2, segmentLabel,
        modelVersion.
    """
    features_brutas = df[FEATURES].to_numpy(dtype=np.float64)
    features_pad = scaler.transform(features_brutas)

    if encoder is not None:
        features_cluster = comprimir_com_encoder(features_pad, encoder)
    else:
        features_cluster = features_pad

    labels = kmeans.predict(features_cluster)
    componentes = aplicar_pca_transform(features_pad, pca)

    resultado = pd.DataFrame(
        {
            "CUST_ID": df["CUST_ID"].values,
            "clusterId": labels,
            "pca1": componentes[:, 0],
            "pca2": componentes[:, 1],
            "segmentLabel": [rotulos[lab] for lab in labels],
            "modelVersion": MODEL_VERSION,
        }
    )
    return resultado
