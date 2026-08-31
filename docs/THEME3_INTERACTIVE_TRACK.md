# Theme 3 Interactive Track — Підготовка даних

## Мета

Перетворити Тему 3 на послідовний навчальний маршрут:

`якість даних → EDA → практичний audit → трансформація → train/test discipline → model readiness`

Головний методичний принцип:

> слухач має бачити не окрему Python-команду, а її місце в аналітичному процесі, наслідок для даних і ризик для подальшого висновку.

## Тривалість

Ціль для кожного заняття Theme 3 — **приблизно 30–45 хв активної роботи**. Час не добирається довгим текстом: він формується через scenario, concept block, interactive lab, decision/what-if activity, interpretation та self-check.

Заняття **3.1** використовується як reference implementation типової лекції приблизно на 40 хв і містить reusable `lesson-roadmap` з розкладом часу.

## Звірені заняття

| ID | Джерело | Зміст за матеріалами репозиторію | Інтерактивний акцент | Орієнтир | Статус |
|---|---|---|---|---|---|
| 3.1 | `Theme3/aLection1` | Методологія підготовки даних; методи попереднього аналізу даних | Scenario + methodology + Data Quality Lab + Decision Trade-off Lab + EDA preview | 35–45 хв | implemented |
| 3.2 | `Theme3/Group lesson 2` | PDA/EDA; Pandas, NumPy, Matplotlib/Seaborn; cleaning, statistics, visualization, correlation, anomalies | EDA Explorer + team profile mission | 30–45 хв | implemented |
| 3.3 | `Theme3/Practice 3/task.ipynb` | Практичний аналіз обраного dataset: load, cleaning, descriptive statistics, visualization, correlation, reporting | Reproducible EDA Mission | 30–45 хв | implemented |
| 3.4 | `Theme3/Group lesson 4` | Missing data, normalization/scaling, One-Hot Encoding, train/test split, feature selection, aggregation | Transformation Lab + Leakage Lab | 30–45 хв | implemented |
| 3.5 | `Theme3/Practice5/task.ipynb` | End-to-end cleaning, transformation, decomposition, visualization, baseline model, reporting | Model-Ready Pipeline + Readiness Gate | 30–45 хв | implemented |

## Reusable components

### `lesson-roadmap`
Показує видимий timebox, результати навчання і структуру заняття з орієнтовними хвилинами. Використовується для контролю того, щоб web-сторінка не стискалася до короткої демонстрації замість повноцінного заняття.

### `decision-tradeoff`
Конфігурований блок неоднозначних ситуацій. Слухач обирає рішення, бачить наслідок, rationale і takeaway. У 3.1 використовується для missingness, deduplication, outliers і time semantics.

### `eda-explorer`
Показує кілька поглядів на dataset: структура, пропуски, розподіли, кореляції, аномалії. Кожен view завершується аналітичним висновком і ризиком помилкової інтерпретації.

### `workflow-mission-lab`
Конфігурований workflow із evidence для кожного етапу. Використовується для практичних і групових занять, де потрібна послідовність дій, а не один правильний клік.

### `transformation-lab`
Моделює вплив імпутації, scaling, encoding і feature review на dataset readiness. Не прив’язаний до конкретної предметної області.

### `split-leakage-lab`
Порівнює небезпечний і коректний preprocessing pipeline та робить видимим data leakage.

### `readiness-scorecard`
Фінальний gate перед моделюванням: goal, provenance, data quality, split isolation, reproducible preprocessing, baseline, metrics, limitations.

## Виправлена методична послідовність

У вихідному `Theme3/Practice5/task.ipynb` scaling демонструється до `train_test_split`. Для навчання ML це небезпечно, бо scaler може отримати інформацію про майбутній test set.

У reusable engine зафіксовано правильний порядок:

```text
raw dataset
    ↓
data audit
    ↓
train/test split
    ↓
fit imputer/scaler/encoder/feature selection on train
    ↓
transform train and test with train-derived parameters
    ↓
train baseline model
    ↓
evaluate on untouched test
    ↓
interpret + document limitations
```

## EDA: термінологія

У матеріалах зустрічаються `Preliminary Data Analysis (PDA)` та `Exploratory Data Analysis (EDA)`. В інтерактивному шарі використовується EDA як основний зрозумілий термін, а PDA трактується як близький за функцією попередній етап дослідження даних. Не слід подавати їх як два повністю незалежні процеси без пояснення.

## Дані

Web-демонстрації використовують синтетичні приклади, близькі за структурою до задач військової аналітики, але без реальних оперативних даних. Вихідні notebooks можуть використовувати загальні Kaggle datasets для відпрацювання Python.

## Definition of Done для Theme 3

Тема 3 вважається інтерактивно завершеною, якщо:

1. усі 3.1–3.5 доступні з головної сторінки всередині групи «Тема 3»;
2. між заняттями є внутрішня навігація;
3. кожне заняття розраховане приблизно на 30–45 хв активної роботи;
4. кожне заняття показує місце технології в analytics pipeline або end-to-end workflow;
5. кожна практична дія пов’язана з evidence/наслідком;
6. data leakage явно пояснено до переходу в Theme 4;
7. усі JavaScript, JSON і catalog links проходять static checks;
8. вихідні notebooks не переписуються автоматично — редакційний technical debt документується окремо.
