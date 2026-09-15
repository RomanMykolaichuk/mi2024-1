const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function mount(element, config) {
  const examples = Array.isArray(config.examples) ? config.examples : [];
  if (!examples.length) {
    element.innerHTML = '<div class="component-error" role="alert">Немає прикладів для Python ML lab.</div>';
    return;
  }

  let current = 0;
  element.innerHTML = `
    <div class="python-ml-lab">
      <div class="python-ml-tabs" role="tablist" aria-label="ML задачі" data-role="tabs"></div>
      <div data-role="example"></div>
    </div>`;

  const tabs = element.querySelector('[data-role="tabs"]');
  const exampleHost = element.querySelector('[data-role="example"]');

  function renderTabs() {
    tabs.innerHTML = examples.map((item, index) => `
      <button type="button" class="python-ml-tab ${index === current ? 'is-active' : ''}" role="tab" aria-selected="${index === current}" data-index="${index}">
        ${esc(item.short ?? item.title ?? item.kind)}
      </button>`).join('');
    tabs.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        current = Number(button.dataset.index);
        renderTabs();
        renderExample();
      });
    });
  }

  function renderExample() {
    const item = examples[current];
    const initial = Number(item.parameter?.value ?? defaultValue(item.kind));
    exampleHost.innerHTML = `
      <div class="python-ml-layout">
        <div class="python-ml-main">
          <div class="python-ml-context">
            <p class="eyebrow">${esc(item.kind?.toUpperCase())}</p>
            <h3>${esc(item.title)}</h3>
            <p>${esc(item.context)}</p>
          </div>
          <div class="python-ml-control">
            <label>${esc(item.parameter?.label ?? 'Параметр')} <strong data-role="parameter-value"></strong></label>
            <input data-role="parameter" type="range"
              min="${Number(item.parameter?.min ?? 1)}"
              max="${Number(item.parameter?.max ?? 100)}"
              step="${Number(item.parameter?.step ?? 1)}"
              value="${initial}">
            <p>${esc(item.parameter?.hint ?? '')}</p>
          </div>
          <div class="python-ml-chart-card">
            <div class="python-ml-chart-head">
              <strong>${esc(item.chartTitle ?? 'Результат')}</strong>
              <span>${esc(item.chartHint ?? 'Synthetic teaching data')}</span>
            </div>
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
    `;

    const slider = exampleHost.querySelector('[data-role="parameter"]');
    const value = exampleHost.querySelector('[data-role="parameter-value"]');
    const chart = exampleHost.querySelector('[data-role="chart"]');
    const metrics = exampleHost.querySelector('[data-role="metrics"]');
    const insight = exampleHost.querySelector('[data-role="insight"]');
    const code = exampleHost.querySelector('[data-role="code"]');

    const render = () => {
      const parameter = Number(slider.value);
      value.textContent = formatParameter(item.kind, parameter);
      if (item.kind === 'regression') renderRegression({chart, metrics, insight, code, parameter, item});
      else if (item.kind === 'classification') renderClassification({chart, metrics, insight, code, parameter, item});
      else renderClustering({chart, metrics, insight, code, parameter, item});
    };

    slider.addEventListener('input', render);
    render();
  }

  renderTabs();
  renderExample();
}

function renderRegression({chart, metrics, insight, code, parameter, item}) {
  const noise = parameter;
  const points = regressionPoints(noise);
  const {slope, intercept} = fitLine(points);
  const predictions = points.map(point => intercept + slope * point.x);
  const mae = mean(points.map((point, index) => Math.abs(point.y - predictions[index])));
  const yMean = mean(points.map(point => point.y));
  const ssRes = points.reduce((sum, point, index) => sum + (point.y - predictions[index]) ** 2, 0);
  const ssTot = points.reduce((sum, point) => sum + (point.y - yMean) ** 2, 0);
  const r2 = 1 - ssRes / Math.max(1e-9, ssTot);
  chart.innerHTML = scatterSvg(points, {
    line: {x1: 0, y1: intercept, x2: 10, y2: intercept + slope * 10},
    xLabel: 'Ознака X', yLabel: 'Числова ціль y'
  });
  metrics.innerHTML = metric('MAE', mae.toFixed(2)) + metric('R²', r2.toFixed(2)) + metric('Slope', slope.toFixed(2));
  insight.innerHTML = `<strong>Інтерпретація:</strong> ${noise <= 10 ? 'Малий шум дає майже лінійну залежність і високе R².' : noise <= 24 ? 'Зі зростанням шуму тренд зберігається, але похибка прогнозу збільшується.' : 'Високий шум послаблює зв’язок: навіть коректна модель не може пояснити всю варіативність даних.'}`;
  code.textContent = regressionCode(noise, item.randomState ?? 42);
}

