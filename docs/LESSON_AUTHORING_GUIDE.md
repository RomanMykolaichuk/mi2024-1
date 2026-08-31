# Authoring guide: інтерактивне заняття

## 1. Педагогічний шаблон

Кожна сторінка має відповідати на п'ять питань:

1. Яку аналітичну проблему ми вирішуємо?
2. Де технологія знаходиться в загальному pipeline?
3. Що технологія отримує на вході та що робить?
4. Який наслідок має рішення користувача?
5. Що з цього повинен винести військовий аналітик?

Лекція не повинна бути HTML-копією конспекту.

## 2. Рекомендована структура лекції

```text
Hero / problem statement
↓
Analytics pipeline
↓
Concept explainer
↓
Interactive demonstration
↓
What-if / trade-off
↓
Why it matters for the analyst
↓
Knowledge check
↓
Notebook / additional materials
```

Для групового заняття акцент зміщується на:

```text
Situation → shared data → team decision → result → comparison → debrief
```

## 3. Створення сторінки

Скопіюйте еталонну сторінку `interactive/lessons/t3-l1.html` і змініть лише змістові секції та посилання на JSON.

Приклад компонента:

```html
<section
  class="section-shell"
  data-component="data-quality-lab"
  data-source="../data/lessons/t3-l1.json"
  data-select="lab">
</section>
```

## 4. Створення JSON

Створіть `interactive/data/lessons/<lesson-id>.json`.

Мінімальна форма:

```json
{
  "id": "t3-l1",
  "title": "Назва",
  "type": "lecture",
  "pipeline": {},
  "lab": {},
  "quiz": {}
}
```

Не вбудовуйте великі масиви реальних даних у page HTML. Дані й сценарії мають бути окремо.

## 5. Додавання нового reusable component

1. Створити `interactive/js/components/my-component.js`.
2. Експортувати `mount(element, config)`.
3. Додати компонент у `interactive/js/core/registry.js`.
4. Використовувати через `data-component="my-component"`.
5. Описати expected config у JSDoc або документації.

## 6. Стиль

Візуальна мова: **Military Analytical Laboratory**, а не декоративний HUD.

Пріоритет:

- чиста типографіка;
- сильна ієрархія;
- великі показники;
- зрозумілі графіки;
- акцентний колір для active stage;
- мінімум декоративного камуфляжу;
- зміст створює військовий контекст.

Обов'язковий змістовий блок: **«Чому це важливо для аналітика?»**.

## 7. Локальна перевірка

```bash
cd interactive
python3 -m http.server 8000
```

Перевірити:

- головну сторінку;
- target lesson;
- усі кнопки;
- reset;
- responsive layout;
- browser console — без помилок;
- відсутність абсолютних шляхів типу `/interactive/...`, які можуть ламати GitHub Pages project site.

## 8. Definition of Done для нового заняття

Заняття вважається готовим, якщо:

- є чітка аналітична проблема;
- active stage pipeline відповідає змісту;
- є хоча б один змістовний інтерактив;
- інтерактив демонструє наслідок рішення, а не лише анімацію;
- є коротка самоперевірка;
- сторінка працює без build step;
- дані безпечні для відкритого репозиторію;
- логіка не дублює існуючий reusable component.
