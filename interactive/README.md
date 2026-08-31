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
├── index.html                 # landing page / grouped course catalog
├── lessons/                   # інтерактивні заняття
├── assets/css/main.css        # спільний design system
├── assets/css/*.css           # тематичні/component styles
├── js/app.js                  # bootstrap reusable engine
├── js/core/                   # registry + data loader
├── js/components/             # reusable components
└── data/                      # course map + lesson scenarios + master matrix
```

## Головна сторінка

Каталог організовано **за темами дисципліни**, а не одним плоским списком. Кожна тема має:

- назву й коротке пояснення;
- статус розроблення;
- прогрес `implemented / total`;
- картки тільки тих занять, які вже мають інтерактивний web-шар.

## Норматив тривалості

Ціль для інтерактивного заняття — **приблизно 30–45 хв активної роботи** без повного виконання окремого Jupyter notebook.

Типова лекція має містити scenario, concept/pipeline, основний lab, decision/what-if activity, interpretation та self-check. Для контролю використовується reusable component `lesson-roadmap`.

`3.1` є reference implementation розширеної лекції приблизно на 40 хв.

## Реалізовані заняття

### Тема 2
- `lessons/t2-l4.html` — **2.4 «Методи зберігання даних ІАЗ ОУВ»**: storage model explorer, normalization lab, SQL query lab, storage decision lab, self-check.
- `lessons/t2-l5.html` — **2.5 «Реляційна база даних та SQL»**: six-variant relational schema builder, PK/FK practice, PostgreSQL SQL Mission Lab, practical workflow, self-check.

### Тема 3 — complete interactive track
- `lessons/t3-l1.html` — **3.1 «Методологія підготовки даних»**: ≈40 хв; scenario, methodology principles, Data Quality Lab, Decision Trade-off Lab, EDA preview, synthesis, self-check.
- `lessons/t3-l2.html` — **3.2 «Попередній аналіз даних»**: EDA Explorer, team mission, self-check.
- `lessons/t3-l3.html` — **3.3 «Практичний EDA»**: dataset → audit → statistics → visualization → correlations → conclusion.
- `lessons/t3-l4.html` — **3.4 «Методи підготовки даних до аналізу (моделювання)»**: transformation lab + train/test leakage lab.
- `lessons/t3-l5.html` — **3.5 «Наскрізна підготовка даних до моделювання»**: end-to-end mission + leakage check + model-readiness scorecard.

## Reusable components

### Core pedagogical components
- `course-catalog` — grouped Theme → Lessons catalog;
- `lesson-roadmap` — timebox, learning outcomes і блоки заняття;
- `analytics-pipeline` — місце технології в аналітичному процесі;
- `decision-tradeoff` — неоднозначні ситуації та наслідки рішення;
- `knowledge-check` — self-check.

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

## SQL dialect

Нові матеріали 2.5 використовують PostgreSQL-синтаксис послідовно. У вихідному `Theme 2/practice2.5/task.ipynb` є змішування PostgreSQL і MySQL-конструкцій; це вважається технічним боргом вихідного матеріалу і не переноситься до reusable engine.
