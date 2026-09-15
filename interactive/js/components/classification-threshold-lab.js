const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function mount(element, config) {
  const base = config.base ?? {positives: 40, negatives: 160};
  let threshold = Number(config.threshold ?? 0.50);
  let fnCost = Number(config.fnCost ?? 8);
  const fpCost = Number(config.fpCost ?? 1);
  let frozen = null;
  let testRevealed = false;

  element.innerHTML = `
    <div class="classification-threshold-lab">
      <div class="classification-threshold-layout">
        <div class="classification-threshold-main">
          <div class="threshold-control-grid">
            <div class="python-ml-control">
              <label>Decision threshold <strong data-role="threshold-value"></strong></label>
              <input data-role="threshold" type="range" min="20" max="80" step="1" value="${Math.round(threshold * 100)}">
              <p>Поріг перетворює probability score на class/action. Його обирають на validation evidence, не на held-out test.</p>
            </div>
            <div class="python-ml-control">
              <label>Ціна false negative <strong data-role="fn-cost-value"></strong>× FP</label>
              <input data-role="fn-cost" type="range" min="1" max="12" step="1" value="${fnCost}">
              <p>Зміна вартості помилки змінює доречний operating point навіть для тієї самої моделі.</p>
            </div>
          </div>

          <div class="python-ml-chart-card">
            <div class="python-ml-chart-head"><strong>Validation threshold trade-off</strong><span>precision · recall · F1</span></div>
            <div class="python-ml-chart" data-role="curve"></div>
          </div>

          <div class="threshold-summary" data-role="summary"></div>
          <div class="confusion-grid threshold-confusion" data-role="matrix"></div>
          <div class="metric-grid python-ml-metrics" data-role="metrics"></div>
          <div class="cv-test-gate" data-role="test-gate"></div>
          <div class="analytics-callout" data-role="insight"></div>
        </div>

        <div class="python-code-card python-ml-code-card">
          <div class="python-code-card__head"><strong>Python</strong><span>LogisticRegression + validation threshold</span></div>
          <pre><code data-role="code"></code></pre>
        </div>
      </div>
      ${config.runCommand ? `<div class="run-command"><strong>Повний runnable example:</strong> <code>${esc(config.runCommand)}</code></div>` : ''}
      ${config.note ? `<p class="microcopy">${esc(config.note)}</p>` : ''}
    </div>`;

  const thresholdInput = element.querySelector('[data-role="threshold"]');
  const fnCostInput = element.querySelector('[data-role="fn-cost"]');
  const thresholdValue = element.querySelector('[data-role="threshold-value"]');
  const fnCostValue = element.querySelector('[data-role="fn-cost-value"]');
  const curve = element.querySelector('[data-role="curve"]');
  const summary = element.querySelector('[data-role="summary"]');
  const matrix = element.querySelector('[data-role="matrix"]');
  const metrics = element.querySelector('[data-role="metrics"]');
  const testGate = element.querySelector('[data-role="test-gate"]');
  const insight = element.querySelector('[data-role="insight"]');
  const code = element.querySelector('[data-role="code"]');

  function invalidateTest() {
    frozen = null;
    testRevealed = false;
  }

  thresholdInput.addEventListener('input', event => {
    threshold = Number(event.target.value) / 100;
    invalidateTest();
    render();
  });

  fnCostInput.addEventListener('input', event => {
    fnCost = Number(event.target.value);
    invalidateTest();
    render();
  });

  function render() {
    thresholdValue.textContent = threshold.toFixed(2);
    fnCostValue.textContent = fnCost;

    const rows = thresholdRows(base, fnCost, fpCost);
    const current = classificationStats(threshold, base, fnCost, fpCost, 'validation');
    const best = rows.reduce((winner, row) => {
      if (row.cost < winner.cost) return row;
      if (row.cost === winner.cost && row.f1 > winner.f1) return row;
      return winner;
    }, rows[0]);

    curve.innerHTML = curveSvg(rows, threshold, best.threshold);
    summary.innerHTML = `
      <div><span>Validation candidate</span><strong>${threshold.toFixed(2)}</strong></div>
      <div><span>Lowest weighted cost</span><strong>${best.threshold.toFixed(2)}</strong></div>
      <div><span>Current cost</span><strong>${current.cost}</strong></div>
      <div><span>Best validation cost</span><strong>${best.cost}</strong></div>`;

    matrix.innerHTML = confusionMatrix(current);
    metrics.innerHTML = metric('Accuracy', pct(current.accuracy)) +
      metric('Precision', pct(current.precision)) +
      metric('Recall', pct(current.recall)) +
      metric('F1', pct(current.f1));

    renderTestGate(current, best);
    insight.innerHTML = `<strong>Інтерпретація:</strong> ${interpret(current, best, threshold, fnCost)} ` +
      `Weighted cost = FP×${fpCost} + FN×${fnCost}; це decision objective, а не універсальна ML-метрика.`;
    code.textContent = pythonCode(threshold, fnCost, fpCost);
  }

  function renderTestGate(current, best) {
    if (!testRevealed) {
      testGate.innerHTML = `
        <div>
          <strong>Held-out test приховано</strong>
          <p>Поріг спочатку обирається на validation set. Після freeze operating point test можна відкрити один раз.</p>
        </div>
        <button type="button" data-role="reveal">Freeze threshold & reveal test</button>`;
      testGate.querySelector('button').addEventListener('click', () => {
        frozen = {threshold, fnCost, fpCost};
        testRevealed = true;
        render();
      });
      return;
    }

    const test = classificationStats(frozen.threshold, base, frozen.fnCost, frozen.fpCost, 'test');
    const choiceNote = Math.abs(frozen.threshold - best.threshold) <= 0.051
      ? 'Frozen threshold близький до validation cost optimum.'
      : `Frozen threshold=${frozen.threshold.toFixed(2)}, тоді як validation cost optimum ≈ ${best.threshold.toFixed(2)}.`;
    testGate.innerHTML = `
      <div>
        <strong>Frozen operating point: threshold=${frozen.threshold.toFixed(2)}</strong>
        <p>${esc(choiceNote)} Test лише оцінює вже прийняте рішення.</p>
        <div class="threshold-test-matrix">${confusionMatrix(test)}</div>
      </div>
      <div class="cv-test-score">
        <span>Test F1</span><strong>${pct(test.f1)}</strong>
        <span>Weighted cost</span><strong>${test.cost}</strong>
      </div>`;
  }

  render();
}

