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
HTML сторінка
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

Один `analytics-pipeline.js` використовується в усіх лекціях, а конкретний зміст задається JSON.

## 4. Reusable engine

### `js/app.js`

Bootstrap-файл. Знаходить усі елементи `[data-component]`, отримує їх конфігурацію та передає відповідному компоненту.

### `js/core/registry.js`

Єдиний реєстр компонентів. Нова функціональність додається один раз у registry, а не імпортується вручну в кожній лекції.

### `js/core/data.js`

Відповідає за:

- завантаження JSON;
- кешування повторних запитів;
- вибір підсекції через `data-select`;
- читання inline `data-config` для малих компонентів.

### `js/components/*`

Самодостатні reusable-компоненти. Кожен експортує одну функцію:

```js
export function mount(element, config) {
  // render + event handlers
}
```

Компонент не повинен знати назву конкретної лекції.

## 5. Базова бібліотека компонентів

Поточний каркас містить:

- `course-catalog` — головна карта/каталог інтерактивних занять;
- `analytics-pipeline` — місце технології в ланцюгу військової аналітики;
- `data-quality-lab` — stateful what-if симулятор підготовки даних;
- `knowledge-check` — коротка самоперевірка.

Наступні кандидати:

- `metric-explorer`;
- `model-comparison`;
- `map-explorer` (Leaflet);
- `timeline-explorer`;
- `network-explorer`;
- `decision-card`;
- `compare-approaches`;
- `uncertainty-lab`.

## 6. State management

У v1 не вводиться глобальний state manager. Стан належить компоненту.

Це навмисно: лекційні інтерактиви мають бути незалежними й малими. Якщо з'явиться комплексний тренажер з картою, timeline, багатьма об'єктами та спільним станом, його можна винести в окремий application layer або перейти для цього компонента на React.

## 7. Дані

JSON — декларативний опис заняття. У ньому зберігаються:

- назва й тип заняття;
- active stage аналітичного pipeline;
- параметри демонстрації;
- сценарій симулятора;
- питання self-check;
- посилання на notebook/матеріали (коли вони будуть промаплені).

Важливо: JSON не повинен містити чутливі або службові реальні дані.

## 8. URL та portable deployment

У коді використовуються відносні URL. Це дозволяє однаково працювати:

- локально через `python3 -m http.server`;
- у GitHub Pages під `/mi2024-1/`;
- з іншого статичного web server.

## 9. Accessibility і progressive enhancement

Компоненти повинні:

- використовувати semantic HTML;
- мати видимий focus state;
- не покладатися лише на колір;
- підтримувати клавіатуру для основних дій;
- показувати зрозуміле повідомлення про помилку замість порожнього блоку.

## 10. Правило масштабування

Не створювати `lecture1.js`, `lecture2.js`, `lecture3.js` з копіями логіки.

Потрібна схема:

```text
один reusable component
        +
JSON конкретного заняття
        =
новий інтерактив
```

Це ключова вимога до всіх наступних сторінок.
