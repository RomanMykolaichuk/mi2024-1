# MI2024 Interactive

Статичний інтерактивний web-шар курсу на HTML + CSS + Vanilla JavaScript ES Modules + JSON.

## Запуск

```bash
cd interactive
python3 -m http.server 8000
```

Відкрити `http://localhost:8000`.

## Залежності

Для базової версії немає npm-залежностей і build step. Потрібні лише browser та будь-який local static server.

## Структура

```text
interactive/
├── index.html                 # grouped course catalog
├── lessons/                   # lesson pages / shared shells
├── assets/css/*.css           # design system + thematic styles
├── js/app.js                  # bootstrap reusable engine
├── js/core/                   # registry + data loader
├── js/components/             # reusable components
└── data/lessons/*.json        # lesson scenarios/configs
```

## Головна сторінка

Каталог організовано **за темами дисципліни**. Кожна тема має status, progress `implemented / total` і картки реалізованих занять.

## Норматив тривалості

Ціль для web-заняття — **приблизно 30–45 хв активної роботи** без повного виконання окремого Jupyter notebook.

Типовий маршрут: scenario → concept/pipeline → main interactive → decision/mission → interpretation → self-check/reflection. `lesson-roadmap` показує timebox і структуру.

## Реалізовані заняття

### Тема 2
- `lessons/t2-l4.html` — 2.4 Storage Architecture Lab.
- `lessons/t2-l5.html` — 2.5 Relational Schema + SQL Mission Lab.

### Тема 3 — 5/5
- 3.1 methodology + Data Quality + decision trade-offs + EDA;
- 3.2 EDA Explorer + team mission;
- 3.3 practical reproducible EDA;
- 3.4 transformation + leakage lab;
- 3.5 end-to-end model-ready pipeline.

### Тема 4 — 13/14 наявних позицій

Theme 4 використовує один data-driven shell:

```text
lessons/theme4.html?lesson=t4-l1
...
lessons/theme4.html?lesson=t4-l14
```

Реалізовано:

- 4.1 — method selection for statistics/ML/GIS/text/network analysis;
- 4.2 — classification/regression/clustering + ML workflow;
- 4.3 — regression metrics and model complexity;
- 4.4 — evaluation, CV and hyperparameter tuning;
- 4.5 — classification threshold + confusion matrix;
- 4.6 — neural-network architecture and capacity;
- 4.7 — deep-learning experiment design;
- 4.8 — TensorFlow regression/classification design;
- 4.9 — convolution/CNN + image-model trade-offs;
- 4.11 — frontier methods, model hubs and MLOps;
- 4.12 — Transfer Learning + RL;
- 4.13 — project design for model repositories / RL;
- 4.14 — text analytics + Generative AI provenance controls.

**4.10** позначено `source-gap`: у репозиторії немає окремого первинного матеріалу, тому зміст не вигадується.

## Reusable components

### Core / pedagogical
- `course-catalog`
- `lesson-roadmap`
- `analytics-pipeline`
- `decision-tradeoff`
- `workflow-mission-lab`
- `knowledge-check`

### Storage / SQL
- `storage-model-explorer`
- `schema-normalization-lab`
- `sql-query-lab`
- `storage-decision-lab`
- `relational-schema-builder`
- `sql-mission-lab`

### Data preparation / EDA
- `data-quality-lab`
- `eda-explorer`
- `transformation-lab`
- `split-leakage-lab`
- `readiness-scorecard`

### Analysis / AI — Theme 4
- `method-selector`
- `metric-tradeoff-lab`
- `neural-network-lab`
- `convolution-lab`
- `transfer-rl-lab`
- `text-analysis-lab`

## Methodological rules

Правильна модель переходу до ML/DL:

`data audit → split → fit preprocessing on train → transform train/validation/test → train/tune → final evaluation on held-out test`

Для GenAI: source evidence, generated synthesis, uncertainty і human review мають бути явно розділені.

## Документація

- `data/course-matrix.json` — machine-readable roadmap Theme 1–5;
- `../docs/COURSE_INTERACTIVE_MATRIX.md` — master matrix;
- `../docs/THEME3_INTERACTIVE_TRACK.md` — Theme 3;
- `../docs/THEME4_INTERACTIVE_TRACK.md` — Theme 4, source audit, reusable components і technical debt.

## Правило reusable engine

Не додавати lesson-specific JS, якщо поведінку можна винести в reusable component.

`HTML shell + reusable JS component + JSON lesson config = interactive lesson`

## Дані

Web-шар використовує лише synthetic, teaching або дозволені open data. Великі model artifacts не завантажуються автоматично; live LLM/RL backend у базовій статичній версії відсутній.
