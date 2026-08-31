# Theme 4 Interactive Track — Методи аналізу даних і штучний інтелект

## Мета

Theme 4 побудована як послідовний маршрут приблизно **30–45 хв активної web-роботи на заняття**:

`вибір методу → ML task formulation → regression → evaluation/tuning → classification → neural networks → deep learning → TensorFlow practice → CNN → deep-learning project practice → frontier methods → Transfer Learning/RL → project design → text/Generative AI`

Web-шар не замінює Jupyter Notebook. Його функція — сформувати правильну аналітичну модель мислення, дати what-if/decision practice і привести слухача до відтворюваної практичної реалізації.

## Статус

**Theme 4 — 14/14 implemented.**

Раніше 4.10 було `source-gap`. 31.08.2026 автор курсу надав точну назву й два навчальні питання:

**Тема 4. Заняття 10. Практичне використання методів глибокого навчання в межах виконання індивідуальних (групових) проектів.**

1. Практичний аналіз даних в індивідуальних проектах з використанням методів глибокого навчання.
2. Практичний аналіз даних в групових проектах з використанням методів глибокого навчання.

На цій підставі створено новий primary source block `Theme4/Practice 10/` і інтерактивне заняття `t4-l10`.

## Аудит первинних матеріалів

| ID | Первинне джерело | Підтверджений зміст | Web-акцент | Статус |
|---|---|---|---|---|
| 4.1 | `Theme4/aLection1` | Огляд сучасних методів аналізу даних | Method Selector + constraints | implemented |
| 4.2 | `Theme4/Group lesson 2/content1.ipynb` | Використання методів ШІ | classification/regression/clustering + ML workflow | implemented |
| 4.3 | `Theme4/practice3/task.ipynb` | Regression practical | metrics + complexity + mission | implemented |
| 4.4 | `Theme4/Group lesson 4/content1.ipynb` | Accuracy + hyperparameters | CV/test roles + tuning | implemented |
| 4.5 | `Theme4/practice5/task.ipynb` | Classification practical | threshold + precision/recall/F1 | implemented |
| 4.6 | `Theme4/aLection6` | Neural networks | architecture capacity + regularization | implemented |
| 4.7 | `Theme4/Group lesson 7/content.ipynb` | Deep learning foundations | leakage-safe DL experiment design | implemented |
| 4.8 | `Theme4/practice8/practical_task_regression_classification.ipynb` | TensorFlow regression/classification | output/loss/metric mapping | implemented |
| 4.9 | `Theme4/Group lesson 9/content.ipynb` | DL для графічної інформації | convolution/CNN + domain shift | implemented |
| 4.10 | `Theme4/Practice 10/content.ipynb`, `task.ipynb`, `sample.ipynb` | Практичне використання DL в індивідуальних/групових проектах | project evidence chain + individual/group missions | implemented |
| 4.11 | `Theme4/aLection11/content.ipynb` | Перспективні напрями | frontier methods + MLOps/governance | implemented |
| 4.12 | `Theme4/Group lesson 12/content.ipynb` | Transfer Learning + RL | fine-tuning + reward/environment validation | implemented |
| 4.13 | `Theme4/Practice 13/content.ipynb` | Model repositories у проектах | project design + reproducibility gates | implemented |
| 4.14 | `Theme4/Group lesson 14/info.ipynb` | Text analysis + Generative AI | text workflow + provenance/human review | implemented |

## 4.10 — первинний контент

Новий каталог:

```text
Theme4/Practice 10/
├── README.md
├── content.ipynb
├── task.ipynb
└── sample.ipynb
```

### `content.ipynb`

Методичний content layer:

`problem → data/provenance → split → baseline → DL model → training/regularization → validation → error analysis → reproducible artifact → analytical conclusion`

Окремо розкрито:

- project contract;
- train/validation/test і leakage;
- вибір MLP/CNN/RNN/Transformer за типом задачі;
- overfitting, dropout, early stopping, augmentation;
- baseline vs DL;
- final evaluation і error analysis;
- індивідуальний project workflow;
- групові ролі та єдиний experiment protocol;
- Git/PR/review discipline;
- review checklist.

### `task.ipynb`

Практичне завдання містить:

- індивідуальний або груповий формат;
- 6 project variants;
- обов'язковий baseline;
- не менше 3 controlled experiments;
- experiment table;
- peer-review checklist;
- критерії оцінювання 100 балів;
- required deliverables.

