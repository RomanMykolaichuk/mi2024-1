# MI2024 Interactive

Статичний інтерактивний web-шар курсу.

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
├── js/app.js                  # bootstrap reusable engine
├── js/core/                   # registry + data loader
├── js/components/             # reusable components
└── data/                      # course map + lesson scenarios
```

## Еталон

`lessons/t3-l1.html` — перший reference implementation: pipeline + data preparation lab + self-check.

Мета цього еталону — перевірити архітектуру. Конкретні числа в демонстрації є навчальними й синтетичними.

## Правило

Не додавати JS-логіку безпосередньо в кожну лекцію, якщо її можна узагальнити як reusable component.
