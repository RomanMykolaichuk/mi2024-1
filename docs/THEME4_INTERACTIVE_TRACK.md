# Theme 4 Interactive Track — Методи аналізу даних і штучний інтелект

## Мета

Theme 4 побудована як послідовний маршрут **30–45 хв активної web-роботи на заняття**:

`вибір методу → ML task formulation → regression → evaluation/tuning → classification → neural networks → deep learning → TensorFlow practice → CNN → deep-learning project practice → frontier methods → Transfer Learning/RL → project design → text/Generative AI`

Web-шар не замінює Jupyter/Python. Його функція — сформувати правильну аналітичну модель мислення, дати what-if/decision practice і привести слухача до відтворюваної практичної реалізації.

## Статус

**Theme 4 — 14/14 implemented.**

У вересні 2026 додатково посилено перші п’ять занять:

- **4.1** — visual lecture з 10 інфографік + Method Selector;
- **4.2** — Python ML Lab для regression, classification і clustering + runnable `scikit-learn`/`matplotlib` reference;
- **4.3** — Regression Diagnostics Lab: Linear/Ridge/Decision Tree, actual-vs-predicted, residuals, complexity curve + runnable comparison;
- **4.4** — CV Tuning Lab: train/CV curves, scoring/folds, GridSearchCV workflow, freeze candidate + held-out test gate;
- **4.5** — Classification Threshold Lab: probability → threshold → confusion matrix → precision/recall/F1 → FP/FN cost → freeze operating point → held-out test.

4.10 залишається повністю закритим primary source package для deep-learning project practice.

## Аудит первинних матеріалів

| ID | Первинне джерело | Підтверджений зміст | Web-акцент | Статус |
|---|---|---|---|---|
| 4.1 | `Theme4/aLection1` | Огляд сучасних методів аналізу даних | 10-image visual lecture + Method Selector | implemented |
| 4.2 | `Theme4/Group lesson 2/content1.ipynb` | Використання методів ШІ | ML task selector + Python regression/classification/clustering lab | implemented |
| 4.3 | `Theme4/practice3/task.ipynb` | Regression practical | baseline + Ridge/Tree + diagnostics + runnable workflow | implemented |
| 4.4 | `Theme4/Group lesson 4/content1.ipynb` | Accuracy + hyperparameters | CV/test roles + scoring + GridSearchCV + test isolation | implemented |
| 4.5 | `Theme4/practice5/task.ipynb` | Classification practical | validation threshold + confusion matrix + precision/recall/F1 + FP/FN cost + final test | implemented |
| 4.6 | `Theme4/aLection6` | Neural networks | architecture capacity + regularization | implemented |
| 4.7 | `Theme4/Group lesson 7/content.ipynb` | Deep learning foundations | leakage-safe DL experiment design | implemented |
| 4.8 | `Theme4/practice8/practical_task_regression_classification.ipynb` | TensorFlow regression/classification | output/loss/metric mapping | implemented |
| 4.9 | `Theme4/Group lesson 9/content.ipynb` | DL для графічної інформації | convolution/CNN + domain shift | implemented |
| 4.10 | `Theme4/Practice 10/{content,task,sample}.ipynb` | Практичне використання DL в індивідуальних/групових проектах | project evidence chain + individual/group missions | implemented |
| 4.11 | `Theme4/aLection11/content.ipynb` | Перспективні напрями | frontier methods + MLOps/governance | implemented |
| 4.12 | `Theme4/Group lesson 12/content.ipynb` | Transfer Learning + RL | fine-tuning + reward/environment validation | implemented |
| 4.13 | `Theme4/Practice 13/content.ipynb` | Model repositories у проектах | project design + reproducibility gates | implemented |
| 4.14 | `Theme4/Group lesson 14/info.ipynb` | Text analysis + Generative AI | text workflow + provenance/human review | implemented |

## 4.1 — visual lecture

Route: `interactive/lessons/theme4.html?lesson=t4-l1`  
Config: `interactive/data/lessons/t4-l1.json`

Visual assets:

```text
Theme4/aLection1/infographics2/
├── 01_theme4_methods.png
├── 02_theme4_logic.png
├── 03_methods_classification.png
├── 04_statistical_methods.png
├── 05_time_series_forecasting.png
├── 06_geospatial_fusion.png
├── 07_clustering_anomaly_network.png
├── 08_deep_learning_cv.png
├── 09_nlp_llm_rag.png
└── 10_future_ai_methods.png
```

