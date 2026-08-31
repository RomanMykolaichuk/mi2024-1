# Theme 2 interactive track — збір і зберігання даних

## Мета

Тема 2 має утворювати один наскрізний маршрут від **інформаційної потреби та отримання evidence** до **керованого сховища і SQL-запиту**:

`information need → source/channel → capture → validation/provenance → format → reconciliation → storage model → relational schema → SQL → analytical result`

Кожне web-заняття орієнтоване приблизно на **30–45 хв активної роботи**. Notebook, реальний Python/PostgreSQL або зовнішній сервіс залишаються наступним практичним рівнем, а не виконуються приховано у статичній browser-симуляції.

## Source audit

| ID | Джерело | Назва в web-layer | Confidence |
|---|---|---|---|
| 2.1 | `Theme 2/alection 1/2026/iaz_learning_site/README.md`; PDF лекції | **Основи збору та зберігання даних для ІАЗ ОУВ** | `verified` |
| 2.2 | `Theme 2/gl2.2/content.ipynb`; 2026 enhanced case | **Методи збору даних для ІАЗ ОУВ** | `verified` |
| 2.3 | `Theme 2/practice 2.3/task.ipynb` | **Збір даних для інформаційно-аналітичного забезпечення (ІАЗ) ОУВ** | `verified-from-task` |
| 2.4 | `Theme 2/gl2.4` | **Методи зберігання даних ІАЗ ОУВ** | existing source-grounded implementation |
| 2.5 | `Theme 2/practice2.5` | **Реляційна база даних та SQL** / практична схема + SQL mission | existing source-grounded implementation |

## Навчальна траєкторія

### 2.1 — foundations of collection and storage

Ціль: показати, що збір починається не з Python-бібліотеки, а з **data requirement**.

Основний маршрут:

`information need → source → collection method → raw evidence → validation → transformation → provenance → storage`

Інтерактиви:

- `collection-method-selector` — WEB / API / formalized report / form;
- `workflow-mission-lab` — ETL/ELT і первинний quality workflow;
- `format-exchange-lab` — CSV / JSON / XML як контракти обміну;
- `storage-model-explorer` — bridge від collection до storage;
- `knowledge-check`.

Оновлений source site 2026 вже містить ETL exercise, quality calculator, storage advisor і duplicate scenario. Новий reusable layer зберігає цю методичну логіку, але не копіює монолітний HTML.

### 2.2 — group collection, provenance and reconciliation

Основа — synthetic 2026 case **«Облік фактів обстрілів»** у вигаданому районі ALFA і сітці 0–99.

Три групи:

1. Internet / CSV / provenance / duplicates;
2. API / GET / JSON / HTTP/schema validation;
3. formalized CSV reports / QA / correction log.

Спільний результат source case:

`17 input records → 14 unique events`

Ключова методична теза:

> **record identity ≠ event identity**

Два source records можуть бути:

- технічним дублем одного ingestion;
- незалежним підтвердженням однієї події;
- двома різними подіями.

Тому deduplication не повинна просто видаляти evidence. Якщо два незалежні records підтверджують один event, доцільно мати один event-level record із кількома provenance links.

Інтерактиви:

- `collection-method-selector`;
- `provenance-lab`;
- `workflow-mission-lab` для інтеграції трьох каналів;
- `knowledge-check`.

### 2.3 — practical data collection missions

Source task містить чотири базові завдання:

1. web scraping: Python + BeautifulSoup → CSV;
2. Excel: pandas → filtering → new XLSX;
3. Google Form / Apps Script → controlled human input;
4. XML generator → machine-readable structured document.

Шість source variants також збережені методично: keyword filtering, conditional Excel filter, required email, XML resource variant, JSON output, email validation.

Browser layer **не виконує live scraping**, не запускає Google Apps Script і не звертається до зовнішніх сервісів. Він готує правильний workflow, output contract, QA і repository evidence перед локальним виконанням.

Інтерактиви:

- `collection-mission-lab` — чотири practical missions;
- `format-exchange-lab`;
- `workflow-mission-lab` — GitHub evidence;
- `decision-tradeoff` — failure modes;
- `knowledge-check`.

Definition of practical evidence:

`code + safe sample/raw input + generated output + README + validation notes + clean Git history`

### 2.4 — storage architecture

Перехід від collected records до керованого storage:

- relational / document / key-value / graph / wide-column models;
- PK/FK;
- normalization;
- SQL;
- scenario-based storage choice.

### 2.5 — relational schema and SQL mission

Практичне завершення Теми 2:

`source data → relational schema → PK/FK → import → SELECT/WHERE/JOIN/GROUP BY/ORDER BY/subquery → interpretation`

Web-layer послідовно використовує PostgreSQL-підхід і не повторює змішування PostgreSQL/MySQL зі старого прикладу.

## Reusable components Theme 2

Нові collection-компоненти:

- `collection-method-selector`
- `provenance-lab`
- `format-exchange-lab`
- `collection-mission-lab`

Повторно використані:

- `lesson-roadmap`
- `analytics-pipeline`
- `workflow-mission-lab`
- `decision-tradeoff`
- `knowledge-check`
- `storage-model-explorer`
- компоненти storage/SQL із 2.4–2.5.

## Data / safety rule

- В interactive layer використовуються лише synthetic, teaching або дозволені open data.
- Sensitive operational data не вбудовуються у статичний web-layer.
- Для web collection зберігаються provenance та access assumptions; scraping не подається як універсально дозволений спосіб доступу.
- Форми мають дотримуватися data minimization; credentials/secrets не потрапляють у Git.

## Definition of Done

Theme 2 вважається завершеною, коли:

- 2.1–2.5 відкриваються з grouped course catalog;
- є внутрішній track navigation 2.1 → 2.5;
- 2.1–2.3 мають 30–45-хв timebox, ≥5 активних блоків і source-grounded titles;
- усі локальні source links існують;
- JS/JSON проходять static checks;
- collection, provenance, format і practical workflow відділені від storage/SQL, але утворюють один наскрізний pipeline.
