"""Reducao de dimensionalidade: PCA e Autoencoder."""

from __future__ import annotations

import numpy as np
from sklearn.decomposition import PCA
from tensorflow import keras
from tensorflow.keras import layers


def aplicar_pca(features_padronizadas: np.ndarray, n_components: int = 2) -> tuple[np.ndarray, PCA]:
    """Aplica PCA para visualizacao 2D dos clusters.

    Args:
        features_padronizadas: Array padronizado de shape (n, 17).
        n_components: Numero de componentes principais (default 2).

    Returns:
        Tupla (componentes principais, PCA ajustado).
    """
    pca = PCA(n_components=n_components, random_state=42)
    componentes = pca.fit_transform(features_padronizadas)
    return componentes, pca


def aplicar_pca_transform(features_padronizadas: np.ndarray, pca: PCA) -> np.ndarray:
    """Aplica um PCA ja ajustado a novos dados.

    Args:
        features_padronizadas: Array padronizado.
        pca: PCA previamente ajustado.

    Returns:
        Componentes principais.
    """
    return pca.transform(features_padronizadas)


def construir_autoencoder(input_dim: int = 17) -> keras.Model:
    """Constrói o autoencoder 17 -> 500 -> 2000 -> 10 -> 2000 -> 500 -> 17.

    Args:
        input_dim: Dimensionalidade da entrada (default 17).

    Returns:
        Modelo Keras do autoencoder (input -> input).
    """
    input_layer = layers.Input(shape=(input_dim,))
    x = layers.Dense(500, activation="relu")(input_layer)
    x = layers.Dense(2000, activation="relu")(x)
    encoded = layers.Dense(10, activation="relu")(x)
    x = layers.Dense(2000, activation="relu")(encoded)
    x = layers.Dense(500, activation="relu")(x)
    decoded = layers.Dense(input_dim)(x)

    autoencoder = keras.Model(input_layer, decoded)
    autoencoder.compile(optimizer="adam", loss="mean_squared_error")
    return autoencoder


def treinar_autoencoder(
    features_padronizadas: np.ndarray,
    autoencoder: keras.Model,
    epochs: int = 50,
    batch_size: int = 128,
) -> keras.callbacks.History:
    """Treina o autoencoder sobre os dados padronizados.

    Args:
        features_padronizadas: Array padronizado de shape (n, 17).
        autoencoder: Modelo Keras compilado.
        epochs: Numero de epocas (default 50).
        batch_size: Tamanho do batch (default 128).

    Returns:
        Historico de treino do Keras.
    """
    history = autoencoder.fit(
        features_padronizadas,
        features_padronizadas,
        epochs=epochs,
        batch_size=batch_size,
        verbose=0,
    )
    return history


def extrair_encoder(autoencoder: keras.Model) -> keras.Model:
    """Extrai o encoder (ate a camada de 10 dim) do autoencoder.

    Args:
        autoencoder: Modelo Keras treinado.

    Returns:
        Modelo Keras que produz a representacao comprimida (10D).
    """
    input_layer = autoencoder.input
    encoded_output = autoencoder.layers[3].output
    encoder = keras.Model(input_layer, encoded_output)
    return encoder


def comprimir_com_encoder(features_padronizadas: np.ndarray, encoder: keras.Model) -> np.ndarray:
    """Gera a representacao comprimida (10D) das features.

    Args:
        features_padronizadas: Array padronizado.
        encoder: Modelo Keras do encoder ja treinado.

    Returns:
        Array de shape (n, 10) com a representacao comprimida.
    """
    return encoder.predict(features_padronizadas, verbose=0)