function renderClassification({chart, metrics, insight, code, parameter, item}) {
  const threshold = parameter / 100;
  const points = classificationPoints();
  const scored = points.map(point => ({...point, score: sigmoid(point.x * 0.95 + point.y * 0.75 - 0.15)}));
  const predicted = scored.map(point => point.score >= threshold ? 1 : 0);
  let tp = 0, fp = 0, tn = 0, fn = 0;
  scored.forEach((point, index) => {
    const pred = predicted[index];
    if (point.label === 1 && pred === 1) tp += 1;
    else if (point.label === 0 && pred === 1) fp += 1;
    else if (point.label === 0 && pred === 0) tn += 1;
    else fn += 1;
  });
  const precision = tp / Math.max(1, tp + fp);
  const recall = tp / Math.max(1, tp + fn);
  const accuracy = (tp + tn) / scored.length;
  const logit = Math.log(threshold / Math.max(1e-9, 1 - threshold));
  chart.innerHTML = classificationSvg(scored, logit);
  metrics.innerHTML = metric('Accuracy', pct(accuracy)) + metric('Precision', pct(precision)) + metric('Recall', pct(recall)) + metric('FP / FN', `${fp} / ${fn}`);
  insight.innerHTML = `<strong>Інтерпретація:</strong> ${threshold < 0.4 ? 'Низький threshold збільшує recall, але створює більше false positives.' : threshold > 0.65 ? 'Високий threshold зменшує false positives, але збільшує false negatives.' : 'Поріг близький до збалансованого, але його треба обирати за вартістю FP/FN, а не за звичкою використовувати 0.5.'}`;
  code.textContent = classificationCode(threshold, item.randomState ?? 42);
}

function renderClustering({chart, metrics, insight, code, parameter, item}) {
  const k = Math.round(parameter);
  const points = clusteringPoints();
  const centroids = initialCentroids(points, k);
  for (let iteration = 0; iteration < 7; iteration += 1) {
    const groups = assignClusters(points, centroids);
    for (let index = 0; index < k; index += 1) {
      const cluster = points.filter((_, pointIndex) => groups[pointIndex] === index);
      if (cluster.length) {
        centroids[index] = {x: mean(cluster.map(point => point.x)), y: mean(cluster.map(point => point.y))};
      }
    }
  }
  const groups = assignClusters(points, centroids);
  const inertia = points.reduce((sum, point, index) => sum + squaredDistance(point, centroids[groups[index]]), 0);
  const counts = Array.from({length: k}, (_, index) => groups.filter(group => group === index).length);
  chart.innerHTML = clusteringSvg(points, groups, centroids);
  metrics.innerHTML = metric('k', String(k)) + metric('Inertia', inertia.toFixed(1)) + metric('Найменший кластер', String(Math.min(...counts))) + metric('Найбільший кластер', String(Math.max(...counts)));
  insight.innerHTML = `<strong>Інтерпретація:</strong> ${k < 3 ? 'За малого k природні групи зливаються: модель спрощує структуру.' : k === 3 ? 'k=3 добре відповідає синтетичній структурі цього прикладу; це не означає, що 3 завжди є правильним числом кластерів.' : 'Завелике k дробить природні групи. Потрібні elbow/silhouette та предметна інтерпретація кластерів.'}`;
  code.textContent = clusteringCode(k, item.randomState ?? 42);
}

function regressionPoints(noise) {
  return Array.from({length: 24}, (_, index) => {
    const x = index * (10 / 23);
    const wave = Math.sin(index * 1.73) * noise * 0.16 + Math.cos(index * 0.61) * noise * 0.11;
    return {x, y: 8 + 3.1 * x + wave};
  });
}

function classificationPoints() {
  const a = [[-2.7,-1.8],[-2.2,-1.1],[-1.9,-2.4],[-1.5,-0.8],[-1.1,-1.7],[-0.8,-0.5],[-0.5,-1.4],[0.1,-0.8],[0.4,-1.1],[-1.0,0.2],[-0.2,0.3],[0.5,-0.2]];
  const b = [[0.2,1.0],[0.7,0.7],[0.9,1.6],[1.2,0.3],[1.5,1.1],[1.8,0.8],[2.1,1.6],[2.4,0.5],[2.8,1.3],[1.1,2.2],[0.3,2.0],[2.0,2.4]];
  return [...a.map(([x,y]) => ({x,y,label:0})), ...b.map(([x,y]) => ({x,y,label:1}))];
}

