# MI2024 Interactive — master matrix

> Статусна матриця для послідовного перетворення наявних матеріалів курсу на reusable інтерактивні сторінки. Вона **не перейменовує** вихідні заняття. Якщо точна назва ще не підтверджена з файлу заняття, це явно позначено.

## Архітектурний принцип

`технологія → місце у військовій аналітиці → дія слухача → наслідок → аналітичний висновок`

Кожне заняття має збиратися за формулою: `HTML placeholder + reusable JS component + JSON lesson config`.

## Матриця

| ID | Тип | Джерело | Назва / робоча назва | Етап ІАЗ | Технологія | Запланований інтерактив | Компоненти | Статус |
|---|---|---|---|---|---|---|---|---|
| t1-l1 | lecture | `Theme 1/1.1` | Методологічні основи ІАЗ | decision | IAZ methodology; project lifecycle | Interactive IAZ lifecycle + methodology comparison | `analytics-pipeline`, `decision-tradeoff` | **planned** |
| t1-l2 | lecture | `Theme 1/1.2` | Наукові методи оцінки ефективності застосування інформаційних технологій в ОУВ | decision | IT effectiveness evaluation | Effectiveness scorecard with weighted criteria | `effectiveness-scorecard`, `decision-tradeoff` | **planned** |
| t1-l3 | lecture | `Theme 1/1.3` | Основи створення інтегрованого середовища розробки засобів ІАЗ | enablement | Git; IDE; development workflow | Git/IDE workflow explorer | `dev-workflow-explorer` | **planned** |
| t1-l4 | project/group | `Theme 1/1.4_1.5/01DataBase` | Проєктування бази даних засобу ІАЗ | storage | database architecture | Schema builder + entity relationship lab | `schema-normalization-lab`, `storage-model-explorer` | **planned** |
| t1-l5 | project/practice | `Theme 1/1.4_1.5/02Analytics_03UI(UX)` | Аналітика та UI/UX засобу ІАЗ | visualization | analytics; UI/UX | Dashboard/UX builder | `metric-explorer`, `visual-encoding-lab` | **planned** |
| t2-l1 | lecture | `Theme 2/alection 1` | Збір та зберігання даних для ІАЗ ОВУ | collection/storage | data sources; storage | Source-to-storage flow explorer | `analytics-pipeline`, `source-flow-map` | **planned** |
| t2-l2 | group | `Theme 2/gl2.2` | Методи збору даних для ІАЗ ОВУ | collection | web forms; files; APIs; structured collection | Collection method selector | `source-flow-map`, `decision-tradeoff` | **planned** |
| t2-l3 | practice | `Theme 2/practice 2.3` | Збір даних для інформаційно-аналітичного забезпечення ОУВ | collection | web scraping; Excel; forms; XML/JSON | Multi-source collection challenge | `source-flow-map`, `format-converter-lab` | **planned** |
| t2-l4 | group | `Theme 2/gl2.4` | Методи зберігання даних ІАЗ ОУВ | storage | relational DB; SQL; normalization; NoSQL | Storage Architecture Lab: model explorer + normalization + SQL + scenario choice | `analytics-pipeline`, `storage-model-explorer`, `schema-normalization-lab`, `sql-query-lab`, `storage-decision-lab`, `knowledge-check` | **implemented** |
| t2-l5 | practice | `Theme 2/practice2.5` | Реляційна база даних: дві пов’язані таблиці та SQL-запити | storage | PostgreSQL; relational schema; JOIN; GROUP BY | SQL mission lab with schema and query objectives | `schema-normalization-lab`, `sql-query-lab` | **planned** |
| t3-l1 | lecture | `Theme3/aLection1` | Методологія підготовки даних | preparation | cleaning; transformation; integration; quality | Data Quality Lab | `analytics-pipeline`, `data-quality-lab`, `knowledge-check` | **prototype** |
| t3-l2 | group | `Theme3/Group lesson 2` | Методи підготовки даних | preparation | cleaning; transformation | Team data-preparation challenge | `data-quality-lab`, `decision-tradeoff` | **planned** |
| t3-l3 | practice | `Theme3/Practice 3` | Практична підготовка даних | preparation | Pandas; cleaning; transformation | Transformation pipeline lab | `data-quality-lab`, `transformation-pipeline` | **planned** |
| t3-l4 | group | `Theme3/Group lesson 4` | Інтеграція та узгодження даних | preparation | data integration; conflicts | Integration conflict lab | `integration-conflict-lab`, `decision-tradeoff` | **planned** |
| t3-l5 | practice | `Theme3/Practice5` | Підготовка даних для подальшого моделювання | preparation | feature preparation; train/test readiness | Feature/readiness lab | `feature-engineering-lab`, `data-quality-lab` | **planned** |
| t4-l1 | lecture | `Theme4/aLection1` | Огляд сучасних методів аналізу даних в інтересах ІАЗ ОВУ | analysis | statistics; ML; AI; GIS; text/network analysis | Method selector | `method-selector`, `analytics-pipeline` | **planned** |
| t4-l2 | group | `Theme4/Group lesson 2` | Застосування методів аналізу даних — групове заняття | analysis | analytical methods | Method-selection challenge | `method-selector`, `decision-tradeoff` | **planned** |
| t4-l3 | practice | `Theme4/practice3` | Практичний аналіз даних | analysis | statistics; data exploration | Metric explorer | `metric-explorer` | **planned** |
| t4-l4 | group | `Theme4/Group lesson 4` | Машинне навчання — групове заняття | analysis | machine learning | Model comparison challenge | `model-comparison`, `metric-explorer` | **planned** |
| t4-l5 | practice | `Theme4/practice5` | Практичне застосування машинного навчання | analysis | machine learning | Train/test model lab | `model-comparison`, `uncertainty-lab` | **planned** |
| t4-l6 | lecture | `Theme4/aLection6` | Основи використання штучних нейронних мереж для аналізу даних | analysis | neural networks; deep learning | Neural-network explainer | `model-explorer`, `metric-explorer` | **planned** |
| t4-l7 | group | `Theme4/Group lesson 7` | Штучні нейронні мережі — групове заняття | analysis | neural networks | Network architecture what-if | `model-explorer`, `decision-tradeoff` | **planned** |
| t4-l8 | practice | `Theme4/practice8` | Практичне застосування нейронних мереж | analysis | neural networks | Interactive training/metrics lab | `model-explorer`, `metric-explorer` | **planned** |
| t4-l9 | group | `Theme4/Group lesson 9` | Інтелектуальний аналіз — групове заняття | analysis | advanced analytics | Analytical method challenge | `method-selector`, `uncertainty-lab` | **planned** |
| t4-l10 | unknown | `—` | Заняття 4.10 — джерело не виділено окремим каталогом | analysis | TBD | Source gap audit | `course-audit` | **source-gap** |
| t4-l11 | lecture | `Theme4/aLection11` | Тема заняття 4.11 потребує звірки з content.ipynb | analysis | interactive/web analytical content | Interactive concept explorer | `method-selector`, `visual-encoding-lab` | **audit-needed** |
| t4-l12 | group | `Theme4/Group lesson 12` | Заняття 4.12 — групове | analysis | TBD | Scenario lab | `decision-tradeoff` | **audit-needed** |
| t4-l13 | practice | `Theme4/Practice 13` | Заняття 4.13 — практичне | analysis | TBD | Applied analytics lab | `metric-explorer` | **audit-needed** |
| t4-l14 | group | `Theme4/Group lesson 14` | Заняття 4.14 — групове | decision | TBD | Capstone decision challenge | `decision-tradeoff`, `decision-brief` | **audit-needed** |
| t5-l1 | lecture | `Theme5/aLection51` | Заняття 5.1 — лекція | visualization | visualization / information presentation | Visualization concept explorer | `visual-encoding-lab` | **audit-needed** |
| t5-l2 | group | `Theme5/GroupLesson52` | Заняття 5.2 — групове | visualization | visual analytics | Visual encoding challenge | `visual-encoding-lab`, `decision-tradeoff` | **audit-needed** |
| t5-l3 | practice | `Theme5/Practice53` | Заняття 5.3 — практичне | visualization | dashboarding | Dashboard builder | `dashboard-builder` | **audit-needed** |
| t5-l4 | group | `Theme5/GroupLesson54` | Заняття 5.4 — групове | visualization | visual analytics | Dashboard critique | `dashboard-builder`, `decision-tradeoff` | **audit-needed** |
| t5-l5 | practice | `Theme5/Practice55` | Заняття 5.5 — практичне | visualization | dashboard / reporting | Analytical dashboard lab | `dashboard-builder` | **audit-needed** |
| t5-l6 | lecture | `Theme5/aLection56` | Заняття 5.6 — лекція | decision | decision-support technologies | Decision-support explainer | `decision-brief`, `analytics-pipeline` | **audit-needed** |
| t5-l7 | group | `Theme5/GroupLesson57` | Заняття 5.7 — групове | decision | decision support | Decision scenario lab | `decision-tradeoff`, `decision-brief` | **audit-needed** |
| t5-l8 | practice | `Theme5/Practice58` | Заняття 5.8 — практичне | decision | integrated analytics | Capstone analytical product | `dashboard-builder`, `decision-brief` | **audit-needed** |