### `sample.ipynb`

Повністю локальний приклад CNN-проекту на **synthetic 16×16 grayscale images** трьох класів. Інтернет і зовнішні datasets не потрібні.

Показано:

`synthetic data → split → linear/softmax baseline → CNN → early stopping → final test → confusion matrix → failure examples`

Notebook навмисно не використовує real operational data.

## Інтерактив 4.10

Route:

`interactive/lessons/theme4.html?lesson=t4-l10`

JSON:

`interactive/data/lessons/t4-l10.json`

Timebox: **≈38–45 хв**.

Сторінка використовує існуючий reusable engine, без окремого lesson-specific component:

1. `lesson-roadmap` — маршрут і timebox;
2. `analytics-pipeline` — місце project workflow;
3. `neural-network-lab` — capacity/generalization preview;
4. `decision-tradeoff` — baseline, test leakage, overfit, compute;
5. `workflow-mission-lab` — Individual Project Mission;
6. `workflow-mission-lab` — Group Project Mission;
7. `readiness-scorecard` — evidence readiness gate;
8. `knowledge-check` — self-check.

Це відповідає правилу reusable engine: новий JS не створюється, якщо поведінка вже покривається загальними компонентами.

## Data-driven page shell

Theme 4 використовує один shell:

`interactive/lessons/theme4.html?lesson=t4-lN`

`interactive/js/theme4-page.js`:

1. читає `lesson` із query string;
2. whitelist містить **4.1–4.14**;
3. завантажує `interactive/data/lessons/<lesson-id>.json`;
4. формує breadcrumb, Theme navigation, hero, roadmap, scenario, component sections, analyst note, quiz і source links;
5. запускає загальний `interactive/js/app.js`.

## Reusable components Theme 4

- `method-selector` — method/task matching;
- `metric-tradeoff-lab` — classification/regression/tuning metrics;
- `neural-network-lab` — architecture capacity/regularization preview;
- `convolution-lab` — local convolution / feature map;
- `transfer-rl-lab` — Transfer Learning + abstract RL;
- `text-analysis-lab` — synthetic text pipeline + provenance;
- shared core: `lesson-roadmap`, `analytics-pipeline`, `decision-tradeoff`, `workflow-mission-lab`, `readiness-scorecard`, `knowledge-check`.

## Методичні принципи Theme 4

### Deep learning experiment

`split → fit preprocessing on train → train/tune on train+validation → freeze candidate → final test → error analysis`

Test не використовується як leaderboard для architecture/hyperparameter selection.

### Project evidence

Model artifact без provenance, baseline, protocol, metrics, failure modes, limitations і run instructions не вважається достатнім project result.

### Групова робота

Група має один problem contract і один experiment protocol. Roles розподіляють ownership, але final result повинен бути інтегрованим і відтворюваним.

## Technical-debt corrections, що вже враховані web-шаром

- 4.3: не переноситься невідповідність House Prices narrative / фактичного dataset.
- 4.7: не використовується removed `load_boston`; preprocessing fit виконується після split; не дублюється помилкова metric naming.
- 4.12–4.13: не дублюється історичний `pretrained=True` API як актуальна рекомендація.
- 4.14: коротке джерело розширено лише в межах підтверджених text/GenAI тем із provenance/human-review controls.

## Норматив часу

Кожний Theme 4 lesson JSON має declared duration 30–45 хв і щонайменше 5 активних blocks. Для 4.10 planned route становить 42 хв.

## Безпека даних

- Web-layer використовує synthetic/open teaching examples.
- `sample.ipynb` 4.10 генерує synthetic data локально.
- Real sensitive data, credentials, tokens, closed model artifacts не повинні потрапляти до public GitHub або сторонніх сервісів.
- Model output завжди потребує validation та human interpretation.

## Definition of Done Theme 4

Theme 4 завершена, якщо:

1. усі **14/14** занять доступні з grouped catalog;
2. кожне заняття має roadmap 30–45 хв;
3. кожне має substantive interactive / mission / decision activity;
4. всі lesson JSON валідні;
5. всі source links існують;
6. catalog routes ведуть на shell + lesson JSON;
7. JavaScript проходить `node --check`;
8. 4.10 має власний primary source package;
9. source evidence, model result та analytical interpretation розділені;
10. CI перевіряє 14 Theme 4 lesson JSON і відсутність `source-gap` для 4.10.
