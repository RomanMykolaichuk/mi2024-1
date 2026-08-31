# MI2024 Interactive — master matrix

> Статусна матриця reusable інтерактивного web-шару. Вихідні назви не вигадуються: `verified`, `verified-from-task`, `source-derived` і `source-gap` зберігають походження назви.

## Архітектурний принцип

`технологія → місце у військовій аналітиці → дія слухача → наслідок → аналітичний висновок`

Цільова тривалість нового web-заняття — **30–45 хв активної роботи**. Theme 1, Theme 2 (2.1–2.3), Theme 4 і Theme 5 використовують data-driven shared shells; 2.4–2.5 та Theme 3 зберігають свої наявні сторінки.

## Матриця

| ID | Source / title audit | Етап | Ключовий інтерактив | Статус |
|---|---|---|---|---|
| 1.1 | `Theme 1/1.1/lesson.ipynb` · **Методологічні основи ІАЗ** · `verified` | decision | IAZ lifecycle + trade-offs | **implemented** |
| 1.2 | `Theme 1/1.2/lesson.ipynb` · **Наукові методи оцінки ефективності застосування інформаційних технологій в ОУВ** · `verified` | decision/evaluation | Effectiveness Scorecard | **implemented** |
| 1.3 | `Theme 1/1.3` · **Основи створення інтегрованого середовища розробки засобів ІАЗ** · `verified` | enablement | Git/IDE workflow | **implemented** |
| 1.4 | `Theme 1/1.4_1.5` · **Проєктування даних і REST API простого засобу ІАЗ** · `source-derived` | storage/enablement | DB → API → UI architecture | **implemented** |
| 1.5 | `Theme 1/1.4_1.5/2025` · **Інтеграція PostgreSQL, REST API та web UI** · `source-derived` | integration | GET/POST/DELETE Integration Flow | **implemented** |
| 2.1 | `alection 1/2026/iaz_learning_site` · **Основи збору та зберігання даних для ІАЗ ОУВ** · `verified` | collection/storage | Collection selector + ETL + CSV/JSON/XML | **implemented** |
| 2.2 | `gl2.2/content.ipynb`, 2026 case · **Методи збору даних для ІАЗ ОУВ** · `verified` | collection/preparation | Internet/API/formal reports + Provenance Lab + 17→14 reconciliation | **implemented** |
| 2.3 | `practice 2.3/task.ipynb` · **Збір даних для інформаційно-аналітичного забезпечення (ІАЗ) ОУВ** · `verified-from-task` | collection | Web/Excel/Form/XML practical missions | **implemented** |
| 2.4 | `gl2.4` · **Методи зберігання даних ІАЗ ОУВ** | storage | Storage Architecture + normalization + SQL | **implemented** |
| 2.5 | `practice2.5` · relational DB / SQL practice | storage/analysis | Schema Builder + SQL Mission Lab | **implemented** |
| 3.1 | `Theme3/aLection1` · data preparation methodology · `verified` | preparation | Data Quality + trade-offs + EDA | **implemented** |
| 3.2 | `Theme3/Group lesson 2` · **Попередній аналіз даних** | preparation | EDA Explorer + workflow mission | **implemented** |
| 3.3 | `Theme3/Practice 3` · Kaggle EDA task | preparation | Practical EDA mission | **implemented** |
| 3.4 | `Theme3/Group lesson 4` · preparation for modeling | preparation | Transformation + leakage lab | **implemented** |
| 3.5 | `Theme3/Practice5` · model-ready practice | model-readiness | Baseline + readiness scorecard | **implemented** |
| 4.1 | `Theme4/aLection1` · modern analysis methods | analysis | Method Selector | **implemented** |
| 4.2 | `Theme4/Group lesson 2` · AI methods | analysis | ML task selector | **implemented** |
| 4.3 | `Theme4/practice3` · regression | analysis | Regression metrics/complexity | **implemented** |
| 4.4 | `Theme4/Group lesson 4` · accuracy/hyperparameters | evaluation | Metric/tuning trade-offs | **implemented** |
| 4.5 | `Theme4/practice5` · classification | evaluation | Threshold / precision / recall / F1 | **implemented** |
| 4.6 | `Theme4/aLection6` · neural networks | analysis | Neural Architecture Lab | **implemented** |
| 4.7 | `Theme4/Group lesson 7` · deep learning | analysis | DL experiment mission | **implemented** |
| 4.8 | `Theme4/practice8` · TensorFlow | analysis | TensorFlow task mission | **implemented** |
| 4.9 | `Theme4/Group lesson 9` · graphical information | analysis | Convolution Lab | **implemented** |
| 4.10 | окремого primary source не знайдено | analysis | не вигадується | **source-gap** |
| 4.11 | `Theme4/aLection11` · перспективні напрями | analysis/enablement | Frontier method selector | **implemented** |
| 4.12 | `Theme4/Group lesson 12` · Transfer Learning + RL | analysis | Transfer/RL Lab | **implemented** |
| 4.13 | `Theme4/Practice 13` · model repositories in projects | project | Project Design Mission | **implemented** |
| 4.14 | `Theme4/Group lesson 14` · text + GenAI | analysis/decision | Text Analysis Lab | **implemented** |
| 5.1 | `Theme5/aLection51` · visualization methodology | visualization | Visual Encoding + Evidence→Brief | **implemented** |
| 5.2 | `Theme5/GroupLesson52` · HTML+CSS | visualization | Dashboard Builder | **implemented** |
| 5.3 | `Theme5/Practice53` · practical visualization | visualization | 10 Visualization Missions | **implemented** |
| 5.4 | `Theme5/GroupLesson54` · visual element selection | visualization | Visual Encoding Challenge | **implemented** |
| 5.5 | `Theme5/Practice55` dashboard artifacts · `source-derived` | visualization/decision | Integrated Dashboard Lab | **implemented** |
| 5.6 | `Theme5/aLection56` · graphic design | visualization | Design Critique | **implemented** |
| 5.7 | `Theme5/GroupLesson57` · applied design | visualization/decision | Group redesign + critique | **implemented** |
| 5.8 | `Theme5/Practice58` · audience-specific visualization | visualization/decision | Audience Adaptation Lab | **implemented** |

