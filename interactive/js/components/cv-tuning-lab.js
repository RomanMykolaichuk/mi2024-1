const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function mount(element, config) {
  let depth = Number(config.depth ?? 5);
  let folds = Number(config.folds ?? 5);
  let scoring = config.scoring ?? 'f1_macro';
  let testRevealed = false;
  let frozen = null;

  element.innerHTML = `
    <div class="cv-tuning-lab">
      <div class="cv-tuning-layout">
        <div class="cv-tuning-main">
          <div class="cv-controls">
            <div class="python-ml-control">
              <label>max_depth <strong data-role="depth-value"></strong></label>
              <input data-role="depth" type="range" min="1" max="12" step="1" value="${depth}">
              <p>Гіперпараметр змінює складність моделі. Candidate обираємо за CV, а не за test.</p>
            </div>
            <div class="cv-select-grid">
              <label>CV folds
                <select data-role="folds">
                  ${[3,5,7].map(value => `<option value="${value}" ${value === folds ? 'selected' : ''}>${value}</option>`).join('')}
                </select>
              </label>
              <label>Scoring
                <select data-role="scoring">
                  <option value="accuracy" ${scoring === 'accuracy' ? 'selected' : ''}>accuracy</option>
                  <option value="f1_macro" ${scoring === 'f1_macro' ? 'selected' : ''}>f1_macro</option>
                </select>
              </label>
            </div>
          </div>

          <div class="python-ml-chart-card">
            <div class="python-ml-chart-head"><strong>Train vs cross-validation</strong><span>synthetic teaching reconstruction</span></div>
            <div class="python-ml-chart" data-role="curve"></div>
          </div>

          <div class="metric-grid python-ml-metrics" data-role="metrics"></div>
          <div class="cv-test-gate" data-role="test-gate"></div>
          <div class="analytics-callout" data-role="insight"></div>
        </div>

        <div class="python-code-card python-ml-code-card">
          <div class="python-code-card__head"><strong>Python</strong><span>GridSearchCV + StratifiedKFold</span></div>
          <pre><code data-role="code"></code></pre>
        </div>
      </div>
      ${config.runCommand ? `<div class="run-command"><strong>Повний runnable example:</strong> <code>${esc(config.runCommand)}</code></div>` : ''}
      ${config.note ? `<p class="microcopy">${esc(config.note)}</p>` : ''}
    </div>`;

  const depthInput = element.querySelector('[data-role="depth"]');
  const depthValue = element.querySelector('[data-role="depth-value"]');
  const foldsSelect = element.querySelector('[data-role="folds"]');
  const scoringSelect = element.querySelector('[data-role="scoring"]');
  const curve = element.querySelector('[data-role="curve"]');
  const metrics = element.querySelector('[data-role="metrics"]');
  const testGate = element.querySelector('[data-role="test-gate"]');
  const insight = element.querySelector('[data-role="insight"]');
  const code = element.querySelector('[data-role="code"]');

  function invalidateTest() {
    testRevealed = false;
    frozen = null;
  }

  depthInput.addEventListener('input', event => {
    depth = Number(event.target.value);
    invalidateTest();
    render();
  });
  foldsSelect.addEventListener('change', event => {
    folds = Number(event.target.value);
    invalidateTest();
    render();
  });
  scoringSelect.addEventListener('change', event => {
    scoring = event.target.value;
    invalidateTest();
    render();
  });

  function render() {
    depthValue.textContent = depth;
    const rows = curveRows(scoring, folds);
    const current = rows.find(row => row.depth === depth);
    const best = rows.reduce((winner, row) => row.cv > winner.cv ? row : winner, rows[0]);
    curve.innerHTML = curveSvg(rows, depth, best.depth);

    metrics.innerHTML = metric('Train', pct(current.train)) +
      metric('CV mean', pct(current.cv)) +
      metric('CV std', `±${(current.std * 100).toFixed(1)} pp`) +
      metric('Gap', `${((current.train - current.cv) * 100).toFixed(1)} pp`);

    renderTestGate(current, best);
    insight.innerHTML = `<strong>Інтерпретація:</strong> ${interpret(current, best)} ` +
      `Поточний найкращий CV candidate: max_depth=${best.depth}. ${folds}-fold CV оцінює стабільність лише всередині training pool.`;
    code.textContent = pythonCode(depth, folds, scoring);
  }

  function renderTestGate(current, best) {
    if (!testRevealed) {
      testGate.innerHTML = `
        <div>
          <strong>Held-out test приховано</strong>
          <p>Спочатку оберіть candidate за CV. Test не повинен впливати на model selection.</p>
        </div>
        <button type="button" data-role="reveal">Freeze candidate & reveal test</button>`;
      testGate.querySelector('button').addEventListener('click', () => {
        frozen = {depth, scoring, folds, cv: current.cv};
        testRevealed = true;
        render();
      });
      return;
    }

    const test = syntheticTestScore(frozen.depth, frozen.scoring);
    const verdict = frozen.depth === best.depth
      ? 'Candidate узгоджується з найкращим CV у поточній реконструкції.'
      : `Ви зафіксували depth=${frozen.depth}, хоча найкращий CV зараз має depth=${best.depth}. Це допустимо лише за додаткових constraints.`;
    testGate.innerHTML = `
      <div>
        <strong>Frozen candidate: max_depth=${frozen.depth}</strong>
        <p>${esc(verdict)}</p>
      </div>
      <div class="cv-test-score"><span>Test ${esc(frozen.scoring)}</span><strong>${pct(test)}</strong></div>`;
  }

  render();
}

