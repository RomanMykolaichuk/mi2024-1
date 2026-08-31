# MI2024 Interactive — master matrix

> Статусна матриця для послідовного перетворення наявних матеріалів курсу на reusable інтерактивні сторінки. Вона **не перейменовує** вихідні заняття. Якщо точна назва ще не підтверджена з файлу заняття, це явно позначено.

## Архітектурний принцип

`технологія → місце у військовій аналітиці → дія слухача → наслідок → аналітичний висновок`

Кожне заняття має збиратися reusable-компонентами та JSON-конфігурацією; для Theme 4 використовується спільний data-driven page shell.

## Матриця

| ID | Тип | Джерело | Назва / робоча назва | Етап ІАЗ | Технологія | Реалізований / запланований інтерактив | Компоненти | Статус |
|---|---|---|---|---|---|---|---|---|
| t1-l1 | lecture | `Theme 1/1.1` | Методологічні основи ІАЗ | decision | IAZ methodology; project lifecycle | Interactive IAZ lifecycle + methodology comparison | `analytics-pipeline`, `decision-tradeoff` | **planned** |
| t1-l2 | lecture | `Theme 1/1.2` | Наукові методи оцінки ефективності застосування інформаційних технологій в ОУВ | decision | IT effectiveness evaluation | Effectiveness scorecard | `effectiveness-scorecard`, `decision-tradeoff` | **planned** |
| t1-l3 | lecture | `Theme 1/1.3` | Основи створення інтегрованого середовища розробки засобів ІАЗ | enablement | Git; IDE; development workflow | Git/IDE workflow explorer | `dev-workflow-explorer` | **planned** |
| t1-l4 | project/group | `Theme 1/1.4_1.5/01DataBase` | Проєктування бази даних засобу ІАЗ | storage | database architecture | Schema builder + entity relationship lab | `schema-normalization-lab`, `storage-model-explorer` | **planned** |
| t1-l5 | project/practice | `Theme 1/1.4_1.5/02Analytics_03UI(UX)` | Аналітика та UI/UX засобу ІАЗ | visualization | analytics; UI/UX | Dashboard/UX builder | `metric-explorer`, `visual-encoding-lab` | **planned** |
| t2-l1 | lecture | `Theme 2/alection 1` | Збір та зберігання даних для ІАЗ ОВУ | collection/storage | data sources; storage | Source-to-storage flow explorer | `analytics-pipeline`, `source-flow-map` | **planned** |
| t2-l2 | group | `Theme 2/gl2.2` | Методи збору даних для ІАЗ ОВУ | collection | web forms; files; APIs | Collection method selector | `source-flow-map`, `decision-tradeoff` | **planned** |
| t2-l3 | practice | `Theme 2/practice 2.3` | Збір даних для інформаційно-аналітичного забезпечення ОУВ | collection | web scraping; Excel; forms; XML/JSON | Multi-source collection challenge | `source-flow-map`, `format-converter-lab` | **planned** |
| t2-l4 | group | `Theme 2/gl2.4` | Методи зберігання даних ІАЗ ОУВ | storage | relational DB; SQL; normalization; NoSQL | Storage Architecture Lab | `analytics-pipeline`, `storage-model-explorer`, `schema-normalization-lab`, `sql-query-lab`, `storage-decision-lab`, `knowledge-check` | **implemented** |
| t2-l5 | practice | `Theme 2/practice2.5` | Реляційна база даних: дві пов’язані таблиці та SQL-запити | storage | PostgreSQL; relational schema; JOIN; GROUP BY | Relational schema + SQL Mission Lab | `relational-schema-builder`, `sql-mission-lab`, `knowledge-check` | **implemented** |
| t3-l1 | lecture | `Theme3/aLection1` | Методологія підготовки даних; Методи попереднього аналізу даних | preparation | data quality; cleaning; transformation; EDA | 35–45 хв: methodology + Data Quality + decision trade-offs + EDA | `lesson-roadmap`, `analytics-pipeline`, `data-quality-lab`, `decision-tradeoff`, `eda-explorer`, `knowledge-check` | **implemented** |
| t3-l2 | group | `Theme3/Group lesson 2` | Попередній аналіз даних | preparation | EDA; statistics; visualization; correlation; anomalies | EDA Explorer + team mission | `eda-explorer`, `workflow-mission-lab`, `knowledge-check` | **implemented** |
| t3-l3 | practice | `Theme3/Practice 3/task.ipynb` | Аналіз набору даних з Kaggle | preparation | data audit; statistics; visualization; correlation | Reproducible EDA Mission | `eda-explorer`, `workflow-mission-lab`, `knowledge-check` | **implemented** |
| t3-l4 | group | `Theme3/Group lesson 4` | Методи підготовки даних до аналізу (моделювання) | preparation | missing data; scaling; encoding; train/test | Transformation + Data Leakage Lab | `transformation-lab`, `split-leakage-lab`, `knowledge-check` | **implemented** |
| t3-l5 | practice | `Theme3/Practice5/task.ipynb` | Аналіз набору даних з Kaggle (Практика 3.5) | preparation/model-readiness | preprocessing; baseline; independent evaluation | Model-Ready Pipeline + Readiness Gate | `workflow-mission-lab`, `split-leakage-lab`, `readiness-scorecard`, `knowledge-check` | **implemented** |
| t4-l1 | lecture | `Theme4/aLection1` | Огляд сучасних методів аналізу даних в інтересах ІАЗ ОВУ | analysis | statistics; ML; AI; GIS; text/network | Method Selector + constraints | `lesson-roadmap`, `method-selector`, `decision-tradeoff`, `knowledge-check` | **implemented** |
| t4-l2 | group | `Theme4/Group lesson 2/content1.ipynb` | Використання методів штучного інтелекту для аналізу даних | analysis | classification; regression; clustering; ML workflow | Task Type Selector + ML Workflow Mission | `method-selector`, `workflow-mission-lab`, `knowledge-check` | **implemented** |
| t4-l3 | practice | `Theme4/practice3/task.ipynb` | Використання методів штучного інтелекту для аналізу даних: регресія | analysis | regression; MAE; RMSE/MSE; R² | Regression complexity + practical mission | `metric-tradeoff-lab`, `workflow-mission-lab`, `knowledge-check` | **implemented** |
| t4-l4 | group | `Theme4/Group lesson 4/content1.ipynb` | Оцінка точності та налаштування гіперпараметрів моделі | analysis/evaluation | metrics; CV; Grid/Random Search; tuning | Hyperparameter curve + evaluation decisions | `metric-tradeoff-lab`, `decision-tradeoff`, `knowledge-check` | **implemented** |
| t4-l5 | practice | `Theme4/practice5/task.ipynb` | Використання методів штучного інтелекту для аналізу даних: класифікація | analysis/evaluation | confusion matrix; precision; recall; F1; threshold | Threshold Lab + classification mission | `metric-tradeoff-lab`, `workflow-mission-lab`, `knowledge-check` | **implemented** |
| t4-l6 | lecture | `Theme4/aLection6` | Основи використання штучних нейронних мереж для аналізу даних | analysis | ANN; weights; activation; training; deep learning | Neural Architecture Lab + model trade-offs | `neural-network-lab`, `decision-tradeoff`, `knowledge-check` | **implemented** |
| t4-l7 | group | `Theme4/Group lesson 7/content.ipynb` | Основи використання методів глибокого навчання для аналізу даних | analysis | MLP; CNN; RNN/LSTM/GRU; Transformer; TensorFlow/Keras | Architecture + leakage-safe experiment mission | `neural-network-lab`, `workflow-mission-lab`, `knowledge-check` | **implemented** |
| t4-l8 | practice | `Theme4/practice8/practical_task_regression_classification.ipynb` | Практична робота: регресія та класифікація з використанням TensorFlow | analysis | TensorFlow/Keras; regression/classification | Task switch + reproducible TensorFlow mission | `neural-network-lab`, `workflow-mission-lab`, `knowledge-check` | **implemented** |
| t4-l9 | group | `Theme4/Group lesson 9/content.ipynb` | Основи використання методів глибокого навчання для аналізу графічної інформації | analysis | convolution; CNN; pooling; ResNet; transfer | Convolution Lab + CNN design trade-offs | `convolution-lab`, `decision-tradeoff`, `knowledge-check` | **implemented** |
| t4-l10 | unknown | `—` | Окреме первинне джерело 4.10 у репозиторії відсутнє | analysis | — | Не реалізується без джерела | — | **source-gap** |
| t4-l11 | lecture | `Theme4/aLection11/content.ipynb` | Перспективні напрямки використання методів аналізу даних | analysis/enablement | CNN/RNN/Transformer; GAN/VAE; LLM; MLOps; Transfer; RL | Frontier Method Selector + operationalization | `method-selector`, `decision-tradeoff`, `knowledge-check` | **implemented** |
| t4-l12 | group | `Theme4/Group lesson 12/content.ipynb` | Використання репозиторіїв аналітичних моделей (Transfer Learning) та основи Reinforcement Learning | analysis | fine-tuning; model hubs; agent/state/action/reward/environment | Transfer/RL Lab + validation risks | `transfer-rl-lab`, `decision-tradeoff`, `knowledge-check` | **implemented** |
| t4-l13 | practice | `Theme4/Practice 13/content.ipynb` | Практичне використання репозиторіїв аналітичних моделей у межах індивідуальних (групових) проєктів | analysis/project | Transfer Learning; RL; reproducibility | Project Design Mission | `transfer-rl-lab`, `workflow-mission-lab`, `knowledge-check` | **implemented** |
| t4-l14 | group | `Theme4/Group lesson 14/info.ipynb` | Методи аналізу текстової інформації. Основи генеративного штучного інтелекту | analysis/decision | text analytics; extraction; summarization; GenAI; provenance | Text Analysis Lab + GenAI controls | `text-analysis-lab`, `decision-tradeoff`, `knowledge-check` | **implemented** |
| t5-l1 | lecture | `Theme5/aLection51` | Заняття 5.1 — лекція | visualization | visualization / information presentation | Visualization concept explorer | `visual-encoding-lab` | **audit-needed** |
| t5-l2 | group | `Theme5/GroupLesson52` | Заняття 5.2 — групове | visualization | visual analytics | Visual encoding challenge | `visual-encoding-lab`, `decision-tradeoff` | **audit-needed** |
| t5-l3 | practice | `Theme5/Practice53` | Заняття 5.3 — практичне | visualization | dashboarding | Dashboard builder | `dashboard-builder` | **audit-needed** |
| t5-l4 | group | `Theme5/GroupLesson54` | Заняття 5.4 — групове | visualization | visual analytics | Dashboard critique | `dashboard-builder`, `decision-tradeoff` | **audit-needed** |
| t5-l5 | practice | `Theme5/Practice55` | Заняття 5.5 — практичне | visualization | dashboard/reporting | Analytical dashboard lab | `dashboard-builder` | **audit-needed** |
| t5-l6 | lecture | `Theme5/aLection56` | Заняття 5.6 — лекція | decision | decision-support technologies | Decision-support explainer | `decision-brief`, `analytics-pipeline` | **audit-needed** |
| t5-l7 | group | `Theme5/GroupLesson57` | Заняття 5.7 — групове | decision | decision support | Decision scenario lab | `decision-tradeoff`, `decision-brief` | **audit-needed** |
| t5-l8 | practice | `Theme5/Practice58` | Заняття 5.8 — практичне | decision | integrated analytics | Capstone analytical product | `dashboard-builder`, `decision-brief` | **audit-needed** |

