# MI2024 Interactive

Статичний інтерактивний web-шар курсу на HTML + CSS + Vanilla JavaScript ES Modules + JSON.

## Запуск

```bash
cd interactive
python3 -m http.server 8000
```

Відкрити `http://localhost:8000`.

## Залежності

Для базової web-версії немає npm-залежностей і build step. Потрібні лише browser та будь-який local static server.

Для runnable Python examples потрібні Python packages, що використовуються конкретним заняттям: `numpy`, `pandas`, `matplotlib`, `scikit-learn`.

## Структура

```text
interactive/
├── index.html                 # grouped course catalog
├── lessons/                   # lesson pages / shared shells
├── assets/css/*.css           # design system + thematic styles
├── examples/*.py              # runnable teaching examples
├── js/app.js                  # bootstrap reusable engine
├── js/core/                   # registry + data loader
├── js/components/             # reusable components
└── data/lessons/*.json        # lesson scenarios/configs
```

## Головна сторінка

Каталог організовано **за темами дисципліни**. Кожна тема має status, progress `implemented / total` і картки реалізованих занять.

Поточний стан web-track:

`Theme 1 — 5/5 · Theme 2 — 5/5 · Theme 3 — 5/5 · Theme 4 — 14/14 · Theme 5 — 8/8`

## Норматив тривалості

Базова ціль web-заняття — **приблизно 30–45 хв активної роботи**.

Для full code labs допускається розширення до **90 хв**, якщо додатковий час формується виконанням та інтерпретацією коду. Поточні extended lessons — **3.1 і 3.2**.

Типовий маршрут: scenario → concept/pipeline → main interactive → decision/mission → interpretation → self-check/reflection. `lesson-roadmap` показує timebox і структуру.

## Реалізовані заняття

### Тема 1 — 5/5

Theme 1 використовує data-driven shell:

```text
lessons/theme1.html?lesson=t1-l1
...
lessons/theme1.html?lesson=t1-l5
```

Наскрізний track:

`problem-first methodology → project lifecycle → effectiveness evaluation → Git/IDE workflow → DB/API/UI architecture → integrated mini-system`

Реалізовано:
- 1.1 — IAZ Lifecycle Lab + methodological trade-offs;
- 1.2 — Effectiveness Scorecard: baseline, criteria, weights і hard constraints;
- 1.3 — Git/GitHub + VS Code + Python + PostgreSQL environment, commit/push workflow і repository hygiene;
- 1.4 — DB → REST API → UI architecture;
- 1.5 — 8-variant GET/POST/DELETE Integration Flow Lab.

### Тема 2 — 5/5

2.1–2.3 використовують data-driven shell; 2.4–2.5 зберігають свої сторінки, але вся Тема 2 має спільну навігацію `2.1 → 2.5`.

Наскрізний track:

`information need → collection channel → raw evidence → validation/provenance → CSV/JSON/XML → reconciliation → storage model → relational schema → SQL → analytical result`

### Тема 3 — 5/5

- **3.1 — 90 хв:** methodology + Data Quality + decision trade-offs + EDA + 4 Python labs; runnable `examples/t3_l1_preparation.py`;
- **3.2 — 90 хв:** EDA Explorer + 5 Python labs + team mission; runnable `examples/t3_l2_eda.py` генерує три matplotlib PNG;
- 3.3 — practical reproducible EDA;
- 3.4 — transformation + leakage lab;
- 3.5 — end-to-end model-ready pipeline.

### Тема 4 — 14/14

Theme 4 використовує один data-driven shell:

```text
lessons/theme4.html?lesson=t4-l1
...
lessons/theme4.html?lesson=t4-l14
```

#### 4.1 — visual lecture

4.1 містить **10 послідовних інфографік** із `Theme4/aLection1/infographics2/` та інтерактивний Method Selector.

Маршрут:

`Theme 4 context → course logic → method taxonomy → statistics → time series → geospatial/fusion → clustering/anomaly/network → DL/CV → NLP/LLM/RAG → future AI → method selection`

#### 4.2 — Python ML Lab

4.2 поєднує Task Type Selector, leakage-safe workflow і reusable `python-ml-lab`.

Три вкладки:

- **Regression:** `LinearRegression`, noise, fitted line, MAE, R²;
- **Classification:** `LogisticRegression`, decision threshold, precision/recall, FP/FN;
- **Clustering:** `KMeans`, `k`, centroids, inertia.