function curveRows(scoring, folds) {
  const foldStability = folds === 3 ? 0.012 : folds === 5 ? 0.007 : 0.004;
  return Array.from({length: 12}, (_, index) => {
    const depth = index + 1;
    const train = clamp(0.72 + depth * 0.023, 0.73, 0.995);
    const basePeak = scoring === 'accuracy' ? 0.878 : 0.842;
    const distance = Math.abs(depth - 6);
    const cv = clamp(basePeak - distance * 0.013 - Math.max(0, depth - 7) * 0.012 + (folds - 5) * 0.0015, 0.66, 0.9);
    const std = clamp(0.035 - Math.min(depth, 6) * 0.002 + foldStability, 0.012, 0.05);
    return {depth, train, cv, std};
  });
}

function syntheticTestScore(depth, scoring) {
  const peak = scoring === 'accuracy' ? 0.868 : 0.833;
  return clamp(peak - Math.abs(depth - 6) * 0.011 - Math.max(0, depth - 8) * 0.009, 0.65, 0.9);
}

function interpret(current, best) {
  const gap = current.train - current.cv;
  if (current.depth <= 2) return 'Train і CV ще невисокі — модель, ймовірно, недонавчається.';
  if (current.depth === best.depth) return 'CV досягає локального максимуму: це сильний candidate для freeze перед фінальним test.';
  if (gap > 0.12 || current.depth >= 9) return 'Train продовжує зростати, а CV погіршується — типова картина overfitting.';
  return 'Модель знаходиться між underfitting та overfitting; рішення слід приймати за CV mean/std і прикладними constraints.';
}

function pythonCode(depth, folds, scoring) {
  return `from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import classification_report\n\n# 1) Isolate held-out test BEFORE tuning.\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.20, stratify=y, random_state=42\n)\n\n# 2) Tune only inside the training pool.\ncv = StratifiedKFold(n_splits=${folds}, shuffle=True, random_state=42)\nparam_grid = {\n    'max_depth': [2, 4, 6, 8, 10, 12],\n    'min_samples_leaf': [1, 3, 6]\n}\nsearch = GridSearchCV(\n    RandomForestClassifier(n_estimators=80, random_state=42),\n    param_grid=param_grid,\n    scoring='${scoring}',\n    cv=cv,\n    n_jobs=-1\n)\nsearch.fit(X_train, y_train)\n\n# Browser-selected candidate for discussion: max_depth=${depth}\nprint(search.best_params_, search.best_score_)\n\n# 3) Open test only after the candidate/pipeline is fixed.\ny_pred = search.best_estimator_.predict(X_test)\nprint(classification_report(y_test, y_pred))`;
}

function curveSvg(rows, currentDepth, bestDepth) {
  const f = {xmin:1,xmax:12,ymin:0.62,ymax:1,left:58,right:568,top:30,bottom:318};
  const trainPath = rows.map((row, index) => `${index ? 'L' : 'M'} ${sx(row.depth,f)} ${sy(row.train,f)}`).join(' ');
  const cvPath = rows.map((row, index) => `${index ? 'L' : 'M'} ${sx(row.depth,f)} ${sy(row.cv,f)}`).join(' ');
  const band = rows.map(row => `${sx(row.depth,f)},${sy(row.cv + row.std,f)}`).join(' ') + ' ' + rows.slice().reverse().map(row => `${sx(row.depth,f)},${sy(row.cv - row.std,f)}`).join(' ');
  const markers = rows.map(row => `<circle cx="${sx(row.depth,f)}" cy="${sy(row.cv,f)}" r="${row.depth === currentDepth ? 7 : 3.5}" class="${row.depth === bestDepth ? 'cv-best-point' : 'ml-point ml-point--b'}"/>`).join('');
  let grid = '<g class="ml-grid">';
  for (let i = 0; i <= 5; i += 1) {
    const x = f.left + i * (f.right - f.left) / 5;
    const y = f.top + i * (f.bottom - f.top) / 5;
    grid += `<line x1="${x}" y1="${f.top}" x2="${x}" y2="${f.bottom}"/><line x1="${f.left}" y1="${y}" x2="${f.right}" y2="${y}"/>`;
  }
  grid += '</g>';
  return `<svg viewBox="0 0 620 370" role="img" aria-label="Train and cross-validation scores by max depth">
    ${grid}
    <polygon points="${band}" class="cv-band"/>
    <line x1="${f.left}" y1="${f.bottom}" x2="${f.right}" y2="${f.bottom}" class="ml-axis"/>
    <line x1="${f.left}" y1="${f.top}" x2="${f.left}" y2="${f.bottom}" class="ml-axis"/>
    <path d="${trainPath}" class="regression-train-line"/>
    <path d="${cvPath}" class="regression-test-line"/>
    ${markers}
    <text x="310" y="354" text-anchor="middle" class="ml-axis-label">max_depth</text>
    <text x="18" y="176" transform="rotate(-90 18 176)" text-anchor="middle" class="ml-axis-label">score</text>
    <g class="ml-legend"><text x="78" y="23">Train</text><text x="145" y="23">CV mean ± std</text></g>
  </svg>`;
}

function sx(value, f) { return f.left + (value - f.xmin) / (f.xmax - f.xmin) * (f.right - f.left); }
function sy(value, f) { return f.bottom - (value - f.ymin) / (f.ymax - f.ymin) * (f.bottom - f.top); }
function metric(label, value) { return `<div class="metric"><span class="metric__value metric__value--small">${esc(value)}</span><span class="metric__label">${esc(label)}</span></div>`; }
function pct(value) { return `${(value * 100).toFixed(1)}%`; }
