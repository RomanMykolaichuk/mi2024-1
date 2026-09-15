const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function mount(element, config) {
  const models = [
    {id:'linear', label:'Linear Regression'},
    {id:'ridge', label:'Ridge'},
    {id:'tree', label:'Decision Tree'},
  ];
  const views = [
    {id:'actual', label:'Actual vs predicted'},
    {id:'residuals', label:'Residuals'},
    {id:'complexity', label:'Complexity curve'},
  ];
  let model = config.defaultModel ?? 'tree';
  let view = 'actual';
  let depth = Number(config.maxDepth ?? 5);
  let alpha = Number(config.ridgeAlpha ?? 2);

  element.innerHTML = `
    <div class="regression-diagnostics-lab">
      <div class="regression-model-tabs" data-role="models" aria-label="Regression models"></div>
      <div class="regression-diag-layout">
        <div class="regression-diag-main">
          <div class="python-ml-control" data-role="control"></div>
          <div class="regression-view-tabs" data-role="views" aria-label="Diagnostic views"></div>
          <div class="python-ml-chart-card">
            <div class="python-ml-chart-head"><strong data-role="chart-title"></strong><span>Synthetic browser reconstruction</span></div>
            <div class="python-ml-chart" data-role="chart" aria-live="polite"></div>
          </div>
          <div class="metric-grid python-ml-metrics" data-role="metrics"></div>
          <div class="analytics-callout" data-role="insight"></div>
        </div>
        <div class="python-code-card python-ml-code-card">
          <div class="python-code-card__head"><strong>Python</strong><span>scikit-learn + matplotlib</span></div>
          <pre><code data-role="code"></code></pre>
        </div>
      </div>
      ${config.runCommand ? `<div class="run-command"><strong>Повний runnable example:</strong> <code>${esc(config.runCommand)}</code></div>` : ''}
      ${config.note ? `<p class="microcopy">${esc(config.note)}</p>` : ''}
    </div>`;

  const modelHost = element.querySelector('[data-role="models"]');
  const control = element.querySelector('[data-role="control"]');
  const viewHost = element.querySelector('[data-role="views"]');
  const chart = element.querySelector('[data-role="chart"]');
  const chartTitle = element.querySelector('[data-role="chart-title"]');
  const metrics = element.querySelector('[data-role="metrics"]');
  const insight = element.querySelector('[data-role="insight"]');
  const code = element.querySelector('[data-role="code"]');

  function renderTabs() {
    modelHost.innerHTML = models.map(item => `<button type="button" class="python-ml-tab ${model === item.id ? 'is-active' : ''}" data-model="${item.id}">${esc(item.label)}</button>`).join('');
    modelHost.querySelectorAll('button').forEach(button => button.addEventListener('click', () => { model = button.dataset.model; render(); }));
    viewHost.innerHTML = views.map(item => `<button type="button" class="regression-view-tab ${view === item.id ? 'is-active' : ''}" data-view="${item.id}">${esc(item.label)}</button>`).join('');
    viewHost.querySelectorAll('button').forEach(button => button.addEventListener('click', () => { view = button.dataset.view; render(); }));
  }

  function renderControl() {
    if (model === 'tree') {
      control.innerHTML = `<label>max_depth <strong>${depth}</strong></label><input data-role="parameter" type="range" min="1" max="12" step="1" value="${depth}"><p>Збільшуйте глибину і стежте, як падає train error, а test error після оптимуму починає зростати.</p>`;
      control.querySelector('input').addEventListener('input', event => { depth = Number(event.target.value); render(); });
    } else if (model === 'ridge') {
      control.innerHTML = `<label>Ridge alpha <strong>${alpha.toFixed(1)}</strong></label><input data-role="parameter" type="range" min="0" max="100" step="5" value="${Math.round(alpha * 10)}"><p>Regularization зменшує величину коефіцієнтів; надмірний alpha може привести до underfitting.</p>`;
      control.querySelector('input').addEventListener('input', event => { alpha = Number(event.target.value) / 10; render(); });
    } else {
      control.innerHTML = `<label>Baseline model <strong>без tuning</strong></label><p>Linear Regression використовується як проста контрольна точка. Її треба перевершити на тому самому held-out test protocol.</p>`;
    }
  }

  function render() {
    renderTabs();
    renderControl();
    const points = testPoints();
    const predictions = points.map((point, index) => predict(model, point, index, depth, alpha));
    const m = regressionMetrics(points.map(p => p.actual), predictions);
    const trainMae = estimatedTrainMae(model, depth, alpha, m.mae);
    const gap = m.mae - trainMae;

    if (view === 'actual') {
      chartTitle.textContent = 'Actual vs predicted';
      chart.innerHTML = actualPredictedSvg(points.map(p => p.actual), predictions);
    } else if (view === 'residuals') {
      chartTitle.textContent = 'Residual diagnostics';
      chart.innerHTML = residualSvg(predictions, points.map((p, i) => p.actual - predictions[i]));
    } else {
      chartTitle.textContent = 'Decision Tree complexity: train/test MAE';
      chart.innerHTML = complexitySvg(depth);
    }

    metrics.innerHTML = metric('Train MAE', trainMae.toFixed(1)) + metric('Test MAE', m.mae.toFixed(1)) + metric('Test RMSE', m.rmse.toFixed(1)) + metric('R²', m.r2.toFixed(2));
    insight.innerHTML = `<strong>Інтерпретація:</strong> ${interpret(model, depth, alpha, gap, m)} ` +
      `${model === 'tree' ? 'Test не використовуйте для вибору max_depth у реальній роботі: tuning робиться на validation/CV, а test відкривається після фіксації кандидата.' : 'Порівнюйте моделі на однаковому split та доповнюйте середні метрики аналізом residuals і worst cases.'}`;
    code.textContent = pythonCode(model, depth, alpha);
  }

  render();
}

