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
├── lessons/                   # сторінки лекцій і групових занять
├── assets/css/main.css        # спільний design system
├── assets/css/*.css           # page/component-specific styles
├── js/app.js                  # bootstrap reusable engine
├── js/core/                   # registry + data loader
├── js/components/             # reusable components
└── data/                      # course map + lesson scenarios + master matrix
```

## Реалізовані заняття

- `lessons/t2-l4.html` — **Тема 2, заняття 4 «Методи зберігання даних ІАЗ ОУВ»**: storage model explorer, normalization lab, SQL query lab, storage decision lab, self-check.
- `lessons/t3-l1.html` — reference prototype: pipeline + data preparation lab + self-check.

## Master matrix

- `data/course-matrix.json` — machine-readable roadmap Theme 1–5.
- `../docs/COURSE_INTERACTIVE_MATRIX.md` — людиночитний варіант матриці та component roadmap.

## Правило reusable engine

Не додавати JS-логіку безпосередньо в кожну лекцію, якщо її можна узагальнити як reusable component.

`HTML placeholder + reusable JS component + JSON lesson config = interactive lesson`

## Дані

Інтерактивний web-шар використовує лише синтетичні, навчальні або дозволені відкриті дані. Він не призначений для розміщення службової чи чутливої інформації.