function clusteringPoints() {
  const base = [
    [-2.8,-1.8],[-2.4,-1.2],[-2.0,-2.2],[-1.7,-1.4],[-2.2,-0.7],[-1.4,-2.0],[-1.2,-1.0],
    [2.0,-1.5],[2.5,-1.0],[1.7,-0.7],[2.8,-0.4],[1.4,-1.8],[3.1,-1.4],[2.2,-2.2],
    [-0.5,2.0],[0.1,2.4],[0.5,1.7],[-0.9,1.4],[0.9,2.7],[-0.1,3.0],[-1.2,2.6]
  ];
  return base.map(([x,y]) => ({x,y}));
}

function fitLine(points) {
  const xMean = mean(points.map(point => point.x));
  const yMean = mean(points.map(point => point.y));
  const numerator = points.reduce((sum, point) => sum + (point.x - xMean) * (point.y - yMean), 0);
  const denominator = points.reduce((sum, point) => sum + (point.x - xMean) ** 2, 0);
  const slope = numerator / Math.max(1e-9, denominator);
  return {slope, intercept: yMean - slope * xMean};
}

function assignClusters(points, centroids) {
  return points.map(point => centroids.reduce((bestIndex, centroid, index) => {
    return squaredDistance(point, centroid) < squaredDistance(point, centroids[bestIndex]) ? index : bestIndex;
  }, 0));
}

function initialCentroids(points, k) {
  const seeds = [0, 7, 14, 4, 18];
  return Array.from({length: k}, (_, index) => ({...points[seeds[index % seeds.length]]}));
}

function squaredDistance(a, b) { return (a.x - b.x) ** 2 + (a.y - b.y) ** 2; }
function mean(values) { return values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length); }
function sigmoid(value) { return 1 / (1 + Math.exp(-value)); }
function pct(value) { return `${Math.round(value * 100)}%`; }
function metric(label, value) { return `<div class="metric"><span class="metric__value metric__value--small">${esc(value)}</span><span class="metric__label">${esc(label)}</span></div>`; }
function defaultValue(kind) { return kind === 'classification' ? 50 : kind === 'clustering' ? 3 : 14; }
function formatParameter(kind, value) { return kind === 'classification' ? (value / 100).toFixed(2) : String(Math.round(value)); }

function scatterSvg(points, {line, xLabel, yLabel}) {
  const frame = getFrame(points, [line ? {x: line.x1, y: line.y1} : null, line ? {x: line.x2, y: line.y2} : null].filter(Boolean));
  const dots = points.map(point => `<circle cx="${sx(point.x, frame)}" cy="${sy(point.y, frame)}" r="5" class="ml-point ml-point--single"/>`).join('');
  const lineSvg = line ? `<line x1="${sx(line.x1, frame)}" y1="${sy(line.y1, frame)}" x2="${sx(line.x2, frame)}" y2="${sy(line.y2, frame)}" class="ml-fit-line"/>` : '';
  return svgWrap(`${grid(frame)}${lineSvg}${dots}`, xLabel, yLabel);
}

function classificationSvg(points, logit) {
  const frame = {xmin:-3.2,xmax:3.3,ymin:-2.8,ymax:3.0};
  const dots = points.map(point => `<circle cx="${sx(point.x, frame)}" cy="${sy(point.y, frame)}" r="5.5" class="ml-point ${point.label ? 'ml-point--b' : 'ml-point--a'}"/>`).join('');
  const x1 = frame.xmin;
  const x2 = frame.xmax;
  const y1 = (logit + 0.15 - 0.95 * x1) / 0.75;
  const y2 = (logit + 0.15 - 0.95 * x2) / 0.75;
  const boundary = `<line x1="${sx(x1, frame)}" y1="${sy(y1, frame)}" x2="${sx(x2, frame)}" y2="${sy(y2, frame)}" class="ml-boundary"/>`;
  const legend = `<g class="ml-legend"><circle cx="72" cy="26" r="5" class="ml-point ml-point--a"/><text x="84" y="30">Class 0</text><circle cx="160" cy="26" r="5" class="ml-point ml-point--b"/><text x="172" y="30">Class 1</text></g>`;
  return svgWrap(`${grid(frame)}${boundary}${dots}${legend}`, 'Ознака X1', 'Ознака X2');
}

function clusteringSvg(points, groups, centroids) {
  const frame = {xmin:-3.5,xmax:3.6,ymin:-2.8,ymax:3.5};
  const dots = points.map((point, index) => `<circle cx="${sx(point.x, frame)}" cy="${sy(point.y, frame)}" r="5" class="ml-cluster ml-cluster--${groups[index] % 5}"/>`).join('');
  const centers = centroids.map((point, index) => `<g><circle cx="${sx(point.x, frame)}" cy="${sy(point.y, frame)}" r="10" class="ml-centroid ml-cluster--${index % 5}"/><text x="${sx(point.x, frame)}" y="${sy(point.y, frame) + 4}" text-anchor="middle" class="ml-centroid-label">${index + 1}</text></g>`).join('');
  return svgWrap(`${grid(frame)}${dots}${centers}`, 'Ознака X1', 'Ознака X2');
}

