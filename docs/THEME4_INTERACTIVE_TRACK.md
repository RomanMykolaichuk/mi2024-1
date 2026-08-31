# Theme 4 Interactive Track — Методи аналізу даних і штучний інтелект

## Мета

Перетворити матеріали Theme 4 на послідовний маршрут приблизно **30–45 хв активної роботи на кожне web-заняття**:

`вибір методу → ML task formulation → regression → evaluation/tuning → classification → neural networks → deep learning → TensorFlow practice → CNN → frontier methods → Transfer Learning/RL → project design → text/Generative AI`

Web-шар не замінює Jupyter Notebook. Його функція — сформувати правильну аналітичну модель мислення до або разом із практичною реалізацією.

## Аудит первинних матеріалів

У `Theme4` підтверджено 13 занять із окремими первинними джерелами. Окремого каталогу/матеріалу для **4.10** у репозиторії немає, тому зміст 4.10 **не вигадується** і в каталозі позначається `source-gap`.

| ID | Первинне джерело | Підтверджений зміст | Web-акцент | Статус |
|---|---|---|---|---|
| 4.1 | `Theme4/aLection1` | Огляд сучасних методів аналізу даних в інтересах ІАЗ ОВУ | Method Selector + operational constraints | implemented |
| 4.2 | `Theme4/Group lesson 2/content1.ipynb` | Використання методів ШІ для аналізу даних | classification/regression/clustering + ML workflow | implemented |
| 4.3 | `Theme4/practice3/task.ipynb` | Regression practical | regression metrics + model complexity + practical mission | implemented |
| 4.4 | `Theme4/Group lesson 4/content1.ipynb` | Оцінка точності та hyperparameter tuning | CV/test roles + tuning curve + metric choice | implemented |
| 4.5 | `Theme4/practice5/task.ipynb` | Classification practical | confusion matrix + threshold + precision/recall/F1 | implemented |
| 4.6 | `Theme4/aLection6` | Основи штучних нейронних мереж; напрями deep learning | architecture capacity + explainability/latency trade-offs | implemented |
| 4.7 | `Theme4/Group lesson 7/content.ipynb` | Основи deep learning | leakage-safe DL experiment design | implemented |
| 4.8 | `Theme4/practice8/practical_task_regression_classification.ipynb` | TensorFlow regression + classification | output/loss/metric mapping + reproducible experiment | implemented |
| 4.9 | `Theme4/Group lesson 9/content.ipynb` | Deep learning для графічної інформації | convolution/CNN + augmentation/transfer/domain shift | implemented |
| 4.10 | — | первинне джерело не виділено | не реалізується без джерела | source-gap |
| 4.11 | `Theme4/aLection11/content.ipynb` | Перспективні напрямки аналізу даних | frontier methods + MLOps/model governance | implemented |
| 4.12 | `Theme4/Group lesson 12/content.ipynb` | Transfer Learning + Reinforcement Learning | fine-tuning + reward/environment validation | implemented |
| 4.13 | `Theme4/Practice 13/content.ipynb` | Практичне використання model repositories у проєктах | project design + reproducibility gates | implemented |
| 4.14 | `Theme4/Group lesson 14/info.ipynb` | Методи аналізу тексту; Generative AI basics | text extraction/classification/summarization + provenance | implemented |

## Data-driven page shell

Theme 4 не має 13 майже однакових HTML-файлів. Використовується один shell:

`interactive/lessons/theme4.html?lesson=t4-lN`

`interactive/js/theme4-page.js`:

1. читає `lesson` із query string;
2. дозволяє лише whitelist підтверджених lesson IDs;
3. завантажує `interactive/data/lessons/<lesson-id>.json`;
4. формує breadcrumb, Theme 4 navigation, hero, roadmap, scenario, component sections, analyst note, quiz і source links;
5. після побудови DOM запускає загальний `interactive/js/app.js`.

Перевага: навігація, timebox, структура сторінки і source-material block підтримуються в одному місці.

## Reusable components Theme 4