function thresholdRows(base, fnCost, fpCost) {
  const rows = [];
  for (let value = 20; value <= 80; value += 5) {
    rows.push(classificationStats(value / 100, base, fnCost, fpCost, 'validation'));
  }
  return rows;
}

function classificationStats(threshold, base, fnCost, fpCost, split) {
  const shift = split === 'test' ? 0.025 : 0;
  const recall = clamp(1.04 - threshold * 0.54 - shift, 0.43, 0.95);
  const fpr = clamp(0.25 - threshold * 0.23 + shift * 0.45, 0.025, 0.22);
  const tp = Math.round(base.positives * recall);
  const fn = base.positives - tp;
  const fp = Math.round(base.negatives * fpr);
  const tn = base.negatives - fp;
  const precision = tp / Math.max(1, tp + fp);
  const actualRecall = tp / Math.max(1, tp + fn);
  const f1 = 2 * precision * actualRecall / Math.max(0.0001, precision + actualRecall);
  const accuracy = (tp + tn) / Math.max(1, base.positives + base.negatives);
  const cost = fp * fpCost + fn * fnCost;
  return {threshold, tp, fp, fn, tn, precision, recall: actualRecall, f1, accuracy, cost};
}

function interpret(current, best, threshold, fnCost) {
  if (threshold < best.threshold - 0.06) return 'Поріг нижчий за validation cost optimum: recall зростає, але збільшується навантаження false positives.';
  if (threshold > best.threshold + 0.06) return 'Поріг вищий за validation cost optimum: precision може зрости, але дорожчі false negatives накопичуються.';
  if (fnCost >= 7) return 'За високої ціни false negative validation evidence підтримує recall-oriented operating point.';
  return 'Поточний поріг близький до мінімуму заданої validation cost function; його все одно треба зафіксувати до test.';
}

