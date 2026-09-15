"""Theme 4.4 — reproducible model evaluation and hyperparameter tuning.

The script uses synthetic classification data so it can run offline and without
operational/sensitive information. The held-out test split is isolated before
cross-validation and GridSearchCV. Hyperparameters are selected only inside the
training pool; the test set is used once for final evaluation.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import ConfusionMatrixDisplay, classification_report
from sklearn.model_selection import (
    GridSearchCV,
    StratifiedKFold,
    cross_validate,
    train_test_split,
)


def build_dataset(random_state: int = 42):
    X, y = make_classification(
        n_samples=900,
        n_features=8,
        n_informative=5,
        n_redundant=1,
        n_clusters_per_class=2,
        weights=[0.72, 0.28],
        class_sep=1.05,
        flip_y=0.04,
        random_state=random_state,
    )
    return train_test_split(
        X,
        y,
        test_size=0.20,
        stratify=y,
        random_state=random_state,
    )


def depth_curve(X_train, y_train, scoring: str, cv, output_dir: Path, random_state: int):
    rows = []
    for depth in range(1, 13):
        model = RandomForestClassifier(
            n_estimators=70,
            max_depth=depth,
            min_samples_leaf=3,
            random_state=random_state,
            n_jobs=-1,
        )
        scores = cross_validate(
            model,
            X_train,
            y_train,
            scoring=scoring,
            cv=cv,
            return_train_score=True,
            n_jobs=-1,
        )
        rows.append(
            {
                "max_depth": depth,
                "train_mean": float(np.mean(scores["train_score"])),
                "cv_mean": float(np.mean(scores["test_score"])),
                "cv_std": float(np.std(scores["test_score"])),
            }
        )

    frame = pd.DataFrame(rows)
    best_depth = int(frame.loc[frame["cv_mean"].idxmax(), "max_depth"])

    fig, ax = plt.subplots(figsize=(8, 5))
    ax.plot(frame["max_depth"], frame["train_mean"], marker="o", label="Train")
    ax.plot(frame["max_depth"], frame["cv_mean"], marker="o", label="CV mean")
    ax.fill_between(
        frame["max_depth"],
        frame["cv_mean"] - frame["cv_std"],
        frame["cv_mean"] + frame["cv_std"],
        alpha=0.2,
        label="CV ±1 std",
    )
    ax.axvline(best_depth, linestyle="--", label=f"Best CV depth={best_depth}")
    ax.set_xlabel("max_depth")
    ax.set_ylabel(scoring)
    ax.set_title("Theme 4.4: train vs cross-validation")
    ax.legend()
    fig.tight_layout()
    fig.savefig(output_dir / "cv_depth_curve.png", dpi=150)
    plt.close(fig)

    return frame, best_depth


def grid_search(X_train, y_train, scoring: str, cv, random_state: int):
    estimator = RandomForestClassifier(
        n_estimators=80,
        random_state=random_state,
        n_jobs=-1,
    )
    param_grid = {
        "max_depth": [2, 4, 6, 8, 10, 12],
        "min_samples_leaf": [1, 3, 6],
    }
    search = GridSearchCV(
        estimator=estimator,
        param_grid=param_grid,
        scoring=scoring,
        cv=cv,
        n_jobs=-1,
        return_train_score=True,
        refit=True,
    )
    search.fit(X_train, y_train)
    return search


def save_grid_results(search: GridSearchCV, output_dir: Path):
    results = pd.DataFrame(search.cv_results_)
    columns = [
        "param_max_depth",
        "param_min_samples_leaf",
        "mean_train_score",
        "mean_test_score",
        "std_test_score",
        "rank_test_score",
    ]
    compact = results[columns].copy()
    compact.to_csv(output_dir / "gridsearch_results.csv", index=False)

    pivot = compact.pivot(
        index="param_min_samples_leaf",
        columns="param_max_depth",
        values="mean_test_score",
    )
    fig, ax = plt.subplots(figsize=(8, 4.5))
    image = ax.imshow(pivot.values, aspect="auto")
    ax.set_xticks(range(len(pivot.columns)), [str(value) for value in pivot.columns])
    ax.set_yticks(range(len(pivot.index)), [str(value) for value in pivot.index])
    ax.set_xlabel("max_depth")
    ax.set_ylabel("min_samples_leaf")
    ax.set_title("GridSearchCV mean validation score")
    fig.colorbar(image, ax=ax, label="mean CV score")
    fig.tight_layout()
    fig.savefig(output_dir / "gridsearch_heatmap.png", dpi=150)
    plt.close(fig)

    return compact


def final_test(search: GridSearchCV, X_test, y_test, output_dir: Path):
    predictions = search.best_estimator_.predict(X_test)
    report = classification_report(y_test, predictions, output_dict=True, zero_division=0)

    fig, ax = plt.subplots(figsize=(5.5, 5))
    ConfusionMatrixDisplay.from_predictions(y_test, predictions, ax=ax)
    ax.set_title("Held-out test confusion matrix")
    fig.tight_layout()
    fig.savefig(output_dir / "test_confusion_matrix.png", dpi=150)
    plt.close(fig)

    return report


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--scoring", choices=["accuracy", "f1_macro"], default="f1_macro")
    parser.add_argument("--cv", type=int, choices=[3, 5, 7], default=5)
    parser.add_argument("--random-state", type=int, default=42)
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("interactive/examples/t4_l4_cv_tuning_output"),
    )
    args = parser.parse_args()

    args.output_dir.mkdir(parents=True, exist_ok=True)
    X_train, X_test, y_train, y_test = build_dataset(args.random_state)

    cv = StratifiedKFold(
        n_splits=args.cv,
        shuffle=True,
        random_state=args.random_state,
    )

    curve, curve_best_depth = depth_curve(
        X_train,
        y_train,
        args.scoring,
        cv,
        args.output_dir,
        args.random_state,
    )
    search = grid_search(
        X_train,
        y_train,
        args.scoring,
        cv,
        args.random_state,
    )
    save_grid_results(search, args.output_dir)
    report = final_test(search, X_test, y_test, args.output_dir)

    test_macro_f1 = report["macro avg"]["f1-score"]
    test_accuracy = report["accuracy"]
    print(f"[t4-l4] scoring={args.scoring} cv={args.cv}")
    print(f"[t4-l4] depth-curve best max_depth={curve_best_depth}")
    print(f"[t4-l4] GridSearchCV best params={search.best_params_}")
    print(f"[t4-l4] best CV score={search.best_score_:.3f}")
    print(f"[t4-l4] held-out test accuracy={test_accuracy:.3f} macro-F1={test_macro_f1:.3f}")
    print(f"[t4-l4] candidates={len(search.cv_results_['params'])}; test opened after refit")
    print(f"[t4-l4] outputs={args.output_dir}")

    # A small machine-readable summary for instructors/CI.
    summary = pd.DataFrame(
        [
            {
                "scoring": args.scoring,
                "cv_folds": args.cv,
                "curve_best_depth": curve_best_depth,
                "grid_best_depth": search.best_params_["max_depth"],
                "grid_best_min_samples_leaf": search.best_params_["min_samples_leaf"],
                "best_cv_score": search.best_score_,
                "test_accuracy": test_accuracy,
                "test_macro_f1": test_macro_f1,
            }
        ]
    )
    summary.to_csv(args.output_dir / "summary.csv", index=False)


if __name__ == "__main__":
    main()