### `method-selector`
Сценарний вибір методу. Показує, що statistics, regression/classification/clustering, GIS, text/network analysis, frontier AI methods мають різні задачі та constraints.

### `metric-tradeoff-lab`
Три режими:

- `classification` — threshold → TP/FP/FN/TN → accuracy/precision/recall/F1;
- `regression` — model complexity → train/test error → underfit/overfit;
- `tuning` — max_depth → train/CV/test → generalization gap.

Показники synthetic: це pedagogical what-if, а не заміна реального training.

### `neural-network-lab`
Task, layers, units і dropout → schematic architecture, parameter count та synthetic generalization indicators. Пояснює capacity/regularization без запуску TensorFlow у браузері.

### `convolution-lab`
Реально обчислює просту valid convolution для 5×5 input і 3×3 kernels та показує feature map. Це concept demonstration, не image classifier.

### `transfer-rl-lab`
Два режими:

- Transfer Learning — feature extractor / partial fine-tune / full fine-tune;
- RL — abstract agent–environment loop і reward-weight what-if.

RL-сценарій свідомо абстрактний і навчальний; web-компонент не моделює реальне бойове керування.

### `text-analysis-lab`
Працює з synthetic reports і показує:

`extract → classify → generated-style summary → provenance check`

Немає зовнішнього LLM API. «Generated-style summary» детермінований JSON/JavaScript, щоб чітко відокремити pedagogical UX від реальної генеративної моделі.

## Методичні виправлення щодо первинних матеріалів

Оригінальні notebooks у цьому PR **не переписуються**, але web-шар не переносить відомі проблеми:

### 4.3
`practice3/task.ipynb` змішує narrative House Prices / `SalePrice` із наявним `Student_Performance.csv`. Web-практика використовує окремий внутрішньо узгоджений synthetic regression scenario.

### 4.7
У старому матеріалі трапляються:

- deprecated/removed `load_boston`;
- scaling до `train_test_split`, що створює data leakage risk;
- помилкова назва metric `precising`.

Web-шар використовує:

`split → fit preprocessing on train → transform train/validation/test → train → validate → final test`.

### 4.12–4.13
Старі приклади можуть містити історичний API `pretrained=True`. Web-шар пояснює model reuse концептуально і не дублює застарілий API.

### 4.14
Первинний `info.ipynb` дуже короткий: лише назва та два навчальні питання. Розширення web-шару обмежене підтвердженими темами — text analysis і Generative AI — і використовує synthetic reports, provenance/hallucination controls та human review.

## Норматив часу

Кожен реалізований Theme 4 JSON містить `roadmap.duration` і 6 activity blocks. Типовий дизайн:

```text
4 хв   scenario
6–7 хв concept
9–12 хв main interactive
7–10 хв mission / trade-off
5–6 хв interpretation / synthesis
5 хв   self-check + reflection
```

Заявлений timebox має бути підтверджений реальною кількістю дій користувача, а не довгим пасивним текстом.

## Безпека даних

- Web-шар використовує synthetic/open teaching examples.
- Великі model artifacts не вантажаться в браузер автоматично.
- Немає live LLM API, live RL environment або зовнішньої передачі даних.
- Model/GenAI output завжди подається як evidence, що потребує validation/human interpretation.

## Definition of Done Theme 4

Theme 4 вважається інтерактивно реалізованою на рівні наявних джерел, якщо:

1. 13 підтверджених занять доступні з grouped catalog;
2. 4.10 явно позначено як `source-gap`;
3. кожне заняття має roadmap 30–45 хв;
4. кожне заняття має щонайменше один substantive interactive та додаткову mission/trade-off activity, де доречно;
5. всі lesson JSON валідні;
6. query routes у catalog ведуть на існуючий shell і lesson JSON;
7. JavaScript проходить `node --check`;
8. primary notebooks не модифікуються автоматично;
9. technical debt первинних матеріалів документовано;
10. source evidence, model result і analytical interpretation не змішуються без явного маркування.
