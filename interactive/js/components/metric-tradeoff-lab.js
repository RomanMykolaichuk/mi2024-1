const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const pct = value => `${Math.round(value * 100)}%`;

export function mount(element, config) {
  const mode = config.mode ?? 'classification';
  if (mode === 'regression') return mountRegression(element, config);
  if (mode === 'tuning') return mountTuning(element, config);
  return mountClassification(element, config);
}

function mountClassification(element, config) {
  const base = config.base ?? {positives: 40, negatives: 160};
  const initial = Number(config.threshold ?? 0.5);
  element.innerHTML = `<div class="metric-lab"><div class="metric-control"><label>Decision threshold <strong data-role="threshold">${initial.toFixed(2)}</strong></label><input data-role="slider" type="range" min="20" max="80" value="${Math.round(initial * 100)}"></div><div class="confusion-grid" data-role="matrix"></div><div class="metric-grid" data-role="metrics"></div><div class="analytics-callout" data-role="insight"></div></div>`;
  const slider = element.querySelector('[data-role="slider"]');
  const threshold = element.querySelector('[data-role="threshold"]');
  const matrix = element.querySelector('[data-role="matrix"]');
  const metrics = element.querySelector('[data-role="metrics"]');
  const insight = element.querySelector('[data-role="insight"]');

  function render() {
    const t = Number(slider.value) / 100;
    threshold.textContent = t.toFixed(2);
    const recall = clamp(1.08 - t * 0.72, 0.35, 0.96);
    const fpr = clamp(0.46 - t * 0.47, 0.03, 0.35);
    const tp = Math.round(base.positives * recall);
    const fn = base.positives - tp;
    const fp = Math.round(base.negatives * fpr);
    const tn = base.negatives - fp;
    const precision = tp / Math.max(1, tp + fp);
    const actualRecall = tp / Math.max(1, tp + fn);
    const f1 = 2 * precision * actualRecall / Math.max(0.0001, precision + actualRecall);
    const accuracy = (tp + tn) / (base.positives + base.negatives);
    matrix.innerHTML = `<div class="confusion-cell"><span>TP</span><strong>${tp}</strong></div><div class="confusion-cell is-warning"><span>FP</span><strong>${fp}</strong></div><div class="confusion-cell is-danger"><span>FN</span><strong>${fn}</strong></div><div class="confusion-cell"><span>TN</span><strong>${tn}</strong></div>`;
    metrics.innerHTML = metric('Accuracy', pct(accuracy)) + metric('Precision', pct(precision)) + metric('Recall', pct(actualRecall)) + metric('F1', pct(f1));
    const focus = t < 0.43 ? 'Низький поріг підвищує recall, але створює більше false positives.' : t > 0.62 ? 'Високий поріг зменшує false positives, але збільшує ризик пропустити позитивні випадки.' : 'Середній поріг балансує precision і recall, але його доречність залежить від вартості FP/FN.';
    insight.innerHTML = `<strong>Інтерпретація:</strong> ${esc(focus)} ${esc(config.contextNote ?? 'Поріг є аналітичним рішенням, а не магічним числом 0.5.')}`;
  }
  slider.addEventListener('input', render);
  render();
}

function mountRegression(element, config) {
  const initial = Number(config.complexity ?? 40);
  element.innerHTML = `<div class="metric-lab"><div class="metric-control"><label>Складність моделі <strong data-role="value">${initial}</strong>/100</label><input data-role="slider" type="range" min="5" max="95" value="${initial}"></div><div class="metric-grid" data-role="metrics"></div><div class="comparison-bars" data-role="bars"></div><div class="analytics-callout" data-role="insight"></div></div>`;
  const slider = element.querySelector('[data-role="slider"]');
  const value = element.querySelector('[data-role="value"]');
  const metrics = element.querySelector('[data-role="metrics"]');
  const bars = element.querySelector('[data-role="bars"]');
  const insight = element.querySelector('[data-role="insight"]');
  function render() {
    const c = Number(slider.value);
    value.textContent = c;
    const trainMae = clamp(26 - c * 0.19, 5.5, 25);
    const testMae = clamp(22 - c * 0.12 + Math.max(0, c - 58) * 0.18, 8, 30);
    const rmse = testMae * (1.18 + Math.max(0, c - 65) / 400);
    const r2 = clamp(0.28 + c * 0.009 - Math.max(0, c - 70) * 0.012, 0.25, 0.89);
    metrics.innerHTML = metric('Train MAE', trainMae.toFixed(1)) + metric('Test MAE', testMae.toFixed(1)) + metric('Test RMSE', rmse.toFixed(1)) + metric('R²', r2.toFixed(2));
    bars.innerHTML = bar('Train error', trainMae, 32) + bar('Test error', testMae, 32);
    const gap = testMae - trainMae;
    insight.innerHTML = `<strong>Інтерпретація:</strong> ${gap > 6 ? 'Train error значно нижчий за test error — модель демонструє ознаки overfitting.' : c < 25 ? 'Модель дуже проста: помилки train і test подібні, але обидві високі — можливий underfitting.' : 'Баланс складності та узагальнення виглядає прийнятним для навчального прикладу.'} ${esc(config.contextNote ?? '')}`;
  }
  slider.addEventListener('input', render);
  render();
}

function mountTuning(element, config) {
  const initial = Number(config.depth ?? 5);
  element.innerHTML = `<div class="metric-lab"><div class="metric-control"><label>max_depth <strong data-role="value">${initial}</strong></label><input data-role="slider" type="range" min="1" max="20" value="${initial}"></div><div class="metric-grid" data-role="metrics"></div><div class="analytics-callout" data-role="insight"></div><p class="microcopy">Синтетична демонстрація: показники ілюструють trade-off, а не є результатом реального тренування.</p></div>`;
  const slider = element.querySelector('[data-role="slider"]');
  const value = element.querySelector('[data-role="value"]');
  const metrics = element.querySelector('[data-role="metrics"]');
  const insight = element.querySelector('[data-role="insight"]');
  function render() {
    const depth = Number(slider.value);
    value.textContent = depth;
    const train = clamp(0.66 + depth * 0.022, 0.67, 0.995);
    const cv = clamp(0.64 + Math.min(depth, 8) * 0.025 - Math.max(0, depth - 8) * 0.014, 0.55, 0.87);
    const test = clamp(cv - 0.01 - Math.max(0, depth - 12) * 0.006, 0.5, 0.86);
    metrics.innerHTML = metric('Train', pct(train)) + metric('CV mean', pct(cv)) + metric('Held-out test', pct(test)) + metric('Gap', pct(train - cv));
    insight.innerHTML = `<strong>Інтерпретація:</strong> ${depth <= 3 ? 'Низька складність може недонавчати модель.' : depth <= 9 ? 'У цій синтетичній кривій область має найкращий CV-баланс.' : 'Train продовжує зростати, але CV погіршується — типова ознака перенавчання.'} Test не використовують для вибору гіперпараметрів.`;
  }
  slider.addEventListener('input', render);
  render();
}

function metric(label, value) { return `<div class="metric"><span class="metric__value">${esc(value)}</span><span class="metric__label">${esc(label)}</span></div>`; }
function bar(label, value, max) { return `<div class="comparison-bar"><span>${esc(label)}</span><div><i style="width:${Math.min(100, value / max * 100)}%"></i></div><strong>${value.toFixed(1)}</strong></div>`; }
