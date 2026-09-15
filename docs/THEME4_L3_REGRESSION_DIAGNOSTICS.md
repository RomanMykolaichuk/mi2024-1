# Theme 4.3 — Regression Diagnostics

Практичне заняття 4.3 розширене reusable інтерактивом і runnable Python reference.

Route:

```text
interactive/lessons/theme4.html?lesson=t4-l3
```

Reusable component:

```text
interactive/js/components/regression-diagnostics-lab.js
```

Runnable example:

```bash
python interactive/examples/t4_l3_regression_workflow.py --max-depth 5
```

Навчальний workflow:

```text
numeric target
→ Linear Regression baseline
→ Ridge / Decision Tree comparison
→ alpha / max_depth
→ actual vs predicted
→ residual diagnostics
→ complexity / train-test gap
→ validation/CV reasoning
→ final held-out test
→ interpretation in target units
```

Script використовує synthetic five-feature logistics-processing dataset, порівнює `LinearRegression`, `Ridge` і `DecisionTreeRegressor`, а також генерує:

```text
interactive/examples/t4_l3_regression_output/
├── actual_vs_predicted.png
├── residuals.png
├── complexity_curve.png
└── model_comparison.csv
```

Ключові методичні правила:

- baseline створюється до складніших моделей;
- MAE/RMSE інтерпретуються в одиницях target;
- R² не замінює residual analysis;
- train error не використовується як єдиний критерій вибору;
- `max_depth` налаштовується на validation/CV, а не багаторазово на held-out test;
- складніша модель повинна довести перевагу generalization evidence;
- web-графіки є навчальною browser-реконструкцією, runnable script — реальним scikit-learn reference.

Source note: вихідний `Theme4/practice3/task.ipynb` змішує House Prices / `SalePrice` narrative з фактичним `Student_Performance.csv`. Source notebook не переписується; web-layer використовує окремий узгоджений synthetic scenario, щоб не маскувати цю неузгодженість.
