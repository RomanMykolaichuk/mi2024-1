# MI2024 Interactive

Статичний інтерактивний web-шар курсу на HTML + CSS + Vanilla JavaScript ES Modules + JSON.

## Запуск

```bash
cd interactive
python3 -m http.server 8000
```

Відкрити `http://localhost:8000`.

## Залежності

Для базової версії немає npm-залежностей і build step. Потрібні лише browser та будь-який локальний static server. Найпростіший варіант — Python `http.server`.

## Структура

```text
interactive/
├── index.html                 # landing page / course catalog
├── lessons/                   # інтерактивні заняття
├── assets/css/main.css        # спільний design system
├── assets/css/*.css           # тематичні/component styles
├── js/app.js                  # bootstrap reusable engine
├── js/core/                   # registry + data loader
├── js/components/             # reusable components
└── data/                      # course map + lesson scenarios + master matrix
```

## Реалізовані заняття

### Тема 2
- `lessons/t2-l4.html` — **2.4 «Методи зберігання даних ІАЗ ОУВ»**: storage model explorer, normalization lab, SQL query lab, storage decision lab, self-check.
- `lessons/t2-l5.html` — **2.5 «Реляційна база даних та SQL»**: six-variant relational schema builder, PK/FK practice, PostgreSQL SQL Mission Lab, practical workflow, self-check.

### Тема 3 — complete interactive track
- `lessons/t3-l1.html` — **3.1 «Методологія підготовки даних»**: analytics pipeline, Data Quality Lab, EDA preview, self-check.
- `lessons/t3-l2.html` — **3.2 «Попередній аналіз даних»**: EDA Explorer, team mission, self-check.
- `lessons/t3-l3.html` — **3.3 «Практичний EDA»**: dataset → audit → statistics → visualization → correlations → conclusion.
- `lessons/t3-l4.html` — **3.4 «Методи підготовки даних до аналізу (моделювання)»**: transformation lab + train/test leakage lab.
- `lessons/t3-l5.html` — **3.5 «Наскрізна підготовка даних до моделювання»**: end-to-end mission + leakage check + model-readiness scorecard.

## Reusable components

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
- `workflow-mission-lab`
- `transformation-lab`
- `split-leakage-lab`
- `readiness-scorecard`
- `knowledge-check`

## Theme 3 methodological rule

Правильна модель переходу до ML:

`data audit → train/test split → fit preprocessing on train → transform train/test → train model → evaluate on test`

Не fit-ити scaler, imputer чи feature selection на всьому dataset до split: це створює ризик **data leakage** і завищеної оцінки моделі.

## Master matrix

- `data/course-matrix.json` — machine-readable roadmap Theme 1–5.
- `../docs/COURSE_INTERACTIVE_MATRIX.md` — людиночитний варіант матриці та component roadmap.
- `../docs/THEME3_INTERACTIVE_TRACK.md` — зміст, педагогічна логіка і технічні рішення Theme 3.

## Правило reusable engine

Не додавати JS-логіку безпосередньо в кожне заняття, якщо її можна узагальнити як reusable component.

`HTML placeholder + reusable JS component + JSON lesson config = interactive lesson`

## Дані

Інтерактивний web-шар використовує лише синтетичні, навчальні або дозволені відкриті дані. Він не призначений для розміщення службової чи чутливої інформації.

## Відомий technical debt вихідних матеріалів

- `Theme 2/practice2.5/task.ipynb` змішує PostgreSQL і MySQL-конструкції; reusable engine використовує послідовний PostgreSQL.
- `Theme3/Practice5/task.ipynb` демонструє scaling до train/test split; reusable engine свідомо виправляє послідовність, щоб уникати data leakage.