## Reusable engine — реалізовано

### Core / pedagogical
- `course-catalog`
- `lesson-roadmap`
- `analytics-pipeline`
- `decision-tradeoff`
- `workflow-mission-lab`
- `knowledge-check`

### Theme 2 — storage / SQL
- `storage-model-explorer`
- `schema-normalization-lab`
- `sql-query-lab`
- `storage-decision-lab`
- `relational-schema-builder`
- `sql-mission-lab`

### Theme 3 — data preparation / EDA
- `data-quality-lab`
- `eda-explorer`
- `transformation-lab`
- `split-leakage-lab`
- `readiness-scorecard`

### Theme 4 — analysis / AI
- `method-selector`
- `metric-tradeoff-lab`
- `neural-network-lab`
- `convolution-lab`
- `transfer-rl-lab`
- `text-analysis-lab`

## Методичні контролі

- Цільова тривалість web-заняття: **30–45 хв активної роботи**.
- Scaling/imputation/feature selection, що навчаються з даних, fit-яться лише на train після split.
- Held-out test не використовується для hyperparameter/model selection.
- GenAI output відокремлюється від source evidence і має provenance/human review.
- Source gap не заповнюється вигаданим матеріалом: саме тому `4.10` залишається `source-gap`.

## Правило аудиту

Рядки `working`, `source-derived`, `audit-needed` та `source-gap` не є твердженнями про офіційну назву чи зміст. Перед реалізацією читається первинний notebook/PDF/plan; лише після цього оновлюються назва, технологія, learning goal та статус.
