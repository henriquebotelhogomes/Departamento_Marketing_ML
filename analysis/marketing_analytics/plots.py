"""Geracao de graficos de avaliacao do modelo de clusterizacao."""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns


def plot_elbow(inercias: list[float], caminho: str | Path) -> None:
    """Salva o grafico do metodo do cotovelo (elbow).

    Args:
        inercias: Lista de inercias para k=1..k_max.
        caminho: Caminho do arquivo PNG de saida.
    """
    fig, ax = plt.subplots(figsize=(10, 6))
    ks = range(1, len(inercias) + 1)
    ax.plot(list(ks), inercias, marker="o", color="#2563EB")
    ax.set_xlabel("Número de clusters (k)")
    ax.set_ylabel("Inércia (WCSS)")
    ax.set_title("Método do Cotovelo")
    ax.grid(True, alpha=0.3)
    fig.tight_layout()
    fig.savefig(caminho, dpi=150)
    plt.close(fig)


def plot_pca_scatter(
    componentes: np.ndarray,
    labels: np.ndarray,
    rotulos: dict[int, str],
    caminho: str | Path,
) -> None:
    """Salva o scatter plot PCA 2D colorido por segmento.

    Args:
        componentes: Array de shape (n, 2) com pca1 e pca2.
        labels: Labels de cluster.
        rotulos: Mapeamento clusterId -> rotulo.
        caminho: Caminho do arquivo PNG de saida.
    """
    df_plot = pd.DataFrame(
        {
            "pca1": componentes[:, 0],
            "pca2": componentes[:, 1],
            "cluster": labels,
        }
    )
    df_plot["label"] = df_plot["cluster"].map(rotulos)

    fig, ax = plt.subplots(figsize=(10, 8))
    sns.scatterplot(
        data=df_plot,
        x="pca1",
        y="pca2",
        hue="label",
        palette="tab10",
        alpha=0.6,
        s=20,
        ax=ax,
    )
    ax.set_title("Dispersão PCA dos Clusters")
    ax.set_xlabel("Componente Principal 1")
    ax.set_ylabel("Componente Principal 2")
    ax.legend(title="Segmento", loc="best")
    fig.tight_layout()
    fig.savefig(caminho, dpi=150)
    plt.close(fig)


def plot_silhouette(
    x_data: np.ndarray,
    labels: np.ndarray,
    silhouette_values: np.ndarray,
    caminho: str | Path,
) -> None:
    """Salva o grafico de silhouette (silhouette analysis plot).

    Args:
        x_data: Dados ja padronizados (para eixo y).
        labels: Labels de cluster.
        silhouette_values: Scores de silhouette por amostra.
        caminho: Caminho do arquivo PNG de saida.
    """
    del x_data
    unique_labels = np.unique(labels)
    fig, ax = plt.subplots(figsize=(10, 6))

    y_lower = 10
    for label in sorted(unique_labels):
        cluster_silhouette = silhouette_values[labels == label]
        cluster_silhouette.sort()
        size = len(cluster_silhouette)
        y_upper = y_lower + size
        ax.fill_betweenx(
            np.arange(y_lower, y_upper),
            0,
            cluster_silhouette,
            alpha=0.7,
            label=f"Cluster {label}",
        )
        ax.axvline(
            x=cluster_silhouette.mean(), color="red", linestyle="--", alpha=0.3
        )
        y_lower = y_upper + 10

    ax.set_xlabel("Silhouette Coefficient")
    ax.set_ylabel("Cluster label (ordenado)")
    ax.set_title("Silhouette Analysis")
    ax.axvline(x=silhouette_values.mean(), color="red", linestyle="--", label="Média")
    ax.legend(loc="best")
    fig.tight_layout()
    fig.savefig(caminho, dpi=150)
    plt.close(fig)


def plot_segment_profiles(
    df: pd.DataFrame,
    labels: np.ndarray,
    rotulos: dict[int, str],
    caminho: str | Path,
) -> None:
    """Salva o grafico de perfis dos centroides por segmento.

    Args:
        df: DataFrame limpo.
        labels: Labels de cluster.
        rotulos: Mapeamento clusterId -> rotulo.
        caminho: Caminho do arquivo PNG de saida.
    """
    df_plot = df.copy()
    df_plot["_cluster"] = labels
    df_plot["_label"] = df_plot["_cluster"].map(rotulos)

    vars_perfil = ["BALANCE", "PURCHASES", "CASH_ADVANCE", "CREDIT_LIMIT", "PRC_FULL_PAYMENT"]
    medias = df_plot.groupby("_label")[vars_perfil].mean().reset_index()
    medias_melt = medias.melt(id_vars="_label", var_name="variavel", value_name="media")

    fig, ax = plt.subplots(figsize=(12, 6))
    sns.barplot(data=medias_melt, x="variavel", y="media", hue="_label", ax=ax)
    ax.set_title("Perfil Médio por Segmento")
    ax.set_xlabel("Variável")
    ax.set_ylabel("Média")
    ax.legend(title="Segmento", loc="best")
    fig.tight_layout()
    fig.savefig(caminho, dpi=150)
    plt.close(fig)
