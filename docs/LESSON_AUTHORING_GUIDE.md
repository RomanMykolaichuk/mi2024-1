# Authoring guide: інтерактивне заняття

## 1. Педагогічний шаблон

Кожна сторінка має відповідати на п'ять питань:

1. Яку аналітичну проблему ми вирішуємо?
2. Де технологія знаходиться в загальному pipeline?
3. Що технологія отримує на вході та що робить?
4. Який наслідок має рішення користувача?
5. Що з цього повинен винести військовий аналітик?

Лекція не повинна бути HTML-копією конспекту.

## 2. Норматив тривалості

Цільова тривалість **типового інтерактивного заняття — приблизно 30–45 хв активної роботи** без урахування окремого повного виконання Jupyter notebook або додаткового читання.

Для code-intensive занять допускається **розширений формат 60–90 хв**, якщо додатковий час формується реальним виконанням коду, інтерпретацією output, debugging/what-if діями та формуванням аналітичного висновку. Не слід досягати тривалості простим збільшенням тексту.

Типовий 30–45-хвилинний маршрут:

```text
3–5 хв   постановка проблеми / scenario
5–7 хв   concept + місце в analytics pipeline
7–10 хв  основний interactive lab
5–8 хв   what-if / trade-off / decision activity
5–8 хв   application / EDA / interpretation
4–6 хв   self-check + reflection
```

Розширений 60–90-хвилинний code lab має містити кілька самостійних циклів:

```text
concept / analytical question
↓
runnable code
↓
observable output
↓
interpretation
↓
what-if / modification
↓
analytical takeaway
```

Орієнтир: **35–40 хв** для типової лекції. Практичне або групове заняття може наближатися до 45 хв завдяки виконанню місій, а не пасивному читанню. Для занять 3.1 і 3.2 Theme 3 застосовано окремий 90-хвилинний формат із реальними Python code labs.

Кожна нова або суттєво оновлена сторінка повинна мати:

- видимий timebox;
- `duration.min` і `duration.max` у lesson JSON або еквівалентні метадані;
- короткий маршрут заняття з орієнтовним часом кожного блоку;
- не менше двох різних активних дій користувача для лекції, якщо це педагогічно виправдано;
- для code-intensive заняття — runnable source file або notebook, а не лише статичні snippets.

Для типових занять рекомендовано reusable component `lesson-roadmap`. Для розширених code labs допускається еквівалентний статичний timebox, якщо він точніше відображає послідовність виконання коду.

## 3. Рекомендована структура лекції

```text
Hero / problem statement
↓
Lesson roadmap / timebox
↓
Analytical scenario
↓
Analytics pipeline
↓
Concept explainer
↓
Interactive demonstration
↓
What-if / trade-off
↓
Application / EDA / interpretation
↓
Why it matters for the analyst
↓
Knowledge check + reflection
↓
Notebook / additional materials
```

Для групового заняття акцент зміщується на:

```text
Situation → shared data → team decision → result → comparison → debrief
```

Для code-intensive заняття:

```text
Situation → concept → code → output → interpretation → modification → conclusion
```

## 4. Створення сторінки

Використовуйте реалізовані заняття як reference patterns. `interactive/lessons/t3-l1.html` є прикладом **розширеної 90-хвилинної лекції з Python code labs**, а `interactive/lessons/t3-l2.html` — прикладом **90-хвилинного EDA/code lab**. Їх не слід копіювати механічно для занять, яким достатньо 30–45 хв.

Приклад компонента:

```html
<section
  class="section-shell"
  data-component="data-quality-lab"
  data-source="../data/lessons/t3-l1.json"
  data-select="lab">
</section>
```

Приклад посилання на runnable code:

```html
<a href="../examples/t3_l1_preparation.py">Python: повний example</a>
```

## 5. Створення JSON

Створіть `interactive/data/lessons/<lesson-id>.json`.

Рекомендована форма для типового заняття:

```json
{
  "id": "t3-l1",
  "title": "Назва",
  "type": "lecture",
  "roadmap": {
    "duration": {"min": 35, "max": 40},
    "outcomes": [],
    "blocks": []
  },
  "pipeline": {},
  "lab": {},
  "quiz": {}
}
```

Не вбудовуйте великі масиви реальних даних у page HTML. Дані й сценарії мають бути окремо.

## 6. Додавання нового reusable component

1. Створити `interactive/js/components/my-component.js`.
2. Експортувати `mount(element, config)`.
3. Додати компонент у `interactive/js/core/registry.js`.
4. Використовувати через `data-component="my-component"`.
5. Описати expected config у JSDoc або документації.

Поточні загальні компоненти, що підтримують педагогічну архітектуру:

- `lesson-roadmap` — timebox, outcomes, послідовність блоків;
- `analytics-pipeline` — місце технології в аналітичному процесі;
- `decision-tradeoff` — неоднозначні ситуації з наслідками рішень;
- `knowledge-check` — самоперевірка;
- тематичні labs — робота з конкретною технологією.

## 7. Стиль

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

Головна сторінка групує заняття **за темами дисципліни**, а не показує один довгий плоский список.

## 8. Локальна перевірка

```bash
cd interactive
python3 -m http.server 8000
```

Перевірити:

- головну сторінку і групування за темами;
- target lesson;
- усі кнопки;
- reset, якщо компонент його має;
- responsive layout;
- browser console — без помилок;
- відсутність абсолютних шляхів типу `/interactive/...`, які можуть ламати GitHub Pages project site;
- реалістичність timebox: сторінка не повинна формально заявляти 40 або 90 хв, якщо активний маршрут реально проходиться значно швидше;
- для Python code labs — запуск відповідного `.py` або notebook без ручного виправлення коду.

## 9. Definition of Done для нового заняття

Заняття вважається готовим, якщо:

- є чітка аналітична проблема;
- active stage pipeline відповідає змісту;
- цільовий маршрут становить приблизно 30–45 хв або обґрунтовано 60–90 хв для code-intensive формату;
- timebox розкладено на змістовні блоки, а не «добрано» зайвим текстом;
- є хоча б один основний змістовний інтерактив і, для лекції, додаткова decision/what-if активність, якщо вона доречна;
- інтерактив демонструє наслідок рішення, а не лише анімацію;
- code-intensive заняття містить runnable source, observable output і завдання на інтерпретацію;
- є коротка самоперевірка і рефлексія;
- сторінка працює без build step;
- дані безпечні для відкритого репозиторію;
- логіка не дублює існуючий reusable component.
