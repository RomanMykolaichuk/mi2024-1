# Theme 1 · Interactive Track

## Роль теми в MI2024 Interactive

Тема 1 формує фундамент для всього подальшого курсу:

`інформаційна потреба → методологія → критерії ефективності → відтворюване середовище → архітектура → інтегрований прототип`

Головний принцип: **problem first, technology second**. Слухач має розуміти, що і для якого рішення будується, як буде оцінена корисність, як забезпечити відтворювану розробку і як поєднати data layer, API та UI.

## Source audit

### 1.1 — verified
Primary source: `Theme 1/1.1/lesson.ipynb`.

Точна назва: **Методологічні основи ІАЗ**.

Первинний notebook містить:
- огляд методологічних підходів до ІАЗ;
- основи розробки проєктів ІАЗ;
- самостійну роботу «Життєвий цикл проекту ІАЗ».

Інтерактив розгортає саме ці пункти у `IAZ Lifecycle Lab`.

### 1.2 — verified
Primary source: `Theme 1/1.2/lesson.ipynb`; supporting source: `Оцінка ефективності ІТ у військовому управлінні.pdf`.

Точна назва: **Наукові методи оцінки ефективності застосування інформаційних технологій в ОУВ**.

Інтерактивний `Effectiveness Scorecard` є **навчальною багатокритеріальною моделлю**, а не нормативною формулою. Він використовується для роботи з поняттями criteria, baseline, weighting, hard constraints і sensitivity.

### 1.3 — verified
Primary sources: `Theme 1/1.3/lesson.ipynb`, `practice3.ipynb`.

Точна назва: **Основи створення інтегрованого середовища розробки засобів ІАЗ**.

`practice3.ipynb` прямо задає:
- Git;
- GitHub;
- Visual Studio Code;
- Python 3.11+;
- PostgreSQL;
- `README.md`, `.gitignore`, `check.py`, `schema.sql`;
- Stage → Commit → Push → browser verification.

### 1.4–1.5 — source-derived
У `Theme 1/1.4_1.5` немає окремих первинних plan/notebook із точними офіційними назвами 1.4 та 1.5. Тому web-назви **не позначаються verified**.

Фактичні source artifacts:
- `01DataBase/*.sql` — PostgreSQL schema/dumps;
- `02Analytics_03UI(UX)/app.py` — Flask + PostgreSQL + JSON API;
- `task.ipynb` — прості DB/API/UI проєкти;
- `2025/task.ipynb` — 8 варіантів мінісистем;
- `2025/README.md` — Expense Tracker sample.

Source-derived web labels:
- **1.4 · Проєктування даних і REST API простого засобу ІАЗ**;
- **1.5 · Інтеграція PostgreSQL, REST API та веб-інтерфейсу простого засобу ІАЗ**.

Вони описують фактичні артефакти, але не видаються за офіційні назви РПНД.

## Інтерактивний маршрут

| ID | Фокус | Головний інтерактив | Орієнтовний час |
|---|---|---|---:|
| 1.1 | методологія і життєвий цикл | `iaz-lifecycle-lab` | 35–45 хв |
| 1.2 | оцінювання ефективності | `effectiveness-scorecard` | 35–45 хв |
| 1.3 | Git/IDE і development environment | `dev-workflow-explorer` | 35–45 хв |
| 1.4 | DB/API/UI architecture | `system-architecture-lab` | 35–45 хв |
| 1.5 | end-to-end CRUD integration | `integration-flow-lab` | 35–45 хв |

Shared page shell:

```text
interactive/lessons/theme1.html?lesson=t1-l1
...
interactive/lessons/theme1.html?lesson=t1-l5
```

Lesson configuration:

```text
interactive/data/lessons/t1-l1.json
...
interactive/data/lessons/t1-l5.json
```

## Reusable components

### `iaz-lifecycle-lab`
Sequence challenge:

`information need → requirements → design → implementation → validation → operation → evaluation/feedback`

Не дозволяє починати з implementation/tool selection.

### `effectiveness-scorecard`
Показує:
- multi-criteria evaluation;
- context-dependent weights;
- baseline;
- weakest criterion;
- threshold;
- distinction between weighted criteria and hard constraints.

Критичне методичне правило: високий середній score не компенсує неприйнятний hard constraint.

### `dev-workflow-explorer`
Два паралельні контури:
- Git workflow: clone → files → stage → commit → push → verify;
- environment readiness: Git, GitHub, VS Code, Python, PostgreSQL, `.gitignore`.

### `system-architecture-lab`
Навчає відповідальності шарів:

`PostgreSQL persistence/integrity → Flask API contract → HTML/CSS/JS presentation`

та end-to-end flow:

`UI → HTTP → API → SQL → DB → JSON → UI`.

### `integration-flow-lab`
Для 8 source-derived варіантів дозволяє пройти GET/POST/DELETE flow.

Варіанти з `2025/task.ipynb`:
1. books;
2. students;
3. products;
4. tasks;
5. contacts;
6. incoming documents;
7. equipment repairs;
8. expenses.

## Red-team findings

### 1. Hardcoded database password у legacy source
`Theme 1/1.4_1.5/02Analytics_03UI(UX)/app.py` містить hardcoded PostgreSQL credentials, включно з password.

Оригінальний source **не переписується** в межах інтерактивного шару, щоб не змінювати навчальні матеріали приховано. Але web-track прямо трактує це як technical debt і вчить:

`source code ≠ secret storage`

Рекомендований pattern:
- environment variables / secret configuration;
- `.env` у `.gitignore`;
- безпечний `.env.example` без реальних secret values.

### 2. 1.4/1.5 не мають окремих official titles
Ризик: випадково перетворити робочі web-labels на «офіційні назви».

Контроль:
- `titleConfidence: source-derived` у JSON;
- CI окремо перевіряє цей статус;
- master matrix і catalog не приховують походження назв.

### 3. Weighted effectiveness score може створити псевдоточність
Контроль:
- scorecard прямо названо навчальною моделлю;
- критерії/ваги не подаються як нормативні;
- hard constraints аналізуються окремо;
- потрібні baseline та обґрунтовані measurements.

## Методичний зв’язок із наступними темами

Theme 1 відповідає на питання **що, навіщо і в якій архітектурі ми будуємо**.

Далі:

`Theme 1 · foundations`
→ `Theme 2 · collection/storage`
→ `Theme 3 · preparation`
→ `Theme 4 · analysis/AI`
→ `Theme 5 · visualization/brief`

Це перетворює курс на один наскрізний аналітичний pipeline, а не п’ять незалежних наборів технологій.
