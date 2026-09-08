"""Lesson 3.2: reproducible exploratory data analysis example.

Run from the repository root:
    python interactive/examples/t3_l2_eda.py

The script reuses the synthetic dataset from lesson 3.1 and saves three PNG
plots into interactive/examples/t3_l2_eda_output/.
"""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

from t3_l1_preparation import build_dataset


OUTPUT_DIR = Path(__file__).with_name("t3_l2_eda_output")


def prepare_for_eda(raw: pd.DataFrame) -> pd.DataFrame:
    """Create analysis-ready helper columns without hiding quality problems."""
    df = raw.copy()
    df["timestamp_parsed"] = pd.to_datetime(df["timestamp"], errors="coerce", utc=True)
    df["delay_min"] = pd.to_numeric(df["delay_min"], errors="coerce")
    df["confidence"] = pd.to_numeric(df["confidence"], errors="coerce")
    return df


def print_structure(df: pd.DataFrame) -> None:
    print("=== STRUCTURE ===")
    print(f"shape: {df.shape}")
    print("\ndtypes:")
    print(df.dtypes)
    print("\nmissing values:")
    print(df.isna().sum().sort_values(ascending=False))


def print_descriptive_statistics(df: pd.DataFrame) -> None:
    print("\n=== DESCRIPTIVE STATISTICS ===")
    print(df[["delay_min", "confidence"]].describe().round(2))

    print("\n=== GROUP PROFILE: SOURCE ===")
    by_source = (
        df.groupby("source")
        .agg(
            events=("event_id", "count"),
            median_delay=("delay_min", "median"),
            mean_confidence=("confidence", "mean"),
            missing_confidence=("confidence", lambda s: int(s.isna().sum())),
        )
        .sort_values("events", ascending=False)
        .round(2)
    )
    print(by_source)

    print("\n=== GROUP PROFILE: EVENT TYPE ===")
    print(
        df.groupby("event_type")
        .agg(
            events=("event_id", "count"),
            median_delay=("delay_min", "median"),
            p90_delay=("delay_min", lambda s: s.quantile(0.90)),
        )
        .round(2)
    )


def detect_anomalies(df: pd.DataFrame) -> pd.DataFrame:
    """Flag high delays with the IQR rule; keep the rows for interpretation."""
    q1 = df["delay_min"].quantile(0.25)
    q3 = df["delay_min"].quantile(0.75)
    iqr = q3 - q1
    upper = q3 + 1.5 * iqr

    flagged = df.loc[
        df["delay_min"].gt(upper),
        ["event_id", "source", "sector", "event_type", "delay_min", "timestamp"],
    ].sort_values("delay_min", ascending=False)

    print("\n=== IQR ANOMALY CHECK ===")
    print(f"upper IQR limit: {upper:.2f} min")
    print(flagged.to_string(index=False) if not flagged.empty else "No flagged rows")
    return flagged


def print_relationships(df: pd.DataFrame) -> None:
    print("\n=== NUMERIC RELATIONSHIPS ===")
    corr = df[["delay_min", "confidence"]].corr(numeric_only=True).round(3)
    print(corr)

    print("\nInterpretation rule: correlation is a signal to investigate, not proof of causation.")


def save_plots(df: pd.DataFrame) -> None:
    OUTPUT_DIR.mkdir(exist_ok=True)

    # 1) Missing confidence by source.
    missing = df.groupby("source")["confidence"].apply(lambda s: s.isna().mean()).sort_values()
    fig, ax = plt.subplots(figsize=(8, 4.5))
    ax.bar(missing.index, missing.values)
    ax.set_title("Missing confidence by source")
    ax.set_xlabel("Source")
    ax.set_ylabel("Missing share")
    ax.set_ylim(0, max(0.35, float(missing.max()) + 0.05))
    fig.tight_layout()
    fig.savefig(OUTPUT_DIR / "missing_confidence_by_source.png", dpi=160)
    plt.close(fig)

    # 2) Delay distribution by event type.
    groups = [
        group["delay_min"].dropna().to_numpy()
        for _, group in df.groupby("event_type", sort=True)
    ]
    labels = [name for name, _ in df.groupby("event_type", sort=True)]
    fig, ax = plt.subplots(figsize=(8, 4.5))
    ax.boxplot(groups, labels=labels)
    ax.set_title("Delay distribution by event type")
    ax.set_xlabel("Event type")
    ax.set_ylabel("Delay, min")
    fig.tight_layout()
    fig.savefig(OUTPUT_DIR / "delay_by_event_type.png", dpi=160)
    plt.close(fig)

    # 3) Event count over time.
    valid_time = df.dropna(subset=["timestamp_parsed"]).set_index("timestamp_parsed")
    counts = valid_time.resample("4h").size()
    fig, ax = plt.subplots(figsize=(8, 4.5))
    ax.plot(counts.index, counts.values, marker="o")
    ax.set_title("Event count by 4-hour interval")
    ax.set_xlabel("Time")
    ax.set_ylabel("Events")
    fig.autofmt_xdate()
    fig.tight_layout()
    fig.savefig(OUTPUT_DIR / "events_over_time.png", dpi=160)
    plt.close(fig)

    print(f"\nPlots saved to: {OUTPUT_DIR}")


def main() -> None:
    raw = build_dataset()
    df = prepare_for_eda(raw)

    print_structure(df)
    print_descriptive_statistics(df)
    detect_anomalies(df)
    print_relationships(df)
    save_plots(df)

    print("\n=== EDA TAKEAWAY ===")
    print(
        "Write 3–5 evidence-based observations: one about quality, one about a distribution, "
        "one about groups/sources, and one about anomalies or uncertainty."
    )


if __name__ == "__main__":
    main()
