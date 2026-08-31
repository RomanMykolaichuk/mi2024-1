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

### Тема 1 — 5/5

Theme 1 використовує один data-driven shell:

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
- 1.4 — DB → REST API → UI architecture на фактичних PostgreSQL/Flask source artifacts;
- 1.5 — 8-variant GET/POST/DELETE Integration Flow Lab.

Назви **1.1–1.3** підтверджені первинними `lesson.ipynb`. Для **1.4–1.5** окремих primary plans з офіційними назвами у repository не знайдено, тому web-labels явно мають `titleConfidence: source-derived`.

Red-team note: legacy `1.4_1.5/02Analytics_03UI(UX)/app.py` містить hardcoded PostgreSQL credentials. Оригінальний source не переписується приховано, але interactive track прямо навчає відокремлювати secrets від source code (`.env`/environment config + `.gitignore`).

### Тема 2 — 5/5

2.1–2.3 використовують data-driven shell:

```text
lessons/theme2.html?lesson=t2-l1
lessons/theme2.html?lesson=t2-l2
lessons/theme2.html?lesson=t2-l3
```

2.4–2.5 зберігають свої існуючі сторінки, але вся Тема 2 має спільну навігацію `2.1 → 2.5`.

Наскрізний track:

`information need → collection channel → raw evidence → validation/provenance → CSV/JSON/XML → reconciliation → storage model → relational schema → SQL → analytical result`

Реалізовано:
- 2.1 — Collection Method Selector + ETL/quality workflow + CSV/JSON/XML + bridge до storage;
- 2.2 — Internet/CSV, API/JSON, formal reports + Provenance Lab + synthetic case `17 records → 14 unique events`;
- 2.3 — four practical missions: web scraping, Excel, form, XML + GitHub evidence + failure modes;
- 2.4 — Storage Architecture Lab;
- 2.5 — Relational Schema + SQL Mission Lab.

Назви 2.1 і 2.2 підтверджені source materials; 2.3 має `titleConfidence: verified-from-task`.

### Тема 3 — 5/5
- 3.1 methodology + Data Quality + decision trade-offs + EDA;
- 3.2 EDA Explorer + team mission;
- 3.3 practical reproducible EDA;
- 3.4 transformation + leakage lab;
- 3.5 end-to-end model-ready pipeline.

### Тема 4 — 13/14

Theme 4 використовує один data-driven shell:

```text
lessons/theme4.html?lesson=t4-l1
...
lessons/theme4.html?lesson=t4-l14
```

Реалізовано 4.1–4.9 та 4.11–4.14. **4.10** позначено `source-gap`: у репозиторії немає окремого первинного матеріалу, тому зміст не вигадується.

### Тема 5 — 8/8

Theme 5 також використовує один data-driven shell:

```text
lessons/theme5.html?lesson=t5-l1
...
lessons/theme5.html?lesson=t5-l8
```

Реалізовано:
- 5.1 — methodology of visualization + Visual Encoding + Evidence→Brief;
- 5.2 — semantic HTML/CSS + responsive Dashboard Builder;
- 5.3 — 10 practical visualization missions from the source task;
- 5.4 — selecting visual elements by task/data/audience;
- 5.5 — integrated analytical dashboard with KPI/chart/table/map;
- 5.6 — graphic-design foundations for analytical visualization;
- 5.7 — group redesign, critique and design rationale;
- 5.8 — audience adaptation: technical expert / leader / public view.

Для **5.5** окремого план-конспекту з точною назвою не знайдено. Назва `Практичне створення дашборду військового аналітика` позначена `source-derived` від фактичних артефактів `Practice55/start` і `Practice55/pr35`.

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

## Methodological rules

Theme 1:

`information need → requirements/criteria → design → implementation → validation → operation → evaluation/feedback`

Theme 2:

`information need → source/channel → capture → validation/provenance → format → reconciliation → storage → query`

Record identity and event identity are not the same. Deduplication має уникати подвійного рахунку, але не знищувати evidence про незалежні підтвердження. Browser practice не виконує live scraping або external Google Apps Script: такі дії переходять у локальне практичне середовище після design/QA route.

Technology selection follows the problem and success criteria. Weighted scorecards are educational decision aids; hard constraints remain explicit. Secrets do not belong in Git/source code.

Правильна модель переходу до ML/DL:

`data audit → split → fit preprocessing on train → transform train/validation/test → train/tune → final evaluation on held-out test`

Для GenAI: source evidence, generated synthesis, uncertainty і human review мають бути явно розділені.

Для visualization:

`analytical question → visual encoding → scale/context → pattern → verification → interpretation → implication / next step`

Audience adaptation може змінювати detail, terminology та interaction, але не повинна змінювати факти, scale, provenance або приховувати критичну uncertainty.

## Документація

- `data/course-matrix.json` — machine-readable roadmap Theme 1–5;
- `../docs/COURSE_INTERACTIVE_MATRIX.md` — master matrix;
- `../docs/THEME1_INTERACTIVE_TRACK.md` — Theme 1 source audit, methodology/project track і technical debt;
- `../docs/THEME2_INTERACTIVE_TRACK.md` — Theme 2 source audit, collection/provenance/storage track і reusable components;
- `../docs/THEME3_INTERACTIVE_TRACK.md` — Theme 3;
- `../docs/THEME4_INTERACTIVE_TRACK.md` — Theme 4;
- `../docs/THEME5_INTERACTIVE_TRACK.md` — Theme 5 source audit, track logic і reusable visualization components.

## Правило reusable engine

Не додавати lesson-specific JS, якщо поведінку можна винести в reusable component.

`HTML shell + reusable JS component + JSON lesson config = interactive lesson`

## Дані

Web-шар використовує лише synthetic, teaching або дозволені open data. Великі model artifacts не завантажуються автоматично; live LLM/RL backend у базовій статичній версії відсутній.
