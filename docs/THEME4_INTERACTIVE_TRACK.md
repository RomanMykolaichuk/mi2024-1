# Theme 4 Interactive Track — Методи аналізу даних і штучний інтелект

## Мета

Theme 4 побудована як послідовний маршрут **30–45 хв активної web-роботи на заняття**:

`вибір методу → ML task formulation → regression → evaluation/tuning → classification → neural networks → deep learning → TensorFlow practice → CNN → deep-learning project practice → frontier methods → Transfer Learning/RL → project design → text/Generative AI`

Web-шар не замінює Jupyter/Python. Його функція — сформувати правильну аналітичну модель мислення, дати what-if/decision practice і привести слухача до відтворюваної практичної реалізації.

## Статус

**Theme 4 — 14/14 implemented.**

У вересні 2026 додатково посилено два перші заняття:

- **4.1** — visual lecture з 10 інфографік + Method Selector;
- **4.2** — інтерактивний Python ML Lab для regression, classification і clustering + runnable `scikit-learn`/`matplotlib` script.

4.10 залишається повністю закритим primary source package для deep-learning project practice.

## Аудит первинних матеріалів

| ID | Первинне джерело | Підтверджений зміст | Web-акцент | Статус |
|---|---|---|---|---|
| 4.1 | `Theme4/aLection1` | Огляд сучасних методів аналізу даних | 10-image visual lecture + Method Selector | implemented |
| 4.2 | `Theme4/Group lesson 2/content1.ipynb` | Використання методів ШІ | ML task selector + Python regression/classification/clustering lab + ML workflow | implemented |
| 4.3 | `Theme4/practice3/task.ipynb` | Regression practical | metrics + complexity + mission | implemented |
| 4.4 | `Theme4/Group lesson 4/content1.ipynb` | Accuracy + hyperparameters | CV/test roles + tuning | implemented |
| 4.5 | `Theme4/practice5/task.ipynb` | Classification practical | threshold + precision/recall/F1 | implemented |
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

Route:

```text
interactive/lessons/theme4.html?lesson=t4-l1
```

Lesson config:

```text
interactive/data/lessons/t4-l1.json
```

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

Послідовність visual lecture:

`місце Theme 4 → логіка теми → taxonomy → statistics → time series → geospatial/fusion → clustering/anomaly/network → DL/CV → NLP/LLM/RAG → future AI`

Після візуальної частини `method-selector` переводить огляд у рішення: слухач має співвіднести **аналітичне питання + тип даних + потрібний output** із придатною родиною методів.

Timebox: **40–45 хв**.

## 4.2 — Python ML Lab

Route:

```text
interactive/lessons/theme4.html?lesson=t4-l2
```

Lesson config:

```text
interactive/data/lessons/t4-l2.json
```

Runnable reference:

```text
interactive/examples/t4_l2_ml_tasks.py
```

Запуск усіх трьох задач:

```bash
python interactive/examples/t4_l2_ml_tasks.py --task all
```

Окремі приклади:

```bash
python interactive/examples/t4_l2_ml_tasks.py --task regression --noise 25
python interactive/examples/t4_l2_ml_tasks.py --task classification --threshold 0.65
python interactive/examples/t4_l2_ml_tasks.py --task clustering --k 4
```

### Regression

- formulation: numeric target;
- model: `LinearRegression`;
- interactive parameter: synthetic `noise`;
- visual evidence: observations + fitted line;
- metrics: MAE, R² і fitted slope.

Навчальний сенс: погіршення signal-to-noise змінює якість прогнозу; fitted line сама по собі не є доказом хорошої generalization.

### Classification

- formulation: categorical target;
- model: `LogisticRegression`;
- interactive parameter: decision `threshold`;
- visual evidence: predicted classes / decision boundary;
- metrics: accuracy, precision, recall, FP/FN.

Навчальний сенс: threshold є аналітичним рішенням і повинен відповідати вартості FP/FN, а не автоматично дорівнювати `0.5`.

### Clustering

- formulation: no labels + grouping question;
- model: `KMeans`;
- interactive parameter: `k`;
- visual evidence: assigned clusters + centroids;
- diagnostic: inertia і sizes of clusters.

Навчальний сенс: clustering не відкриває «істинні класи» автоматично; `k` і інтерпретація груп потребують domain validation.

### Педагогічний маршрут 4.2

```text
ML task formulation
    ↓
Task Type Selector
    ↓
Python code
    ↓
change one meaningful parameter
    ↓
graph + metrics
    ↓
leakage-safe ML workflow
    ↓
analytical interpretation
```

Timebox: **40–45 хв**.

## 4.10 — primary content

Каталог:

```text
Theme4/Practice 10/
├── README.md
├── content.ipynb
├── task.ipynb
└── sample.ipynb
```

### `content.ipynb`

Методичний content layer:

`problem → data/provenance → split → baseline → DL model → training/regularization → validation → error analysis → reproducible artifact → analytical conclusion`