function testPoints() {
  return Array.from({length: 34}, (_, index) => {
    const x = index / 33;
    const actual = 28 + 105 * x + 24 * x * x + Math.sin(index * 1.41) * 7 + Math.cos(index * .47) * 3;
    return {x, actual};
  });
}

function predict(model, point, index, depth, alpha) {
  const x = point.x;
  if (model === 'linear') return 31 + 126 * x;
  if (model === 'ridge') {
    const shrink = clamp(alpha / 20, 0, .45);
    return 32 + (125 - 18 * shrink) * x + 8 * x * x;
  }
  const bins = Math.max(2, Math.round(2 + depth * .85));
  const bucket = Math.min(bins - 1, Math.floor(x * bins));
  const center = (bucket + .5) / bins;
  const base = 28 + 105 * center + 24 * center * center;
  const overfit = depth > 7 ? Math.sin(index * 2.7) * (depth - 7) * 1.5 : 0;
  return base + overfit;
}

function regressionMetrics(actual, predicted) {
  const errors = actual.map((value, i) => value - predicted[i]);
  const mae = mean(errors.map(Math.abs));
  const rmse = Math.sqrt(mean(errors.map(value => value ** 2)));
  const avg = mean(actual);
  const ssRes = errors.reduce((sum, value) => sum + value ** 2, 0);
  const ssTot = actual.reduce((sum, value) => sum + (value - avg) ** 2, 0);
  return {mae, rmse, r2: 1 - ssRes / Math.max(1e-9, ssTot)};
}

function estimatedTrainMae(model, depth, alpha, testMae) {
  if (model === 'linear') return testMae * .92;
  if (model === 'ridge') return testMae * (.94 + Math.min(alpha, 10) * .003);
  return clamp(17 - depth * 1.45, 1.8, 16);
}

function complexity(depth) {
  return Array.from({length: 12}, (_, i) => {
    const d = i + 1;
    const train = clamp(17 - d * 1.35, 2, 16);
    const test = 16.5 - Math.min(d, 5) * 1.45 + Math.max(0, d - 5) * 1.15;
    return {depth:d, train, test, current:d === depth};
  });
}

function interpret(model, depth, alpha, gap, m) {
  if (model === 'linear') return 'Linear Regression дає зрозумілий baseline, але систематична кривизна residuals може сигналізувати underfitting.';
  if (model === 'ridge') return alpha > 7 ? 'Сильна regularization спрощує модель; якщо помилка зростає, це ознака надмірного shrinkage.' : 'Ridge стабілізує linear baseline і корисний як регуляризована контрольна модель.';
  if (depth <= 2) return 'Неглибоке дерево має високі train і test errors — типовий underfitting.';
  if (depth <= 6) return 'Середня глибина дає кращий баланс bias/variance у цьому навчальному прикладі.';
  if (gap > 5 || depth >= 8) return 'Train error продовжує падати, але test error зростає — ознака overfitting.';
  return `Поточна модель має test MAE ${m.mae.toFixed(1)}; рішення потребує порівняння з baseline та предметною допустимою похибкою.`;
}

function pythonCode(model, depth, alpha) {
  if (model === 'linear') return `from sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score\n\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\ny_pred = model.predict(X_test)\n\nmae = mean_absolute_error(y_test, y_pred)\nrmse = mean_squared_error(y_test, y_pred) ** 0.5\nr2 = r2_score(y_test, y_pred)`;
  if (model === 'ridge') return `from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import Ridge\n\nmodel = make_pipeline(\n    StandardScaler(),\n    Ridge(alpha=${alpha.toFixed(1)})\n)\nmodel.fit(X_train, y_train)\ny_pred = model.predict(X_test)`;
  return `from sklearn.tree import DecisionTreeRegressor\n\n# Tune max_depth on validation/CV, not on held-out test.\nmodel = DecisionTreeRegressor(\n    max_depth=${depth},\n    min_samples_leaf=5,\n    random_state=42\n)\nmodel.fit(X_train, y_train)\ny_pred = model.predict(X_test)`;
}