Runnable reference:

```bash
python interactive/examples/t4_l2_ml_tasks.py --task all
```

Окремі приклади:

```bash
python interactive/examples/t4_l2_ml_tasks.py --task regression --noise 25
python interactive/examples/t4_l2_ml_tasks.py --task classification --threshold 0.65
python interactive/examples/t4_l2_ml_tasks.py --task clustering --k 4
```

#### 4.3 — Regression Diagnostics Lab

4.3 поглиблює regression workflow від постановки задачі до evidence-based model judgement. Reusable `regression-diagnostics-lab` дозволяє:

- перемикати `LinearRegression`, `Ridge` і `DecisionTreeRegressor`;
- змінювати Ridge `alpha` або tree `max_depth`;
- бачити train/test MAE, test RMSE і R²;
- перемикати `Actual vs predicted`, `Residuals` і `Complexity curve`;
- читати відповідний scikit-learn code preview;
- пояснювати underfitting/overfitting та роль baseline.

Runnable reference:

```bash
python interactive/examples/t4_l3_regression_workflow.py --max-depth 5
```

Script генерує:

```text
interactive/examples/t4_l3_regression_output/
├── actual_vs_predicted.png
├── residuals.png
├── complexity_curve.png
└── model_comparison.csv
```

Ключовий принцип 4.3: **складніша модель повинна довести перевагу на generalization evidence; низький train error не є аргументом сам по собі**.

#### 4.4 — Cross-Validation & Hyperparameter Tuning Lab

4.4 реалізує evaluation protocol як дію, а не лише пояснення. Reusable `cv-tuning-lab` дозволяє:

- змінювати `max_depth` Random Forest;
- перемикати 3/5/7-fold CV;
- порівнювати `accuracy` та `f1_macro`;
- бачити train score, CV mean/std і generalization gap;
- спостерігати train/CV curve та overfitting;
- **не бачити held-out test**, доки candidate не зафіксовано;
- автоматично знову приховувати test після зміни tuning choices.

Runnable reference:

```bash
python interactive/examples/t4_l4_cv_tuning_workflow.py --scoring f1_macro --cv 5
```

Script використовує synthetic imbalanced classification data, ізолює test до tuning і генерує:

```text
interactive/examples/t4_l4_cv_tuning_output/
├── cv_depth_curve.png
├── gridsearch_heatmap.png
├── test_confusion_matrix.png
├── gridsearch_results.csv
└── summary.csv
```

Ключовий принцип 4.4: **GridSearchCV/CV працюють тільки всередині training pool; held-out test відкривається після freeze candidate і не керує model selection**.

#### 4.10 — deep-learning project practice

**«Практичне використання методів глибокого навчання в межах виконання індивідуальних (групових) проектів»**.

Primary source package:

```text
Theme4/Practice 10/
├── README.md
├── content.ipynb
├── task.ipynb
└── sample.ipynb
```

4.10 використовує `neural-network-lab`, `decision-tradeoff`, individual/group `workflow-mission-lab`, `readiness-scorecard` і `knowledge-check`.

`sample.ipynb` генерує synthetic 16×16 images локально і показує `baseline → CNN → early stopping → final test → confusion matrix → error analysis` без зовнішніх даних.

### Тема 5 — 8/8

Theme 5 також використовує data-driven shell:

```text
lessons/theme5.html?lesson=t5-l1
...
lessons/theme5.html?lesson=t5-l8
```

Реалізовано:
- 5.1 — methodology of visualization + Visual Encoding + Evidence→Brief;
- 5.2 — semantic HTML/CSS + responsive Dashboard Builder;
- 5.3 — 10 practical visualization missions;
- 5.4 — selecting visual elements by task/data/audience;
- 5.5 — integrated analytical dashboard with KPI/chart/table/map;
- 5.6 — graphic-design foundations;
- 5.7 — group redesign, critique and design rationale;
- 5.8 — audience adaptation: technical expert / leader / public view.

## Reusable components

### Core / pedagogical
- `course-catalog`
- `lesson-roadmap`
- `analytics-pipeline`
- `decision-tradeoff`
- `workflow-mission-lab`
- `knowledge-check`

### Methodology / project foundations — Theme 1
- `iaz-lifecycle-lab`
- `effectiveness-scorecard`
- `dev-workflow-explorer`
- `system-architecture-lab`
- `integration-flow-lab`

