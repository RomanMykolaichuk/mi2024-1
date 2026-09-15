# MI2024 Interactive — architecture

## 1. Мета

`interactive/` є окремим web-шаром над існуючими навчальними матеріалами. Він не замінює Jupyter/Python і не вимагає переписування старих занять.

Ролі шарів:

- **interactive page** — формує розуміння технології, дає what-if/decision practice і швидкий feedback;
- **runnable Python / Jupyter notebook** — показує реальну реалізацію, обчислення та відтворюваний experiment;
- **group lesson** — дає спільну аналітичну задачу;
- **practical** — забезпечує самостійне виконання.

## 2. Технологічне рішення v1

```text
HTML5
  + CSS
  + Vanilla JavaScript ES6+
  + ES Modules
  + JSON
  + Python examples / Jupyter where needed
  + GitHub Pages / local static server
```

У v1 немає обов'язкового framework або build step.

## 3. Архітектурний принцип

Контент відділяється від механізму.

```text
HTML shell / page
    ↓
data-component="..."
    ↓
Reusable JS component
    ↓
JSON configuration / scenario
```

Наприклад:

```html
<section
  data-component="analytics-pipeline"
  data-source="../data/lessons/t3-l1.json"
  data-select="pipeline">
</section>
```

Один reusable component використовується в різних заняттях, а конкретний зміст задається JSON.

## 4. Способи page composition

### 4.1 Explicit HTML composition

Підходить, коли заняття має унікальну структуру. Theme 2–3 частково використовують окремі HTML-сторінки з явними `[data-component]` placeholders.

### 4.2 Data-driven shared shell

Коли серія занять має однакову педагогічну рамку, HTML не дублюється. Theme 4 використовує:

```text
lessons/theme4.html?lesson=t4-lN
        ↓
js/theme4-page.js
        ↓
data/lessons/t4-lN.json
        ↓
shared reusable components
```

`theme4-page.js` формує breadcrumb, track navigation, hero, `lesson-roadmap`, scenario, pipeline, component sections, analyst note, self-check і source links, після чого запускає загальний `app.js`.

Для **4.1** shared shell додатково вміє показувати велику visual lecture з 10 інфографік. Для **4.2** він рендерить `python-ml-lab`, що пов'язує Python-код, інтерактивний параметр, SVG-графік і метрики. Для **4.3** той самий shell використовує reusable `regression-diagnostics-lab`: model selection, Ridge alpha / tree max_depth, actual-vs-predicted, residuals, complexity curve та code preview. Для **4.4** використовується reusable `cv-tuning-lab`: train/CV curve, folds/scoring controls, candidate freeze і test gate, який не дозволяє використовувати held-out test як tuning feedback. Для **4.5** використовується reusable `classification-threshold-lab`: probability score → threshold → confusion matrix/metrics → validation FP/FN cost → freeze operating point → held-out test gate.

Це не SPA framework: сторінка залишається static HTML + browser JavaScript.

## 5. Reusable engine

### `js/app.js`

Bootstrap-файл. Знаходить `[data-component]`, отримує конфігурацію та передає її відповідному component mount.

### `js/core/registry.js`

Єдиний реєстр компонентів. Нова поведінка додається один раз у registry.

### `js/core/data.js`

Відповідає за:

- завантаження JSON;
- кешування повторних запитів;
- вибір підсекції через `data-select`;
- inline `data-config` для малих компонентів.

### `js/components/*`

Самодостатні reusable-компоненти. Кожен експортує:

```js
export function mount(element, config) {
  // render + event handlers
}
```

Component не повинен залежати від ID конкретної лекції.

## 6. Поточна бібліотека компонентів

### Core / pedagogical
- `course-catalog`
- `lesson-roadmap`
- `analytics-pipeline`
- `decision-tradeoff`
- `workflow-mission-lab`
- `knowledge-check`

### Methodology / project foundations
- `iaz-lifecycle-lab`
- `effectiveness-scorecard`
- `dev-workflow-explorer`
- `system-architecture-lab`
- `integration-flow-lab`

### Collection / provenance
- `collection-method-selector`
- `provenance-lab`
- `format-exchange-lab`
- `collection-mission-lab`

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
- `transformation-lab`
- `split-leakage-lab`
- `readiness-scorecard`

### Analysis / AI
- `method-selector`
- `metric-tradeoff-lab`
- `python-ml-lab`
- `regression-diagnostics-lab`
- `cv-tuning-lab`
- `classification-threshold-lab`
- `neural-network-lab`
- `convolution-lab`
- `transfer-rl-lab`
- `text-analysis-lab`

### Visualization / analytical communication
- `visual-encoding-lab`
- `dashboard-builder`
- `design-critique-lab`
- `audience-adaptation-lab`
- `visualization-mission-lab`
- `insight-brief-lab`

## 7. Browser simulation vs runnable code

Browser interaction не підмінює реальне навчання моделі. Якщо заняття містить runnable example, web-layer має явно показати цей зв'язок.

Поточні приклади:

