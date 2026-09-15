"""Theme 4.3: reproducible regression workflow and diagnostics.

Synthetic teaching data only. The script compares a linear baseline, Ridge and a
DecisionTreeRegressor, then saves actual-vs-predicted, residual and complexity
plots.

Run from repository root:
    python interactive/examples/t4_l3_regression_workflow.py --max-depth 5
"""
from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeRegressor

RANDOM_STATE = 42


def build_dataset(n: int = 650, seed: int = RANDOM_STATE) -> tuple[pd.DataFrame, pd.Series]:
    """Create a synthetic logistics-processing regression dataset."""
    rng = np.random.default_rng(seed)
    items = rng.integers(1, 31, size=n)
    distance_km = rng.uniform(5, 420, size=n)
    load = rng.uniform(0.15, 1.0, size=n)
    priority = rng.integers(0, 3, size=n)
    queue = rng.integers(0, 18, size=n)

    X = pd.DataFrame(
        {
            "items": items,
            "distance_km": distance_km,
            "load": load,
            "priority": priority,
            "queue": queue,
        }
    )

    nonlinear = 0.0015 * distance_km * items + 12 * load**2 + 0.18 * queue**1.7
    noise = rng.normal(0, 7.5, size=n)
    y = (
        12
        + 1.7 * items
        + 0.13 * distance_km
        + 17 * load
        - 4.5 * priority
        + 1.1 * queue
        + nonlinear
        + noise
    )
    return X, pd.Series(y, name="processing_minutes")


def metrics(y_true: pd.Series, y_pred: np.ndarray) -> dict[str, float]:
    return {
        "MAE": float(mean_absolute_error(y_true, y_pred)),
        "RMSE": float(mean_squared_error(y_true, y_pred) ** 0.5),
        "R2": float(r2_score(y_true, y_pred)),
    }


def fit_models(X_train: pd.DataFrame, y_train: pd.Series, max_depth: int, ridge_alpha: float):
    models = {
        "LinearRegression": LinearRegression(),
        "Ridge": make_pipeline(StandardScaler(), Ridge(alpha=ridge_alpha)),
        "DecisionTree": DecisionTreeRegressor(
            max_depth=max_depth,
            min_samples_leaf=5,
            random_state=RANDOM_STATE,
        ),
    }
    for model in models.values():
        model.fit(X_train, y_train)
    return models


def comparison_table(models, X_train, y_train, X_test, y_test) -> pd.DataFrame:
    rows = []
    for name, model in models.items():
        train_pred = model.predict(X_train)
        test_pred = model.predict(X_test)
        train_m = metrics(y_train, train_pred)
        test_m = metrics(y_test, test_pred)
        rows.append(
            {
                "model": name,
                "train_MAE": train_m["MAE"],
                "test_MAE": test_m["MAE"],
                "test_RMSE": test_m["RMSE"],
                "test_R2": test_m["R2"],
                "MAE_gap": test_m["MAE"] - train_m["MAE"],
            }
        )
    return pd.DataFrame(rows).sort_values("test_MAE")


def save_actual_vs_predicted(y_test, predictions: dict[str, np.ndarray], output_dir: Path) -> None:
    fig, ax = plt.subplots(figsize=(7.4, 5.2))
    low = min(float(y_test.min()), *(float(p.min()) for p in predictions.values()))
    high = max(float(y_test.max()), *(float(p.max()) for p in predictions.values()))
    for name, pred in predictions.items():
        ax.scatter(y_test, pred, alpha=0.48, s=24, label=name)
    ax.plot([low, high], [low, high], linestyle="--", linewidth=1.5, label="ideal")
    ax.set_xlabel("Actual processing time, min")
    ax.set_ylabel("Predicted processing time, min")
    ax.set_title("Theme 4.3 — Actual vs predicted")
    ax.legend()
    fig.tight_layout()
    fig.savefig(output_dir / "actual_vs_predicted.png", dpi=160)
    plt.close(fig)


def save_residuals(y_test, y_pred: np.ndarray, output_dir: Path) -> None:
    residuals = y_test.to_numpy() - y_pred
    fig, ax = plt.subplots(figsize=(7.4, 5.0))
    ax.scatter(y_pred, residuals, alpha=0.62, s=26)
    ax.axhline(0, linestyle="--", linewidth=1.5)
    ax.set_xlabel("Predicted processing time, min")
    ax.set_ylabel("Residual = actual - predicted")
    ax.set_title("Decision Tree residual diagnostics")
    fig.tight_layout()
    fig.savefig(output_dir / "residuals.png", dpi=160)
    plt.close(fig)


def save_complexity_curve(X_train, y_train, X_test, y_test, output_dir: Path, selected_depth: int) -> None:
    depths = list(range(1, 15))
    train_mae, test_mae = [], []
    for depth in depths:
        model = DecisionTreeRegressor(
            max_depth=depth,
            min_samples_leaf=5,
            random_state=RANDOM_STATE,
        )
        model.fit(X_train, y_train)
        train_mae.append(mean_absolute_error(y_train, model.predict(X_train)))
        test_mae.append(mean_absolute_error(y_test, model.predict(X_test)))

    fig, ax = plt.subplots(figsize=(7.4, 4.8))
    ax.plot(depths, train_mae, marker="o", label="Train MAE")
    ax.plot(depths, test_mae, marker="o", label="Test MAE")
    ax.axvline(selected_depth, linestyle="--", linewidth=1.2, label=f"selected depth={selected_depth}")
    ax.set_xlabel("DecisionTree max_depth")
    ax.set_ylabel("MAE, min")
    ax.set_title("Model complexity vs generalization")
    ax.legend()
    fig.tight_layout()
    fig.savefig(output_dir / "complexity_curve.png", dpi=160)
    plt.close(fig)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--max-depth", type=int, default=5)
    parser.add_argument("--ridge-alpha", type=float, default=2.0)
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("interactive/examples/t4_l3_regression_output"),
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    max_depth = min(14, max(1, args.max_depth))
    ridge_alpha = max(0.0, args.ridge_alpha)
    args.output_dir.mkdir(parents=True, exist_ok=True)

    X, y = build_dataset()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=RANDOM_STATE
    )
    models = fit_models(X_train, y_train, max_depth=max_depth, ridge_alpha=ridge_alpha)
    table = comparison_table(models, X_train, y_train, X_test, y_test)
    print("=== MODEL COMPARISON ===")
    print(table.round(3).to_string(index=False))

    predictions = {name: model.predict(X_test) for name, model in models.items()}
    save_actual_vs_predicted(y_test, predictions, args.output_dir)
    save_residuals(y_test, predictions["DecisionTree"], args.output_dir)
    save_complexity_curve(X_train, y_train, X_test, y_test, args.output_dir, max_depth)
    table.to_csv(args.output_dir / "model_comparison.csv", index=False)
    print(f"Saved diagnostics to: {args.output_dir}")


if __name__ == "__main__":
    main()