function actualPredictedSvg(actual, predicted) {
  const all = [...actual, ...predicted];
  const min = Math.min(...all) - 8;
  const max = Math.max(...all) + 8;
  const f = frame(min, max, min, max);
  const dots = actual.map((value, i) => `<circle cx="${sx(value,f)}" cy="${sy(predicted[i],f)}" r="4.5" class="ml-point ml-point--single"/>`).join('');
  return svgWrap(`${grid(f)}<line x1="${sx(min,f)}" y1="${sy(min,f)}" x2="${sx(max,f)}" y2="${sy(max,f)}" class="ml-fit-line"/>${dots}`, 'Фактичний час, хв', 'Прогноз, хв');
}

function residualSvg(predicted, residuals) {
  const xmin = Math.min(...predicted) - 8;
  const xmax = Math.max(...predicted) + 8;
  const limit = Math.max(12, ...residuals.map(Math.abs)) + 4;
  const f = frame(xmin, xmax, -limit, limit);
  const dots = predicted.map((value, i) => `<circle cx="${sx(value,f)}" cy="${sy(residuals[i],f)}" r="4.5" class="ml-point ml-point--b"/>`).join('');
  return svgWrap(`${grid(f)}<line x1="${sx(xmin,f)}" y1="${sy(0,f)}" x2="${sx(xmax,f)}" y2="${sy(0,f)}" class="ml-boundary"/>${dots}`, 'Прогноз, хв', 'Residual = actual − predicted');
}

function complexitySvg(currentDepth) {
  const rows = complexity(currentDepth);
  const f = frame(1, 12, 0, 20);
  const trainPath = rows.map((p,i) => `${i ? 'L' : 'M'} ${sx(p.depth,f)} ${sy(p.train,f)}`).join(' ');
  const testPath = rows.map((p,i) => `${i ? 'L' : 'M'} ${sx(p.depth,f)} ${sy(p.test,f)}`).join(' ');
  const markers = rows.map(p => `<circle cx="${sx(p.depth,f)}" cy="${sy(p.test,f)}" r="${p.current ? 7 : 3.5}" class="${p.current ? 'ml-centroid' : 'ml-point ml-point--b'}"/>`).join('');
  return svgWrap(`${grid(f)}<path d="${trainPath}" class="regression-train-line"/><path d="${testPath}" class="regression-test-line"/>${markers}<g class="ml-legend"><text x="75" y="32">Train MAE</text><text x="180" y="32">Test MAE</text></g>`, 'max_depth', 'MAE');
}

function frame(xmin,xmax,ymin,ymax){return {xmin,xmax,ymin,ymax,left:58,right:568,top:28,bottom:318};}
function sx(x,f){return f.left+(x-f.xmin)/Math.max(1e-9,f.xmax-f.xmin)*(f.right-f.left);}
function sy(y,f){return f.bottom-(y-f.ymin)/Math.max(1e-9,f.ymax-f.ymin)*(f.bottom-f.top);}
function grid(f){let out='<g class="ml-grid">';for(let i=0;i<=5;i++){const x=f.left+i*(f.right-f.left)/5;const y=f.top+i*(f.bottom-f.top)/5;out+=`<line x1="${x}" y1="${f.top}" x2="${x}" y2="${f.bottom}"/><line x1="${f.left}" y1="${y}" x2="${f.right}" y2="${y}"/>`;}return out+'</g>';}
function svgWrap(body,xLabel,yLabel){return `<svg viewBox="0 0 620 360" role="img" aria-label="${esc(xLabel)} versus ${esc(yLabel)}">${body}<line x1="58" y1="318" x2="568" y2="318" class="ml-axis"/><line x1="58" y1="28" x2="58" y2="318" class="ml-axis"/><text x="313" y="350" text-anchor="middle" class="ml-axis-label">${esc(xLabel)}</text><text x="17" y="173" text-anchor="middle" transform="rotate(-90 17 173)" class="ml-axis-label">${esc(yLabel)}</text></svg>`;}
function metric(label,value){return `<div class="metric"><span class="metric__value metric__value--small">${esc(value)}</span><span class="metric__label">${esc(label)}</span></div>`;}
function mean(values){return values.reduce((sum,value)=>sum+value,0)/Math.max(1,values.length);}