function getFrame(points, extras = []) {
  const all = [...points, ...extras];
  const xs = all.map(point => point.x);
  const ys = all.map(point => point.y);
  const xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys), ymax = Math.max(...ys);
  const xpad = Math.max(0.5, (xmax - xmin) * 0.08);
  const ypad = Math.max(0.5, (ymax - ymin) * 0.12);
  return {xmin:xmin-xpad,xmax:xmax+xpad,ymin:ymin-ypad,ymax:ymax+ypad};
}

function sx(value, frame) { return 54 + (value - frame.xmin) / (frame.xmax - frame.xmin) * 542; }
function sy(value, frame) { return 292 - (value - frame.ymin) / (frame.ymax - frame.ymin) * 242; }
function grid() {
  const horizontal = Array.from({length:5}, (_, index) => 50 + index * 60.5).map(y => `<line x1="54" y1="${y}" x2="596" y2="${y}"/>`).join('');
  const vertical = Array.from({length:6}, (_, index) => 54 + index * 108.4).map(x => `<line x1="${x}" y1="50" x2="${x}" y2="292"/>`).join('');
  return `<g class="ml-grid">${horizontal}${vertical}</g><line x1="54" y1="292" x2="596" y2="292" class="ml-axis"/><line x1="54" y1="50" x2="54" y2="292" class="ml-axis"/>`;
}
function svgWrap(content, xLabel, yLabel) {
  return `<svg viewBox="0 0 650 330" role="img" aria-label="Інтерактивний ML графік">${content}<text x="325" y="322" text-anchor="middle" class="ml-axis-label">${esc(xLabel)}</text><text x="16" y="172" text-anchor="middle" transform="rotate(-90 16 172)" class="ml-axis-label">${esc(yLabel)}</text></svg>`;
}

function regressionCode(noise, randomState) {
  return `import matplotlib.pyplot as plt\nfrom sklearn.datasets import make_regression\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_absolute_error, r2_score\n\nX, y = make_regression(\n    n_samples=120, n_features=1,\n    noise=${noise}, random_state=${randomState}\n)\n\nmodel = LinearRegression()\nmodel.fit(X, y)\ny_pred = model.predict(X)\n\nprint("MAE:", mean_absolute_error(y, y_pred))\nprint("R2:", r2_score(y, y_pred))\n\norder = X[:, 0].argsort()\nplt.scatter(X[:, 0], y, alpha=0.65)\nplt.plot(X[order, 0], y_pred[order])\nplt.xlabel("Feature X")\nplt.ylabel("Target y")\nplt.title("Regression: observations and fitted line")\nplt.show()`;
}

function classificationCode(threshold, randomState) {
  return `import matplotlib.pyplot as plt\nfrom sklearn.datasets import make_classification\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score, precision_score, recall_score\n\nX, y = make_classification(\n    n_samples=300, n_features=2, n_redundant=0,\n    class_sep=1.2, random_state=${randomState}\n)\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.30, stratify=y, random_state=${randomState}\n)\n\nmodel = LogisticRegression()\nmodel.fit(X_train, y_train)\nprob = model.predict_proba(X_test)[:, 1]\nthreshold = ${threshold.toFixed(2)}\ny_pred = (prob >= threshold).astype(int)\n\nprint("accuracy:", accuracy_score(y_test, y_pred))\nprint("precision:", precision_score(y_test, y_pred))\nprint("recall:", recall_score(y_test, y_pred))\n\nplt.scatter(X_test[:, 0], X_test[:, 1], c=y_pred)\nplt.xlabel("Feature X1")\nplt.ylabel("Feature X2")\nplt.title(f"Classification, threshold={threshold:.2f}")\nplt.show()`;
}

function clusteringCode(k, randomState) {
  return `import matplotlib.pyplot as plt\nfrom sklearn.cluster import KMeans\nfrom sklearn.datasets import make_blobs\n\nX, _ = make_blobs(\n    n_samples=240, centers=3, cluster_std=0.75,\n    random_state=${randomState}\n)\n\nk = ${k}\nmodel = KMeans(n_clusters=k, n_init="auto", random_state=${randomState})\nlabels = model.fit_predict(X)\n\nprint("inertia:", model.inertia_)\n\nplt.scatter(X[:, 0], X[:, 1], c=labels, alpha=0.7)\nplt.scatter(\n    model.cluster_centers_[:, 0], model.cluster_centers_[:, 1],\n    marker="X", s=180, edgecolor="black"\n)\nplt.xlabel("Feature X1")\nplt.ylabel("Feature X2")\nplt.title(f"KMeans clustering, k={k}")\nplt.show()`;
}
