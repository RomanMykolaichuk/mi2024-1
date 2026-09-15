#!/usr/bin/env python3
"""Theme 4.5: reproducible classification + threshold-selection workflow.

The example is intentionally synthetic and contains no operational data.
Threshold selection is performed on a validation set; held-out test data are
used only after the operating point has been frozen.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--fn-cost", type=float, default=8.0, help="Relative cost of a false negative.")
    parser.add_argument("--fp-cost", type=float, default=1.0, help="Relative cost of a false positive.")
    parser.add_argument("--threshold-step", type=float, default=0.05, help="Validation threshold grid step.")
    parser.add_argument("--output-dir", type=Path, default=Path("interactive/examples/t4_l5_classification_output"))
    return parser.parse_args()


def build_dataset() -> tuple[np.ndarray, np.ndarray]:
    return make_classification(
        n_samples=1200,
        n_features=8,
        n_informative=5,
        n_redundant=1,
        n_clusters_per_class=2,
        weights=[0.80, 0.20],
        class_sep=1.05,
        flip_y=0.04,
        random_state=42,
    )


def split_dataset(X: np.ndarray, y: np.ndarray):
    X_train, X_hold, y_train, y_hold = train_test_split(
        X,
        y,
        test_size=0.40,
        stratify=y,
        random_state=42,
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_hold,
        y_hold,
        test_size=0.50,
        stratify=y_hold,
        random_state=42,
    )
    return X_train, X_val, X_test, y_train, y_val, y_test


def evaluate_threshold(y_true: np.ndarray, probability: np.ndarray, threshold: float, fn_cost: float, fp_cost: float) -> dict:
    prediction = (probability >= threshold).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_true, prediction, labels=[0, 1]).ravel()
    return {
        "threshold": float(threshold),
        "tn": int(tn),
        "fp": int(fp),
        "fn": int(fn),
        "tp": int(tp),
        "accuracy": accuracy_score(y_true, prediction),
        "precision": precision_score(y_true, prediction, zero_division=0),
        "recall": recall_score(y_true, prediction, zero_division=0),
        "f1": f1_score(y_true, prediction, zero_division=0),
        "weighted_cost": float(fp * fp_cost + fn * fn_cost),
    }


def threshold_grid(step: float) -> np.ndarray:
    if step <= 0 or step > 0.20:
        raise ValueError("threshold-step must be in (0, 0.20].")
    values = np.arange(0.20, 0.800001, step)
    return np.round(values, 4)


def choose_threshold(table: pd.DataFrame) -> pd.Series:
    ranked = table.sort_values(["weighted_cost", "f1", "recall"], ascending=[True, False, False])
    return ranked.iloc[0]


def plot_validation_tradeoff(table: pd.DataFrame, selected_threshold: float, output: Path) -> None:
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.plot(table["threshold"], table["precision"], marker="o", label="Precision")
    ax.plot(table["threshold"], table["recall"], marker="o", label="Recall")
    ax.plot(table["threshold"], table["f1"], marker="o", label="F1")
    ax.axvline(selected_threshold, linestyle="--", label=f"Selected {selected_threshold:.2f}")
    ax.set_xlabel("Decision threshold")
    ax.set_ylabel("Metric")
    ax.set_ylim(0, 1.02)
    ax.set_title("Validation threshold trade-off")
    ax.grid(alpha=0.25)
    ax.legend()
    fig.tight_layout()
    fig.savefig(output, dpi=150)
    plt.close(fig)


def plot_validation_cost(table: pd.DataFrame, selected_threshold: float, output: Path) -> None:
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.plot(table["threshold"], table["weighted_cost"], marker="o")
    ax.axvline(selected_threshold, linestyle="--", label=f"Selected {selected_threshold:.2f}")
    ax.set_xlabel("Decision threshold")
    ax.set_ylabel("Weighted validation cost")
    ax.set_title("Validation operating-cost curve")
    ax.grid(alpha=0.25)
    ax.legend()
    fig.tight_layout()
    fig.savefig(output, dpi=150)
    plt.close(fig)


def plot_confusion(matrix: np.ndarray, output: Path) -> None:
    fig, ax = plt.subplots(figsize=(5.5, 5))
    image = ax.imshow(matrix)
    fig.colorbar(image, ax=ax, fraction=0.046, pad=0.04)
    ax.set_xticks([0, 1], labels=["Pred 0", "Pred 1"])
    ax.set_yticks([0, 1], labels=["Actual 0", "Actual 1"])
    ax.set_title("Held-out test confusion matrix")
    for row in range(2):
        for col in range(2):
            ax.text(col, row, str(matrix[row, col]), ha="center", va="center")
    fig.tight_layout()
    fig.savefig(output, dpi=150)
    plt.close(fig)


def main() -> None:
    args = parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    X, y = build_dataset()
    X_train, X_val, X_test, y_train, y_val, y_test = split_dataset(X, y)

    model = make_pipeline(
        StandardScaler(),
        LogisticRegression(max_iter=2000, random_state=42),
    )
    model.fit(X_train, y_train)

    validation_probability = model.predict_proba(X_val)[:, 1]
    rows = [
        evaluate_threshold(y_val, validation_probability, threshold, args.fn_cost, args.fp_cost)
        for threshold in threshold_grid(args.threshold_step)
    ]
    table = pd.DataFrame(rows)
    selected = choose_threshold(table)
    selected_threshold = float(selected["threshold"])

    # The operating point is now frozen. The held-out test is opened only here.
    test_probability = model.predict_proba(X_test)[:, 1]
    test_stats = evaluate_threshold(
        y_test,
        test_probability,
        selected_threshold,
        args.fn_cost,
        args.fp_cost,
    )
    test_prediction = (test_probability >= selected_threshold).astype(int)
    test_matrix = confusion_matrix(y_test, test_prediction, labels=[0, 1])

    table.to_csv(args.output_dir / "threshold_table.csv", index=False)
    summary = pd.DataFrame(
        [
            {
                "selected_threshold": selected_threshold,
                "fn_cost": args.fn_cost,
                "fp_cost": args.fp_cost,
                "validation_cost": float(selected["weighted_cost"]),
                "validation_precision": float(selected["precision"]),
                "validation_recall": float(selected["recall"]),
                "validation_f1": float(selected["f1"]),
                "test_accuracy": test_stats["accuracy"],
                "test_precision": test_stats["precision"],
                "test_recall": test_stats["recall"],
                "test_f1": test_stats["f1"],
                "test_weighted_cost": test_stats["weighted_cost"],
                "test_tn": test_stats["tn"],
                "test_fp": test_stats["fp"],
                "test_fn": test_stats["fn"],
                "test_tp": test_stats["tp"],
            }
        ]
    )
    summary.to_csv(args.output_dir / "summary.csv", index=False)

    plot_validation_tradeoff(table, selected_threshold, args.output_dir / "validation_threshold_tradeoff.png")
    plot_validation_cost(table, selected_threshold, args.output_dir / "validation_cost_curve.png")
    plot_confusion(test_matrix, args.output_dir / "test_confusion_matrix.png")

    print(f"[classification] selected_threshold={selected_threshold:.2f} fn_cost={args.fn_cost:g} fp_cost={args.fp_cost:g}")
    print(
        "[validation] "
        f"precision={selected['precision']:.3f} recall={selected['recall']:.3f} "
        f"f1={selected['f1']:.3f} cost={selected['weighted_cost']:.1f}"
    )
    print(
        "[test] "
        f"accuracy={test_stats['accuracy']:.3f} precision={test_stats['precision']:.3f} "
        f"recall={test_stats['recall']:.3f} f1={test_stats['f1']:.3f} "
        f"cost={test_stats['weighted_cost']:.1f}"
    )
    print(f"[output] {args.output_dir}")


if __name__ == "__main__":
    main()