## Reusable engine

### Core
`course-catalog`, `lesson-roadmap`, `analytics-pipeline`, `decision-tradeoff`, `workflow-mission-lab`, `knowledge-check`

### Theme 1 — foundations
`iaz-lifecycle-lab`, `effectiveness-scorecard`, `dev-workflow-explorer`, `system-architecture-lab`, `integration-flow-lab`

### Theme 2 — collection / provenance
`collection-method-selector`, `provenance-lab`, `format-exchange-lab`, `collection-mission-lab`

### Theme 2 — storage / SQL
`storage-model-explorer`, `schema-normalization-lab`, `sql-query-lab`, `storage-decision-lab`, `relational-schema-builder`, `sql-mission-lab`

### Theme 3 — preparation / EDA
`data-quality-lab`, `eda-explorer`, `transformation-lab`, `split-leakage-lab`, `readiness-scorecard`

### Theme 4 — analysis / AI
`method-selector`, `metric-tradeoff-lab`, `neural-network-lab`, `convolution-lab`, `transfer-rl-lab`, `text-analysis-lab`

### Theme 5 — visualization
`visual-encoding-lab`, `dashboard-builder`, `design-critique-lab`, `audience-adaptation-lab`, `visualization-mission-lab`, `insight-brief-lab`

## Методичні контролі

- Web-заняття: **30–45 хв активної роботи**.
- Collection: source/provenance/timestamp/schema/validation не губляться під час transformation.
- **Record identity ≠ event identity**: deduplication не повинна знищувати evidence незалежного підтвердження.
- Browser simulation не підміняє live scraping, реальний PostgreSQL, Jupyter, Apps Script або зовнішні API.
- Scaling/imputation/feature selection, що навчаються з даних, fit-яться лише на train після split.
- Held-out test не використовується для model/hyperparameter selection.
- GenAI output відокремлюється від source evidence та проходить human review.
- Visual encoding визначається analytical question/data/audience, а не декоративністю.
- Secrets та sensitive data не зберігаються у Git/static web-layer.
- `source-derived` і `source-gap` не маскуються під verified source titles.