### Collection / provenance — Theme 2
- `collection-method-selector`
- `provenance-lab`
- `format-exchange-lab`
- `collection-mission-lab`

### Storage / SQL — Theme 2
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
- `python-ml-lab`
- `regression-diagnostics-lab`
- `cv-tuning-lab`
- `neural-network-lab`
- `convolution-lab`
- `transfer-rl-lab`
- `text-analysis-lab`

### Visualization / analytical communication — Theme 5
- `visual-encoding-lab`
- `dashboard-builder`
- `design-critique-lab`
- `audience-adaptation-lab`
- `visualization-mission-lab`
- `insight-brief-lab`

## Browser simulation і runnable code

Browser simulation використовується для швидкого reasoning і parameter exploration, але не подається як результат реального model training.

Поточні runnable references:

```text
examples/t3_l1_preparation.py
examples/t3_l2_eda.py
examples/t4_l2_ml_tasks.py
examples/t4_l3_regression_workflow.py
examples/t4_l4_cv_tuning_workflow.py
```

Для 4.2 використовується схема:

`task formulation → Python code → parameter → graph/metrics → runnable reproduction → interpretation`.

Для 4.3:

`numeric target → baseline → alternative models → parameter/complexity → actual-vs-predicted/residuals → runnable comparison → model judgement`.

Для 4.4:

`isolate test → define scoring/search space → Stratified CV → GridSearchCV → freeze candidate → one final test → error analysis`.

## Methodological rules

Theme 1:

`information need → requirements/criteria → design → implementation → validation → operation → evaluation/feedback`

Theme 2:

`information need → source/channel → capture → validation/provenance → format → reconciliation → storage → query`

Record identity and event identity are not the same. Deduplication має уникати подвійного рахунку, але не знищувати evidence про незалежні підтвердження.

Правильна модель переходу до ML/DL:

`data audit → split → fit preprocessing on train → transform train/validation/test → train/tune → freeze candidate → final evaluation on held-out test → error analysis`

ML task type визначається аналітичним питанням і target/labels **до** вибору алгоритму.

Regression model selection не робиться за train score або повторним підбором на held-out test: baseline, validation/CV, residual diagnostics і фінальний test мають різні ролі.

Hyperparameter tuning не використовує held-out test як feedback loop. Якщо test переглядається після кожної комбінації, він фактично стає validation set і фінальна оцінка перестає бути незалежною.

Для DL-project:

`problem contract → provenance → baseline → controlled experiments → independent evaluation → failure modes → reproducibility → limitations / next step`

Для GenAI: source evidence, generated synthesis, uncertainty і human review мають бути явно розділені.

Для visualization:

`analytical question → visual encoding → scale/context → pattern → verification → interpretation → implication / next step`

## CI

`Interactive static checks` перевіряє JS, JSON, catalog/matrix/routes/sources, Theme 4.10 package, 10 visual assets 4.1, а також headless-запуск runnable Python examples 3.1, 3.2, 4.2, 4.3 і 4.4 та очікувані PNG/CSV outputs.

## Документація

- `data/course-matrix.json` — machine-readable roadmap Theme 1–5;
- `../docs/COURSE_INTERACTIVE_MATRIX.md` — master matrix;
- `../docs/THEME1_INTERACTIVE_TRACK.md` — Theme 1;
- `../docs/THEME2_INTERACTIVE_TRACK.md` — Theme 2;
- `../docs/THEME3_INTERACTIVE_TRACK.md` — Theme 3;
- `../docs/THEME4_INTERACTIVE_TRACK.md` — Theme 4, включно з 4.1–4.4 і 4.10;
- `../docs/THEME5_INTERACTIVE_TRACK.md` — Theme 5.

## Правило reusable engine

Не додавати lesson-specific JS, якщо поведінку можна зібрати з наявних reusable components.

`HTML shell + reusable JS component + JSON lesson config = interactive lesson`

Унікальна поведінка додається як reusable component лише тоді, коли вона представляє повторно застосовну педагогічну взаємодію. `python-ml-lab`, `regression-diagnostics-lab` і `cv-tuning-lab` є такими компонентами.

## Дані

Web-шар використовує лише synthetic, teaching або дозволені open data. Великі model artifacts не завантажуються автоматично; live LLM/RL backend у базовій статичній версії відсутній.