Sequence:

`місце Theme 4 → логіка теми → taxonomy → statistics → time series → geospatial/fusion → clustering/anomaly/network → DL/CV → NLP/LLM/RAG → future AI → method selection`

Timebox: **40–45 хв**.

## 4.2 — Python ML Lab

Route: `interactive/lessons/theme4.html?lesson=t4-l2`  
Config: `interactive/data/lessons/t4-l2.json`  
Runnable: `interactive/examples/t4_l2_ml_tasks.py`

```bash
python interactive/examples/t4_l2_ml_tasks.py --task all
```

Три постановки:

- regression — `LinearRegression`, noise → fitted line / MAE / R²;
- classification — `LogisticRegression`, threshold → precision/recall / decision boundary;
- clustering — `KMeans`, k → clusters / centroids / inertia.

Педагогічний маршрут:

`ML task formulation → Python code → meaningful parameter → graph/metrics → leakage-safe workflow → runnable reproduction → interpretation`.

Timebox: **40–45 хв**.

## 4.3 — Regression Diagnostics Lab

Route: `interactive/lessons/theme4.html?lesson=t4-l3`  
Config: `interactive/data/lessons/t4-l3.json`  
Runnable: `interactive/examples/t4_l3_regression_workflow.py`

```bash
python interactive/examples/t4_l3_regression_workflow.py --max-depth 5
```

Reusable `regression-diagnostics-lab`:

- `LinearRegression` baseline;
- `Ridge` + `alpha`;
- `DecisionTreeRegressor` + `max_depth`;
- train/test MAE, test RMSE, R²;
- Actual vs predicted;
- Residuals;
- Complexity curve.

Outputs:

```text
interactive/examples/t4_l3_regression_output/
├── actual_vs_predicted.png
├── residuals.png
├── complexity_curve.png
└── model_comparison.csv
```

Principle:

`numeric target → baseline → alternatives → complexity → diagnostics → validation/CV judgement → frozen candidate → held-out test → interpretation`.

Timebox: **40–45 хв**.

## 4.4 — Cross-Validation & Hyperparameter Tuning Lab

Route: `interactive/lessons/theme4.html?lesson=t4-l4`  
Config: `interactive/data/lessons/t4-l4.json`  
Runnable: `interactive/examples/t4_l4_cv_tuning_workflow.py`

```bash
python interactive/examples/t4_l4_cv_tuning_workflow.py --scoring f1_macro --cv 5
```

Reusable `cv-tuning-lab`:

- `max_depth` slider;
- 3/5/7-fold CV;
- `accuracy` / `f1_macro` scoring;
- train score, CV mean/std, train/CV gap;
- best CV candidate marker;
- held-out test gate;
- будь-яка зміна tuning choices invalidates freeze і знову приховує test.

Runnable reference використовує synthetic imbalanced data, `StratifiedKFold`, `cross_validate`, `GridSearchCV(RandomForestClassifier)` і відкриває test лише після freeze candidate.

Outputs:

```text
interactive/examples/t4_l4_cv_tuning_output/
├── cv_depth_curve.png
├── gridsearch_heatmap.png
├── test_confusion_matrix.png
├── gridsearch_results.csv
└── summary.csv
```

### Методична корекція primary materials

У старому `content1.ipynb` є standalone приклад `cross_val_score(model, X, y, cv=5)` на всьому dataset уже після створення test split. Для tuning protocol із незалежним test це неприйнятно, бо test samples повертаються в CV pool. Strengthened 4.4 використовує CV лише всередині training pool.

Timebox: **40–45 хв**.

## 4.5 — Classification Threshold Lab

Route: `interactive/lessons/theme4.html?lesson=t4-l5`  
Config: `interactive/data/lessons/t4-l5.json`  
Runnable: `interactive/examples/t4_l5_classification_workflow.py`

```bash
python interactive/examples/t4_l5_classification_workflow.py --fn-cost 8 --fp-cost 1
```

### Інтерактивний workflow

Reusable `classification-threshold-lab` показує, що classification decision має два шари:

`model probability score → operating threshold → class/action`.

Слухач може:

- змінювати threshold `0.20–0.80`;
- змінювати відносну ціну FN `1×–12×` FP;
- бачити validation curves precision / recall / F1;
- читати TP, FP, FN, TN;
- порівнювати accuracy, precision, recall і F1;
- бачити weighted validation cost `FP×cost_FP + FN×cost_FN`;
- порівнювати поточний operating point із validation cost optimum;
- зафіксувати threshold і лише після цього відкрити held-out test;
- автоматично втратити попередній test result, якщо threshold або cost assumptions змінено.

### Runnable Logistic Regression

Python reference:

1. генерує synthetic imbalanced classification dataset;
2. робить stratified `train / validation / test` split;
3. fit-ить `StandardScaler + LogisticRegression` лише на train;
4. отримує probability scores для validation;
5. перевіряє threshold grid `0.20–0.80`;
6. для кожного threshold рахує confusion matrix, precision, recall, F1 і weighted cost;
7. обирає threshold за minimum validation cost, tie-break — F1/recall;
8. freeze-ить operating point;
9. лише після цього один раз оцінює held-out test.

Outputs:

```text
interactive/examples/t4_l5_classification_output/
├── validation_threshold_tradeoff.png
├── validation_cost_curve.png
├── test_confusion_matrix.png
├── threshold_table.csv
└── summary.csv
```

Педагогічний принцип:

`positive-class semantics → class balance → train/validation/test → probability model → threshold selection on validation → FP/FN consequence → freeze operating point → held-out test → analytical conclusion`.

Важливо: F1-optimal threshold і cost-optimal threshold можуть бути різними. Threshold не є властивістю моделі «назавжди» — він залежить від decision objective та operational constraints.

### Методична корекція primary practical

Primary `task.ipynb` правильно вимагає class balance, accuracy/precision/recall/F1, confusion matrix і ROC curve, але його базовий приклад використовує `model.predict(X_test)` з implicit threshold `0.5`. Strengthened 4.5 не підбирає threshold на held-out test: operating point обирається на validation evidence, а test використовується тільки для фінальної оцінки frozen policy.

Timebox: **40–45 хв**.

## 4.10 — primary content

Primary package:

```text
Theme4/Practice 10/
├── README.md
├── content.ipynb
├── task.ipynb
└── sample.ipynb
```

`content.ipynb` формує methodology: `problem → data/provenance → split → baseline → DL model → training/regularization → validation → error analysis → reproducible artifact → conclusion`.

`task.ipynb` містить individual/group format, 6 variants, mandatory baseline, не менше 3 controlled experiments, experiment table, peer-review checklist, criteria 100 балів і required deliverables.

`sample.ipynb` локально генерує synthetic 16×16 grayscale images і демонструє `baseline → CNN → early stopping → final test → confusion matrix → failure examples`.

## Data-driven page shell

Theme 4 використовує один shell:

```text
interactive/lessons/theme4.html?lesson=t4-lN
```

`interactive/js/theme4-page.js` читає query parameter, завантажує lesson JSON, будує hero/roadmap/scenario/pipeline/sections/note/quiz/sources і запускає загальний reusable engine. Для 4.1 shell додатково рендерить visual lecture viewer.

## Reusable components Theme 4

- `method-selector` — method/task matching;
- `metric-tradeoff-lab` — базові metric trade-offs;
- `python-ml-lab` — regression/classification/clustering: Python code + parameter + graph + metrics;
- `regression-diagnostics-lab` — model comparison + residuals + complexity;
- `cv-tuning-lab` — CV folds/scoring + train/CV curve + freeze + test gate;
- `classification-threshold-lab` — threshold + FP/FN cost + validation curves + confusion matrix + freeze + test gate;
- `neural-network-lab` — architecture capacity/regularization;
- `convolution-lab` — local convolution / feature map;
- `transfer-rl-lab` — Transfer Learning + abstract RL;
- `text-analysis-lab` — synthetic text pipeline + provenance;
- shared core: `lesson-roadmap`, `analytics-pipeline`, `decision-tradeoff`, `workflow-mission-lab`, `readiness-scorecard`, `knowledge-check`.

## Методичні принципи Theme 4

### Task formulation before algorithm

`question + target/labels + data representation → ML task type → model family → evaluation`.

### Split / leakage discipline

`split → fit preprocessing on train → train/tune on train+validation/CV → freeze candidate/policy → final test → error analysis`.

Held-out test не використовується як leaderboard для architecture, hyperparameter або threshold selection.