function pythonCode(threshold, fnCost, fpCost) {
  return `import numpy as np\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score\n\n# 1) Create three roles: train / validation / held-out test.\nX_train, X_hold, y_train, y_hold = train_test_split(\n    X, y, test_size=0.40, stratify=y, random_state=42\n)\nX_val, X_test, y_val, y_test = train_test_split(\n    X_hold, y_hold, test_size=0.50, stratify=y_hold, random_state=42\n)\n\n# 2) Fit model only on train.\nmodel = make_pipeline(\n    StandardScaler(),\n    LogisticRegression(max_iter=2000, random_state=42)\n)\nmodel.fit(X_train, y_train)\n\n# 3) Select threshold on validation evidence only.\nval_prob = model.predict_proba(X_val)[:, 1]\nfn_cost, fp_cost = ${fnCost}, ${fpCost}\nrows = []\nfor threshold in np.arange(0.20, 0.81, 0.05):\n    pred = (val_prob >= threshold).astype(int)\n    tn, fp, fn, tp = confusion_matrix(y_val, pred).ravel()\n    cost = fp * fp_cost + fn * fn_cost\n    rows.append((cost, -f1_score(y_val, pred), threshold))\n\n_, _, selected_threshold = min(rows)\nprint('validation threshold:', selected_threshold)\n\n# Browser-selected threshold for discussion: ${threshold.toFixed(2)}\n\n# 4) Freeze threshold, then open held-out test once.\ntest_prob = model.predict_proba(X_test)[:, 1]\ntest_pred = (test_prob >= selected_threshold).astype(int)\nprint(confusion_matrix(y_test, test_pred))\nprint('precision', precision_score(y_test, test_pred))\nprint('recall', recall_score(y_test, test_pred))\nprint('f1', f1_score(y_test, test_pred))`;
}

function curveSvg(rows, currentThreshold, bestThreshold) {
  const f = {xmin:0.20,xmax:0.80,ymin:0.30,ymax:1.0,left:58,right:568,top:30,bottom:318};
  const precisionPath = rows.map((row, index) => `${index ? 'L' : 'M'} ${sx(row.threshold,f)} ${sy(row.precision,f)}`).join(' ');
  const recallPath = rows.map((row, index) => `${index ? 'L' : 'M'} ${sx(row.threshold,f)} ${sy(row.recall,f)}`).join(' ');
  const f1Path = rows.map((row, index) => `${index ? 'L' : 'M'} ${sx(row.threshold,f)} ${sy(row.f1,f)}`).join(' ');
  let grid = '<g class="ml-grid">';
  for (let i = 0; i <= 5; i += 1) {
    const x = f.left + i * (f.right - f.left) / 5;
    const y = f.top + i * (f.bottom - f.top) / 5;
    grid += `<line x1="${x}" y1="${f.top}" x2="${x}" y2="${f.bottom}"/><line x1="${f.left}" y1="${y}" x2="${f.right}" y2="${y}"/>`;
  }
  grid += '</g>';
  const currentX = sx(currentThreshold, f);
  const bestX = sx(bestThreshold, f);
  return `<svg viewBox="0 0 620 370" role="img" aria-label="Precision recall and F1 by decision threshold">
    ${grid}
    <line x1="${f.left}" y1="${f.bottom}" x2="${f.right}" y2="${f.bottom}" class="ml-axis"/>
    <line x1="${f.left}" y1="${f.top}" x2="${f.left}" y2="${f.bottom}" class="ml-axis"/>
    <path d="${precisionPath}" class="threshold-precision-line"/>
    <path d="${recallPath}" class="threshold-recall-line"/>
    <path d="${f1Path}" class="threshold-f1-line"/>
    <line x1="${currentX}" y1="${f.top}" x2="${currentX}" y2="${f.bottom}" class="threshold-current-line"/>
    <line x1="${bestX}" y1="${f.top}" x2="${bestX}" y2="${f.bottom}" class="threshold-best-line"/>
    <text x="310" y="354" text-anchor="middle" class="ml-axis-label">decision threshold</text>
    <text x="18" y="176" transform="rotate(-90 18 176)" text-anchor="middle" class="ml-axis-label">metric</text>
    <g class="ml-legend"><text x="76" y="22">Precision</text><text x="154" y="22">Recall</text><text x="216" y="22">F1</text><text x="258" y="22">current / best-cost</text></g>
  </svg>`;
}

function confusionMatrix(stats) {
  return `<div class="confusion-cell"><span>TP</span><strong>${stats.tp}</strong></div>` +
    `<div class="confusion-cell is-warning"><span>FP</span><strong>${stats.fp}</strong></div>` +
    `<div class="confusion-cell is-danger"><span>FN</span><strong>${stats.fn}</strong></div>` +
    `<div class="confusion-cell"><span>TN</span><strong>${stats.tn}</strong></div>`;
}

function sx(value, f) { return f.left + (value - f.xmin) / (f.xmax - f.xmin) * (f.right - f.left); }
function sy(value, f) { return f.bottom - (value - f.ymin) / (f.ymax - f.ymin) * (f.bottom - f.top); }
function metric(label, value) { return `<div class="metric"><span class="metric__value metric__value--small">${esc(value)}</span><span class="metric__label">${esc(label)}</span></div>`; }
function pct(value) { return `${(value * 100).toFixed(1)}%`; }