Окремо розкрито project contract, train/validation/test, leakage, model-family selection, overfitting/regularization, baseline vs DL, final evaluation, error analysis, group roles, Git/PR/review discipline і review checklist.

### `task.ipynb`

Практичне завдання містить individual/group format, 6 variants, mandatory baseline, не менше 3 controlled experiments, experiment table, peer-review checklist, criteria 100 балів і required deliverables.

### `sample.ipynb`

Повністю локальний CNN-приклад на synthetic 16×16 grayscale images трьох класів:

`synthetic data → split → linear/softmax baseline → CNN → early stopping → final test → confusion matrix → failure examples`

Notebook не використовує real operational data.

## Data-driven page shell

Theme 4 використовує один shell:

```text
interactive/lessons/theme4.html?lesson=t4-lN
```

`interactive/js/theme4-page.js`:

1. читає `lesson` із query string;
2. whitelist містить 4.1–4.14;
3. завантажує `interactive/data/lessons/<lesson-id>.json`;
4. формує breadcrumb, navigation, hero, roadmap, scenario, pipeline, component sections, analyst note, quiz і source links;
5. для lesson з `infographics` рендерить visual lecture viewer;
6. запускає загальний `interactive/js/app.js`.

## Reusable components Theme 4

- `method-selector` — method/task matching;
- `metric-tradeoff-lab` — classification/regression/tuning metrics;
- `python-ml-lab` — regression/classification/clustering: Python code + parameter + graph + metrics;
- `neural-network-lab` — architecture capacity/regularization preview;
- `convolution-lab` — local convolution / feature map;
- `transfer-rl-lab` — Transfer Learning + abstract RL;
- `text-analysis-lab` — synthetic text pipeline + provenance;
- shared core: `lesson-roadmap`, `analytics-pipeline`, `decision-tradeoff`, `workflow-mission-lab`, `readiness-scorecard`, `knowledge-check`.

## Методичні принципи Theme 4

### Task formulation before algorithm

```text
question + target/labels + data representation → ML task type → model family → evaluation
```

Regression, classification і clustering не є взаємозамінними лише тому, що всі вони використовують ML libraries.

### Split / leakage discipline

```text
split → fit preprocessing on train → train/tune on train+validation → freeze candidate → final test → error analysis
```

Test не використовується як leaderboard для architecture/hyperparameter selection.

### Browser simulation vs model evidence

Інтерактивний browser chart використовується для швидкого what-if reasoning. Там, де є runnable Python reference, остаточний навчальний зв'язок має бути:

`web intuition → real code → reproducible result → analytical conclusion`.

### Project evidence

Model artifact без provenance, baseline, protocol, metrics, failure modes, limitations і run instructions не вважається достатнім project result.

### Групова робота

Група має один problem contract і один experiment protocol. Roles розподіляють ownership, але final result повинен бути інтегрованим і відтворюваним.

## Technical-debt corrections, що вже враховані web-шаром

- 4.3: не переноситься невідповідність House Prices narrative / фактичного dataset;
- 4.7: не використовується removed `load_boston`; preprocessing fit виконується після split; не дублюється помилкова metric naming;
- 4.12–4.13: не дублюється історичний `pretrained=True` API як актуальна рекомендація;
- 4.14: коротке джерело розширено лише в межах підтверджених text/GenAI тем із provenance/human-review controls.

## Норматив часу

Кожний Theme 4 lesson JSON має declared duration **30–45 хв** і щонайменше 5 active blocks. 4.1 та 4.2 зараз використовують верхню частину цього діапазону через visual/code practice.

## Безпека даних

- Web-layer використовує synthetic/open teaching examples;
- `t4_l2_ml_tasks.py` генерує synthetic ML datasets локально;
- `sample.ipynb` 4.10 генерує synthetic image data локально;
- real sensitive data, credentials, tokens і closed model artifacts не повинні потрапляти до public GitHub або сторонніх сервісів;
- model output завжди потребує validation та human interpretation.

## CI contracts Theme 4

CI має перевіряти:

1. 14/14 Theme 4 lesson JSON;
2. valid JSON та JavaScript syntax;
3. catalog routes і local source links;
4. declared/planned timebox 30–45 хв;
5. 10/10 visual assets 4.1;
6. runnable `t4_l2_ml_tasks.py` і три generated PNG;
7. primary source package 4.10 та Python syntax його sample notebook;
8. відсутність legacy `source-gap` для 4.10.

## Definition of Done Theme 4

Theme 4 завершена, якщо:

1. усі **14/14** занять доступні з grouped catalog;
2. кожне заняття має roadmap 30–45 хв;
3. кожне має substantive interactive / mission / decision activity;
4. 4.1 має перевірюваний комплект 10 visual assets;
5. 4.2 має task selector + `python-ml-lab` + runnable reference;
6. всі lesson JSON валідні;
7. всі source links існують;
8. catalog routes ведуть на shell + lesson JSON;
9. JavaScript проходить `node --check`;
10. 4.10 має власний primary source package;
11. source evidence, model result та analytical interpretation розділені;
12. CI перевіряє structural integrity і runnable teaching examples.
