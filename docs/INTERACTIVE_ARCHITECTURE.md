# MI2024 Interactive — architecture

## 1. Мета

`interactive/` є окремим web-шаром над існуючими навчальними матеріалами. Він не замінює Jupyter/Python і не вимагає переписування старих занять.

Ролі шарів:

- **interactive page** — формує розуміння технології;
- **Jupyter notebook** — показує реалізацію та обчислення;
- **group lesson** — дає спільну аналітичну задачу;
- **practical** — забезпечує самостійне виконання.

## 2. Технологічне рішення v1

```text
HTML5
  + CSS
  + Vanilla JavaScript ES6+
  + ES Modules
  + JSON
  + optional Plotly.js / Leaflet
  + GitHub Pages
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

## 4. Два способи page composition

### 4.1 Explicit HTML composition

Підходить, коли заняття має унікальну структуру. Theme 2–3 переважно використовують окремі HTML-сторінки з явними `[data-component]` placeholders.

### 4.2 Data-driven shared shell

Коли велика серія занять має однакову педагогічну рамку, не потрібно дублювати HTML. Theme 4 використовує:

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

Це не SPA framework: сторінка залишається звичайним static HTML + browser JavaScript.

## 5. Reusable engine

### `js/app.js`

Bootstrap-файл. Знаходить `[data-component]`, отримує конфігурацію та передає відповідному component mount.

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
- `neural-network-lab`
- `convolution-lab`
- `transfer-rl-lab`
- `text-analysis-lab`

Майбутні кандидати: `map-explorer`, `timeline-explorer`, `network-explorer`, `visual-encoding-lab`, `dashboard-builder`, `decision-brief`.

## 7. State management

У v1 немає global state manager. Стан належить компоненту.

Це навмисно: лекційні інтерактиви незалежні й малі. Якщо з'явиться комплексний тренажер із картою, timeline, багатьма об'єктами та спільним state, його можна винести в окремий application layer або, за потреби, використати framework лише для цього складного компонента.

## 8. Lesson JSON

JSON є декларативним описом заняття. Рекомендовані поля:

- `id`, `number`, `title`, `type`;
- `roadmap.duration`, outcomes і timeboxed blocks;
- `scenario`;
- `pipeline`;
- component configs;
- `sections` для data-driven shell;
- `analystNote`;
- `quiz` і reflection;
- `sources`.

JSON не повинен містити чутливі або службові реальні дані.

## 9. URL та portable deployment

Використовуються relative URLs. Це дозволяє однаково працювати:

- локально через `python3 -m http.server`;
- у GitHub Pages під `/mi2024-1/`;
- з іншого static web server.

Query route типу `theme4.html?lesson=t4-l1` також залишається статичним: server віддає один HTML-файл, а browser обирає lesson JSON.

## 10. CI contracts

Static checks перевіряють:

- JavaScript syntax;
- JSON validity;
- catalog links і data-driven query routes;
- для Theme 4 — 13 підтверджених lesson JSON та timebox 30–45 хв.

CI не підмінює browser/manual QA, але ловить структурні помилки до merge.

## 11. Accessibility і progressive enhancement

Компоненти повинні:

- використовувати semantic HTML;
- мати видимий focus state;
- не покладатися лише на колір;
- підтримувати клавіатуру для основних дій;
- показувати зрозуміле повідомлення про помилку замість порожнього блоку.

## 12. Правило масштабування

Не створювати `lecture1.js`, `lecture2.js`, `lecture3.js` з копіями логіки.

Потрібна схема:

```text
shared page shell (коли доречно)
        +
reusable components
        +
JSON конкретного заняття
        =
новий інтерактив
```

Framework додається лише тоді, коли реальна shared-state complexity виправдовує його вартість.
