"""Lesson 3.1: reproducible data-preparation example.

Run from the repository root:
    python interactive/examples/t3_l1_preparation.py

The dataset is synthetic and intentionally contains missing values, duplicate
rows, inconsistent timestamps and a rare extreme delay.
"""

from __future__ import annotations

import numpy as np
import pandas as pd


def build_dataset(seed: int = 42) -> pd.DataFrame:
    """Create a small synthetic dataset with realistic quality problems."""
    rng = np.random.default_rng(seed)
    n = 80

    df = pd.DataFrame(
        {
            "event_id": [f"EVT-{i:03d}" for i in range(1, n + 1)],
            "source": rng.choice(["SRC-A", "SRC-B", "SRC-C", "SRC-D"], n),
            "sector": rng.choice(["NORTH", "CENTER", "SOUTH"], n),
            "event_type": rng.choice(
                ["observation", "movement", "interference"], n, p=[0.45, 0.35, 0.20]
            ),
            "delay_min": np.maximum(1, rng.normal(22, 9, n)).round(1),
            "confidence": rng.uniform(0.55, 0.98, n).round(2),
            "timestamp": pd.date_range(
                "2026-09-01 06:00", periods=n, freq="30min", tz="UTC"
            ).astype(str),
        }
    )

    # Systematic missingness: several confidence values are absent.
    c_rows = df.index[df["source"].eq("SRC-C")][:5]
    df.loc[c_rows, "confidence"] = np.nan
    df.loc[[7, 33], "confidence"] = np.nan

    # One rare but potentially meaningful observation.
    df.loc[5, "delay_min"] = 185.0

    # Two timestamp problems: one unusual representation and one invalid value.
    df.loc[12, "timestamp"] = "2026/09/01 12:00:00+00:00"
    df.loc[44, "timestamp"] = "not-a-time"

    # Add two exact technical duplicates.
    df = pd.concat([df, df.iloc[[10, 21]].copy()], ignore_index=True)

    # Add a corroborating report: same time/type/sector, but independent source.
    corroboration = df.iloc[[15]].copy()
    corroboration["event_id"] = "EVT-CORROBORATED"
    corroboration["source"] = "SRC-D" if corroboration.iloc[0]["source"] != "SRC-D" else "SRC-A"
    df = pd.concat([df, corroboration], ignore_index=True)

    return df


def quality_profile(df: pd.DataFrame) -> dict[str, object]:
    """Return a compact quality profile without changing the data."""
    potential_key = ["timestamp", "sector", "event_type"]
    return {
        "rows": len(df),
        "columns": len(df.columns),
        "missing_by_column": df.isna().sum().to_dict(),
        "exact_duplicates": int(df.duplicated().sum()),
        "potential_event_matches": int(df.duplicated(potential_key, keep=False).sum()),
        "dtypes": df.dtypes.astype(str).to_dict(),
    }


def prepare_dataset(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Apply explainable preprocessing and keep a small audit log."""
    clean = df.copy()
    audit: list[dict[str, object]] = []

    # 1) Parse time, but do not silently discard invalid values.
    clean["timestamp_parsed"] = pd.to_datetime(
        clean["timestamp"], errors="coerce", utc=True
    )
    clean["timestamp_valid"] = clean["timestamp_parsed"].notna()
    audit.append(
        {
            "step": "parse_timestamp",
            "affected_rows": int((~clean["timestamp_valid"]).sum()),
            "decision": "flag invalid timestamps instead of silently deleting rows",
        }
    )

    # 2) Remove only exact technical duplicates.
    before = len(clean)
    clean = clean.drop_duplicates().copy()
    audit.append(
        {
            "step": "drop_exact_duplicates",
            "affected_rows": before - len(clean),
            "decision": "do not collapse independent corroborating reports",
        }
    )

    # 3) Diagnose missingness by source before imputing.
    missing_by_source = clean.groupby("source")["confidence"].apply(
        lambda s: float(s.isna().mean())
    )
    source_medians = clean.groupby("source")["confidence"].transform("median")
    global_median = clean["confidence"].median()
    missing_before = int(clean["confidence"].isna().sum())
    clean["confidence_imputed"] = clean["confidence"].fillna(source_medians).fillna(global_median)
    audit.append(
        {
            "step": "impute_confidence",
            "affected_rows": missing_before,
            "decision": "use source median after inspecting missingness by source",
            "max_missing_rate_by_source": round(float(missing_by_source.max()), 3),
        }
    )

    # 4) Detect extreme delays with IQR. Flag first; do not auto-delete.
    q1 = clean["delay_min"].quantile(0.25)
    q3 = clean["delay_min"].quantile(0.75)
    iqr = q3 - q1
    upper = q3 + 1.5 * iqr
    clean["delay_is_outlier"] = clean["delay_min"].gt(upper)
    audit.append(
        {
            "step": "flag_delay_outliers",
            "affected_rows": int(clean["delay_is_outlier"].sum()),
            "decision": "review provenance/context before removal",
            "upper_iqr_limit": round(float(upper), 2),
        }
    )

    return clean, pd.DataFrame(audit)


def main() -> None:
    raw = build_dataset()
    print("=== RAW QUALITY PROFILE ===")
    for key, value in quality_profile(raw).items():
        print(f"{key}: {value}")

    print("\n=== MISSING CONFIDENCE BY SOURCE ===")
    print(
        raw.groupby("source")["confidence"]
        .apply(lambda s: s.isna().mean())
        .sort_values(ascending=False)
        .round(3)
    )

    clean, audit = prepare_dataset(raw)

    print("\n=== PREPARED SAMPLE ===")
    print(
        clean[
            [
                "event_id",
                "source",
                "timestamp_valid",
                "confidence",
                "confidence_imputed",
                "delay_min",
                "delay_is_outlier",
            ]
        ].head(10)
    )

    print("\n=== AUDIT LOG ===")
    print(audit.to_string(index=False))


if __name__ == "__main__":
    main()