## Пріоритет reusable engine

### Уже реалізовано
- `analytics-pipeline`
- `data-quality-lab`
- `knowledge-check`
- `course-catalog`

### Додається разом із заняттям 2.4
- `storage-model-explorer` — порівняння relational/document/key-value/graph/column моделей.
- `schema-normalization-lab` — візуалізація переходу від плоскої таблиці до схеми `documents` + `document_types` з PK/FK.
- `sql-query-lab` — браузерний тренажер SQL на синтетичних навчальних даних; без реального PostgreSQL.
- `storage-decision-lab` — сценарний вибір моделі зберігання з поясненням компромісів.

### Наступний пакет
- `source-flow-map`, `format-converter-lab`;
- `transformation-pipeline`, `integration-conflict-lab`, `feature-engineering-lab`;
- `method-selector`, `metric-explorer`, `model-comparison`, `model-explorer`, `uncertainty-lab`;
- `visual-encoding-lab`, `dashboard-builder`, `decision-brief`.

## Правило аудиту

Рядки `working`, `source-derived` та `audit-needed` є **планувальними**, а не твердженням про офіційну назву заняття. Перед реалізацією такого заняття спочатку читаємо його первинний notebook/PDF/plan, після чого оновлюємо `title`, `technology`, `learningGoal` і переводимо запис у `verified`.
