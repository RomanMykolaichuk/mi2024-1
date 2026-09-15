"""Runnable examples for Theme 4, lesson 4.2.

Synthetic data only. Demonstrates three core ML task formulations:
regression, classification and clustering.
"""
from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs, make_classification, make_regression
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    mean_absolute_error,
    precision_score,
    r2_score,
    recall_score,
)
from sklearn.model_selection import train_test_split

RANDOM_STATE = 42


def regression_demo(output_dir: Path, noise: float = 14.0) -> None:
    X, y = make_regression(
        n_samples=160,
        n_features=1,
        noise=noise,
        random_state=RANDOM_STATE,
    )
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.30, random_state=RANDOM_STATE
    )
    model = LinearRegression()
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"[regression] noise={noise:.1f} MAE={mae:.2f} R2={r2:.3f}")

    order = X_test[:, 0].argsort()
    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    ax.scatter(X_test[:, 0], y_test, alpha=0.65, label="test observations")
    ax.plot(X_test[order, 0], y_pred[order], linewidth=2, label="prediction")
    ax.set_title("Regression: observations and fitted line")
    ax.set_xlabel("Feature X")
    ax.set_ylabel("Numeric target y")
    ax.legend()
    fig.tight_layout()
    fig.savefig(output_dir / "regression.png", dpi=160)
    plt.close(fig)


def classification_demo(output_dir: Path, threshold: float = 0.50) -> None:
    X, y = make_classification(
        n_samples=420,
        n_features=2,
        n_redundant=0,
        n_informative=2,
        n_clusters_per_class=1,
        class_sep=1.15,
        random_state=RANDOM_STATE,
    )
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.30,
        stratify=y,
        random_state=RANDOM_STATE,
    )
    model = LogisticRegression()
    model.fit(X_train, y_train)
    probability = model.predict_proba(X_test)[:, 1]
    y_pred = (probability >= threshold).astype(int)

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, zero_division=0)
    recall = recall_score(y_test, y_pred, zero_division=0)
    print(
        f"[classification] threshold={threshold:.2f} "
        f"accuracy={accuracy:.3f} precision={precision:.3f} recall={recall:.3f}"
    )

    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    scatter = ax.scatter(
        X_test[:, 0],
        X_test[:, 1],
        c=y_pred,
        alpha=0.72,
        edgecolor="none",
    )
    ax.set_title(f"Classification: predicted classes, threshold={threshold:.2f}")
    ax.set_xlabel("Feature X1")
    ax.set_ylabel("Feature X2")
    ax.legend(*scatter.legend_elements(), title="Predicted")
    fig.tight_layout()
    fig.savefig(output_dir / "classification.png", dpi=160)
    plt.close(fig)


def clustering_demo(output_dir: Path, k: int = 3) -> None:
    X, _ = make_blobs(
        n_samples=300,
        centers=3,
        cluster_std=0.78,
        random_state=RANDOM_STATE,
    )
    model = KMeans(n_clusters=k, n_init="auto", random_state=RANDOM_STATE)
    labels = model.fit_predict(X)
    print(f"[clustering] k={k} inertia={model.inertia_:.2f}")

    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    ax.scatter(X[:, 0], X[:, 1], c=labels, alpha=0.70, edgecolor="none")
    ax.scatter(
        model.cluster_centers_[:, 0],
        model.cluster_centers_[:, 1],
        marker="X",
        s=190,
        edgecolor="black",
        linewidth=1.2,
        label="centroids",
    )
    ax.set_title(f"KMeans clustering, k={k}")
    ax.set_xlabel("Feature X1")
    ax.set_ylabel("Feature X2")
    ax.legend()
    fig.tight_layout()
    fig.savefig(output_dir / "clustering.png", dpi=160)
    plt.close(fig)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--task",
        choices=("all", "regression", "classification", "clustering"),
        default="all",
    )
    parser.add_argument("--noise", type=float, default=14.0)
    parser.add_argument("--threshold", type=float, default=0.50)
    parser.add_argument("--k", type=int, default=3)
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("interactive/examples/t4_l2_ml_output"),
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    if args.task in ("all", "regression"):
        regression_demo(args.output_dir, noise=max(0.0, args.noise))
    if args.task in ("all", "classification"):
        threshold = min(0.95, max(0.05, args.threshold))
        classification_demo(args.output_dir, threshold=threshold)
    if args.task in ("all", "clustering"):
        clustering_demo(args.output_dir, k=min(6, max(2, args.k)))

    print(f"Saved plots to: {args.output_dir}")


if __name__ == "__main__":
    main()