### Regression evidence chain — 4.3

`baseline → same split → error metrics → residuals → complexity/validation evidence → final test → domain interpretation`.

### Evaluation/tuning evidence chain — 4.4

`test isolation → scoring rationale → search space → CV mean/std → best_params → freeze → one final test → limitations`.

### Classification operating-point evidence chain — 4.5

`class semantics → class balance → probability model → validation threshold table → confusion matrix → precision/recall/F1 → FP/FN cost → freeze threshold → one final test`.

Accuracy не є достатньою основною метрикою при imbalance. Threshold `0.5` не є універсально правильним. Зміна FP/FN consequence може змінити operating point без перенавчання моделі.

### Browser simulation vs model evidence

Browser chart — швидка навчальна реконструкція. Там, де є runnable reference, остаточний зв’язок:

`web intuition → real code → reproducible result → analytical conclusion`.

### Project evidence

Model artifact без provenance, baseline, protocol, metrics, failure modes, limitations і run instructions не вважається достатнім project result.

## Technical-debt corrections, що враховані web-шаром

- 4.3: source notebook змішує House Prices / `SalePrice` narrative з `Student_Performance.csv`; web-layer використовує окремий coherent synthetic reference;
- 4.4: historical CV example не використовується як tuning protocol із незалежним test;
- 4.5: implicit `model.predict()` threshold `0.5` не подається як універсальний operating point; threshold selection винесено на validation evidence;
- 4.7: не використовується removed `load_boston`; preprocessing fit після split;
- 4.12–4.13: не дублюється історичний `pretrained=True` API як актуальна рекомендація;
- 4.14: GenAI synthesis відокремлюється від source evidence та human review.

## Норматив часу

Кожний Theme 4 lesson JSON має declared duration **30–45 хв** і щонайменше 5 active blocks. 4.1–4.5 використовують верхню частину діапазону через visual/code/diagnostics/tuning/threshold practice.

## Безпека даних

- Web-layer використовує synthetic/open teaching examples;
- `t4_l2_ml_tasks.py` генерує synthetic ML datasets;
- `t4_l3_regression_workflow.py` генерує synthetic regression data;
- `t4_l4_cv_tuning_workflow.py` генерує synthetic imbalanced classification data;
- `t4_l5_classification_workflow.py` генерує synthetic imbalanced classification data;
- `sample.ipynb` 4.10 генерує synthetic image data;
- real sensitive data, credentials, tokens і closed model artifacts не повинні потрапляти до public GitHub або сторонніх сервісів.

## CI contracts Theme 4

CI має перевіряти:

1. 14/14 Theme 4 lesson JSON;
2. valid JSON та JavaScript syntax;
3. catalog routes і local source links;
4. declared/planned timebox 30–45 хв;
5. 10/10 visual assets 4.1;
6. runnable `t4_l2_ml_tasks.py` і три generated PNG;
7. runnable `t4_l3_regression_workflow.py`, three diagnostics PNG + model comparison CSV;
8. runnable `t4_l4_cv_tuning_workflow.py`, CV curve, GridSearch heatmap, final confusion matrix + CSV summaries;
9. runnable `t4_l5_classification_workflow.py`, validation trade-off/cost plots, final confusion matrix + threshold/summary CSV;
10. primary source package 4.10 та Python syntax його sample notebook;
11. відсутність legacy `source-gap` для 4.10.

## Definition of Done Theme 4

Theme 4 завершена, якщо:

1. усі **14/14** занять доступні з grouped catalog;
2. кожне заняття має roadmap 30–45 хв;
3. кожне має substantive interactive / mission / decision activity;
4. 4.1 має 10 visual assets;
5. 4.2 має `python-ml-lab` + runnable reference;
6. 4.3 має `regression-diagnostics-lab` + runnable diagnostics;
7. 4.4 має `cv-tuning-lab` + runnable GridSearchCV + held-out test discipline;
8. 4.5 має `classification-threshold-lab` + validation-only threshold selection + held-out test discipline;
9. усі lesson JSON валідні;
10. source links існують;
11. catalog routes ведуть на shell + lesson JSON;
12. JavaScript проходить `node --check`;
13. 4.10 має primary source package;
14. source evidence, model result та analytical interpretation розділені;
15. CI перевіряє structural integrity і runnable teaching examples.