```text
interactive/examples/t3_l1_preparation.py
interactive/examples/t3_l2_eda.py
interactive/examples/t4_l2_ml_tasks.py
interactive/examples/t4_l3_regression_workflow.py
interactive/examples/t4_l4_cv_tuning_workflow.py
interactive/examples/t4_l5_classification_workflow.py
```

Для 4.2 модель така:

```text
ML task formulation
    ↓
Python code (scikit-learn)
    ↓
change one meaningful parameter
    ↓
interactive chart / metrics
    ↓
runnable script reproduces the example
    ↓
analytical interpretation
```

Для 4.3 pipeline поглиблюється:

```text
numeric target
    ↓
Linear Regression baseline
    ↓
Ridge / Decision Tree comparison
    ↓
alpha / max_depth
    ↓
actual vs predicted + residuals + train/test gap
    ↓
complexity curve
    ↓
runnable scikit-learn comparison
    ↓
model judgement in target units
```

Для 4.4 evaluation protocol стає окремим training interaction:

```text
stratified train/test split
    ↓
hold test closed
    ↓
define scoring + search space
    ↓
StratifiedKFold inside training pool
    ↓
GridSearchCV / candidate comparison
    ↓
freeze candidate
    ↓
reveal held-out test once
    ↓
confusion matrix + limitations
```

Для 4.5 decision-threshold workflow:

```text
positive-class semantics
    ↓
stratified train / validation / test
    ↓
fit probability model on train
    ↓
validation precision / recall / F1 by threshold
    ↓
FP/FN weighted cost
    ↓
freeze operating threshold
    ↓
reveal held-out test once
    ↓
confusion matrix + analytical consequence
```

Web-графік є швидкою навчальною реконструкцією; script є відтворюваним reference implementation.

## 8. State management

У v1 немає global state manager. Стан належить компоненту.

`cv-tuning-lab` є прикладом локального pedagogical state: після freeze candidate test може бути відкритий, але будь-яка зміна tuning choices автоматично invalidates цей стан і знову приховує test.

`classification-threshold-lab` використовує той самий принцип для decision policy: зміна threshold або FP/FN cost assumptions після відкриття test invalidates frozen operating point і знову закриває test.

Якщо з'явиться комплексний тренажер із картою, timeline, багатьма об'єктами та shared state, його можна винести в окремий application layer або використати framework лише для цього складного компонента.

## 9. Lesson JSON

JSON є декларативним описом заняття. Рекомендовані поля:

- `id`, `number`, `title`, `type`;
- `roadmap.duration`, outcomes і timeboxed blocks;
- `scenario`;
- `pipeline`;
- component configs;
- `sections` для data-driven shell;
- visual assets, якщо вони є частиною lesson contract;
- `analystNote`;
- `quiz` і reflection;
- `sources`.

JSON не повинен містити чутливі або службові реальні дані.

## 10. URL та portable deployment

Використовуються relative URLs. Це дозволяє однаково працювати:

- локально через `python3 -m http.server`;
- у GitHub Pages під `/mi2024-1/`;
- з іншого static web server.

Query route типу `theme4.html?lesson=t4-l1` також залишається статичним: server віддає один HTML-файл, а browser обирає lesson JSON.

## 11. Норматив тривалості

Базовий формат web-заняття — **30–45 хв активної роботи**.

Виняток дозволяється для повних code labs, де додатковий час утворюється виконанням та інтерпретацією коду, а не пасивним текстом. Поточний приклад — **Theme 3.1 і 3.2 по 90 хв**.

Theme 4 наразі зберігає контракт 30–45 хв для всіх 14 lesson JSON. Заняття 4.2–4.5 використовують верхню частину діапазону через interactive code/diagnostics/tuning/threshold practice.

## 12. CI contracts

`Interactive static checks` перевіряє:

- JavaScript syntax;
- JSON validity;
- кількість lesson configs і status catalog/matrix;
- catalog links, data-driven query routes і локальні source links;
- Theme 4 timebox та офіційний контракт 4.10;
- 10 visual assets заняття 4.1;
- JSON/Python syntax для primary package 4.10;
- реальний headless-запуск runnable Python examples 3.1, 3.2, 4.2, 4.3, 4.4 і 4.5;
- створення очікуваних PNG/CSV artifacts для 3.2, 4.2, 4.3, 4.4 та 4.5.

CI не підмінює browser/manual QA, але ловить структурні та reproducibility-помилки до merge.

## 13. Accessibility і progressive enhancement

Компоненти повинні:

- використовувати semantic HTML;
- мати видимий focus state;
- не покладатися лише на колір;
- підтримувати клавіатуру для основних дій;
- показувати зрозуміле повідомлення про помилку замість порожнього блоку.

## 14. Правило масштабування

Не створювати `lecture1.js`, `lecture2.js`, `lecture3.js` з копіями логіки.

Потрібна схема:

```text
shared page shell (коли доречно)
        +
reusable components
        +
JSON конкретного заняття
        +
runnable code / visual assets, коли цього потребує педагогічна задача
        =
новий інтерактив
```

Framework додається лише тоді, коли реальна shared-state complexity виправдовує його вартість.
