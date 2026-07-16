"""Interpretacao dos segmentos: rótulos de negocio e dominantFeatures."""

from __future__ import annotations

import numpy as np
import pandas as pd

from analysis.marketing_analytics.config import FEATURES
from analysis.marketing_analytics.evaluate import MetricasCluster

ROTULOS = {
    "Comprador Ativo": "Alta frequência e volume de compras, baixo adiantamento.",
    "Devedor Rotativo": "Alto saldo devedor e baixa taxa de pagamento integral.",
    "Usuário de Adiantamento": "Alto CASH_ADVANCE e CASH_ADVANCE_FREQUENCY, poucas compras.",
    "Bom Pagador": "Alto PRC_FULL_PAYMENT e baixo saldo devedor.",
}

RECOMENDACOES = {
    "Comprador Ativo": ["Cashback", "Programa de fidelidade", "Upgrade de limite"],
    "Devedor Rotativo": [
        "Renegociação de dívida",
        "Educação financeira",
        "Parcelamento de saldo",
    ],
    "Usuário de Adiantamento": [
        "Monitoramento de risco",
        "Alertas proativos",
        "Oferta de crédito pessoal",
    ],
    "Bom Pagador": [
        "Upgrade para cartão premium",
        "Benefícios exclusivos",
        "Cross-sell",
    ],
}


def rotular_clusters_automatico(
    df: pd.DataFrame,
    labels: np.ndarray,
) -> dict[int, str]:
    """Atribui rótulos de negocio automaticamente conforme PARTE 3.11.

    Ordem deterministica:
    1. Usuário de Adiantamento: maior CASH_ADVANCE médio.
    2. Bom Pagador: maior PRC_FULL_PAYMENT medio (entre restantes).
    3. Comprador Ativo: maior PURCHASES medio (entre restantes).
    4. Devedor Rotativo: restante.

    Args:
        df: DataFrame limpo com as 18 colunas originais.
        labels: Labels de cluster de cada amostra.

    Returns:
        Dicionario {clusterId: rotulo}.
    """
    df_rot = df.copy()
    df_rot["_cluster"] = labels
    clusters_unicos = sorted(df_rot["_cluster"].unique())
    rotulos: dict[int, str] = {}
    restantes = list(clusters_unicos)

    medias = df_rot.groupby("_cluster")[
        ["CASH_ADVANCE", "PRC_FULL_PAYMENT", "PURCHASES", "BALANCE"]
    ].mean()

    c_adv = medias["CASH_ADVANCE"].idxmax()
    rotulos[c_adv] = "Usuário de Adiantamento"
    restantes.remove(c_adv)

    c_pag = medias.loc[restantes, "PRC_FULL_PAYMENT"].idxmax()
    rotulos[c_pag] = "Bom Pagador"
    restantes.remove(c_pag)

    c_comp = medias.loc[restantes, "PURCHASES"].idxmax()
    rotulos[c_comp] = "Comprador Ativo"
    restantes.remove(c_comp)

    c_dev = restantes[0]
    rotulos[c_dev] = "Devedor Rotativo"

    return rotulos


