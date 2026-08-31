# MI2024 Interactive — master matrix

> Статусна матриця для послідовного перетворення наявних матеріалів курсу на reusable інтерактивні сторінки. Вона **не перейменовує** вихідні заняття. Якщо точна назва не підтверджена первинним матеріалом, це явно позначається.

## Архітектурний принцип

`технологія → місце у військовій аналітиці → дія слухача → наслідок → аналітичний висновок`

Кожне заняття збирається reusable-компонентами та JSON-конфігурацією. Theme 4 і Theme 5 використовують спільні data-driven page shells, щоб не дублювати HTML/навігацію.

## Матриця

| ID | Тип | Джерело | Назва / робоча назва | Етап ІАЗ | Технологія | Інтерактив | Компоненти | Статус |
|---|---|---|---|---|---|---|---|---|
| t1-l1 | lecture | `Theme 1/1.1` | Методологічні основи ІАЗ | decision | IAZ methodology | IAZ lifecycle | `analytics-pipeline`, `decision-tradeoff` | **planned** |
| t1-l2 | lecture | `Theme 1/1.2` | Наукові методи оцінки ефективності застосування ІТ в ОУВ | decision | effectiveness evaluation | Effectiveness scorecard | `effectiveness-scorecard` | **planned** |
| t1-l3 | lecture | `Theme 1/1.3` | Основи створення інтегрованого середовища розробки засобів ІАЗ | enablement | Git; IDE; workflow | Development workflow explorer | `dev-workflow-explorer` | **planned** |
| t1-l4 | project/group | `Theme 1/1.4_1.5/01DataBase` | Проєктування бази даних засобу ІАЗ | storage | DB architecture | Schema builder | `schema-normalization-lab`, `storage-model-explorer` | **planned** |
| t1-l5 | project/practice | `Theme 1/1.4_1.5/02Analytics_03UI(UX)` | Аналітика та UI/UX засобу ІАЗ | visualization | analytics; UI/UX | Dashboard/UX builder | `visual-encoding-lab` | **planned** |
| t2-l1 | lecture | `Theme 2/alection 1` | Збір та зберігання даних для ІАЗ ОВУ | collection/storage | data sources; storage | Source-to-storage flow | `analytics-pipeline` | **planned** |
| t2-l2 | group | `Theme 2/gl2.2` | Методи збору даних для ІАЗ ОВУ | collection | web/forms/files/APIs | Collection selector | `decision-tradeoff` | **planned** |
| t2-l3 | practice | `Theme 2/practice 2.3` | Збір даних для ІАЗ ОУВ | collection | scraping; Excel; forms; JSON/XML | Collection challenge | reusable collection components | **planned** |
| t2-l4 | group | `Theme 2/gl2.4` | Методи зберігання даних ІАЗ ОУВ | storage | relational DB; SQL; normalization; NoSQL | Storage Architecture Lab | `storage-model-explorer`, `schema-normalization-lab`, `sql-query-lab`, `storage-decision-lab` | **implemented** |
| t2-l5 | practice | `Theme 2/practice2.5` | Реляційна база даних: дві пов’язані таблиці та SQL-запити | storage | PostgreSQL; JOIN; GROUP BY | SQL Mission Lab | `relational-schema-builder`, `sql-mission-lab` | **implemented** |
| t3-l1 | lecture | `Theme3/aLection1` | Методологія підготовки даних; Методи попереднього аналізу даних | preparation | quality; cleaning; EDA | 35–45 хв methodology + Data Quality + trade-offs | `lesson-roadmap`, `data-quality-lab`, `decision-tradeoff`, `eda-explorer` | **implemented** |
| t3-l2 | group | `Theme3/Group lesson 2` | Попередній аналіз даних | preparation | EDA; statistics; correlation; anomalies | EDA Explorer | `eda-explorer`, `workflow-mission-lab` | **implemented** |
| t3-l3 | practice | `Theme3/Practice 3/task.ipynb` | Аналіз набору даних з Kaggle | preparation | audit; stats; visualization | EDA Mission | `eda-explorer`, `workflow-mission-lab` | **implemented** |
| t3-l4 | group | `Theme3/Group lesson 4` | Методи підготовки даних до аналізу (моделювання) | preparation | missing; scaling; encoding; split | Transformation + Leakage Lab | `transformation-lab`, `split-leakage-lab` | **implemented** |
| t3-l5 | practice | `Theme3/Practice5/task.ipynb` | Аналіз набору даних з Kaggle (Практика 3.5) | preparation/model-readiness | preprocessing; baseline; evaluation | Model-Ready Pipeline | `workflow-mission-lab`, `readiness-scorecard` | **implemented** |
| t4-l1 | lecture | `Theme4/aLection1` | Огляд сучасних методів аналізу даних в інтересах ІАЗ ОВУ | analysis | statistics; ML; GIS; text/network | Method Selector | `method-selector`, `decision-tradeoff` | **implemented** |
| t4-l2 | group | `Theme4/Group lesson 2/content1.ipynb` | Використання методів ШІ для аналізу даних | analysis | classification; regression; clustering | Task selector + ML workflow | `method-selector`, `workflow-mission-lab` | **implemented** |
| t4-l3 | practice | `Theme4/practice3/task.ipynb` | Використання методів ШІ для аналізу даних: регресія | analysis | regression; MAE; MSE/RMSE; R² | Regression lab | `metric-tradeoff-lab`, `workflow-mission-lab` | **implemented** |
| t4-l4 | group | `Theme4/Group lesson 4/content1.ipynb` | Оцінка точності та налаштування гіперпараметрів | analysis/evaluation | metrics; CV; tuning | Hyperparameter/evaluation lab | `metric-tradeoff-lab`, `decision-tradeoff` | **implemented** |
| t4-l5 | practice | `Theme4/practice5/task.ipynb` | Використання методів ШІ для аналізу даних: класифікація | analysis/evaluation | confusion matrix; precision; recall; F1 | Threshold Lab | `metric-tradeoff-lab`, `workflow-mission-lab` | **implemented** |
| t4-l6 | lecture | `Theme4/aLection6` | Основи використання штучних нейронних мереж для аналізу даних | analysis | ANN; activation; training | Neural Architecture Lab | `neural-network-lab`, `decision-tradeoff` | **implemented** |
| t4-l7 | group | `Theme4/Group lesson 7/content.ipynb` | Основи використання методів глибокого навчання для аналізу даних | analysis | MLP; CNN; RNN; Transformer | DL experiment mission | `neural-network-lab`, `workflow-mission-lab` | **implemented** |
| t4-l8 | practice | `Theme4/practice8/practical_task_regression_classification.ipynb` | Регресія та класифікація з TensorFlow | analysis | TensorFlow/Keras | TensorFlow mission | `neural-network-lab`, `workflow-mission-lab` | **implemented** |
| t4-l9 | group | `Theme4/Group lesson 9/content.ipynb` | Основи використання глибокого навчання для аналізу графічної інформації | analysis | CNN; convolution; pooling | Convolution Lab | `convolution-lab`, `decision-tradeoff` | **implemented** |
| t4-l10 | unknown | `—` | Окреме первинне джерело 4.10 у репозиторії відсутнє | analysis | — | Не реалізується без джерела | — | **source-gap** |
| t4-l11 | lecture | `Theme4/aLection11/content.ipynb` | Перспективні напрямки використання методів аналізу даних | analysis/enablement | DL; LLM; MLOps; Transfer; RL | Frontier Method Selector | `method-selector`, `decision-tradeoff` | **implemented** |
| t4-l12 | group | `Theme4/Group lesson 12/content.ipynb` | Transfer Learning та основи Reinforcement Learning | analysis | model hubs; fine-tuning; RL | Transfer/RL Lab | `transfer-rl-lab`, `decision-tradeoff` | **implemented** |
| t4-l13 | practice | `Theme4/Practice 13/content.ipynb` | Практичне використання репозиторіїв моделей у проєктах | analysis/project | Transfer Learning; RL | Project Design Mission | `transfer-rl-lab`, `workflow-mission-lab` | **implemented** |
| t4-l14 | group | `Theme4/Group lesson 14/info.ipynb` | Методи аналізу текстової інформації. Основи генеративного ШІ | analysis/decision | text analytics; GenAI | Text Analysis Lab | `text-analysis-lab`, `decision-tradeoff` | **implemented** |
| t5-l1 | lecture | `Theme5/aLection51/content51.ipynb` | **Методологічні основи візуалізації даних** | visualization/decision | visual encoding; design quality; evidence communication | Visual Encoding + Design Critique + Evidence→Brief | `visual-encoding-lab`, `design-critique-lab`, `insight-brief-lab` | **implemented** |
| t5-l2 | group | `Theme5/GroupLesson52/content.ipynb` | **Огляд інструментів візуалізації даних на основі HTML + CSS** | visualization | semantic HTML; CSS Grid/Flexbox; dashboard layout | Dashboard Builder + layout critique | `dashboard-builder`, `design-critique-lab`, `insight-brief-lab` | **implemented** |
| t5-l3 | practice | `Theme5/Practice53/2025/task.ipynb` | **Практичне використання інструментів візуалізації даних** | visualization/decision | maps; time series; network; heatmap; dashboard; uncertainty | 10 Visualization Missions | `visualization-mission-lab`, `visual-encoding-lab`, `insight-brief-lab` | **implemented** |
| t5-l4 | group | `Theme5/GroupLesson54/content.ipynb` | **Підбір візуальних елементів для візуалізації даних** | visualization | chart selection; perceptual accuracy; data/task/audience | Visual Encoding Challenge + trade-offs | `visual-encoding-lab`, `decision-tradeoff`, `insight-brief-lab` | **implemented** |
| t5-l5 | practice | `Theme5/Practice55/start`, `pr35` | **Практичне створення дашборду військового аналітика** *(source-derived)* | visualization/decision | KPI; chart; table; map; coordinated views | Integrated Dashboard Lab | `dashboard-builder`, `design-critique-lab`, `insight-brief-lab` | **implemented** |
| t5-l6 | lecture | `Theme5/aLection56/content.ipynb` | **Основи графічного дизайну та його використання для візуалізації даних** | visualization | composition; hierarchy; color; typography; whitespace | Design Critique + encoding | `design-critique-lab`, `visual-encoding-lab`, `insight-brief-lab` | **implemented** |
| t5-l7 | group | `Theme5/GroupLesson57/content.ipynb` | **Застосування принципів графічного дизайну для візуалізації даних** | visualization/decision | redesign; design review; dashboard | Group redesign + critique + pitch | `dashboard-builder`, `design-critique-lab`, `decision-tradeoff`, `insight-brief-lab` | **implemented** |
| t5-l8 | practice | `Theme5/Practice58/content.ipynb` | **Розробка та демонстрація візуалізацій для різних аудиторій в межах виконання індивідуальних (групових) проектів** | visualization/decision | audience adaptation; simple/detailed views | Audience Adaptation + role-specific brief | `audience-adaptation-lab`, `dashboard-builder`, `insight-brief-lab` | **implemented** |

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

### Theme 5 — visualization / analytical communication
- `visual-encoding-lab`
- `dashboard-builder`
- `design-critique-lab`
- `audience-adaptation-lab`
- `visualization-mission-lab`
- `insight-brief-lab`

## Методичні контролі

- Цільова тривалість web-заняття: **30–45 хв активної роботи**.
- Visual обирається від аналітичного питання, data type та audience, а не від популярності бібліотеки.
- Scale, units, provenance і критична uncertainty не приховуються заради дизайну.
- Dashboard має підтримувати `overview → comparison/pattern → detail → brief`, а не бути колекцією widgets.
- Scaling/imputation/feature selection, що навчаються з даних, fit-яться лише на train після split.
- Held-out test не використовується для hyperparameter/model selection.
- GenAI output відокремлюється від source evidence і має provenance/human review.
- Source gap не заповнюється вигаданим матеріалом: `4.10` залишається `source-gap`; назва `5.5` явно позначена як `source-derived`.

## Правило аудиту

Статуси `working`, `source-derived`, `audit-needed` та `source-gap` не є твердженнями про офіційну назву. Перед реалізацією читається первинний notebook/PDF/plan; лише після цього оновлюються назва, технологія, learning goal та статус.