def calcular_dominant_features(
    centroides_padronizados: np.ndarray,
    centroides_originais: np.ndarray,
    media_geral: np.ndarray,
    limite_z: float = 0.5,
    min_itens: int = 3,
    max_itens: int = 6,
) -> list[list[dict[str, object]]]:
    """Calcula as features dominantes de cada cluster conforme PARTE 3.5.

    Args:
        centroides_padronizados: Centroides no espaco padronizado (k, 17).
        centroides_originais: Centroides em escala original (k, 17).
        media_geral: Media geral de cada feature em escala original (17,).
        limite_z: Valor absoluto minimo de zScore para inclusao (default 0.5).
        min_itens: Numero minimo de itens (default 3).
        max_itens: Numero maximo de itens (default 6).

    Returns:
        Lista de listas (uma por cluster) de dicts {feature, direction, zScore,
        centroidValue, overallMean}.
    """
    resultados: list[list[dict[str, object]]] = []
    for cluster_idx in range(centroides_padronizados.shape[0]):
        z_scores = centroides_padronizados[cluster_idx]
        itens: list[dict[str, object]] = []
        for feat_idx, z in enumerate(z_scores):
            if abs(z) >= limite_z:
                itens.append(
                    {
                        "feature": FEATURES[feat_idx],
                        "direction": "high" if z > 0 else "low",
                        "zScore": float(z),
                        "centroidValue": float(centroides_originais[cluster_idx, feat_idx]),
                        "overallMean": float(media_geral[feat_idx]),
                    }
                )
        itens_ordenados = sorted(itens, key=lambda d: abs(d["zScore"]), reverse=True)
        if len(itens_ordenados) < min_itens:
            todos: list[dict[str, object]] = []
            for feat_idx, z in enumerate(z_scores):
                todos.append(
                    {
                        "feature": FEATURES[feat_idx],
                        "direction": "high" if z > 0 else "low",
                        "zScore": float(z),
                        "centroidValue": float(centroides_originais[cluster_idx, feat_idx]),
                        "overallMean": float(media_geral[feat_idx]),
                    }
                )
            todos_ordenados = sorted(todos, key=lambda d: abs(d["zScore"]), reverse=True)
            itens_ordenados = todos_ordenados[:max_itens]
        else:
            itens_ordenados = itens_ordenados[:max_itens]
        resultados.append(itens_ordenados)
    return resultados


def gerar_perfil_segmentos(
    df: pd.DataFrame,
    labels: np.ndarray,
    rotulos: dict[int, str],
    dominant_features_por_cluster: list[list[dict[str, object]]],
) -> list[dict[str, object]]:
    """Gera o perfil completo de cada segmento para segment_profiles.json.

    Args:
        df: DataFrame limpo com as 18 colunas originais.
        labels: Labels de cluster de cada amostra.
        rotulos: Mapeamento clusterId -> rotulo de negocio.
        dominant_features_por_cluster: dominantFeatures calculados por cluster.

    Returns:
        Lista de dicts (um por cluster) com o perfil completo.
    """
    df_seg = df.copy()
    df_seg["_cluster"] = labels
    segmentos: list[dict[str, object]] = []
    total = len(df_seg)

    for cluster_id, rotulo in rotulos.items():
        subset = df_seg[df_seg["_cluster"] == cluster_id]
        count = len(subset)
        share_pct = round(count / total * 100, 2) if total > 0 else 0.0
        segmentos.append(
            {
                "clusterId": int(cluster_id),
                "label": rotulo,
                "description": ROTULOS.get(rotulo, ""),
                "customerCount": int(count),
                "sharePct": float(share_pct),
                "avgBalance": float(subset["BALANCE"].mean()),
                "avgPurchases": float(subset["PURCHASES"].mean()),
                "avgCashAdvance": float(subset["CASH_ADVANCE"].mean()),
                "avgCreditLimit": float(subset["CREDIT_LIMIT"].mean()),
                "avgPrcFullPayment": float(subset["PRC_FULL_PAYMENT"].mean()),
                "dominantFeatures": dominant_features_por_cluster[cluster_id],
                "recommendation": RECOMENDACOES.get(rotulo, []),
            }
        )
    return segmentos


def registrar_metricas_dict(metricas: MetricasCluster, used_autoencoder: bool) -> dict[str, object]:
    """Serializa as metricas para persistencia JSON.

    Args:
        metricas: MetricasCluster calculadas.
        used_autoencoder: Se usou autoencoder no pipeline.

    Returns:
        Dicionario serializavel com as metricas.
    """
    return {
        "silhouette": metricas.silhouette,
        "daviesBouldin": metricas.davies_bouldin,
        "calinskiHarabasz": metricas.calinski_harabasz,
        "inertia": metricas.inertia,
        "usedAutoencoder": used_autoencoder,
    }
